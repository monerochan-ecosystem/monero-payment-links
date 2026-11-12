// assumptions about the source that must always hold.
// no server, no browser.
// run: bun test tests/quality_assurance
import { expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { startShop } from "../shop";
import { REPO, testDataFor } from "../testdata";

const testData = testDataFor(import.meta.path);

// app source: everything but tests, node_modules and data folders
function appFiles(dir = REPO): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (["node_modules", "tests", "test-data", "wallet-caches", ".git", "docs"].includes(name)) continue;
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) out.push(...appFiles(p));
    else if (name.endsWith(".ts")) out.push(p);
  }
  return out;
}
const files = appFiles().map((p) => ({ path: relative(REPO, p), src: readFileSync(p, "utf8") }));
const themeFiles = files.filter((f) => f.path.startsWith("theme/"));
const codeFiles = files.filter((f) => !f.path.startsWith("theme/"));
// the folder name ends with a space: "dashboard/frontend /"
const frontendFiles = files.filter((f) => f.path.startsWith("dashboard/frontend /"));
const pkg = JSON.parse(readFileSync(resolve(REPO, "package.json"), "utf8"));

// every match of re in the code files, as "file:line: text". comment lines do not count.
function grep(re: RegExp, list = codeFiles) {
  const hits: string[] = [];
  for (const f of list)
    f.src.split("\n").forEach((line, i) => {
      if (/^\s*(\/\/|\/?\*)/.test(line)) return;
      if (re.test(line)) hits.push(`${f.path}:${i + 1}: ${line.trim()}`);
    });
  return hits;
}

test("q00 the scan found the app", () => {
  expect(files.length).toBeGreaterThan(20);
  expect(frontendFiles.length).toBeGreaterThan(8);
  testData("q00").dump("files.txt", files.map((f) => f.path).join("\n"));
});

test("q01 every dependency is pinned to an exact version", () => {
  // a ^ or ~ lets bun install pull a different mininext or wallet lib
  const loose: string[] = [];
  for (const group of ["dependencies", "devDependencies", "peerDependencies"])
    for (const [name, v] of Object.entries(pkg[group] ?? {}))
      if (!/^\d+\.\d+\.\d+$/.test(String(v))) loose.push(`${group}.${name}=${v}`);
  expect(loose).toEqual([]);
});

test("q02 mininext is 0.9.0 in package.json, bun.lock and node_modules", () => {
  expect(pkg.dependencies["@spirobel/mininext"]).toBe("0.9.0");
  expect(readFileSync(resolve(REPO, "bun.lock"), "utf8")).toContain('"@spirobel/mininext@0.9.0"');
  const installed = JSON.parse(readFileSync(resolve(REPO, "node_modules/@spirobel/mininext/package.json"), "utf8"));
  expect(installed.version).toBe("0.9.0");
});

test("q03 no string on* handlers in templates", () => {
  // mininext 0.9 throws on them. onclick="fn()" also needs a window global.
  expect(grep(/\son[a-z]+\s*=\s*["']/i)).toEqual([]);
});

test("q04 no on* handler returns an assignment", () => {
  // onclick=${() => (open = false)} returns false. a handler property that returns
  // false cancels the event: a click in that element never submits a form.
  expect(grep(/on[a-z]+=\$\{\s*(\([^)]*\)|\w+)\s*=>\s*\(/i)).toEqual([]);
  expect(grep(/on[a-z]+=\$\{\s*(\([^)]*\)|\w+)\s*=>\s*(false|null|\w+\s*=[^=>])/i)).toEqual([]);
});

test("q05 no window globals except dashboardData", () => {
  const assigns = grep(/window\.(\w+)\s*=[^=]/).filter((l) => !/window\.dashboardData\s*=/.test(l) && !/window\.location/.test(l));
  expect(assigns).toEqual([]);
  // the Window interface only declares the data
  const decl = files.filter((f) => f.path.startsWith("dashboard/")).map((f) => f.src.match(/interface Window \{([^}]*)\}/)?.[1] ?? "").join("");
  expect(decl.replace(/\s+/g, " ").trim()).toBe("dashboardData: DashboardData;");
});

test("q06 no removed or legacy mininext api", () => {
  expect(grep(/\bflatten\s*\(|minireload|from "@spirobel\/mininext\/dist/)).toEqual([]);
});

test("q07 no raw html sinks or eval in app code", () => {
  // all markup goes through html``, which escapes values
  expect(grep(/\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function\(|dangerously/)).toEqual([]);
});

test("q08 inline <script> blocks in templates are static", () => {
  // a ${value} in a script is text, not js. html escaping does not make it safe there.
  const bad: string[] = [];
  for (const f of codeFiles)
    for (const m of f.src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g))
      if (m[1]!.includes("${")) bad.push(`${f.path}: ${m[1]!.trim().slice(0, 80)}`);
  expect(bad).toEqual([]);
});

test("q09 hydration is base64 of utf-8 bytes", () => {
  // btoa(JSON) throws on any non latin1 title. JSON.parse(atob()) breaks utf-8.
  expect(grep(/btoa\(/)).toEqual([]);
  expect(grep(/JSON\.parse\(atob\(/)).toEqual([]);
  expect(files.find((f) => f.path === "dashboard/dashboard.ts")!.src).toContain('toString("base64")');
  expect(files.find((f) => f.path === "dashboard/frontend_main.ts")!.src).toContain("new TextDecoder().decode(");
});

test("q10 every route in server.ts is known to backend.test.ts", () => {
  // a new route must be added here AND to backend.test.ts (admin list or public list)
  const server = files.find((f) => f.path === "server.ts")!.src;
  const routes = [...server.matchAll(/^\s{4}"(\/[^"]*)":\s*\{/gm)].map((m) => m[1]).sort();
  const backend = readFileSync(resolve(REPO, "tests/quality_assurance/backend.test.ts"), "utf8");
  const ADMIN = ["/dashboard", "/ws", ...[...backend.matchAll(/^\s+"(\/[^"]+)",$/gm)].map((m) => m[1]!)];
  const PUBLIC = ["/login", "/favicon.ico"];
  testData("q10").dump("routes.json", JSON.stringify({ routes, ADMIN, PUBLIC }, null, 2));
  expect(routes.filter((r) => !ADMIN.includes(r!) && !PUBLIC.includes(r!))).toEqual([]);
  // and every admin handler checks the session first
  for (const f of files.filter((f) => f.path.startsWith("dashboard/backend/")))
    for (const m of f.src.matchAll(/export async function (\w+Route)\(req[^)]*\)[^{]*\{([\s\S]*?)\n\}/g))
      expect(`${m[1]}: ${m[2]!.includes("checkAdminAndRedirect(req)")}`).toBe(`${m[1]}: true`);
});

test("q11 checkout routes are the known public ones", () => {
  const checkout = files.find((f) => f.path === "checkout.ts")!.src;
  const routes = [...checkout.matchAll(/^\s{4}"(\/[^"]*)":/gm)].map((m) => m[1]).sort();
  expect(routes).toEqual(["/", "/monerochan001/:address", "/pay/:paymentLinkId", "/paymentstatus", "/wallet_info"]);
});

test("q12 user urls go through isHttpUrl", () => {
  expect(files.find((f) => f.path === "dashboard/backend/payment_links.ts")!.src).toMatch(/body\.successUrl && !isHttpUrl\(body\.successUrl\)/);
  expect(files.find((f) => f.path === "checkout.ts")!.src).toMatch(/!isHttpUrl\(paymentLink\.successUrl\)/);
  expect(files.find((f) => f.path === "dashboard/backend/wallets.ts")!.src).toMatch(/!isHttpUrl\(body\.nodeurl\)/);
  expect(files.find((f) => f.path === "dashboard/backend/wallets.ts")!.src).toMatch(/themeNames\.includes\(/);
});

test("q13 frontend fetch calls use absolute paths", () => {
  // fetch("deletePaymentLink") resolves against the page path and breaks on another route
  expect(grep(/fetch\(\s*["'`](?!\/)/, frontendFiles)).toEqual([]);
});

test("q14 secrets and data stay out of git", () => {
  const ignore = readFileSync(resolve(REPO, ".gitignore"), "utf8").split("\n").map((l) => l.trim());
  for (const entry of ["test-data/", "monero_payments.db", ".env", "*ScanSettings.json", "*_cache.json", ".mininext-*"]) expect(ignore).toContain(entry);
});

test("q15 the shop keeps port 3003 by default (the wallet repo tests use it)", () => {
  const server = files.find((f) => f.path === "server.ts")!.src;
  expect(server).toContain("port: Number(Bun.env.PORT ?? 3003)");
  expect(pkg.scripts).toEqual({ production: "NODE_ENV=production bun run server.ts", dev: "bun run --hot server.ts" });
});

test("q16 tests never touch the real database or wallet caches", async () => {
  // only tests/shop.ts may name the db file, and it runs the shop below test-data
  const testFiles = readdirSync(resolve(REPO, "tests"), { recursive: true }).map(String).filter((f) => f.endsWith(".ts"));
  const naming = testFiles.filter((f) => f !== "shop.ts" && f !== "quality_assurance/source.test.ts" && readFileSync(resolve(REPO, "tests", f), "utf8").includes("monero_payments.db"));
  expect(naming).toEqual([]);
  // the guard refuses a shop in the repo root
  await expect(startShop(REPO)).rejects.toThrow("below test-data");
  await expect(startShop(resolve(REPO, ".."))).rejects.toThrow("below test-data");
});

test("q17 themes define the same style parts", () => {
  const parts = (src: string) => [...src.matchAll(/export const (\w+)/g)].map((m) => m[1]).sort();
  const first = parts(themeFiles.find((f) => f.path === "theme/document.ts")!.src);
  for (const f of themeFiles.filter((f) => f.path !== "theme/theme.ts")) expect(`${f.path}: ${parts(f.src)}`).toBe(`${f.path}: ${first}`);
});

test("q19 the browser bundle imports only the wallet library tools subpath", () => {
  // the package root has circular imports. bun's dev (hmr) bundler then crashes in the
  // browser: "Cannot read properties of null (reading 'createWebworker')". it also
  // pulls the scanner and worker code into the dashboard.
  const browserFiles = frontendFiles.concat(files.filter((f) => ["dashboard/frontend_main.ts", "rates.ts"].includes(f.path)));
  const bad = browserFiles.flatMap((f) =>
    [...f.src.matchAll(/^import (?!type )[^;]*from "@spirobel\/monero-wallet-api"/gm)].map((m) => `${f.path}: ${m[0]}`),
  );
  expect(bad).toEqual([]);
});

test("q20 atomicToXmr matches the wallet library", async () => {
  const { convertBigIntAmount } = await import("@spirobel/monero-wallet-api");
  const { atomicToXmr } = await import("../../dashboard/frontend /tx_status");
  for (const n of [0n, 1n, 10n, 999999999999n, 1000000000000n, 1500000000000n, 123456789012345n, 18446744073709551615n, -5000000000n])
    expect(`${n}: ${atomicToXmr(n)}`).toBe(`${n}: ${convertBigIntAmount(n)}`);
});

test("q18 typecheck passes", async () => {
  const p = Bun.spawn([resolve(REPO, "node_modules/.bin/tsc"), "--noEmit", "-p", REPO], { stdout: "pipe", stderr: "pipe" });
  const out = await new Response(p.stdout).text();
  testData("q18").dump("tsc.txt", out);
  expect(await p.exited).toBe(0);
}, 120_000);

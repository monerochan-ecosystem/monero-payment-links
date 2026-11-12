// assumptions about the backend, checked over plain http against an isolated shop (tests/shop.ts).
// no browser. run: bun test tests/quality_assurance
import { afterAll, beforeAll, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { insertCheckout, startShop, testKeys, type Shop } from "../shop";
import { testDataFor } from "../testdata";

const testData = testDataFor(import.meta.path);
let shop: Shop;
let cookie = "";

beforeAll(async () => {
  shop = await startShop(testData("shop").dir);
  cookie = (await shop.login()).cookie;
}, 90_000);
afterAll(async () => {
  await shop?.stop();
});

const ADMIN_POSTS = [
  "/editPaymentLink",
  "/deletePaymentLink",
  "/editWallet",
  "/deleteWallet",
  "/monerochan002/",
  "/updateNodeUrl",
  "/updateTheme",
];

function rowCounts() {
  const db = shop.db();
  const n = (t: string) => (db.query(`select count(*) as n from ${t}`).get() as { n: number }).n;
  const counts = {
    product: n("product_payment_links"),
    invoice: n("invoice_payment_links"),
    sessions: n("checkout_session"),
  };
  db.close();
  return counts;
}
const scanSettings = () => readFileSync(resolve(shop.cwd, "wallet-caches/ScanSettings.json"), "utf8");

test("s01 the test shop runs in test-data on its own port, not in the repo", () => {
  const { dump } = testData("s01");
  dump("env.json", JSON.stringify({ ...shop.env, ADMIN_SECRET: "<test secret>" }, null, 2));
  expect(shop.cwd).toContain("/test-data/");
  expect(shop.url).not.toContain(":3003");
  // the repo .env (real admin secret, view keys) does not reach the shop
  expect(Object.keys(shop.env).filter((k) => k.startsWith("vk"))).toEqual([]);
  expect(shop.env.ADMIN_SECRET).toStartWith("test-");
});

test("s02 every admin route refuses without a session and changes nothing", async () => {
  const { dump } = testData("s02");
  const before = { rows: rowCounts(), settings: scanSettings() };
  const keys = await testKeys();
  const bodies: Record<string, unknown> = {
    "/editPaymentLink": { linkType: "product", productTitle: "x", amount: "1", walletId: keys.address },
    "/deletePaymentLink": { paymentLinkId: "x", linkType: "product" },
    "/editWallet": { walletName: "evil", primaryAddress: keys.address, secretViewKey: keys.viewKey },
    "/deleteWallet": { primaryAddress: keys.address },
    "/monerochan002/": {},
    "/updateNodeUrl": { nodeurl: "http://evil.example:18081" },
    "/updateTheme": { checkout_theme: "monero", dashboard_theme: "monero" },
  };
  const seen: Record<string, string> = {};
  for (const forged of ["", "admin_session=forged-" + crypto.randomUUID()]) {
    for (const path of ADMIN_POSTS) {
      const r = await shop.post(path, bodies[path], forged);
      seen[`${forged ? "forged" : "none"} POST ${path}`] = `${r.res.status} ${r.res.headers.get("location")}`;
      expect(r.res.status).toBe(303);
      expect(r.res.headers.get("location")).toEndWith("/login");
    }
    const dash = await fetch(shop.url + "/dashboard", { headers: forged ? { cookie: forged } : {}, redirect: "manual" });
    seen[`${forged ? "forged" : "none"} GET /dashboard`] = `${dash.status} ${dash.headers.get("location")}`;
    expect(dash.status).toBe(303);
    const ws = await fetch(shop.url + "/ws", { headers: { upgrade: "websocket", connection: "upgrade", ...(forged ? { cookie: forged } : {}) } });
    seen[`${forged ? "forged" : "none"} GET /ws`] = String(ws.status);
    expect(ws.status).toBe(401);
  }
  dump("responses.json", JSON.stringify(seen, null, 2));
  expect(rowCounts()).toEqual(before.rows);
  expect(scanSettings()).toBe(before.settings);
});

test("s03 login: wrong password gives no cookie, right one gives a strict cookie", async () => {
  const { dump } = testData("s03");
  const wrong = await shop.login("wrong-" + crypto.randomUUID());
  expect(wrong.res.status).toBe(303);
  expect(wrong.res.headers.get("location")).toBe("/login?error=1");
  expect(wrong.cookie).toBe("");
  const ok = await shop.login();
  dump("set-cookie.txt", ok.setCookie.replace(/admin_session=[^;]+/, "admin_session=<token>"));
  expect(ok.cookie).toMatch(/^admin_session=[0-9a-f-]{36}$/);
  expect(ok.setCookie).toContain("HttpOnly");
  expect(ok.setCookie).toContain("Secure");
  expect(ok.setCookie).toContain("SameSite=Strict");
  // the token never shows up in a page
  const html = await (await fetch(shop.url + "/dashboard", { headers: { cookie: ok.cookie } })).text();
  expect(html).not.toContain(ok.cookie.split("=")[1]!);
});

test("s04 a javascript: or data: success url is refused, http(s) is saved", async () => {
  const { dump } = testData("s04");
  const keys = await testKeys();
  // a wallet is needed for links. the node is closed, nothing gets scanned.
  const w = await shop.post("/editWallet", { walletName: "test wallet", primaryAddress: keys.address, secretViewKey: keys.viewKey }, cookie);
  expect(w.json?.success).toBe(true);
  const results: Record<string, unknown> = {};
  for (const successUrl of ["javascript:alert(1)", " JaVaScRiPt:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:x", "//evil.example", "/relative"]) {
    const r = await shop.post("/editPaymentLink", { linkType: "product", productTitle: "x", amount: "1", walletId: keys.address, successUrl }, cookie);
    results[successUrl] = r.json;
    expect(r.json?.success).toBe(false);
    expect(r.json?.error?.issues?.map((i: any) => i.path[0])).toContain("successUrl");
  }
  const ok = await shop.post("/editPaymentLink", { linkType: "product", productTitle: "x", amount: "1", walletId: keys.address, successUrl: "https://shop.example/thanks?checkoutId=" }, cookie);
  results.https = ok.json && { success: ok.json.success };
  dump("results.json", JSON.stringify(results, null, 2));
  expect(ok.json?.success).toBe(true);
  await shop.post("/deletePaymentLink", { paymentLinkId: ok.json.paymentLinkId, linkType: "product" }, cookie);
  await shop.post("/deleteWallet", { primaryAddress: keys.address }, cookie);
});

const XSS_TITLE = `<img src=x onerror="window.__xss=1">"'<script>window.__xss=2</script>`;
const XSS_DESC = `</div></body><script>window.__xss=3</script><a href="javascript:window.__xss=4">x</a>`;

test("s05 checkout pages escape titles and descriptions", async () => {
  const { dump } = testData("s05");
  const keys = await testKeys();
  const open = insertCheckout(shop, keys.address, { title: XSS_TITLE, description: XSS_DESC });
  const inv = insertCheckout(shop, keys.address, { type: "invoice", title: XSS_TITLE, description: XSS_DESC, currentUses: 1, paid: true, txHash: "ab".repeat(32) });
  const sold = insertCheckout(shop, keys.address, { title: XSS_TITLE, description: XSS_DESC, maxUses: 1, currentUses: 1 });
  const pages = {
    checkout: await (await fetch(`${shop.url}/?checkoutId=${open.sessionId}`)).text(),
    invoicePaid: await (await fetch(`${shop.url}/pay/${inv.linkId}`)).text(),
    soldOut: await (await fetch(`${shop.url}/pay/${sold.linkId}`)).text(),
  };
  for (const [name, html] of Object.entries(pages)) {
    dump(`${name}.html`, html);
    expect(html).toContain("&lt;img src=x");
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<script>window.__xss");
    expect(html).not.toContain('href="javascript:');
  }
});

test("s06 paid status: success url is escaped, only http(s) redirects", async () => {
  const { dump } = testData("s06");
  const keys = await testKeys();
  const evil = `https://shop.example/ok?a="><script>window.__xss=5</script>&b=1&checkoutId=`;
  const good = insertCheckout(shop, keys.address, { paid: true, successUrl: evil });
  const html = await (await fetch(`${shop.url}/paymentstatus?checkoutId=${good.sessionId}`)).text();
  dump("paid-redirect.html", html);
  expect(html).not.toContain("<script>window.__xss");
  expect(html).toContain('target="_top"');
  expect(html).toContain("&amp;b=1&amp;checkoutId=" + good.sessionId);
  // an old row from before the check: a javascript: url must not become a link
  const legacy = insertCheckout(shop, keys.address, { paid: true, successUrl: "javascript:window.__xss=6" });
  const html2 = await (await fetch(`${shop.url}/paymentstatus?checkoutId=${legacy.sessionId}`)).text();
  dump("paid-legacy-js-url.html", html2);
  expect(html2).not.toContain("javascript:");
  expect(html2).toContain("Payment received!");
  // the checkout page itself redirects with a 303 only to http(s)
  const r1 = await fetch(`${shop.url}/?checkoutId=${good.sessionId}`, { redirect: "manual" });
  expect(r1.status).toBe(303);
  expect(r1.headers.get("location")).toStartWith("https://shop.example/");
  const r2 = await fetch(`${shop.url}/?checkoutId=${legacy.sessionId}`, { redirect: "manual" });
  expect(r2.status).toBe(200);
});

test("s07 dashboard hydration is base64 and holds no raw markup from user data", async () => {
  const { dump } = testData("s07");
  const html = await (await fetch(shop.url + "/dashboard", { headers: { cookie } })).text();
  dump("dashboard.html", html);
  const b64 = html.match(/data-hydrate="([^"]*)"/)?.[1] ?? "";
  expect(b64).toMatch(/^[A-Za-z0-9+/=]+$/);
  const data = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  dump("hydrate.json", JSON.stringify(data, null, 2));
  // s05 put xss titles in the db. they travel only inside base64.
  expect(JSON.stringify(data)).toContain("window.__xss=2");
  expect(html).not.toContain("window.__xss");
});

test("s08 public pages never show view keys, admin data or other sessions", async () => {
  const { dump } = testData("s08");
  const keys = await testKeys();
  const w = await shop.post("/editWallet", { walletName: "secret wallet name", primaryAddress: keys.address, secretViewKey: keys.viewKey }, cookie);
  expect(w.json?.success).toBe(true);
  const link = insertCheckout(shop, keys.address, { title: "public product" });
  const pages: Record<string, string> = {};
  for (const path of ["/login", `/pay/${link.linkId}`, `/?checkoutId=${link.sessionId}`, `/paymentstatus?checkoutId=${link.sessionId}`, `/wallet_info?checkoutId=${link.sessionId}`, "/", "/?checkoutId=nope"]) {
    const res = await fetch(shop.url + path, { redirect: "manual" });
    pages[path] = `${res.status}\n${await res.text()}`;
  }
  dump("pages.json", JSON.stringify(pages, null, 2));
  for (const [path, body] of Object.entries(pages)) {
    expect(body).not.toContain(keys.viewKey);
    expect(body).not.toContain("secret wallet name");
    expect(body).not.toContain("data-hydrate");
    if (!path.includes(link.sessionId) && !path.includes(link.linkId)) expect(body).not.toContain(keys.address);
  }
  // the admin dashboard does carry the key (the wallet dialog shows it), only with a session
  const dash = await (await fetch(shop.url + "/dashboard", { headers: { cookie } })).text();
  const data = JSON.parse(Buffer.from(dash.match(/data-hydrate="([^"]*)"/)![1]!, "base64").toString("utf8"));
  expect(JSON.stringify(data.scan_settings)).toContain(keys.viewKey);
  await shop.post("/deleteWallet", { primaryAddress: keys.address }, cookie);
});

test("s09 unknown checkout ids and bad input do not crash the server", async () => {
  const { dump } = testData("s09");
  const out: Record<string, number> = {};
  for (const path of ["/pay/does-not-exist", "/pay/%3Cscript%3E", "/?checkoutId=%22%3E%3Cscript%3E", "/paymentstatus", "/paymentstatus?checkoutId=x", "/wallet_info?checkoutId=%22%3E"]) {
    const res = await fetch(shop.url + path, { redirect: "manual" });
    const text = await res.text();
    out[path] = res.status;
    expect(res.status).toBeLessThan(500);
    expect(text).not.toContain("<script>");
  }
  const bad = await shop.post("/editPaymentLink", "not json at all", cookie);
  out["bad json"] = bad.res.status;
  expect(bad.res.status).toBeLessThan(500);
  dump("statuses.json", JSON.stringify(out, null, 2));
  // still alive
  expect((await fetch(shop.url + "/login")).status).toBe(200);
});

test("s10 theme names are a fixed list: no newline can write a line into .env", async () => {
  const { dump } = testData("s10");
  const envFile = resolve(shop.cwd, ".env");
  const before = readFileSync(envFile, "utf8");
  const out: Record<string, unknown> = {};
  for (const evil of ["monero\nADMIN_SECRET=pwned", "x\r\nTHEME_DASHBOARD=monero", "../../etc", "", " stripe"]) {
    const r = await shop.post("/updateTheme", { checkout_theme: evil }, cookie);
    out[JSON.stringify(evil)] = r.json;
    if (evil !== "") expect(r.json?.success).toBe(false);
  }
  dump("results.json", JSON.stringify(out, null, 2));
  const after = readFileSync(envFile, "utf8");
  expect(after).not.toContain("pwned");
  expect(after.split("\n").filter((l) => l.startsWith("ADMIN_SECRET=")).length).toBeLessThanOrEqual(1);
  expect(after).toBe(before);
  // the old secret still works, no new one
  expect((await shop.login()).cookie).toMatch(/^admin_session=/);
  const ok = await shop.post("/updateTheme", { checkout_theme: "monero" }, cookie);
  expect(ok.json?.success).toBe(true);
  await shop.post("/updateTheme", { checkout_theme: "document" }, cookie);
});

test("s11 node url must be http(s)", async () => {
  const { dump } = testData("s11");
  const out: Record<string, unknown> = {};
  for (const nodeurl of ["not a url", "javascript:alert(1)", "file:///etc/passwd", "ftp://x"]) {
    const r = await shop.post("/updateNodeUrl", { nodeurl }, cookie);
    out[nodeurl] = r.json;
    expect(r.json?.success).toBe(false);
    expect(r.json?.error?.issues?.[0]?.path).toEqual(["nodeurl"]);
  }
  dump("results.json", JSON.stringify(out, null, 2));
  expect(scanSettings()).toContain(shop.nodeUrl);
});

// an isolated shop for one test file.
// server.ts runs with its cwd in test-data, so monero_payments.db, wallet-caches/
// and .env are fresh files there. the repo database and wallet caches are never touched.
// the node url points at a closed local port: no monerod, no network.
import { Database } from "bun:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { makeTestKeyPair } from "@spirobel/monero-wallet-api";
import { REPO, TEST_DATA } from "./testdata";

export type Shop = Awaited<ReturnType<typeof startShop>>;

// a port that nothing listens on
export function closedPort() {
  const s = Bun.listen({ hostname: "127.0.0.1", port: 0, socket: { data() {} } });
  const port = s.port;
  s.stop(true);
  return port;
}

export async function startShop(dir: string, opts: { env?: Record<string, string>; hot?: boolean } = {}) {
  const cwd = resolve(dir, "shop");
  // the guard: a shop runs only below test-data, never in the repo root
  if (!cwd.startsWith(TEST_DATA + sep)) throw new Error("shop cwd must be below test-data: " + cwd);
  mkdirSync(resolve(cwd, "wallet-caches"), { recursive: true });
  const nodeUrl = `http://127.0.0.1:${closedPort()}`;
  writeFileSync(
    resolve(cwd, "wallet-caches/ScanSettings.json"),
    JSON.stringify({ node_url: nodeUrl, start_height: 0, wallets: [] }, null, 2),
  );
  const secret = "test-" + crypto.randomUUID();
  // a clean env. bun test loads the repo .env (admin secret, view keys) into
  // process.env, so passing process.env on would leak it into the test shop.
  const env: Record<string, string> = {
    PATH: process.env.PATH ?? "",
    HOME: process.env.HOME ?? "",
    NODE_ENV: "production",
    PORT: "0",
    ADMIN_SECRET: secret,
    ...opts.env,
  };
  // hot: like "bun run dev" (bun --hot, no NODE_ENV=production)
  if (opts.hot) delete env.NODE_ENV;
  const cmd = opts.hot ? ["bun", "--hot", resolve(REPO, "server.ts")] : ["bun", resolve(REPO, "server.ts")];
  const proc = Bun.spawn(cmd, { cwd, env, stdout: "pipe", stderr: "pipe" });
  let log = "";
  const collect = async (stream: ReadableStream<Uint8Array>) => {
    const dec = new TextDecoder();
    for await (const chunk of stream as unknown as AsyncIterable<Uint8Array>) {
      log += dec.decode(chunk);
      writeFileSync(resolve(dir, "shop.log"), log);
    }
  };
  collect(proc.stdout);
  collect(proc.stderr);
  let url = "";
  const end = Date.now() + 60_000;
  while (!url && Date.now() < end) {
    url = log.match(/access dashboard at (http:\/\/\S+)\/dashboard/)?.[1] ?? "";
    if (proc.exitCode !== null) break;
    if (!url) await Bun.sleep(50);
  }
  if (!url) {
    proc.kill();
    throw new Error("shop did not start. log:\n" + log);
  }
  // 127.0.0.1, not localhost: same origin for cookies in chrome and fetch
  url = url.replace("localhost", "127.0.0.1").replace("0.0.0.0", "127.0.0.1");

  const shop = {
    url,
    cwd,
    secret,
    nodeUrl,
    env,
    log: () => log,
    db: () => new Database(resolve(cwd, "monero_payments.db")),
    async stop() {
      proc.kill();
      await proc.exited;
    },
    // admin cookie over plain http, for the fetch level tests
    async login(password = secret) {
      const res = await fetch(url + "/login", {
        method: "POST",
        body: new URLSearchParams({ password }),
        redirect: "manual",
      });
      const setCookie = res.headers.get("set-cookie") ?? "";
      const cookie = setCookie.match(/admin_session=[^;]+/)?.[0] ?? "";
      return { res, setCookie, cookie };
    },
    async post(path: string, body: unknown, cookie = "") {
      const res = await fetch(url + path, {
        method: "POST",
        headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
        body: JSON.stringify(body),
        redirect: "manual",
      });
      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {}
      return { res, text, json };
    },
  };
  return shop;
}

// a product link and a checkout session straight in the test database.
// checkout pages render from these rows alone, no wallet needed.
export function insertCheckout(
  shop: Shop,
  address: string,
  o: {
    linkId?: string;
    type?: "product" | "invoice";
    title?: string;
    description?: string;
    amount?: string;
    successUrl?: string | null;
    maxUses?: number | null;
    currentUses?: number;
    dueDate?: string | null;
    paid?: boolean;
    conf?: number;
    txHash?: string | null;
  } = {},
) {
  const db = shop.db();
  const linkId = o.linkId ?? crypto.randomUUID();
  const type = o.type ?? "product";
  const amount = o.amount ?? "0.5";
  if (type === "product")
    db.run(
      "insert into product_payment_links (payment_link_id, productTitle, productDescription, amount, currency, wallet_primary_address, maxUses, currentUses, successUrl) values (?,?,?,?,?,?,?,?,?)",
      [linkId, o.title ?? "Test Product", o.description ?? "", amount, "XMR", address, o.maxUses ?? null, o.currentUses ?? 0, o.successUrl ?? null],
    );
  else
    db.run(
      "insert into invoice_payment_links (payment_link_id, invoiceTitle, invoiceDescription, amount, currency, wallet_primary_address, dueDate, currentUses, successUrl) values (?,?,?,?,?,?,?,?,?)",
      [linkId, o.title ?? "Test Invoice", o.description ?? "", amount, "XMR", address, o.dueDate ?? null, o.currentUses ?? 0, o.successUrl ?? null],
    );
  const sessionId = crypto.randomUUID();
  db.run(
    "insert into checkout_session (amount, session_id, address, paid_status, required_confirmations, tx_confirmations, tx_hash, payment_link_id, paid_at) values (?,?,?,?,?,?,?,?,?)",
    [amount, sessionId, address, o.paid ? 1 : 0, 10, o.conf ?? 0, o.txHash ?? null, linkId, o.paid ? "2026-11-12 10:00:00" : null],
  );
  db.close();
  return { linkId, sessionId };
}

// a fresh test key pair (random spend key). never a real wallet.
let keys: Promise<{ address: string; viewKey: string }> | null = null;
export function testKeys() {
  keys ??= makeTestKeyPair().then((k) => ({ address: k.view_key.mainnet_primary, viewKey: k.view_key.view_key }));
  return keys;
}

// the buyer side: every checkout state, in all checkout themes, desktop and phone width.
// own headless chrome, isolated shop, rows put straight into the test database.
// screenshots: test-data/functional/checkout.browser/<test>/, see index.html there.
// run: bun test tests/functional/checkout.browser.test.ts
import { afterAll, beforeAll, expect, test } from "bun:test";
import { VIEWPORT } from "../cdp";
import { openEnv, pageErrors, text, visible, writeGallery, type Env } from "../browser";
import { insertCheckout, testKeys } from "../shop";
import { testDataFor } from "../testdata";

const testData = testDataFor(import.meta.path);
let env: Env;
let cookie = "";
const T = 120_000;
const PHONE = { width: 375, height: 812 };

beforeAll(async () => {
  env = await openEnv(testData("env").dir);
  cookie = (await env.shop.login()).cookie;
}, 90_000);
afterAll(async () => {
  await env?.close();
  writeGallery(testData.root);
});

async function viewport(size: { width: number; height: number }) {
  await env.cdp.send("Emulation.setDeviceMetricsOverride", { ...size, deviceScaleFactor: 1, mobile: size.width < 600 });
}

// the checks every checkout page must pass, in every theme and width
async function pageChecks(what: string) {
  const { cdp } = env;
  const r = await cdp.eval(`({
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(0, 40)),
    scripts: [...document.scripts].filter((s) => !s.src).map((s) => s.textContent.trim().slice(0, 80)),
    xss: window.__xss ?? null,
    // the status iframe has a fixed height. its text must fit, also when it wraps.
    iframeClipped: [...document.querySelectorAll("iframe")].some((f) => {
      const d = f.contentDocument?.documentElement;
      return !!d && d.scrollHeight > f.clientHeight + 1;
    }),
  })`);
  expect({ what, ...r, scripts: undefined }).toEqual({ what, overflowX: false, brokenImages: [], xss: null, iframeClipped: false });
  return r;
}

type State = { name: string; url: () => string; ready: string };
let states: State[] = [];

test("c01 build the checkout states", async () => {
  const { shop } = env;
  const keys = await testKeys();
  const desc = "A long description that wraps over more than one line, so the layout of the info box gets checked. ✓ Ünïcödé";
  const waiting = insertCheckout(shop, keys.address, { title: "Monerochan Hoodie", description: desc, amount: "0.42" });
  const confirming = insertCheckout(shop, keys.address, { title: "Sticker Pack", amount: "0.01", conf: 4, txHash: "cd".repeat(32) });
  const paid = insertCheckout(shop, keys.address, { title: "E-Book", amount: "0.2", paid: true, conf: 10, txHash: "ef".repeat(32) });
  const invoice = insertCheckout(shop, keys.address, { type: "invoice", title: "Invoice #42 consulting", description: "10 hours x 0.1 XMR", amount: "1.0", dueDate: "2026-12-24" });
  const sold = insertCheckout(shop, keys.address, { title: "Limited Print", description: desc, maxUses: 3, currentUses: 3 });
  const invPaid = insertCheckout(shop, keys.address, { type: "invoice", title: "Invoice #41", amount: "2.5", currentUses: 1, paid: true, txHash: "12".repeat(32) });
  states = [
    { name: "instance-info", url: () => `${shop.url}/`, ready: visible(".info-card") },
    { name: "checkout-waiting", url: () => `${shop.url}/?checkoutId=${waiting.sessionId}`, ready: `${visible(".qr-code img")} && (document.querySelector("iframe")?.contentDocument?.body?.innerText ?? "").includes("Waiting for payment")` },
    { name: "checkout-confirming-4-of-10", url: () => `${shop.url}/?checkoutId=${confirming.sessionId}`, ready: `(document.querySelector("iframe")?.contentDocument?.body?.innerText ?? "").includes("4/10")` },
    { name: "checkout-paid-no-success-url", url: () => `${shop.url}/?checkoutId=${paid.sessionId}`, ready: `(document.querySelector("iframe")?.contentDocument?.body?.innerText ?? "").includes("Payment received")` },
    { name: "invoice-checkout-due-date", url: () => `${shop.url}/?checkoutId=${invoice.sessionId}`, ready: `${visible(".info-due-date")}` },
    { name: "product-sold-out", url: () => `${shop.url}/pay/${sold.linkId}`, ready: `${text(".info-message")}.includes("out of stock")` },
    { name: "invoice-paid", url: () => `${shop.url}/pay/${invPaid.linkId}`, ready: `${visible(".info-tx-hash")}` },
    { name: "wallet-not-installed", url: () => `${shop.url}/wallet_info?checkoutId=${waiting.sessionId}`, ready: visible(".install-btn") },
    { name: "payment-link-not-found", url: () => `${shop.url}/pay/does-not-exist`, ready: `${text("h1")} === "Payment link not found"` },
  ];
  expect(states.length).toBe(9);
});

for (const theme of ["document", "stripe", "monero"]) {
  test(`c02 every checkout state in theme ${theme}, desktop and phone`, async () => {
    const { dump, dir } = testData(`c02-theme-${theme}`);
    const { cdp, shop } = env;
    cdp.shotDir = dir;
    const r = await shop.post("/updateTheme", { checkout_theme: theme }, cookie);
    expect(r.json?.success).toBe(true);
    const report: Record<string, unknown> = {};
    for (const size of [VIEWPORT, PHONE]) {
      await viewport(size);
      for (const s of states) {
        await cdp.goto(s.url());
        await cdp.waitFor(s.ready, `${theme} ${s.name}`, 10_000);
        await cdp.shot(`${s.name}-${size.width}px`);
        report[`${s.name} ${size.width}`] = await pageChecks(`${theme} ${s.name} ${size.width}`);
      }
    }
    await viewport(VIEWPORT);
    dump("checks.json", JSON.stringify(report, null, 2));
  }, T);
}

test("c03 checkout content: amount, address, qr code, wallet link, status iframe", async () => {
  const { cdp } = env;
  cdp.shotDir = testData("c03-content").dir;
  const keys = await testKeys();
  await cdp.goto(states[1]!.url());
  await cdp.waitFor(states[1]!.ready, "waiting state");
  const c = await cdp.eval(`({
    amount: ${text(".info-amount")},
    address: ${text(".wallet-address")},
    qrWidth: document.querySelector(".qr-code img").naturalWidth,
    payHref: document.querySelector(".pay-button").getAttribute("href"),
    payTarget: document.querySelector(".pay-button").target,
    payRel: document.querySelector(".pay-button").rel,
    iframeSrc: document.querySelector("iframe").getAttribute("src"),
  })`);
  testData("c03-content").dump("content.json", JSON.stringify(c, null, 2));
  expect(c.amount).toBe("0.42 XMR");
  expect(c.address).toBe(keys.address);
  expect(c.qrWidth).toBeGreaterThan(100);
  expect(c.payHref).toStartWith("/wallet_info?checkoutId=");
  expect(c.payHref).toContain(keys.address);
  expect(c.payTarget).toBe("_blank");
  expect(c.payRel).toContain("noopener");
  expect(c.iframeSrc).toStartWith("/paymentstatus?checkoutId=");
  // the status iframe reloads itself (Refresh header), no javascript needed
  const res = await fetch(env.shop.url + c.iframeSrc);
  expect(res.headers.get("refresh")).toBe("1");
  expect(res.headers.get("cache-control")).toContain("no-store");
  await cdp.shot("checkout");
}, T);

test("c04 waiting turns into paid live, and the buyer lands on the success url with the checkout id", async () => {
  const { cdp, shop } = env;
  const { dir, dump } = testData("c04-redirect");
  cdp.shotDir = dir;
  // the merchant shop: another origin that the buyer comes back to
  const merchant = Bun.serve({
    port: 0,
    fetch: (req) => new Response(`<!doctype html><title>thanks</title><h1 id="thanks">thanks ${new URL(req.url).searchParams.get("checkoutId")}</h1>`, { headers: { "content-type": "text/html" } }),
  });
  try {
    const keys = await testKeys();
    const successUrl = `${merchant.url}thanks?ref="quoted"&checkoutId=`;
    const s = insertCheckout(shop, keys.address, { title: "Redirect Product", successUrl });
    await cdp.goto(`${shop.url}/?checkoutId=${s.sessionId}`);
    await cdp.waitFor(`(document.querySelector("iframe")?.contentDocument?.body?.innerText ?? "").includes("Waiting")`, "waiting");
    await cdp.shot("before-payment");
    // the wallet backend would do this when the tx confirms
    const db = shop.db();
    db.run("update checkout_session set paid_status = 1, tx_confirmations = 10, tx_hash = ? where session_id = ?", ["34".repeat(32), s.sessionId]);
    db.close();
    await cdp.waitFor(`location.origin === ${JSON.stringify(merchant.url.origin)}`, "top window on the merchant page", 15_000);
    await cdp.waitFor(`!!document.querySelector("#thanks")`, "thanks page");
    await cdp.shot("merchant-thanks-page");
    const href = await cdp.eval("location.href");
    dump("landed.txt", href);
    const u = new URL(href);
    expect(u.pathname).toBe("/thanks");
    expect(u.searchParams.get("ref")).toBe('"quoted"');
    expect(u.searchParams.get("checkoutId")).toBe(s.sessionId);
  } finally {
    merchant.stop(true);
  }
}, T);

test("c05 a legacy javascript: success url never runs, the buyer sees payment received", async () => {
  const { cdp, shop } = env;
  cdp.shotDir = testData("c05-legacy-js-url").dir;
  const keys = await testKeys();
  const s = insertCheckout(shop, keys.address, { title: "Old Link", paid: true, successUrl: "javascript:window.top.__xss=1" });
  await cdp.goto(`${shop.url}/?checkoutId=${s.sessionId}`);
  await cdp.waitFor(`(document.querySelector("iframe")?.contentDocument?.body?.innerText ?? "").includes("Payment received")`, "paid");
  await Bun.sleep(1500); // one iframe refresh
  await cdp.shot("paid-no-redirect");
  expect(await cdp.eval(`window.__xss ?? null`)).toBeNull();
  expect(await cdp.eval("location.origin")).toBe(new URL(shop.url).origin);
}, T);

test("c06 backend lost its node: /pay shows a notice, no checkout session is made", async () => {
  const { cdp, shop } = env;
  const { dir, dump } = testData("c06-node-down");
  cdp.shotDir = dir;
  const keys = await testKeys();
  const w = await shop.post("/editWallet", { walletName: "Shop Wallet", primaryAddress: keys.address, secretViewKey: keys.viewKey }, cookie);
  expect(w.json?.success).toBe(true);
  const link = await shop.post("/editPaymentLink", { linkType: "product", productTitle: "Needs Node", amount: "1", walletId: keys.address }, cookie);
  const db = shop.db();
  const count = () => (db.query("select count(*) as n from checkout_session where payment_link_id = ?").get(link.json.paymentLinkId) as { n: number }).n;
  // the node url is a closed port. the wallet marks itself disconnected after a try.
  const end = Date.now() + 30_000;
  let body = "";
  while (Date.now() < end) {
    body = await (await fetch(`${shop.url}/pay/${link.json.paymentLinkId}`, { redirect: "manual" })).text();
    if (body.includes("lost connection")) break;
    await Bun.sleep(500);
  }
  dump("pay.html", body);
  expect(body).toContain("payment backend lost connection to node");
  const before = count();
  await cdp.goto(`${shop.url}/pay/${link.json.paymentLinkId}`);
  await cdp.waitFor(`${text(".mpl-title")}.includes("lost connection")`, "notice");
  await cdp.shot("node-down-desktop");
  await viewport(PHONE);
  await cdp.goto(`${shop.url}/pay/${link.json.paymentLinkId}`);
  await cdp.waitFor(`${text(".mpl-title")}.includes("lost connection")`, "notice phone");
  await cdp.shot("node-down-phone");
  await pageChecks("node down phone");
  await viewport(VIEWPORT);
  expect(count()).toBe(before);
  db.close();
}, T);

test("c07 no page errors on any checkout page", () => {
  const errors = pageErrors(env.cdp);
  testData("c07-errors").dump("page-errors.json", JSON.stringify(errors, null, 2));
  expect(errors).toEqual([]);
  expect(env.cdp.dialogs()).toEqual([]);
});

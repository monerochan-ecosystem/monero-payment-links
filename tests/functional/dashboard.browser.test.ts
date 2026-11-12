// the admin dashboard in a real (own, headless) chrome against an isolated shop.
// real mouse clicks and typing over cdp. every state is a screenshot in
// test-data/functional/dashboard.browser/<test>/, see index.html there.
// run: bun test tests/functional/dashboard.browser.test.ts
import { afterAll, beforeAll, expect, test } from "bun:test";
import { loginInBrowser, openEnv, pageErrors, text, value, visible, writeGallery, type Env } from "../browser";
import { testKeys } from "../shop";
import { testDataFor } from "../testdata";

const testData = testDataFor(import.meta.path);
let env: Env;
const T = 60_000;

beforeAll(async () => {
  env = await openEnv(testData("env").dir);
}, 90_000);
afterAll(async () => {
  await env?.close();
  writeGallery(testData.root);
});

function step(name: string) {
  const t = testData(name);
  env.cdp.shotDir = t.dir;
  return t;
}

test("d01 login page, wrong password, right password", async () => {
  step("d01-login");
  const { cdp, shop } = env;
  await cdp.goto(shop.url + "/dashboard");
  await cdp.waitFor(`location.pathname === "/login"`, "redirect to login");
  await cdp.shot("login");
  await cdp.type("input[name=password]", "wrong");
  await cdp.click("form button[type=submit]");
  await cdp.waitFor(`location.search === "?error=1" && ${visible(".error")}`, "error shown");
  await cdp.shot("login-wrong-password");
  await loginInBrowser(env);
  await cdp.shot("dashboard-first-visit");
  // no wallet yet: payment links page guides to wallets
  expect(await cdp.eval(`location.hash`)).toBe("#/payment-links");
  expect(await cdp.eval(visible("#no-wallets-guidance"))).toBe(true);
}, T);

test("d02 add wallet: link without extension opens the manual dialog, validation, save", async () => {
  step("d02-add-wallet");
  const { cdp } = env;
  const keys = await testKeys();
  await cdp.click(".guidance-cta");
  await cdp.waitFor(`location.hash === "#/wallets" && ${visible(".empty-wallet-card")}`, "wallets empty state");
  await cdp.shot("wallets-empty");
  await cdp.click(".add-wallet-btn");
  await cdp.waitFor(`${text(".dialog-title")} === "Add New Wallet"`, "manual dialog");
  expect(await cdp.eval(`location.hash`)).toBe("#/wallets");
  await cdp.shot("add-wallet-dialog");
  await cdp.type(".edit-dialog-overlay input[name=walletName]", "Test Wallet ✓");
  await cdp.type(".edit-dialog-overlay input[name=primaryAddress]", "not-an-address");
  await cdp.type(".edit-dialog-overlay input[name=secretViewKey]", keys.viewKey);
  await cdp.click(".edit-dialog-overlay .submit-btn");
  await cdp.waitFor(`${visible(".edit-dialog-overlay input[name=primaryAddress].error")}`, "address error");
  await cdp.shot("add-wallet-bad-address");
  await cdp.type(".edit-dialog-overlay input[name=primaryAddress]", keys.address);
  // the typed values survive the error render
  expect(await cdp.eval(value(".edit-dialog-overlay input[name=walletName]"))).toBe("Test Wallet ✓");
  await cdp.click(".edit-dialog-overlay .submit-btn");
  // the wallet library takes only plain names. the error shows at the field.
  await cdp.waitFor(`${visible(".edit-dialog-overlay input[name=walletName].error")}`, "name error");
  await cdp.shot("add-wallet-bad-name");
  await cdp.type(".edit-dialog-overlay input[name=walletName]", "Test Wallet");
  await cdp.click(".edit-dialog-overlay .submit-btn");
  await cdp.waitFor(`${visible(".wallet-card")} && ${text(".wallet-name")} === "Test Wallet"`, "wallet card after reload", 20_000);
  await cdp.shot("wallet-added");
}, T);

test("d03 wallet dialog: prefilled, delete warning and cancel, close by overlay", async () => {
  step("d03-wallet-dialog");
  const { cdp } = env;
  const keys = await testKeys();
  await cdp.click(".edit-wallet-btn");
  await cdp.waitFor(`${text(".dialog-title")} === "Edit Wallet"`, "edit wallet dialog");
  expect(await cdp.eval(value(".edit-dialog-overlay input[name=primaryAddress]"))).toBe(keys.address);
  expect(await cdp.eval(value(".edit-dialog-overlay input[name=secretViewKey]"))).toBe(keys.viewKey);
  await cdp.shot("edit-wallet");
  await cdp.click(".edit-dialog-overlay .delete-btn");
  await cdp.waitFor(visible(".delete-warning.show"), "delete warning");
  await cdp.shot("delete-warning");
  await cdp.click(".cancel-delete");
  await cdp.waitFor(visible(".edit-dialog-overlay .delete-btn"), "delete button back");
  await cdp.clickAt(4, 4);
  await cdp.waitFor(`!${visible(".edit-dialog-overlay")}`, "overlay click closes");
  await cdp.shot("closed");
}, T);

test("d04 rename wallet saves", async () => {
  step("d04-rename-wallet");
  const { cdp } = env;
  await cdp.click(".edit-wallet-btn");
  await cdp.waitFor(visible(".edit-dialog-overlay"), "dialog");
  await cdp.type(".edit-dialog-overlay input[name=walletName]", "Renamed Wallet");
  await cdp.click(".edit-dialog-overlay .submit-btn");
  await cdp.waitFor(`${text(".wallet-name")} === "Renamed Wallet"`, "renamed after reload", 20_000);
  await cdp.shot("renamed");
}, T);

test("d05 settings: node url prefilled, validation, theme tab and dropdown", async () => {
  step("d05-settings");
  const { cdp, shop } = env;
  await cdp.click(".set-nodeurl-btn");
  await cdp.waitFor(visible("#settings-dialog-overlay"), "settings open");
  expect(await cdp.eval(value("input[name=nodeurl]"))).toBe(shop.nodeUrl);
  await cdp.shot("settings-connection");
  await cdp.type("input[name=nodeurl]", "not a url");
  await cdp.click("#connection-form .submit-btn");
  await cdp.waitFor(`${visible("#settings-dialog-overlay .error-message[style*=block]")}`, "node url error");
  await cdp.shot("settings-bad-url");
  await cdp.click(".settings-tab", 1);
  await cdp.waitFor(visible("#theme-form"), "theme tab");
  await cdp.shot("settings-theme");
  await cdp.click(".custom-dropdown-menu .dropdown-display", 1);
  await cdp.waitFor(visible(".theme-dropdown-list.open"), "dashboard theme menu");
  await cdp.shot("theme-menu-open");
  await cdp.click(".dialog-title");
  await cdp.waitFor(`!${visible(".theme-dropdown-list.open")}`, "click elsewhere closes the menu");
  await cdp.click("#settings-dialog-overlay .close-btn");
  await cdp.waitFor(`!${visible("#settings-dialog-overlay")}`, "settings close");
}, T);

for (const theme of ["stripe", "monero", "document"]) {
  test(`d06 dashboard theme ${theme} applies after save`, async () => {
    step(`d06-theme-${theme}`);
    const { cdp } = env;
    await cdp.click(".set-nodeurl-btn");
    await cdp.click(".settings-tab", 1);
    await cdp.click(".custom-dropdown-menu .dropdown-display", 1);
    await cdp.waitFor(visible(".theme-dropdown-list.open"), "menu open");
    await cdp.clickSettled(".theme-dropdown-list.open .dropdown-item", theme);
    await cdp.waitFor(`[...document.querySelectorAll(".dropdown-display")][1].innerText.trim().toLowerCase() === ${JSON.stringify(theme)} && !${visible(".theme-dropdown-list.open")}`, "theme picked");
    await cdp.shot(`picked-${theme}`);
    await cdp.clickSettled("#theme-form .submit-btn");
    await cdp.waitFor(`window.dashboardData?.theme_dashboard === ${JSON.stringify(theme)} && ${visible(".wallet-card")}`, "reload with theme", 20_000);
    await cdp.shot(`wallets-${theme}`);
    await cdp.click(".sidebar .menu-item", 2);
    await cdp.waitFor(visible(".create-link-btn"), "payment links page");
    await cdp.shot(`payment-links-${theme}`);
    await cdp.click(".sidebar .menu-item", 0);
    await cdp.waitFor(visible(".wallet-card"), "back to wallets");
  }, T);
}

const TITLE = "Café ✓ 日本 product";
let linkId = "";

test("d07 payment link form: empty submit errors, type switch, overlay close", async () => {
  step("d07-link-form");
  const { cdp } = env;
  await cdp.click(".sidebar .menu-item", 2);
  await cdp.waitFor(visible(".empty-payment-links-card"), "empty links state");
  await cdp.shot("links-empty");
  await cdp.click(".empty-payment-links-button");
  await cdp.waitFor(`${text(".dialog-title")} === "Create Product Payment Link"`, "create dialog");
  await cdp.shot("create-step1");
  await cdp.click(".next-btn");
  await cdp.waitFor(`${text(".next-btn")} === "Back"`, "step 2");
  await cdp.shot("create-step2");
  // a real click on submit must send the form
  await cdp.click(".submit-btn");
  await cdp.waitFor(visible("input[name=productTitle].error"), "back on step 1 with title error");
  await cdp.shot("empty-submit-step1");
  await cdp.click(".next-btn");
  await cdp.waitFor(visible("input[name=amount].error"), "amount error on step 2");
  await cdp.shot("empty-submit-step2");
  await cdp.click(".next-btn");
  await cdp.click(".payment-type-btn", 1);
  await cdp.waitFor(`${text(".dialog-title")} === "Create Invoice Payment Link"`, "invoice");
  await cdp.shot("invoice-step1");
  await cdp.click(".next-btn");
  await cdp.waitFor(visible("input[name=dueDate]"), "due date");
  expect(await cdp.eval(visible("input[name=maxUses]"))).toBe(false);
  await cdp.shot("invoice-step2");
  await cdp.clickAt(4, 4);
  await cdp.waitFor(`!${visible(".edit-dialog-overlay")}`, "overlay closes");
  await cdp.click(".empty-payment-links-button");
  await cdp.waitFor(visible(".edit-dialog-overlay"), "reopen");
  expect(await cdp.eval(visible(".error-message[style*=block]"))).toBe(false);
  expect(await cdp.eval(text(".dialog-title"))).toBe("Create Product Payment Link");
  await cdp.click(".close-btn");
}, T);

test("d08 create product link with unicode title, lands on detail without reload", async () => {
  step("d08-create");
  const { cdp } = env;
  await cdp.eval(`window.__noReload = 1`);
  await cdp.click(".empty-payment-links-button");
  await cdp.type("input[name=productTitle]", TITLE);
  await cdp.type("textarea[name=productDescription]", "line one\nline two");
  await cdp.click(".next-btn");
  await cdp.type("input[name=amount]", "0.123");
  await cdp.click(".custom-dropdown-menu .dropdown-display");
  await cdp.waitFor(visible(".dropdown-list.open .dropdown-item"), "wallet menu");
  await cdp.clickSettled(".dropdown-list.open .dropdown-item");
  await cdp.shot("wallet-picked");
  await cdp.waitFor(`${text(".custom-dropdown-menu .dropdown-display")}.startsWith("Renamed Wallet")`, "wallet picked");
  await cdp.type("input[name=maxUses]", "5");
  await cdp.type("input[name=successUrl]", "https://shop.example/thanks?checkoutId=");
  await cdp.shot("filled");
  await cdp.click(".submit-btn");
  await cdp.waitFor(`location.hash.startsWith("#/payment-links/") && ${text(".detail-card h2")} === ${JSON.stringify(TITLE)}`, "detail page", 10_000);
  linkId = await cdp.eval(`decodeURIComponent(location.hash.split("/").pop())`);
  expect(await cdp.eval(`window.__noReload`)).toBe(1);
  await cdp.shot("detail");
}, T);

test("d09 edit: every field prefilled, change saves", async () => {
  step("d09-edit");
  const { cdp } = env;
  await cdp.click(".edit-payment-link-btn");
  await cdp.waitFor(`${text(".dialog-title")} === "Update Product Payment Link"`, "update dialog");
  expect(await cdp.eval(value("input[name=productTitle]"))).toBe(TITLE);
  expect(await cdp.eval(value("textarea[name=productDescription]"))).toBe("line one\nline two");
  expect(await cdp.eval(visible(".payment-type-selector"))).toBe(false);
  await cdp.shot("edit-step1");
  await cdp.click(".next-btn");
  expect(await cdp.eval(value("input[name=amount]"))).toBe("0.123");
  expect(await cdp.eval(value("input[name=maxUses]"))).toBe("5");
  expect(await cdp.eval(value("input[name=successUrl]"))).toBe("https://shop.example/thanks?checkoutId=");
  expect(await cdp.eval(text(".custom-dropdown-menu .dropdown-display"))).toStartWith("Renamed Wallet");
  await cdp.shot("edit-step2");
  await cdp.type("input[name=successUrl]", "javascript:alert(1)");
  await cdp.click(".submit-btn");
  await cdp.waitFor(visible("input[name=successUrl].error"), "javascript: url refused");
  await cdp.shot("edit-js-url-refused");
  await cdp.type("input[name=successUrl]", "https://shop.example/ok");
  await cdp.click(".next-btn");
  await cdp.type("input[name=productTitle]", TITLE + " v2");
  await cdp.click(".next-btn");
  await cdp.click(".submit-btn");
  await cdp.waitFor(`${text(".detail-card h2")} === ${JSON.stringify(TITLE + " v2")} && !${visible(".edit-dialog-overlay")}`, "saved");
  await cdp.shot("edited");
}, T);

test("d10 copy button, list page, reload hydrates unicode", async () => {
  step("d10-copy-reload");
  const { cdp, shop } = env;
  await cdp.send("Browser.grantPermissions", { origin: shop.url, permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => {});
  await cdp.click(".copy-link-btn");
  await cdp.waitFor(`${text(".copy-link-btn")} === "Copied!"`, "copied");
  await cdp.shot("copied");
  await cdp.waitFor(`!!document.querySelector(".copy-link-btn svg")`, "icon back", 4000);
  await cdp.click(".back-btn");
  await cdp.waitFor(visible(".payment-link-card"), "list");
  await cdp.shot("list");
  // the copy button inside a card does not open the card
  await cdp.click(".payment-link-card .copy-link-btn");
  await Bun.sleep(200);
  expect(await cdp.eval(`location.hash`)).toBe("#/payment-links");
  await cdp.send("Page.reload");
  await cdp.waitFor(`${text(".payment-link-card h3")}.startsWith(${JSON.stringify(TITLE + " v2")})`, "unicode after reload", 15_000);
  await cdp.shot("list-after-reload");
}, T);

test("d11 xss in titles stays text in list, detail and transactions", async () => {
  step("d11-xss");
  const { cdp } = env;
  const XSS = `<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>`;
  await cdp.click(".create-link-btn");
  await cdp.click(".payment-type-btn", 1);
  await cdp.type("input[name=invoiceTitle]", XSS);
  await cdp.type("textarea[name=invoiceDescription]", `</textarea><img src=x onerror="window.__xss=3">`);
  await cdp.click(".next-btn");
  await cdp.type("input[name=amount]", "1");
  await cdp.click(".custom-dropdown-menu .dropdown-display");
  await cdp.clickSettled(".dropdown-list.open .dropdown-item");
  await cdp.click(".submit-btn");
  await cdp.waitFor(`${text(".info-title")} === ${JSON.stringify(XSS)}`, "invoice detail shows the raw text");
  await cdp.shot("xss-detail");
  await cdp.click(".back-btn");
  await cdp.waitFor(visible(".invoice-badge"), "list with invoice");
  await cdp.shot("xss-list");
  await cdp.click(".sidebar .menu-item", 1);
  await cdp.waitFor(`location.hash === "#/transactions"`, "transactions");
  await cdp.shot("transactions");
  await cdp.send("Page.reload");
  await cdp.waitFor(visible(".sidebar"), "reload");
  expect(await cdp.eval(`window.__xss ?? null`)).toBeNull();
  expect(await cdp.eval(`document.querySelectorAll("img[onerror], .main-content script").length`)).toBe(0);
  expect(cdp.dialogs()).toEqual([]);
}, T);

test("d12 delete from detail: cancel, overlay, confirm", async () => {
  step("d12-delete");
  const { cdp } = env;
  await cdp.goto(env.shop.url + `/dashboard#/payment-links/${linkId}`);
  await cdp.waitFor(visible(".delete-payment-link-btn"), "detail");
  await cdp.click(".delete-payment-link-btn");
  await cdp.waitFor(visible(".delete-dialog-overlay"), "delete dialog");
  await cdp.shot("delete-dialog");
  await cdp.click(".cancel-delete-btn");
  await cdp.waitFor(`!${visible(".delete-dialog-overlay")}`, "cancel");
  await cdp.click(".delete-payment-link-btn");
  await cdp.clickAt(4, 4);
  await cdp.waitFor(`!${visible(".delete-dialog-overlay")}`, "overlay closes");
  await cdp.click(".delete-payment-link-btn");
  await cdp.click(".confirm-delete-btn");
  await cdp.waitFor(`location.hash === "#/payment-links" && !window.dashboardData.payment_links.some((l) => l.payment_link_id === ${JSON.stringify(linkId)})`, "deleted", 10_000);
  await cdp.shot("after-delete");
  const db = env.shop.db();
  expect(db.query("select count(*) as n from product_payment_links where payment_link_id = ?").get(linkId)).toEqual({ n: 0 });
  db.close();
}, T);

test("d13 delete from the edit form, other dashboards get the change over the websocket", async () => {
  const { dump } = step("d13-delete-form-ws");
  const { cdp, shop } = env;
  // the invoice from d11 is the only link left
  const ids = await cdp.eval(`window.dashboardData.payment_links.map((l) => l.payment_link_id)`);
  expect(ids.length).toBe(1);
  // a second admin session acts as another open dashboard
  const { cookie } = await shop.login();
  const ws = new WebSocket(shop.url.replace("http", "ws") + "/ws", { headers: { cookie } } as any);
  const frames: any[] = [];
  ws.onmessage = (m) => frames.push(JSON.parse(String(m.data)));
  await new Promise((r) => (ws.onopen = r));
  await cdp.goto(shop.url + `/dashboard#/payment-links/${ids[0]}`);
  await cdp.waitFor(visible(".edit-payment-link-btn"), "detail");
  await cdp.click(".edit-payment-link-btn");
  await cdp.click(".next-btn");
  await cdp.click(".edit-dialog-overlay .delete-btn");
  await cdp.waitFor(visible(".delete-warning.show"), "warning");
  await cdp.shot("form-delete-warning");
  await cdp.click(".confirm-delete");
  await cdp.waitFor(`location.hash === "#/payment-links" && ${visible(".empty-payment-links-card")}`, "empty again", 10_000);
  await cdp.shot("empty-again");
  const end = Date.now() + 5000;
  while (Date.now() < end && !frames.some((f) => Array.isArray(f.payment_links) && f.payment_links.length === 0)) await Bun.sleep(50);
  ws.close();
  dump("ws-frames.json", JSON.stringify(frames.map((f) => ({ links: f.payment_links?.length, sessions: f.checkout_sessions?.length })), null, 2));
  expect(frames.some((f) => Array.isArray(f.payment_links) && f.payment_links.length === 0)).toBe(true);
}, T);

test("d14 sidebar routes and unknown hash, no page errors in the whole run", async () => {
  step("d14-routes");
  const { cdp } = env;
  for (const [i, hash] of [[0, "#/wallets"], [1, "#/transactions"], [2, "#/payment-links"]] as const) {
    await cdp.click(".sidebar .menu-item", i);
    await cdp.waitFor(`location.hash === ${JSON.stringify(hash)} && document.querySelectorAll(".menu-item.active").length === 1`, hash);
    await cdp.shot(hash.slice(2));
  }
  await cdp.goto(env.shop.url + "/dashboard#/payment-links/does-not-exist");
  await cdp.waitFor(`${text(".detail-container h1")} === "Payment Link not found"`, "not found");
  await cdp.shot("link-not-found");
  const errors = pageErrors(cdp);
  testData("d14-routes").dump("page-errors.json", JSON.stringify(errors, null, 2));
  expect(errors).toEqual([]);
}, T);

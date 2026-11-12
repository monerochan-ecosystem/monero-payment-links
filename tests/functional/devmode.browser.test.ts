// "bun run dev" mode: bun --hot and bun's own html bundler instead of the production build.
// the dashboard must load and render there too.
// run: bun test tests/functional/devmode.browser.test.ts
import { afterAll, beforeAll, expect, test } from "bun:test";
import { loginInBrowser, openEnv, pageErrors, visible, writeGallery, type Env } from "../browser";
import { testDataFor } from "../testdata";

const testData = testDataFor(import.meta.path);
let env: Env;

beforeAll(async () => {
  env = await openEnv(testData("env").dir, { hot: true });
}, 90_000);
afterAll(async () => {
  await env?.close();
  writeGallery(testData.root);
});

test("h01 dev mode: login, dashboard renders, sidebar routes, settings dialog", async () => {
  const { dir, dump } = testData("h01-dev-dashboard");
  const { cdp } = env;
  cdp.shotDir = dir;
  expect(env.shop.env.NODE_ENV).toBeUndefined();
  await loginInBrowser(env);
  await cdp.waitFor(visible("#no-wallets-guidance"), "guidance");
  await cdp.shot("dev-payment-links");
  await cdp.click(".sidebar .menu-item", 0);
  await cdp.waitFor(`location.hash === "#/wallets" && ${visible(".set-nodeurl-btn")}`, "wallets");
  await cdp.click(".set-nodeurl-btn");
  await cdp.waitFor(visible("#settings-dialog-overlay"), "settings");
  await cdp.shot("dev-settings");
  const scripts = await cdp.eval(`[...document.scripts].map((s) => s.src)`);
  dump("scripts.json", JSON.stringify(scripts, null, 2));
  const errors = pageErrors(cdp);
  dump("page-errors.json", JSON.stringify(errors, null, 2));
  expect(errors).toEqual([]);
}, 60_000);

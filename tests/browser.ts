// one isolated shop + one own headless chrome per browser test file
import { openChrome, type CDP } from "./cdp";
import { writeGallery } from "./gallery";
import { startShop, type Shop } from "./shop";

export type Env = { shop: Shop; cdp: CDP; close: () => Promise<void> };

export async function openEnv(dir: string, opts: { env?: Record<string, string>; hot?: boolean } = {}): Promise<Env> {
  const shop = await startShop(dir, opts);
  const chrome = await openChrome(dir).catch(async (e) => {
    await shop.stop();
    throw e;
  });
  return {
    shop,
    cdp: chrome.cdp,
    async close() {
      await chrome.close();
      await shop.stop();
    },
  };
}

export async function loginInBrowser(env: Env) {
  const { cdp, shop } = env;
  await cdp.goto(shop.url + "/login");
  await cdp.type("input[name=password]", shop.secret);
  await cdp.click("form button[type=submit]");
  await cdp.waitFor(`location.pathname === "/dashboard" && !!document.querySelector(".sidebar")`, "dashboard after login", 15_000);
}

export const visible = (sel: string) =>
  `!![...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => e.getBoundingClientRect().width > 0)`;
export const text = (sel: string) => `(document.querySelector(${JSON.stringify(sel)})?.innerText ?? "").trim()`;
export const value = (sel: string) => `(document.querySelector(${JSON.stringify(sel)})?.value ?? null)`;

// page errors, without favicon requests
export function pageErrors(cdp: CDP) {
  return cdp
    .errors()
    .map((e) => JSON.stringify(e.params).slice(0, 400))
    .filter((e) => !e.includes("favicon"));
}

export { writeGallery };

// chrome over the devtools protocol (cdp), like ../mininext/tests/cdp.ts.
// each test file starts its OWN headless chrome: own profile folder in test-data,
// --remote-debugging-port=0, so it never talks to or closes another browser.
// CHROME=/path/to/chrome picks the browser.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const known = [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/opt/brave.com/brave/brave",
  ];
  const found = known.find((p) => existsSync(p));
  if (!found) throw new Error("no chrome found. set CHROME=/path/to/chrome");
  return found;
}
export const CHROME = findChrome();
// github's ubuntu runners do not allow chrome's sandbox
const CHROME_FLAGS = process.env.CI ? ["--no-sandbox"] : [];

export const VIEWPORT = { width: 1280, height: 900 };

export class CDP {
  private id = 0;
  private pending = new Map<number, { ok: (v: any) => void; fail: (e: Error) => void }>();
  readonly events: { method: string; params: any; at: number }[] = [];
  private shotCount = 0;
  // the folder that screenshots go to. tests set it per test.
  shotDir = "";
  private constructor(private ws: WebSocket) {
    ws.onmessage = (m) => {
      const msg = JSON.parse(String(m.data));
      if (msg.id === undefined) return void this.events.push({ ...msg, at: Date.now() });
      const p = this.pending.get(msg.id)!;
      this.pending.delete(msg.id);
      msg.error ? p.fail(new Error(`${msg.error.message} ${msg.error.data ?? ""}`)) : p.ok(msg.result);
    };
  }
  static connect(url: string) {
    return new Promise<CDP>((ok, fail) => {
      const ws = new WebSocket(url);
      ws.onopen = () => ok(new CDP(ws));
      ws.onerror = () => fail(new Error(`cdp: can not connect to ${url}`));
    });
  }
  send(method: string, params: object = {}): Promise<any> {
    const id = ++this.id;
    return new Promise((ok, fail) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        fail(new Error("cdp timeout " + method));
      }, 30_000);
      this.pending.set(id, {
        ok: (v) => (clearTimeout(timer), ok(v)),
        fail: (e) => (clearTimeout(timer), fail(e)),
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression: string) {
    const r = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`page: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`);
    return r.result.value;
  }
  async waitFor(expression: string, what: string, ms = 8000) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (await this.eval(expression).catch(() => false)) return;
      await Bun.sleep(50);
    }
    await this.shot("TIMEOUT-" + what);
    throw new Error(`timeout: ${what}`);
  }
  async goto(url: string) {
    await this.send("Page.navigate", { url });
    await this.waitFor(`document.readyState === "complete" && location.href !== "about:blank"`, "load " + url, 15_000);
  }
  // a real mouse click in the middle of the first visible match
  async click(selector: string, nth = 0) {
    const pos = await this.eval(`(() => {
      const el = [...document.querySelectorAll(${JSON.stringify(selector)})].filter((e) => e.getBoundingClientRect().width > 0)[${nth}];
      if (!el) return null;
      el.scrollIntoView({ block: "center" });
      const b = el.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    })()`);
    if (!pos) {
      await this.shot("NO-ELEMENT-" + selector);
      throw new Error(`no visible ${selector}`);
    }
    await this.clickAt(pos.x, pos.y);
  }
  // wait until the element stops moving (css transitions), then click it
  async clickSettled(selector: string, textMatch?: string) {
    const find = `[...document.querySelectorAll(${JSON.stringify(selector)})].filter((e) => e.getBoundingClientRect().width > 0)${textMatch ? `.filter((e) => e.innerText.trim().toLowerCase() === ${JSON.stringify(textMatch.toLowerCase())})` : ""}[0]`;
    let last = "";
    for (let i = 0; i < 40; i++) {
      const box = await this.eval(`(() => { const el = ${find}; if (!el) return ""; const b = el.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round).join(","); })()`);
      if (box && box === last) break;
      last = box;
      await Bun.sleep(60);
    }
    if (!last) {
      await this.shot("NO-ELEMENT-" + selector);
      throw new Error(`no visible ${selector} ${textMatch ?? ""}`);
    }
    const [x, y, w, h] = last.split(",").map(Number) as [number, number, number, number];
    await this.clickAt(x + w / 2, y + h / 2);
  }
  async clickAt(x: number, y: number) {
    for (const type of ["mousePressed", "mouseReleased"])
      await this.send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
    // one frame for the render loop
    await Bun.sleep(80);
  }
  // click the field, select what is there, type like a keyboard (input events)
  async type(selector: string, text: string) {
    await this.click(selector);
    await this.eval(`document.querySelector(${JSON.stringify(selector)}).select?.()`);
    await this.send("Input.insertText", { text });
    await Bun.sleep(50);
  }
  async key(key: string, code = key) {
    for (const type of ["keyDown", "keyUp"])
      await this.send("Input.dispatchKeyEvent", { type, key, code, windowsVirtualKeyCode: key === "Enter" ? 13 : 0 });
    await Bun.sleep(80);
  }
  // full page png into shotDir, numbered in the order they are taken
  async shot(name: string) {
    if (!this.shotDir) return "";
    await Bun.sleep(120); // let the frame paint
    const r = await this.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    const file = `${this.shotDir}/${String(++this.shotCount).padStart(2, "0")}-${name.replace(/[^\w.-]+/g, "_").slice(0, 80)}.png`;
    mkdirSync(this.shotDir, { recursive: true });
    writeFileSync(file, Buffer.from(r.data, "base64"));
    return file;
  }
  // uncaught exceptions and console errors of the page
  errors() {
    return this.events.filter(
      (e) =>
        e.method === "Runtime.exceptionThrown" ||
        (e.method === "Runtime.consoleAPICalled" && e.params.type === "error") ||
        (e.method === "Log.entryAdded" && e.params.entry.level === "error"),
    );
  }
  dialogs() {
    return this.events.filter((e) => e.method === "Page.javascriptDialogOpening");
  }
  close() {
    this.ws.close();
  }
}

// headless chrome with its profile in <dir>/profile, connected to its first tab
export async function openChrome(dir: string) {
  mkdirSync(`${dir}/profile`, { recursive: true });
  const chrome = Bun.spawn(
    [CHROME, ...CHROME_FLAGS, "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${dir}/profile`, "--no-first-run", "--no-default-browser-check",
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`, "--hide-scrollbars", "--font-render-hinting=none",
      "--disable-background-timer-throttling", "--disable-extensions",
      "--disable-component-update", "--disable-background-networking", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "about:blank"],
    { stdout: "ignore", stderr: "ignore" },
  );
  try {
    let port = "";
    for (let i = 0; i < 100 && !port; i++) {
      await Bun.sleep(100);
      if (existsSync(`${dir}/profile/DevToolsActivePort`)) port = readFileSync(`${dir}/profile/DevToolsActivePort`, "utf8").split("\n")[0]!;
    }
    if (!port) throw new Error(`chrome did not start: ${CHROME}`);
    let page: any;
    for (let i = 0; i < 100 && !page; i++) {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).catch(() => []);
      page = targets.find((t: any) => t.type === "page");
      if (!page) await Bun.sleep(100);
    }
    if (!page) throw new Error(`chrome has no page target on port ${port}`);
    const cdp = await CDP.connect(page.webSocketDebuggerUrl);
    for (const d of ["Runtime", "Page", "Log"]) await cdp.send(`${d}.enable`);
    await cdp.send("Emulation.setDeviceMetricsOverride", { ...VIEWPORT, deviceScaleFactor: 1, mobile: false });
    // alert() and friends would block the page. a test checks dialogs() is empty.
    await cdp.send("Page.setInterceptFileChooserDialog", { enabled: false }).catch(() => {});
    const close = async () => {
      cdp.close();
      chrome.kill();
      await chrome.exited;
    };
    return { cdp, close, port };
  } catch (e) {
    chrome.kill();
    throw e;
  }
}

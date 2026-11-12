// an index.html with every screenshot, so a human can check all states fast.
// test-data/screenshots.html links all galleries.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { TEST_DATA } from "./testdata";

function pngs(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const p = resolve(dir, name);
    if (name === "profile" || name === "shop") continue;
    if (statSync(p).isDirectory()) out.push(...pngs(p));
    else if (name.endsWith(".png")) out.push(p);
  }
  return out;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot" }[c]};`);

export function writeGallery(root: string) {
  const files = pngs(root);
  const groups = new Map<string, string[]>();
  for (const f of files) {
    const g = relative(root, f).split("/").slice(0, -1).join("/") || ".";
    groups.set(g, [...(groups.get(g) ?? []), f]);
  }
  const body = [...groups]
    .map(([g, fs]) => `<h2>${esc(g)}</h2><div class="grid">${fs.map((f) => {
      const rel = relative(root, f);
      return `<figure><a href="${esc(rel)}"><img loading="lazy" src="${esc(rel)}"></a><figcaption>${esc(rel.split("/").pop()!)}</figcaption></figure>`;
    }).join("")}</div>`)
    .join("");
  writeFileSync(resolve(root, "index.html"), page(relative(TEST_DATA, root), body));
  // the top level list of all galleries
  const all: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = resolve(d, name);
      if (!statSync(p).isDirectory() || name === "profile" || name === "shop") continue;
      if (readdirSync(p).includes("index.html")) all.push(relative(TEST_DATA, resolve(p, "index.html")));
      walk(p);
    }
  };
  walk(TEST_DATA);
  writeFileSync(resolve(TEST_DATA, "screenshots.html"), page("all screenshots", `<ul>${all.sort().map((a) => `<li><a href="${esc(a)}">${esc(a)}</a></li>`).join("")}</ul>`));
}

function page(title: string, body: string) {
  return `<!doctype html><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font:14px system-ui;margin:20px;background:#f4f4f4}h2{margin-top:32px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}
figure{margin:0;background:#fff;padding:6px;border:1px solid #ddd}img{width:100%;display:block}
figcaption{font-size:12px;padding-top:4px;word-break:break-all}</style><h1>${esc(title)}</h1>${body}`;
}

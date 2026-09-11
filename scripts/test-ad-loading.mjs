import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const source = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes("function loadAds"));
for (const first of ["scroll", "pointerdown", "timer"]) {
  const handlers = {};
  let timer;
  let count = 0;
  runInNewContext(source, {
    window: { addEventListener: (name, fn) => handlers[name] = fn, removeEventListener: () => {} },
    document: { createElement: () => ({}), head: { appendChild: () => count++ } },
    setTimeout: fn => { timer = fn; return 1; }, clearTimeout: () => {},
  });
  (first === "timer" ? timer : handlers[first])();
  handlers.scroll(); handlers.pointerdown(); timer();
  assert.equal(count, 1, first);
}
console.log("Ad loading: all 3 event orderings passed");

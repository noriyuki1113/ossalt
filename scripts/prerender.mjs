#!/usr/bin/env node
/**
 * Post-build prerender script.
 * Reads dist/index.html, replaces meta tags per route, writes route-specific HTML.
 * Run after `vite build`: node scripts/prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { getPrerenderRoutes } from "./prerender-routes.mjs";

const DIST = join(process.cwd(), "dist");
const INDEX_HTML = join(DIST, "index.html");

if (!existsSync(INDEX_HTML)) {
  console.error("❌ dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}

const template = readFileSync(INDEX_HTML, "utf-8");
const routes = getPrerenderRoutes();

console.log(`\n🔧 Prerendering ${routes.length} routes...\n`);

let count = 0;

for (const route of routes) {
  let html = template;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(route.description)}">`
  );

  // Replace OG tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(route.title)}">`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(route.description)}">`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttr(route.canonical)}">`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}">`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}">`
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(route.canonical)}">`
  );

  // Write file
  const filePath =
    route.path === "/"
      ? join(DIST, "index.html")
      : join(DIST, route.path, "index.html");

  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, html, "utf-8");
  count++;
  console.log(`  ✅ ${route.path}`);
}

console.log(`\n✨ Prerendered ${count} pages.\n`);

// --- Helpers ---

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return str.replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}

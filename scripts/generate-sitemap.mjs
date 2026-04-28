#!/usr/bin/env node
/**
 * Generates dist/sitemap.xml from prerender routes.
 * Run after vite build, before prerender.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getPrerenderRoutes } from "./prerender-routes.mjs";

const DIST = join(process.cwd(), "dist");
const TODAY = new Date().toISOString().split("T")[0];

if (!existsSync(DIST)) {
  console.error("❌ dist/ not found. Run `vite build` first.");
  process.exit(1);
}

const routes = await getPrerenderRoutes();

const urls = routes
  .filter((r) => r.canonical)
  .map((r) => {
    const loc = r.canonical;
    const lastmod = r.lastmod ?? TODAY;
    const changefreq = r.changefreq ?? "monthly";
    const priority = r.priority ?? 0.5;
    return [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

writeFileSync(join(DIST, "sitemap.xml"), sitemap, "utf-8");
console.log(`✨ sitemap.xml generated — ${routes.length} URLs`);

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
}

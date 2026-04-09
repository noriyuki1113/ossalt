#!/usr/bin/env node
/**
 * Supabase の tools テーブルから stars_num 上位10件を取得し、
 * raw/openalt/{tool-name}.md として書き出すスクリプト。
 *
 * Usage: node scripts/export-openalt-tools.mjs
 *        bun scripts/export-openalt-tools.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in env");
  process.exit(1);
}

async function fetchTopTools(limit = 10) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/tools`);
  url.searchParams.set("select", "*");
  url.searchParams.set("order", "stars_num.desc.nullslast");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase query failed: ${res.status} ${body}`);
  }

  return res.json();
}

function toSlug(name) {
  return (name || "unknown")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(isoStr) {
  if (!isoStr) return "unknown";
  return isoStr.slice(0, 10);
}

function buildMarkdown(tool) {
  const slug = toSlug(tool.name);
  const today = new Date().toISOString().slice(0, 10);

  const replaces = Array.isArray(tool.replaces) && tool.replaces.length
    ? tool.replaces.map((r) => `  - ${r}`).join("\n")
    : "  - unknown";

  return `---
# このファイルは export-openalt-tools.mjs により自動生成された raw ソースです。
# LLM は読むだけ。編集しないこと。
tool_id: ${tool.id}
name: ${tool.name || "unknown"}
slug: ${slug}
category_en: ${tool.category_en || "unknown"}
category_ja: ${tool.category_ja || "unknown"}
parent_category_en: ${tool.parent_category_en || "unknown"}
parent_category_ja: ${tool.parent_category_ja || "unknown"}
github_url: ${tool.github_url || "unknown"}
url: ${tool.url || "unknown"}
stars_num: ${tool.stars_num ?? "unknown"}
forks_num: ${tool.forks_num ?? "unknown"}
language: ${tool.language || "unknown"}
last_commit: ${formatDate(tool.last_commit)}
license: ${tool.license || "unknown"}
primary_competitor: ${tool.primary_competitor || "unknown"}
primary_competitor_ja: ${tool.primary_competitor_ja || "unknown"}
replaces:
${replaces}
exported_at: ${today}
---

# ${tool.name || "unknown"}

## description_en

${tool.description_en || "（説明なし）"}

## description_ja

${tool.description_ja || "（説明なし）"}
`;
}

async function main() {
  console.log("Fetching top 10 tools from Supabase...");
  const tools = await fetchTopTools(10);
  console.log(`Fetched ${tools.length} tools.`);

  const outDir = join(ROOT, "raw", "openalt");
  mkdirSync(outDir, { recursive: true });

  for (const tool of tools) {
    const slug = toSlug(tool.name);
    const filename = `${slug}.md`;
    const filepath = join(outDir, filename);
    writeFileSync(filepath, buildMarkdown(tool), "utf8");
    console.log(`  -> raw/openalt/${filename}  (stars: ${tool.stars_num ?? "N/A"})`);
  }

  console.log("\nDone. Files written to raw/openalt/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

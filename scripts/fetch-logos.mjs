#!/usr/bin/env node
/**
 * Fetch tool logos from GitHub / Clearbit / Google Favicons,
 * convert to 128×128 WebP, and save to public/logos/{id}.webp.
 *
 * Usage:
 *   node scripts/fetch-logos.mjs               # fetch all missing logos
 *   node scripts/fetch-logos.mjs --force        # re-fetch everything
 *   node scripts/fetch-logos.mjs --limit 20     # process first 20 tools only
 *   node scripts/fetch-logos.mjs --id 42        # fetch one specific tool
 *   node scripts/fetch-logos.mjs --dry-run      # show plan without saving
 *
 * Outputs:
 *   public/logos/{id}.webp   — converted logo
 *   public/logos/index.json  — { "id": true } map used by ToolIcon at runtime
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// Auto-load .env (mirrors how Vite exposes these at build time)
try {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), "../.env");
  const envText = readFileSync(envPath, "utf8");
  for (const line of envText.split("\n")) {
    const eq = line.indexOf("=");
    if (eq < 1 || line.startsWith("#")) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch { /* .env is optional */ }

// ── Config ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LOGOS_DIR = join(ROOT, "public", "logos");
const INDEX_PATH = join(LOGOS_DIR, "index.json");

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://fjljkjbheqtprmforvpr.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const LOGO_SIZE = 128;       // output px (square)
const CONCURRENCY = 4;       // parallel downloads
const REQUEST_DELAY_MS = 80; // ms between each source attempt (rate limiting)
const FETCH_TIMEOUT_MS = 8000;

const EXCLUDED_DOMAINS = new Set([
  "openalternative.co",
  "www.openalternative.co",
  "github.com",    // github.com/org/repo pages — not useful as logos
]);

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const force   = args.includes("--force");
const dryRun  = args.includes("--dry-run");
const mockMode = args.includes("--mock");
const limitArg = args.includes("--limit")
  ? Number(args[args.indexOf("--limit") + 1]) || Infinity
  : Infinity;
const idArg = args.includes("--id")
  ? Number(args[args.indexOf("--id") + 1])
  : null;

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function getGithubAvatarUrl(githubUrl) {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length > 0) return `https://github.com/${parts[0]}.png?size=256`;
  } catch {}
  return null;
}

function getClearbitUrl(url) {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    if (EXCLUDED_DOMAINS.has(host)) return null;
    return `https://logo.clearbit.com/${host}`;
  } catch {}
  return null;
}

function getFaviconUrl(url) {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    if (EXCLUDED_DOMAINS.has(host)) return null;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
  } catch {}
  return null;
}

function getSources(tool) {
  return [
    getGithubAvatarUrl(tool.github_url),
    getClearbitUrl(tool.url),
    getFaviconUrl(tool.url),
  ].filter(Boolean);
}

async function downloadAsWebP(srcUrl) {
  const res = await fetchWithTimeout(srcUrl);
  if (!res.ok) return null;

  const contentType = res.headers.get("content-type") || "";
  // Reject HTML error pages disguised as images
  if (contentType.includes("text/html")) return null;

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) return null; // suspiciously small

  const webp = await sharp(buf)
    .resize(LOGO_SIZE, LOGO_SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 85 })
    .toBuffer();

  return webp;
}

function loadIndex() {
  try {
    return JSON.parse(readFileSync(INDEX_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveIndex(index) {
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + "\n");
}

// ── Supabase fetch ────────────────────────────────────────────────────────────

const MOCK_TOOLS = [
  { id: 1, name: "Supabase",   url: "https://supabase.com",   github_url: "https://github.com/supabase/supabase" },
  { id: 2, name: "AppFlowy",   url: "https://appflowy.io",    github_url: "https://github.com/AppFlowy-IO/AppFlowy" },
  { id: 3, name: "n8n",        url: "https://n8n.io",         github_url: "https://github.com/n8n-io/n8n" },
  { id: 4, name: "Grafana",    url: "https://grafana.com",    github_url: "https://github.com/grafana/grafana" },
  { id: 5, name: "Penpot",     url: "https://penpot.app",     github_url: "https://github.com/penpot/penpot" },
];

async function fetchTools() {
  if (mockMode) {
    console.log("    ※ --mock モード — Supabase への接続をスキップ");
    return MOCK_TOOLS;
  }

  if (!SUPABASE_KEY) {
    console.error("❌  SUPABASE_PUBLISHABLE_KEY が設定されていません (.env を確認してください)");
    process.exit(1);
  }

  let tools = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const params = new URLSearchParams({
      select: "id,name,url,github_url",
      order: "stars_num.desc.nullslast",
      limit: String(pageSize),
      offset: String(offset),
    });
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/rest/v1/tools?${params}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Accept-Profile": "public",
        },
      }
    );
    if (!res.ok) {
      console.error(`❌  Supabase エラー: ${res.status} ${await res.text()}`);
      process.exit(1);
    }
    const page = await res.json();
    tools = tools.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }

  return tools;
}

// ── Per-tool processor ────────────────────────────────────────────────────────

async function processTools(tools, index) {
  let fetched = 0, skipped = 0, failed = 0;

  async function processOne(tool) {
    const outPath = join(LOGOS_DIR, `${tool.id}.webp`);
    const alreadyExists = existsSync(outPath) && index[String(tool.id)];

    if (alreadyExists && !force) {
      skipped++;
      return;
    }

    const sources = getSources(tool);
    if (sources.length === 0) {
      process.stdout.write(`  ⚠  [${tool.id}] ${tool.name} — URLなし\n`);
      failed++;
      return;
    }

    let saved = false;
    for (const src of sources) {
      await sleep(REQUEST_DELAY_MS);
      try {
        const webp = await downloadAsWebP(src);
        if (!webp) continue;

        if (!dryRun) {
          writeFileSync(outPath, webp);
          index[String(tool.id)] = true;
        }
        process.stdout.write(
          `  ✓  [${tool.id}] ${tool.name ?? "?"}${dryRun ? " (dry-run)" : ""}\n`
        );
        fetched++;
        saved = true;
        break;
      } catch (err) {
        // Try next source silently
      }
    }

    if (!saved) {
      process.stdout.write(`  ✗  [${tool.id}] ${tool.name ?? "?"} — 全ソース失敗\n`);
      failed++;
    }
  }

  // Process with limited concurrency
  const queue = [...tools];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const tool = queue.shift();
      await processOne(tool);
    }
  });
  await Promise.all(workers);

  return { fetched, skipped, failed };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(LOGOS_DIR, { recursive: true });
  const index = loadIndex();

  console.log("📥  Supabase からツール一覧を取得中…");
  let tools = await fetchTools();
  console.log(`    ${tools.length} 件取得`);

  if (idArg !== null) {
    tools = tools.filter((t) => t.id === idArg);
    if (tools.length === 0) {
      console.error(`❌  id=${idArg} のツールが見つかりません`);
      process.exit(1);
    }
  }

  if (isFinite(limitArg)) {
    tools = tools.slice(0, limitArg);
  }

  const existing = tools.filter((t) => !force && index[String(t.id)] && existsSync(join(LOGOS_DIR, `${t.id}.webp`))).length;
  const toFetch = tools.length - existing;

  console.log(`\n🖼   ロゴ取得開始 (${toFetch} 件対象 / スキップ予定 ${existing} 件)`);
  if (dryRun) console.log("    ※ dry-run モード — ファイルは書き込みません\n");

  const { fetched, skipped, failed } = await processTools(tools, index);

  if (!dryRun) saveIndex(index);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ 取得成功  : ${fetched}
  – スキップ  : ${skipped}
  ✗ 取得失敗  : ${failed}
  合計        : ${tools.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main().catch((err) => {
  console.error("❌ 予期せぬエラー:", err);
  process.exit(1);
});

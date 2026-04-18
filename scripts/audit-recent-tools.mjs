#!/usr/bin/env node
/**
 * 最近追加されたツールの competitor データを監査するスクリプト。
 * Usage: node scripts/audit-recent-tools.mjs [--limit 20]
 *
 * 出力: 各ツールの id, name, primary_competitor, primary_competitor_ja を表示し、
 * 不正値と思われるものを警告する。
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://fjljkjbheqtprmforvpr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const INVALID = new Set([
  "有料SaaS", "有料SaaSサービス", "商用ツール", "その他",
  "unknown", "Unknown", "n/a", "N/A", "TBD", "tbd", "none", "None", "-",
]);

const limitArg = process.argv.includes("--limit")
  ? Number(process.argv[process.argv.indexOf("--limit") + 1]) || 20
  : 20;

async function main() {
  if (!SUPABASE_KEY) {
    console.error("❌ SUPABASE_PUBLISHABLE_KEY が設定されていません。");
    process.exit(1);
  }

  const url = `${SUPABASE_URL}/rest/v1/tools?select=id,name,primary_competitor,primary_competitor_ja,description_ja,created_at&order=created_at.desc.nullslast&limit=${limitArg}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) {
    console.error(`❌ Supabase エラー: ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  const tools = await res.json();
  console.log(`\n最近追加されたツール（上位${tools.length}件、created_at DESC）\n`);
  console.log("ID    | ツール名               | primary_competitor      | primary_competitor_ja   | 状態");
  console.log("------|------------------------|-------------------------|-------------------------|------");

  let issues = 0;
  for (const t of tools) {
    const en = t.primary_competitor ?? "(null)";
    const ja = t.primary_competitor_ja ?? "(null)";
    const enBad = !t.primary_competitor || INVALID.has(t.primary_competitor.trim());
    const jaBad = !t.primary_competitor_ja || INVALID.has(t.primary_competitor_ja.trim());
    const noDesc = !t.description_ja;
    const status = (enBad && jaBad) ? "⚠️ 競合なし" : (enBad || jaBad) ? "△ 片方のみ" : noDesc ? "△ 説明なし" : "✅";
    if (status !== "✅") issues++;

    const pad = (s, n) => String(s).slice(0, n).padEnd(n);
    console.log(`${pad(t.id, 5)} | ${pad(t.name, 22)} | ${pad(en, 23)} | ${pad(ja, 23)} | ${status}`);
  }

  console.log(`\n合計: ${issues} 件に問題あり / ${tools.length} 件中\n`);
  if (issues > 0) {
    console.log("修正方法:");
    console.log("  Supabase Studio > Table Editor > tools テーブル");
    console.log("  該当ツールの primary_competitor / primary_competitor_ja を正しいツール名に更新\n");
  }
}

main().catch(e => { console.error(e); process.exit(1); });

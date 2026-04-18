#!/usr/bin/env node
/**
 * DBの primary_competitor が不正なツールを自動修正するスクリプト。
 *
 * 動作:
 *   1. tools テーブルを全件取得
 *   2. primary_competitor が未設定/不正なツールを抽出
 *   3. replaces[0] を元に正しい競合ツール名を推定
 *   4. SUPABASE_SERVICE_ROLE_KEY がある場合 → 直接DB更新
 *      ない場合 → SQL UPDATE 文を標準出力に書き出す（Supabase Studio で実行）
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/fix-competitor-data.mjs
 *   node scripts/fix-competitor-data.mjs   # → SQL を出力するだけ（読み取りに anon key を使用）
 */

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://fjljkjbheqtprmforvpr.supabase.co";

const ANON_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 既知の有効な競合ツール（英語正規名）
const KNOWN_COMPETITORS = new Set([
  "Notion","Figma","Zapier","Slack","Firebase","Airtable","Trello","Jira",
  "WordPress","Shopify","Google Analytics","Datadog","Auth0","Typeform",
  "GitHub Copilot","Tableau","Contentful","LaunchDarkly","Google Drive",
  "Intercom","Retool","Postman","Webflow","Evernote","ChatGPT","Devin",
  "Stripe Billing","Pinecone","Bitly","Canny","Zendesk","Linear","Asana",
  "Confluence","Sentry","Miro","Mixpanel","HubSpot","ClickUp","PagerDuty",
  "SendGrid","GitHub","GitLab","Vercel","Heroku","MongoDB","Elasticsearch",
  "Algolia","Twilio","Segment","Amplitude","Loom","Calendly","Zoom",
  "Monday.com","Okta","Cloudflare","Supabase","PlanetScale",
]);

// replaces の値からKNOWN_COMPETITORSへのマッピング（ゆらぎ吸収）
const REPLACE_ALIAS = {
  "notion": "Notion", "figma": "Figma", "zapier": "Zapier", "slack": "Slack",
  "firebase": "Firebase", "airtable": "Airtable", "trello": "Trello",
  "jira": "Jira", "wordpress": "WordPress", "shopify": "Shopify",
  "google analytics": "Google Analytics", "ga": "Google Analytics",
  "datadog": "Datadog", "auth0": "Auth0", "typeform": "Typeform",
  "github copilot": "GitHub Copilot", "copilot": "GitHub Copilot",
  "tableau": "Tableau", "contentful": "Contentful",
  "launchdarkly": "LaunchDarkly", "google drive": "Google Drive",
  "intercom": "Intercom", "retool": "Retool", "postman": "Postman",
  "webflow": "Webflow", "evernote": "Evernote", "chatgpt": "ChatGPT",
  "devin": "Devin", "stripe": "Stripe Billing", "stripe billing": "Stripe Billing",
  "pinecone": "Pinecone", "bitly": "Bitly", "canny": "Canny",
  "zendesk": "Zendesk", "linear": "Linear", "asana": "Asana",
  "confluence": "Confluence", "sentry": "Sentry", "miro": "Miro",
  "mixpanel": "Mixpanel", "hubspot": "HubSpot", "clickup": "ClickUp",
  "pagerduty": "PagerDuty", "sendgrid": "SendGrid", "github": "GitHub",
  "gitlab": "GitLab", "vercel": "Vercel", "heroku": "Heroku",
  "mongodb": "MongoDB", "elasticsearch": "Elasticsearch", "algolia": "Algolia",
  "twilio": "Twilio", "segment": "Segment", "amplitude": "Amplitude",
  "loom": "Loom", "calendly": "Calendly", "zoom": "Zoom",
  "monday": "Monday.com", "monday.com": "Monday.com", "okta": "Okta",
};

const INVALID = new Set([
  "有料SaaS","有料SaaSサービス","商用ツール","その他",
  "unknown","Unknown","n/a","N/A","TBD","tbd","none","None","-","",
]);

function normalise(s) {
  return (s || "").trim().toLowerCase();
}

function resolveCompetitor(tool) {
  // 既存値が有効なら保持
  const cur = (tool.primary_competitor || "").trim();
  if (cur && !INVALID.has(cur) && KNOWN_COMPETITORS.has(cur)) return cur;

  // replaces 配列から推定
  if (Array.isArray(tool.replaces)) {
    for (const r of tool.replaces) {
      const mapped = REPLACE_ALIAS[normalise(r)];
      if (mapped) return mapped;
      // そのまま大文字始まりで一致するか
      const trimmed = (r || "").trim();
      if (KNOWN_COMPETITORS.has(trimmed)) return trimmed;
    }
  }
  return null; // 推定不可
}

async function fetchAll(key) {
  let offset = 0;
  const all = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/tools?select=id,name,primary_competitor,primary_competitor_ja,replaces&order=id&limit=1000&offset=${offset}`;
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 1000) break;
    offset += 1000;
  }
  return all;
}

async function patchTool(key, id, competitor) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tools?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        primary_competitor: competitor,
        primary_competitor_ja: competitor, // 固有名詞はそのまま
      }),
    }
  );
  return res.ok;
}

async function main() {
  const readKey = SERVICE_KEY || ANON_KEY;
  if (!readKey) {
    console.error("❌ SUPABASE_PUBLISHABLE_KEY が設定されていません。");
    process.exit(1);
  }

  console.log("⏳ tools テーブルを取得中...");
  const tools = await fetchAll(readKey);
  console.log(`✅ ${tools.length} 件取得\n`);

  const toFix = [];
  for (const t of tools) {
    const cur = (t.primary_competitor || "").trim();
    const needsFix = !cur || INVALID.has(cur) || !KNOWN_COMPETITORS.has(cur);
    if (!needsFix) continue;

    const resolved = resolveCompetitor(t);
    toFix.push({ ...t, resolved });
  }

  if (toFix.length === 0) {
    console.log("✨ 修正が必要なツールは見つかりませんでした。");
    return;
  }

  console.log(`⚠️  修正候補: ${toFix.length} 件\n`);
  console.log("ID    | ツール名               | 現在の値              | 推定値");
  console.log("------|------------------------|-----------------------|-----------");
  for (const t of toFix) {
    const pad = (s, n) => String(s ?? "").slice(0, n).padEnd(n);
    console.log(`${pad(t.id, 5)} | ${pad(t.name, 22)} | ${pad(t.primary_competitor, 21)} | ${t.resolved ?? "(推定不可)"}`);
  }

  if (SERVICE_KEY) {
    // サービスキーがある → 直接更新
    console.log("\n🔧 DB を直接更新します...\n");
    let ok = 0, skip = 0;
    for (const t of toFix) {
      if (!t.resolved) { skip++; continue; }
      const success = await patchTool(SERVICE_KEY, t.id, t.resolved);
      if (success) {
        console.log(`  ✅ [${t.id}] ${t.name}: "${t.primary_competitor ?? "(null)"}" → "${t.resolved}"`);
        ok++;
      } else {
        console.log(`  ❌ [${t.id}] ${t.name}: 更新失敗`);
      }
    }
    console.log(`\n完了: ${ok} 件更新, ${skip} 件スキップ（推定不可）`);
  } else {
    // サービスキーなし → SQL を出力
    console.log("\n📋 以下の SQL を Supabase Studio の SQL Editor で実行してください:\n");
    for (const t of toFix) {
      if (!t.resolved) {
        console.log(`-- [${t.id}] ${t.name}: 推定不可（手動で確認してください）`);
        continue;
      }
      const safe = t.resolved.replace(/'/g, "''");
      console.log(`UPDATE tools SET primary_competitor = '${safe}', primary_competitor_ja = '${safe}' WHERE id = ${t.id}; -- ${t.name}`);
    }
    console.log("\n💡 ヒント: SUPABASE_SERVICE_ROLE_KEY を設定すると自動更新できます。");
  }
}

main().catch(e => { console.error(e); process.exit(1); });

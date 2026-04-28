/**
 * Social draft generation job.
 * Uses Claude API to write Twitter/Bluesky drafts for newly added tools.
 * Inserts into social_drafts (status='draft', human approval required).
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../lib/supabase.mjs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたはOSSアルタナティブ（ossalt.jp）の中の人です。
日本の開発者向けに、新しいOSSツールの紹介ツイートを書いてください。

ルール:
- 140文字以内（日本語）
- 最初に絵文字1つ
- ツール名と「代替として使える」「セルフホスト可能」などの訴求
- URLは含めない（後で追加する）
- 過剰な宣伝はしない、技術的に正確に`;

export async function generateDrafts() {
  console.log("[generate-drafts] start");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[generate-drafts] ANTHROPIC_API_KEY not set — skipping");
    return;
  }

  // 過去7日以内に追加されたツールでまだ下書きがないもの
  const since = new Date(Date.now() - 7 * 86400_000).toISOString();

  const { data: tools } = await db
    .from("tools")
    .select("id, name, description_ja, description_en, primary_competitor, parent_category_ja")
    .gte("created_at", since)
    .order("stars_num", { ascending: false })
    .limit(5); // 1回5件まで（API費用節約）

  if (!tools?.length) {
    console.log("[generate-drafts] no new tools");
    return;
  }

  // 既に下書きがあるtool_idを除外
  const { data: existing } = await db
    .from("social_drafts")
    .select("tool_id")
    .in("tool_id", tools.map((t) => t.id));

  const doneIds = new Set((existing ?? []).map((r) => r.tool_id));
  const targets = tools.filter((t) => !doneIds.has(t.id));

  let generated = 0;

  for (const tool of targets) {
    try {
      const description = tool.description_ja || tool.description_en || "";
      const competitor = tool.primary_competitor || "";

      const userPrompt = `ツール名: ${tool.name}
説明: ${description.slice(0, 200)}
代替対象SaaS: ${competitor || "なし"}
カテゴリ: ${tool.parent_category_ja || ""}
サイトURL: https://ossalt.jp/tools/${tool.id}

上記ツールの紹介ツイート（Bluesky・X共用）を1つ作成してください。`;

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: userPrompt }],
        system: SYSTEM_PROMPT,
      });

      const content = message.content[0]?.text?.trim();
      if (!content) continue;

      // Bluesky用（140字）とTwitter用（同文）を両方登録
      const drafts = [
        { platform: "bluesky", draft_type: "new_tool", tool_id: tool.id, content, status: "draft" },
        { platform: "twitter", draft_type: "new_tool", tool_id: tool.id, content, status: "draft" },
      ];

      await db.from("social_drafts").insert(drafts);
      generated++;

      await sleep(1000); // Claude API rate limit
    } catch (err) {
      console.error(`[generate-drafts] failed for tool ${tool.id}:`, err.message);
    }
  }

  console.log(`[generate-drafts] done — generated=${generated}`);
  return { generated };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

if (process.argv[1].endsWith("generate-drafts.mjs")) {
  await generateDrafts();
}

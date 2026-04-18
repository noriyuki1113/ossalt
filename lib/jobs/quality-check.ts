import { supabaseAdmin } from "../supabase/client";
import { generateJson, loadPrompt } from "../claude/client";
import type { QualityCheckResult } from "../../types/automation";

interface QualityScore {
  score: number; // 0–1
  reasons: string[];
  recommend_publish: boolean;
}

export async function runQualityCheck(batchSize = 20): Promise<QualityCheckResult> {
  const result: QualityCheckResult = { checked: 0, passed: 0, failed: 0, scores: {} };

  const { data: tools, error } = await supabaseAdmin
    .from("tools")
    .select("id, name, slug, description, github_url, stars_count, language, tags, quality_score")
    .eq("status", "pending_review")
    .is("quality_score", null)
    .limit(batchSize);

  if (error) throw new Error(`Fetch tools error: ${error.message}`);
  if (!tools?.length) return result;

  const systemPrompt = loadPrompt("quality-check");

  for (const tool of tools) {
    result.checked++;
    try {
      const score = await scoreToolHeuristic(tool);
      const llmScore = await scoreTool(tool, systemPrompt);
      const finalScore = (score * 0.4 + llmScore.score * 0.6);

      await supabaseAdmin
        .from("tools")
        .update({
          quality_score: finalScore,
          status: finalScore >= 0.6 ? "pending_review" : "low_quality",
        })
        .eq("id", tool.id);

      result.scores[tool.slug] = finalScore;
      if (finalScore >= 0.6) result.passed++;
      else result.failed++;
    } catch (err) {
      console.error(`Quality check error for ${tool.slug}:`, err);
      result.failed++;
    }
  }

  console.log(`Quality check complete: ${JSON.stringify(result)}`);
  return result;
}

function scoreToolHeuristic(tool: {
  stars_count: number;
  description: string | null;
  github_url: string | null;
  language: string | null;
}): number {
  let score = 0;

  // Stars: log scale, maxes at ~10k stars = 0.4
  const stars = tool.stars_count ?? 0;
  score += Math.min(0.4, Math.log10(Math.max(1, stars)) / 4);

  // Has description
  if (tool.description && tool.description.length > 20) score += 0.2;

  // Has GitHub URL
  if (tool.github_url) score += 0.2;

  // Has known language
  if (tool.language) score += 0.1;

  // Stars threshold bonus
  if (stars >= 500) score += 0.1;

  return Math.min(1, score);
}

async function scoreTool(
  tool: { id: number; name: string; description: string | null; stars_count: number; tags: string[] },
  systemPrompt: string
): Promise<QualityScore> {
  const userMessage = `以下のOSSツールの品質スコアを評価してください:\n\n${JSON.stringify(tool, null, 2)}`;
  try {
    return await generateJson<QualityScore>(systemPrompt, userMessage);
  } catch {
    return { score: 0.5, reasons: ["LLM evaluation failed, using default"], recommend_publish: false };
  }
}

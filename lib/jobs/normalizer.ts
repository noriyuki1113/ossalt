import { supabaseAdmin } from "../supabase/client";
import { generateJson, loadPrompt } from "../claude/client";
import { getRepo } from "../github/api";
import type { IngestionQueueItem, NormalizedTool, NormalizerResult } from "../../types/automation";

export async function runNormalizer(batchSize = 10): Promise<NormalizerResult> {
  const result: NormalizerResult = { processed: 0, normalized: 0, rejected: 0, errors: 0 };

  const { data: items, error } = await supabaseAdmin
    .from("ingestion_queue")
    .select("*")
    .eq("status", "pending")
    .order("priority", { ascending: true })
    .order("discovered_at", { ascending: true })
    .limit(batchSize);

  if (error) throw new Error(`Fetch queue error: ${error.message}`);
  if (!items?.length) return result;

  const systemPrompt = loadPrompt("normalization");

  for (const item of items as IngestionQueueItem[]) {
    result.processed++;
    try {
      await markProcessing(item.id);
      const normalized = await normalizeItem(item, systemPrompt);

      if (!normalized) {
        await markRejected(item.id, "LLM determined not a relevant OSS tool");
        result.rejected++;
        continue;
      }

      const toolId = await upsertTool(normalized);
      await markNormalized(item.id, toolId);
      await saveAlternatives(toolId, normalized.saas_alternatives);
      result.normalized++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await markError(item.id, msg);
      result.errors++;
      console.error(`Normalizer error for ${item.id}:`, err);
    }
  }

  console.log(`Normalizer complete: ${JSON.stringify(result)}`);
  return result;
}

async function normalizeItem(
  item: IngestionQueueItem,
  systemPrompt: string
): Promise<NormalizedTool | null> {
  // Fetch fresh GitHub data if available
  let enriched = { ...item.raw_data };
  if (item.github_url) {
    try {
      const fullName = item.github_url.replace("https://github.com/", "");
      const repo = await getRepo(fullName);
      enriched = {
        ...enriched,
        stars: repo.stargazers_count,
        topics: repo.topics,
        description: repo.description,
        language: repo.language,
        homepage: repo.homepage,
        license: repo.license?.spdx_id,
        archived: repo.archived,
      };
      // Reject archived repos
      if (repo.archived) return null;
    } catch {
      // Continue with raw data if GitHub fetch fails
    }
  }

  const userMessage = `以下のOSSツール情報を正規化してください:\n\n${JSON.stringify(enriched, null, 2)}`;

  try {
    return await generateJson<NormalizedTool>(systemPrompt, userMessage);
  } catch {
    return null;
  }
}

async function upsertTool(normalized: NormalizedTool): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("tools")
    .upsert(
      {
        name: normalized.name,
        slug: normalized.slug,
        description: normalized.description_ja,
        description_en: normalized.description_en,
        github_url: normalized.github_url,
        website_url: normalized.website_url,
        license: normalized.license,
        stars_count: normalized.stars_count,
        language: normalized.language,
        tags: normalized.tags,
        quality_score: normalized.quality_score,
        status: "pending_review",
      },
      { onConflict: "github_url", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error) throw new Error(`Upsert tool error: ${error.message}`);
  return data.id;
}

async function saveAlternatives(
  toolId: number,
  alternatives: NormalizedTool["saas_alternatives"]
): Promise<void> {
  if (!alternatives?.length) return;

  const rows = alternatives.map((alt, i) => ({
    tool_id: toolId,
    saas_name: alt.saas_name,
    saas_slug: alt.saas_slug,
    saas_url: alt.saas_url,
    confidence_score: alt.confidence_score,
    source: "llm" as const,
    is_primary: i === 0,
  }));

  const { error } = await supabaseAdmin
    .from("tool_alternatives")
    .upsert(rows, { onConflict: "tool_id,saas_slug", ignoreDuplicates: false });

  if (error) console.error("Save alternatives error:", error.message);
}

async function markProcessing(id: string) {
  await supabaseAdmin.from("ingestion_queue").update({ status: "processing" }).eq("id", id);
}

async function markNormalized(id: string, toolId: number) {
  await supabaseAdmin
    .from("ingestion_queue")
    .update({ status: "normalized", normalized_tool_id: toolId, processed_at: new Date().toISOString() })
    .eq("id", id);
}

async function markRejected(id: string, reason: string) {
  await supabaseAdmin
    .from("ingestion_queue")
    .update({ status: "rejected", rejection_reason: reason, processed_at: new Date().toISOString() })
    .eq("id", id);
}

async function markError(id: string, message: string) {
  await supabaseAdmin
    .from("ingestion_queue")
    .update({ status: "pending", error_message: message })
    .eq("id", id);
}

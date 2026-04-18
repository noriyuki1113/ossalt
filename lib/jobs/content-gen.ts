import { supabaseAdmin } from "../supabase/client";
import { generateJson, generateText, loadPrompt } from "../claude/client";
import type { ComparisonContent, ContentGenResult } from "../../types/automation";

export async function runContentGen(batchSize = 5): Promise<ContentGenResult> {
  const result: ContentGenResult = { generated: 0, comparisons: 0, social_posts: 0, errors: 0 };

  // Find approved tools with alternatives that don't yet have comparisons
  const { data: tools, error } = await supabaseAdmin
    .from("tools")
    .select(`
      id, name, slug, description, github_url, stars_count, language, tags,
      tool_alternatives(saas_name, saas_slug, saas_url, confidence_score, is_primary)
    `)
    .eq("status", "approved")
    .gt("quality_score", 0.6)
    .limit(batchSize);

  if (error) throw new Error(`Fetch tools error: ${error.message}`);
  if (!tools?.length) return result;

  const comparisonPrompt = loadPrompt("comparison-draft");
  const socialPrompt = loadPrompt("social-x");

  for (const tool of tools) {
    const alternatives = (tool.tool_alternatives as Array<{
      saas_name: string;
      saas_slug: string;
      saas_url?: string;
      confidence_score: number;
      is_primary: boolean;
    }>) ?? [];

    for (const alt of alternatives.filter((a) => a.confidence_score >= 0.7)) {
      result.generated++;
      const slug = `${tool.slug}-vs-${alt.saas_slug}`;

      // Skip if comparison already exists
      const { data: existing } = await supabaseAdmin
        .from("comparisons")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) continue;

      try {
        const content = await generateComparisonContent(tool, alt, comparisonPrompt);

        await supabaseAdmin.from("comparisons").insert({
          slug,
          oss_tool_id: tool.id,
          oss_name: tool.name,
          saas_name: alt.saas_name,
          alternative_slug: alt.saas_slug,
          status: "draft",
          content,
          quality_score: null,
        });

        result.comparisons++;

        // Generate social post draft
        await generateSocialPost(tool, alt, content, socialPrompt);
        result.social_posts++;
      } catch (err) {
        console.error(`Content gen error for ${slug}:`, err);
        result.errors++;
      }
    }
  }

  console.log(`Content gen complete: ${JSON.stringify(result)}`);
  return result;
}

async function generateComparisonContent(
  tool: { name: string; slug: string; description: string; stars_count: number; language: string },
  alt: { saas_name: string; saas_slug: string },
  systemPrompt: string
): Promise<ComparisonContent> {
  const userMessage = `以下のOSSツールとSaaSの比較ページを日本語で生成してください:

OSS: ${tool.name} (${tool.slug})
SaaS: ${alt.saas_name} (${alt.saas_slug})
OSSの概要: ${tool.description}
Stars: ${tool.stars_count}
言語: ${tool.language}

comparison JSONを生成してください。`;

  return generateJson<ComparisonContent>(systemPrompt, userMessage, { maxTokens: 4096 });
}

async function generateSocialPost(
  tool: { name: string; slug: string },
  alt: { saas_name: string; saas_slug: string },
  content: ComparisonContent,
  systemPrompt: string
): Promise<void> {
  const userMessage = `以下の比較ページのXポスト（日本語・280文字以内）を1件生成してください:
OSS: ${tool.name}
SaaS: ${alt.saas_name}
verdict: ${content.verdict}
URL: https://ossalt.jp/compare/${tool.slug}-vs-${alt.saas_slug}`;

  const postText = await generateText(systemPrompt, userMessage, { maxTokens: 512 });

  const { data: compRow } = await supabaseAdmin
    .from("comparisons")
    .select("id")
    .eq("slug", `${tool.slug}-vs-${alt.saas_slug}`)
    .maybeSingle();

  await supabaseAdmin.from("social_posts").insert({
    tool_id: null,
    comparison_id: compRow?.id ?? null,
    platform: "x",
    content: postText.trim(),
    status: "draft",
  });
}

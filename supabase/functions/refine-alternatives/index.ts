import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BATCH_SIZE = 10;
const DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAI(
  apiKey: string,
  name: string,
  descriptionEn: string,
  categoryEn: string
): Promise<{
  primary_competitor: string;
  primary_competitor_ja: string;
  replaces: string[];
  replaces_ja: string[];
} | null> {
  const prompt = `以下のOSSツールが代替する最も有名な有料SaaSを1つ答えてください。
ツール名: ${name}
説明: ${descriptionEn || "N/A"}
カテゴリ: ${categoryEn || "N/A"}

回答はJSON形式で：
{
  "primary_competitor": "有料SaaS名（英語）",
  "primary_competitor_ja": "有料SaaS名（日本語説明付き）",
  "replaces": ["代替元1", "代替元2", "代替元3"],
  "replaces_ja": ["代替元1（説明）", "代替元2（説明）", "代替元3（説明）"]
}

例：
- Notionの代替OSSなら → "Notion"
- Slackの代替OSSなら → "Slack"
- Google Analyticsの代替OSSなら → "Google Analytics"

JSON以外は出力しないでください。`;

  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a software industry expert. Respond only with valid JSON, no markdown fences.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    }
  );

  if (!res.ok) {
    const t = await res.text();
    console.error(`OpenAI error for ${name}: ${res.status} ${t}`);
    return null;
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) return null;

  try {
    const cleaned = content
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`JSON parse error for ${name}: ${e.message}`, content);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Check for limit parameter (for testing)
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");

    let query = supabase
      .from("tools")
      .select("id, name, description_en, category_en, parent_category_en")
      .order("id");

    if (limitParam) {
      query = query.limit(parseInt(limitParam, 10));
    }

    const { data: tools, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    if (!tools || tools.length === 0) {
      return new Response(
        JSON.stringify({ message: "No tools found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${tools.length} tools in batches of ${BATCH_SIZE}`);

    let success = 0;
    let errors = 0;
    const updatedSamples: string[] = [];

    for (let i = 0; i < tools.length; i += BATCH_SIZE) {
      const batch = tools.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (tool) => {
          const result = await callAI(
            openaiApiKey,
            tool.name || "",
            tool.description_en || "",
            tool.category_en || ""
          );

          if (!result) {
            errors++;
            return;
          }

          const { error: updateError } = await supabase
            .from("tools")
            .update({
              primary_competitor: result.primary_competitor || null,
              primary_competitor_ja: result.primary_competitor_ja || null,
              replaces: result.replaces || null,
              replaces_ja: result.replaces_ja || null,
            })
            .eq("id", tool.id);

          if (updateError) {
            console.error(`Update error for ${tool.name}: ${updateError.message}`);
            errors++;
          } else {
            success++;
            if (updatedSamples.length < 5) {
              updatedSamples.push(
                `${tool.name} → ${result.primary_competitor}`
              );
            }
          }
        })
      );

      console.log(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1}: processed ${batch.length} tools (total: ${success} success, ${errors} errors)`
      );

      if (i + BATCH_SIZE < tools.length) {
        await sleep(DELAY_MS);
      }
    }

    const result = {
      message: "Refine alternatives complete",
      total: tools.length,
      success,
      errors,
      updated_samples: updatedSamples,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Refine error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

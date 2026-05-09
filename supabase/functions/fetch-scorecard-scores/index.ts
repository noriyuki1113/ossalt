import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SCORECARD_API = "https://api.securityscorecards.dev/projects/github.com";

function extractOwnerRepo(githubUrl: string): string | null {
  try {
    const url = new URL(githubUrl);
    if (!url.hostname.includes("github.com")) return null;
    const parts = url.pathname.replace(/^\//, "").replace(/\/$/, "").split("/");
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return null;
  } catch {
    return null;
  }
}

interface ScorecardCheck {
  name: string;
  score: number;
}

interface ScorecardResponse {
  score: number;
  checks: ScorecardCheck[];
}

async function fetchScorecardScore(ownerRepo: string): Promise<ScorecardResponse | null> {
  try {
    const res = await fetch(`${SCORECARD_API}/${ownerRepo}`, {
      headers: { "User-Agent": "ossalt-bot" },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`Scorecard API error for ${ownerRepo}: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (e) {
    console.error(`Scorecard fetch failed for ${ownerRepo}: ${e}`);
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const url = new URL(req.url);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    // stale-first: 未取得 → 古い順
    const { data: tools, error } = await supabase
      .from("tools")
      .select("id, github_url, scorecard_updated_at")
      .not("github_url", "is", null)
      .neq("github_url", "")
      .order("scorecard_updated_at", { ascending: true, nullsFirst: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    if (!tools || tools.length === 0) {
      return new Response(
        JSON.stringify({ message: "No tools to process", updated: 0, offset, limit }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${tools.length} tools for Scorecard (offset=${offset})`);

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const tool of tools) {
      const ownerRepo = extractOwnerRepo(tool.github_url);
      if (!ownerRepo) {
        errors++;
        continue;
      }

      const data = await fetchScorecardScore(ownerRepo);

      if (!data) {
        // 404は notFound としてカウントし、updated_at だけ更新して再試行を抑制
        notFound++;
        await supabase
          .from("tools")
          .update({ scorecard_updated_at: new Date().toISOString() })
          .eq("id", tool.id);
        await sleep(200);
        continue;
      }

      const { error: updateError } = await supabase
        .from("tools")
        .update({
          scorecard_score: Math.round(data.score * 10) / 10,
          scorecard_updated_at: new Date().toISOString(),
        })
        .eq("id", tool.id);

      if (updateError) {
        console.error(`Update error for tool ${tool.id}: ${updateError.message}`);
        errors++;
      } else {
        updated++;
        console.log(`${ownerRepo}: score=${data.score}`);
      }

      // Scorecard APIはrate limitがゆるいが念のため間隔を空ける
      await sleep(300);
    }

    const result = {
      message: "Scorecard fetch complete",
      updated,
      notFound,
      errors,
      total: tools.length,
      offset,
      limit,
    };
    console.log(JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Fatal error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

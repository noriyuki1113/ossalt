import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

async function fetchGitHubRepo(
  ownerRepo: string,
  token?: string
): Promise<{
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  language: string | null;
} | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ossalt-bot",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${ownerRepo}`, {
    headers,
  });
  if (!res.ok) {
    console.error(`GitHub API error for ${ownerRepo}: ${res.status}`);
    await res.text();
    return null;
  }
  return res.json();
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
    const githubToken = Deno.env.get("GITHUB_TOKEN") || undefined;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch all tools with github_url
    const { data: tools, error } = await supabase
      .from("tools")
      .select("id, github_url")
      .not("github_url", "is", null)
      .neq("github_url", "");

    if (error) throw error;
    if (!tools || tools.length === 0) {
      return new Response(
        JSON.stringify({ message: "No tools with GitHub URLs found", updated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${tools.length} tools with GitHub URLs`);

    let updated = 0;
    let errors = 0;
    const BATCH_SIZE = 100;

    for (let i = 0; i < tools.length; i += BATCH_SIZE) {
      const batch = tools.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

      for (const tool of batch) {
        const ownerRepo = extractOwnerRepo(tool.github_url);
        if (!ownerRepo) {
          errors++;
          continue;
        }

        const data = await fetchGitHubRepo(ownerRepo, githubToken);
        if (!data) {
          errors++;
          await sleep(100);
          continue;
        }

        const { error: updateError } = await supabase
          .from("tools")
          .update({
            stars_num: data.stargazers_count,
            forks_num: data.forks_count,
            last_commit: data.pushed_at,
            language: data.language,
            github_stars_updated_at: new Date().toISOString(),
          })
          .eq("id", tool.id);

        if (updateError) {
          console.error(`Update error for tool ${tool.id}: ${updateError.message}`);
          errors++;
        } else {
          updated++;
        }

        await sleep(100);
      }
    }

    const result = { message: "GitHub stats update complete", updated, errors, total: tools.length };
    console.log(JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Fatal error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

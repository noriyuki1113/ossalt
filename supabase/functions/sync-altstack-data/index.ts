import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// altstackHQ/altstack-data の tools.json
const ALTSTACK_DATA_URL =
  "https://raw.githubusercontent.com/altstackHQ/altstack-data/main/data/tools.json";

interface AltstackTool {
  name?: string;
  github?: string;
  github_url?: string;
  repository?: string;
  docker_compose?: string;
  docker_compose_url?: string;
  has_docker?: boolean;
  docker?: boolean;
  [key: string]: unknown;
}

function normalizeGithubUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://github.com/${raw}`);
    if (!u.hostname.includes("github.com")) return null;
    const parts = u.pathname.replace(/^\//, "").replace(/\/$/, "").split("/");
    if (parts.length < 2) return null;
    return `https://github.com/${parts[0]}/${parts[1]}`.toLowerCase();
  } catch {
    return null;
  }
}

function hasDockerCompose(tool: AltstackTool): boolean {
  return !!(
    tool.docker_compose ||
    tool.docker_compose_url ||
    tool.has_docker ||
    tool.docker
  );
}

function getDockerComposeUrl(tool: AltstackTool): string | null {
  return tool.docker_compose_url ?? tool.docker_compose ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // altstack-data のJSONを取得
    const res = await fetch(ALTSTACK_DATA_URL, {
      headers: { "User-Agent": "ossalt-bot" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch altstack-data: ${res.status}`);
    }

    const raw = await res.json();

    // レスポンスが配列か、{ tools: [] } 形式かを吸収
    const altstackTools: AltstackTool[] = Array.isArray(raw)
      ? raw
      : (raw.tools ?? raw.data ?? []);

    console.log(`Fetched ${altstackTools.length} tools from altstack-data`);

    // github_url → docker情報 のマップを構築
    const dockerMap = new Map<
      string,
      { docker_available: boolean; docker_compose_url: string | null }
    >();

    for (const t of altstackTools) {
      const ghUrl = normalizeGithubUrl(
        (t.github_url ?? t.github ?? t.repository) as string | undefined
      );
      if (!ghUrl) continue;

      const docker_available = hasDockerCompose(t);
      if (!docker_available) continue; // Docker情報なしはスキップ

      dockerMap.set(ghUrl, {
        docker_available: true,
        docker_compose_url: getDockerComposeUrl(t),
      });
    }

    console.log(`Docker info available for ${dockerMap.size} tools`);

    // ossalt の tools テーブルと突合して更新
    const { data: ossTools, error } = await supabase
      .from("tools")
      .select("id, github_url");

    if (error) throw error;

    let updated = 0;
    let skipped = 0;

    for (const tool of ossTools ?? []) {
      if (!tool.github_url) continue;
      const normalized = normalizeGithubUrl(tool.github_url);
      if (!normalized) continue;

      const dockerInfo = dockerMap.get(normalized);
      if (!dockerInfo) {
        skipped++;
        continue;
      }

      const { error: updateError } = await supabase
        .from("tools")
        .update({
          docker_available: dockerInfo.docker_available,
          docker_compose_url: dockerInfo.docker_compose_url,
        })
        .eq("id", tool.id);

      if (updateError) {
        console.error(`Update error for tool ${tool.id}: ${updateError.message}`);
      } else {
        updated++;
      }
    }

    const result = {
      message: "altstack-data sync complete",
      altstackTotal: altstackTools.length,
      dockerMapSize: dockerMap.size,
      updated,
      skipped,
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

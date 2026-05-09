import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALTSTACK_DATA_URL =
  "https://raw.githubusercontent.com/altstackHQ/altstack-data/main/data/tools.json";

const DOCKER_BASE_URL =
  "https://github.com/altstackHQ/altstack-data/tree/main/docker-deploy";

interface AltstackDeployment {
  type?: string;
  local_path?: string;
}

interface AltstackTool {
  slug?: string;
  name?: string;
  is_open_source?: boolean;
  github_repo?: string;
  deployment?: AltstackDeployment;
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

function buildDockerComposeUrl(tool: AltstackTool): string | null {
  const localPath = tool.deployment?.local_path;
  if (!localPath) return null;
  // "./docker-deploy/n8n" → "n8n"
  const toolDir = localPath.replace(/^\.\/docker-deploy\//, "").replace(/\/$/, "");
  if (!toolDir) return null;
  return `${DOCKER_BASE_URL}/${toolDir}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const res = await fetch(ALTSTACK_DATA_URL, {
      headers: { "User-Agent": "ossalt-bot" },
    });
    if (!res.ok) throw new Error(`Failed to fetch altstack-data: ${res.status}`);

    const raw = await res.json();
    const altstackTools: AltstackTool[] = Array.isArray(raw) ? raw : (raw.tools ?? []);

    console.log(`Fetched ${altstackTools.length} items from altstack-data`);

    // OSS かつ Docker Compose ありのツールだけ抽出
    const dockerMap = new Map<string, { docker_compose_url: string | null }>();

    for (const t of altstackTools) {
      if (!t.is_open_source) continue;
      if (!t.github_repo) continue;
      if (t.deployment?.type !== "docker-compose") continue;

      const normalized = normalizeGithubUrl(t.github_repo);
      if (!normalized) continue;

      dockerMap.set(normalized, {
        docker_compose_url: buildDockerComposeUrl(t),
      });
    }

    console.log(`Docker Compose available for ${dockerMap.size} OSS tools`);

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
          docker_available: true,
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

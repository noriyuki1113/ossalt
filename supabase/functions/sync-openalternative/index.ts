import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ── Category mapping ── */
const CATEGORY_MAP: Record<string, string> = {
  "AI & Machine Learning": "AI・ML",
  "Business Software": "業務ソフト",
  "Developer Tools": "開発ツール",
  "Infrastructure & Operations": "インフラ・運用",
  "Data & Analytics": "データ・分析",
  "Content & Publishing": "コンテンツ",
  "Productivity & Utilities": "生産性・便利ツール",
  "Security & Privacy": "セキュリティ",
  "Community & Social": "コミュニティ",
  "Miscellaneous": "その他",
};

const PARENT_CATEGORY_JA_MAP: Record<string, string> = {
  "AI & Machine Learning": "AI・ML",
  "Business Software": "業務ソフト",
  "Developer Tools": "開発ツール",
  "Infrastructure & Operations": "インフラ・運用",
  "Data & Analytics": "データ・分析",
  "Content & Publishing": "コンテンツ",
  "Productivity & Utilities": "生産性・便利ツール",
  "Security & Privacy": "セキュリティ",
  "Community & Social": "コミュニティ",
  "Miscellaneous": "その他",
};

/* ── README parser ── */
interface ParsedTool {
  name: string;
  url: string;
  description: string;
  license: string | null;
  stars_text: string | null;
  parent_category_en: string;
  category_en: string;
}

function parseReadme(markdown: string): ParsedTool[] {
  const tools: ParsedTool[] = [];
  let currentParentCategory = "";
  let currentSubCategory = "";

  for (const line of markdown.split("\n")) {
    const parentMatch = line.match(/^##\s+(.+)$/);
    if (parentMatch) {
      const cat = parentMatch[1].trim();
      if (cat !== "Contents" && !cat.startsWith("Contributing")) {
        currentParentCategory = cat;
        currentSubCategory = "";
      }
      continue;
    }

    const subMatch = line.match(/^###\s+(.+)$/);
    if (subMatch) {
      currentSubCategory = subMatch[1].trim();
      continue;
    }

    const toolMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)\s+-\s+(.+)$/);
    if (toolMatch && currentParentCategory) {
      const name = toolMatch[1].trim();
      const url = toolMatch[2].trim();
      const rest = toolMatch[3].trim();

      let license: string | null = null;
      let starsText: string | null = null;

      for (const seg of rest.match(/`([^`]+)`/g) || []) {
        const content = seg.replace(/`/g, "").trim();
        if (content.startsWith("⭐")) {
          starsText = content.replace("⭐", "").trim();
        } else if (content.match(/^(MIT|Apache|AGPL|GPL|BSD|MPL|ISC|Unlicense|LGPL|SSPL|EUPL|CC|Elastic|FSL)/i)) {
          license = content;
        }
      }

      const description = rest.replace(/`[^`]+`/g, "").trim().replace(/\s+$/, "");

      tools.push({
        name,
        url,
        description,
        license,
        stars_text: starsText,
        parent_category_en: currentParentCategory,
        category_en: currentSubCategory || currentParentCategory,
      });
    }
  }

  return tools;
}

/* ── GitHub helpers ── */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeForMatch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isGitHubUrl(url: string): boolean {
  try {
    return new URL(url).hostname === "github.com";
  } catch {
    return false;
  }
}

interface GitHubRepo {
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  language: string | null;
  license: { spdx_id: string; name: string } | null;
}

async function fetchRepoData(
  ownerRepo: string,
  token?: string,
): Promise<GitHubRepo | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ossalt-bot",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${ownerRepo}`, { headers });
  if (!res.ok) {
    await res.text(); // drain body
    return null;
  }
  return res.json() as Promise<GitHubRepo>;
}

async function searchGitHubRepo(
  toolName: string,
  token?: string,
): Promise<GitHubRepo | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ossalt-bot",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const q = encodeURIComponent(`${toolName} in:name`);
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=5`,
    { headers },
  );
  if (!res.ok) {
    await res.text();
    return null;
  }

  const data = await res.json() as { items: (GitHubRepo & { name: string; full_name: string })[] };
  const normTool = normalizeForMatch(toolName);

  for (const repo of data.items || []) {
    const normRepo = normalizeForMatch(repo.name);
    const normFull = normalizeForMatch(repo.full_name.split("/")[1] ?? "");
    // Only accept an exact normalized name match to avoid false positives
    if (normRepo === normTool || normFull === normTool) {
      return repo;
    }
  }
  return null;
}

function extractOwnerRepo(githubUrl: string): string | null {
  try {
    const parts = new URL(githubUrl).pathname
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
  } catch {
    return null;
  }
}

function parseStarsNum(starsText: string | null): number | null {
  if (!starsText) return null;
  const cleaned = starsText.replace(/,/g, "").trim();
  if (cleaned.endsWith("K")) return Math.round(parseFloat(cleaned) * 1000);
  if (cleaned.endsWith("M")) return Math.round(parseFloat(cleaned) * 1_000_000);
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? null : n;
}

/* ── Main handler ── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const githubToken = Deno.env.get("GITHUB_TOKEN") || undefined;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Optional: limit how many new tools to process per run (avoid timeouts)
    const url = new URL(req.url);
    const maxInsert = parseInt(url.searchParams.get("max") || "50", 10);

    // 1. Fetch README
    console.log("Fetching OpenAlternative README…");
    const readmeRes = await fetch(
      "https://raw.githubusercontent.com/piotrkulpinski/openalternative/main/README.md",
    );
    if (!readmeRes.ok) throw new Error(`README fetch failed: ${readmeRes.status}`);
    const parsedTools = parseReadme(await readmeRes.text());
    console.log(`Parsed ${parsedTools.length} tools from README`);

    // 2. Get existing tool names (lower-cased)
    const { data: existing, error: existErr } = await supabase
      .from("tools")
      .select("name");
    if (existErr) throw existErr;
    const existingNames = new Set(
      (existing || []).map((t: { name: string | null }) => t.name?.toLowerCase()),
    );

    // 3. Filter to new tools only, up to maxInsert
    const newTools = parsedTools
      .filter((t) => !existingNames.has(t.name.toLowerCase()))
      .slice(0, maxInsert);

    console.log(`${newTools.length} new tools to process (${parsedTools.length - newTools.length - (parsedTools.length - newTools.length - (parsedTools.length - newTools.length))} capped)`);

    let inserted = 0;
    let githubFound = 0;
    let errors = 0;

    for (const tool of newTools) {
      let githubUrl: string | null = null;
      let repoData: GitHubRepo | null = null;

      // Strategy 1: tool URL is already a GitHub URL
      if (isGitHubUrl(tool.url)) {
        githubUrl = tool.url;
        const ownerRepo = extractOwnerRepo(githubUrl);
        if (ownerRepo) repoData = await fetchRepoData(ownerRepo, githubToken);
        await sleep(150);
      } else {
        // Strategy 2: search GitHub by tool name
        repoData = await searchGitHubRepo(tool.name, githubToken);
        if (repoData) {
          githubUrl = repoData.html_url;
          githubFound++;
        }
        await sleep(200); // slightly longer to respect search rate limit
      }

      const parentCategoryJa = PARENT_CATEGORY_JA_MAP[tool.parent_category_en] || "その他";
      const categoryJa = CATEGORY_MAP[tool.parent_category_en] || "その他";

      const record: Record<string, unknown> = {
        name: tool.name,
        url: isGitHubUrl(tool.url) ? null : tool.url, // don't use GitHub URL as official URL
        description_en: tool.description,
        description_ja: tool.description, // placeholder until translated
        parent_category_en: tool.parent_category_en,
        parent_category_ja: parentCategoryJa,
        category_en: tool.category_en,
        category_ja: categoryJa,
        github_url: githubUrl,
        // Prefer live GitHub data; fall back to README scrape
        license: repoData?.license?.spdx_id || repoData?.license?.name || tool.license,
        stars_num: repoData?.stargazers_count ?? parseStarsNum(tool.stars_text),
        forks_num: repoData?.forks_count ?? null,
        last_commit: repoData?.pushed_at ?? null,
        language: repoData?.language ?? null,
        github_stars_updated_at: repoData ? new Date().toISOString() : null,
      };

      const { error: insertError } = await supabase.from("tools").insert(record);
      if (insertError) {
        console.error(`Insert failed for ${tool.name}: ${insertError.message}`);
        errors++;
      } else {
        inserted++;
      }
    }

    const result = {
      message: "OpenAlternative sync complete",
      total_in_readme: parsedTools.length,
      already_existing: existingNames.size,
      new_processed: newTools.length,
      inserted,
      github_urls_found: githubFound,
      errors,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(result));
    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

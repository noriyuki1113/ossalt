import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── GitHub helpers ──────────────────────────────────────────

function parseGitHub(url: string): { owner: string; repo: string } | null {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
  } catch { /* ignore */ }
  return null;
}

function getOwnerAvatarUrl(githubUrl: string): string | null {
  const info = parseGitHub(githubUrl);
  return info ? `https://github.com/${info.owner}.png?size=128` : null;
}

function getFaviconUrl(websiteUrl: string): string | null {
  try {
    const hostname = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch { return null; }
}

// Badge / shield patterns to ignore
const BADGE_PATTERNS = [
  /shields\.io/i,
  /badge/i,
  /img\.shields/i,
  /travis-ci/i,
  /circleci/i,
  /codecov/i,
  /coveralls/i,
  /github\.com\/.*\/workflows/i,
  /github\.com\/.*\/actions/i,
  /snyk\.io/i,
  /david-dm/i,
  /npmjs\.com/i,
  /npm-stat/i,
  /bundlephobia/i,
  /flat\.badgen/i,
  /badgen\.net/i,
  /forthebadge/i,
  /contributor/i,
  /star-history/i,
  /api\.star-history/i,
];

const LOGO_ALT_HINTS = /logo|brand|icon|banner/i;

function extractReadmeLogoUrl(
  readmeContent: string,
  owner: string,
  repo: string,
  defaultBranch: string
): string | null {
  // Only look at the first 3000 chars (logo is usually at the top)
  const top = readmeContent.slice(0, 3000);

  // Match markdown images: ![alt](url) and HTML img tags
  const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const htmlImgAltRegex = /<img[^>]+alt=["']([^"']+)["'][^>]*src=["']([^"']+)["'][^>]*/gi;
  const htmlImgSrcFirstRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["'][^>]*/gi;

  interface Candidate {
    alt: string;
    url: string;
    position: number;
    hasLogoHint: boolean;
  }

  const candidates: Candidate[] = [];

  // Markdown images
  let match: RegExpExecArray | null;
  while ((match = mdImgRegex.exec(top)) !== null) {
    candidates.push({
      alt: match[1],
      url: match[2],
      position: match.index,
      hasLogoHint: LOGO_ALT_HINTS.test(match[1]),
    });
  }

  // HTML img (alt before src)
  while ((match = htmlImgAltRegex.exec(top)) !== null) {
    candidates.push({
      alt: match[1],
      url: match[2],
      position: match.index,
      hasLogoHint: LOGO_ALT_HINTS.test(match[1]),
    });
  }

  // HTML img (src before alt)
  while ((match = htmlImgSrcFirstRegex.exec(top)) !== null) {
    candidates.push({
      alt: match[2],
      url: match[1],
      position: match.index,
      hasLogoHint: LOGO_ALT_HINTS.test(match[2]),
    });
  }

  // HTML img without alt
  while ((match = htmlImgRegex.exec(top)) !== null) {
    if (!candidates.some((c) => c.url === match![1])) {
      candidates.push({
        alt: "",
        url: match[1],
        position: match.index,
        hasLogoHint: false,
      });
    }
  }

  // Filter out badges
  const filtered = candidates.filter((c) => {
    const url = c.url.toLowerCase();
    if (BADGE_PATTERNS.some((p) => p.test(url))) return false;
    // Skip very small badge-like extensions
    if (url.endsWith(".gif") && !c.hasLogoHint) return false;
    return true;
  });

  // Sort: logo hint first, then by position
  filtered.sort((a, b) => {
    if (a.hasLogoHint && !b.hasLogoHint) return -1;
    if (!a.hasLogoHint && b.hasLogoHint) return 1;
    return a.position - b.position;
  });

  if (filtered.length === 0) return null;

  let imgUrl = filtered[0].url;

  // Resolve relative URLs
  if (imgUrl.startsWith("./") || imgUrl.startsWith("/") || !imgUrl.startsWith("http")) {
    const cleanPath = imgUrl.replace(/^\.\//, "").replace(/^\//, "");
    imgUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanPath}`;
  }

  return imgUrl;
}

async function fetchReadmeLogo(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    // Get default branch from API
    const repoResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { "User-Agent": "FindMyAlt/1.0", Accept: "application/vnd.github.v3+json" },
    });
    if (!repoResp.ok) return null;
    const repoData = await repoResp.json();
    const defaultBranch = repoData.default_branch || "main";

    // Fetch README
    const readmeResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          "User-Agent": "FindMyAlt/1.0",
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );
    if (!readmeResp.ok) return null;
    const readme = await readmeResp.text();

    return extractReadmeLogoUrl(readme, owner, repo, defaultBranch);
  } catch {
    return null;
  }
}

// ── Main handler ────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const productId: string | undefined = body.product_id;
    const onlyMissing: boolean = body.only_missing ?? true;

    // Build query
    let query = supabase.from("products").select("id, name, github_url, website_url, logo_url, logo_source");
    if (productId) {
      query = query.eq("id", productId);
    } else if (onlyMissing) {
      query = query.is("logo_url", null);
    }
    const { data: products, error: fetchErr } = await query.limit(100);
    if (fetchErr) throw fetchErr;
    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ enriched: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let enriched = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        const updates: Record<string, string | null> = {};

        // GitHub avatar
        if (product.github_url) {
          const avatar = getOwnerAvatarUrl(product.github_url);
          if (avatar) updates.logo_github_avatar_url = avatar;
        }

        // Favicon
        if (product.website_url) {
          const fav = getFaviconUrl(product.website_url);
          if (fav) updates.logo_favicon_url = fav;
        }

        // README logo
        if (product.github_url) {
          const ghInfo = parseGitHub(product.github_url);
          if (ghInfo) {
            const readmeLogo = await fetchReadmeLogo(ghInfo.owner, ghInfo.repo);
            if (readmeLogo) updates.logo_github_readme_url = readmeLogo;
          }
        }

        // Set best logo if no manual logo_url
        if (!product.logo_url || product.logo_source !== "manual") {
          if (updates.logo_github_readme_url) {
            updates.logo_url = updates.logo_github_readme_url;
            updates.logo_source = "github-readme";
          } else if (updates.logo_github_avatar_url) {
            updates.logo_url = updates.logo_github_avatar_url;
            updates.logo_source = "github-avatar";
          } else if (updates.logo_favicon_url) {
            updates.logo_url = updates.logo_favicon_url;
            updates.logo_source = "favicon";
          }
        }

        if (Object.keys(updates).length > 0) {
          const { error: updateErr } = await supabase
            .from("products")
            .update(updates)
            .eq("id", product.id);
          if (updateErr) throw updateErr;
          enriched++;
        }
      } catch (e) {
        errors.push(`${product.name}: ${(e as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({ enriched, total: products.length, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Maps the source README's English category heading to the slug in the
// `tool_categories` table (see supabase/migrations/20260903000002_*.sql).
// Writing `category_slug` (validated by an FK + sync trigger) instead of
// `parent_category_ja` directly is what prevents this function from ever
// writing a category value that the rest of the site doesn't recognize.
const CATEGORY_EN_TO_SLUG: Record<string, string> = {
  "AI & Machine Learning": "ai-ml",
  "Business Software": "business",
  "Developer Tools": "developer-tools",
  "Infrastructure & Operations": "infrastructure",
  "Data & Analytics": "data-analytics",
  "Content & Publishing": "content",
  "Productivity & Utilities": "productivity",
  "Security & Privacy": "security",
  "Community & Social": "community",
  "Miscellaneous": "other",
};

// NOTE: no competitor guessing here anymore. The previous COMPETITOR_MAP
// assigned one crude placeholder competitor per category (e.g. every
// "Business Software" tool got "Salesforce") — low-quality guesses that
// mostly don't exist in the `competitors` table and would now fail the FK
// constraint. Leave competitor_slug unset; a human (AdminAgent) or
// refine-alternatives can assign a real competitor later.

interface ParsedTool {
  name: string;
  url: string;
  description: string;
  license: string | null;
  stars_text: string | null;
  parent_category_en: string;
  category_en: string;
  github_url: string | null;
}

function parseReadme(markdown: string): ParsedTool[] {
  const tools: ParsedTool[] = [];
  let currentParentCategory = "";
  let currentSubCategory = "";

  const lines = markdown.split("\n");

  for (const line of lines) {
    // Match ## Parent Category
    const parentMatch = line.match(/^##\s+(.+)$/);
    if (parentMatch) {
      const cat = parentMatch[1].trim();
      if (cat !== "Contents" && !cat.startsWith("Contributing")) {
        currentParentCategory = cat;
      }
      continue;
    }

    // Match ### Sub Category
    const subMatch = line.match(/^###\s+(.+)$/);
    if (subMatch) {
      currentSubCategory = subMatch[1].trim();
      continue;
    }

    // Match tool entries: - [Name](url) - Description `License` `⭐ Stars`
    const toolMatch = line.match(
      /^-\s+\[([^\]]+)\]\(([^)]+)\)\s+-\s+(.+)$/
    );
    if (toolMatch && currentParentCategory) {
      const name = toolMatch[1].trim();
      const url = toolMatch[2].trim();
      let rest = toolMatch[3].trim();

      // Extract backtick segments for license and stars
      let license: string | null = null;
      let starsText: string | null = null;

      const backtickSegments = rest.match(/`([^`]+)`/g) || [];
      for (const seg of backtickSegments) {
        const content = seg.replace(/`/g, "").trim();
        if (content.startsWith("⭐")) {
          starsText = content.replace("⭐", "").trim();
        } else if (
          content.match(
            /^(MIT|Apache|AGPL|GPL|BSD|MPL|ISC|Unlicense|LGPL|SSPL|EUPL|CC|Elastic|FSL)/i
          )
        ) {
          license = content;
        }
      }

      // Remove backtick segments from description
      const description = rest
        .replace(/`[^`]+`/g, "")
        .trim()
        .replace(/\s+$/, "");

      // Derive github_url from openalternative URL slug
      // We'll try to fetch it later via GitHub API if needed
      let githubUrl: string | null = null;

      tools.push({
        name,
        url,
        description,
        license,
        stars_text: starsText,
        parent_category_en: currentParentCategory,
        category_en: currentSubCategory || currentParentCategory,
        github_url: githubUrl,
      });
    }
  }

  return tools;
}

function parseStarsNum(starsText: string | null): number | null {
  if (!starsText) return null;
  const cleaned = starsText.replace(/,/g, "").trim();
  if (cleaned.endsWith("K")) {
    return Math.round(parseFloat(cleaned.replace("K", "")) * 1000);
  }
  if (cleaned.endsWith("M")) {
    return Math.round(parseFloat(cleaned.replace("M", "")) * 1000000);
  }
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // 1. Fetch README
    console.log("Fetching OpenAlternative README...");
    const readmeRes = await fetch(
      "https://raw.githubusercontent.com/piotrkulpinski/openalternative/main/README.md"
    );
    if (!readmeRes.ok) {
      throw new Error(`Failed to fetch README: ${readmeRes.status}`);
    }
    const readmeText = await readmeRes.text();

    // 2. Parse tools
    const parsedTools = parseReadme(readmeText);
    console.log(`Parsed ${parsedTools.length} tools from README`);

    // 3. Get existing tool names
    const { data: existingTools, error: fetchError } = await supabase
      .from("tools")
      .select("name");
    if (fetchError) throw fetchError;

    const existingNames = new Set(
      (existingTools || []).map((t: { name: string | null }) =>
        t.name?.toLowerCase()
      )
    );

    // 4. Filter new tools
    const newTools = parsedTools.filter(
      (t) => !existingNames.has(t.name.toLowerCase())
    );

    console.log(
      `Found ${newTools.length} new tools (${parsedTools.length - newTools.length} already exist)`
    );

    // 5. Insert new tools
    let inserted = 0;
    let errors = 0;

    for (const tool of newTools) {
      const categorySlug = CATEGORY_EN_TO_SLUG[tool.parent_category_en] || "other";

      // Skip aggregator URLs (openalternative.co) — they would all share the same favicon
      const isAggregatorUrl = (() => {
        try {
          const h = new URL(tool.url).hostname.toLowerCase();
          return h === "openalternative.co" || h === "www.openalternative.co";
        } catch { return false; }
      })();

      const record = {
        name: tool.name,
        url: isAggregatorUrl ? null : tool.url,
        description_en: tool.description,
        description_ja: tool.description, // placeholder until translated
        parent_category_en: tool.parent_category_en,
        category_en: tool.category_en,
        category_ja: tool.category_en, // keep English subcategory for now
        category_slug: categorySlug, // parent_category_ja is derived by the DB trigger
        license: tool.license,
        stars: tool.stars_text,
        stars_num: parseStarsNum(tool.stars_text),
      };

      const { error: insertError } = await supabase
        .from("tools")
        .insert(record);

      if (insertError) {
        console.error(
          `Failed to insert ${tool.name}: ${insertError.message}`
        );
        errors++;
      } else {
        inserted++;
      }
    }

    const result = {
      message: "OpenAlternative sync complete",
      total_parsed: parsedTools.length,
      new_inserted: inserted,
      skipped_existing: parsedTools.length - newTools.length,
      errors,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

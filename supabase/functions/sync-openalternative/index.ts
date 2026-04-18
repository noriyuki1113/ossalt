import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CATEGORY_MAP: Record<string, string> = {
  "AI & Machine Learning": "AI・機械学習",
  "Business Software": "ビジネスソフトウェア",
  "Developer Tools": "開発者ツール",
  "Infrastructure & Operations": "インフラ・運用",
  "Data & Analytics": "データ・分析",
  "Content & Publishing": "コンテンツ・パブリッシング",
  "Productivity & Utilities": "生産性・ユーティリティ",
  "Security & Privacy": "セキュリティ・プライバシー",
  "Community & Social": "コミュニティ・ソーシャル",
  "Miscellaneous": "その他",
};

// Map parent categories to likely primary competitors
const COMPETITOR_MAP: Record<string, string> = {
  "AI & Machine Learning": "OpenAI",
  "Business Software": "Salesforce",
  "Developer Tools": "GitHub",
  "Infrastructure & Operations": "AWS",
  "Data & Analytics": "Tableau",
  "Content & Publishing": "WordPress.com",
  "Productivity & Utilities": "Microsoft 365",
  "Security & Privacy": "CrowdStrike",
  "Community & Social": "Discord",
  "Miscellaneous": "",
};

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
      const parentCategoryJa =
        CATEGORY_MAP[tool.parent_category_en] || "その他";
      const primaryCompetitor =
        COMPETITOR_MAP[tool.parent_category_en] || "";

      const record = {
        name: tool.name,
        url: tool.url,
        description_en: tool.description,
        description_ja: tool.description, // placeholder until translated
        parent_category_en: tool.parent_category_en,
        parent_category_ja: parentCategoryJa,
        category_en: tool.category_en,
        category_ja: tool.category_en, // keep English subcategory for now
        license: tool.license,
        stars: tool.stars_text,
        stars_num: parseStarsNum(tool.stars_text),
        primary_competitor: primaryCompetitor || null,
        primary_competitor_ja: primaryCompetitor || null,
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

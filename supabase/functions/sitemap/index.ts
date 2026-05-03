import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

const BASE_URL = "https://ossalt.jp";

// Maps parent_category_ja (from DB) → clean URL slug
const CATEGORY_SLUG_MAP: Record<string, string> = {
  "AI・ML": "ai-ml",
  "業務ソフト": "business",
  "開発ツール": "developer-tools",
  "インフラ・運用": "infrastructure",
  "データ・分析": "data-analytics",
  "コンテンツ": "content",
  "生産性・便利ツール": "productivity",
  "セキュリティ": "security",
  "コミュニティ": "community",
  "その他": "other",
};

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all tools
  const { data: tools } = await supabase
    .from("tools")
    .select("id, parent_category_ja")
    .order("id");

  // Collect distinct category slugs (mapped from Japanese DB values)
  const categorySlugs = new Set<string>();
  if (tools) {
    for (const t of tools) {
      const slug = t.parent_category_ja ? CATEGORY_SLUG_MAP[t.parent_category_ja] : undefined;
      if (slug) categorySlugs.add(slug);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/ranking</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/quiz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/savings</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/compare</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/n8n-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/appflowy-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`;

  // Category pages — clean /category/:slug URLs (not ?category= query params)
  for (const slug of categorySlugs) {
    xml += `
  <url>
    <loc>${BASE_URL}/category/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  // Tool detail pages
  if (tools) {
    for (const t of tools) {
      xml += `
  <url>
    <loc>${BASE_URL}/tools/${t.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  }

  // Alternative pages
  const altSlugs = [
    "notion","figma","zapier","slack","firebase","airtable","trello","jira",
    "wordpress","shopify","google-analytics","datadog","auth0","typeform",
    "github-copilot","tableau","contentful","launchdarkly","google-drive",
    "intercom","retool","postman","webflow","evernote","chatgpt","devin",
    "stripe-billing","pinecone","bitly","canny","zendesk",
    "linear","asana","confluence","sentry","miro","mixpanel","hubspot",
    "clickup","pagerduty","sendgrid",
  ];
  for (const slug of altSlugs) {
    xml += `
  <url>
    <loc>${BASE_URL}/alternatives/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  // Compare pages
  const compareSlugs = [
    "appflowy-vs-notion","mattermost-vs-slack","plane-vs-linear",
    "posthog-vs-mixpanel","penpot-vs-figma","outline-vs-confluence",
    "n8n-vs-zapier","nocodb-vs-airtable","matomo-vs-google-analytics",
    "keycloak-vs-auth0","glitchtip-vs-sentry","excalidraw-vs-miro",
    "listmonk-vs-sendgrid","vikunja-vs-asana","rocket-chat-vs-slack",
    "nextcloud-vs-google-drive","gitea-vs-github","plausible-vs-google-analytics",
    "chatwoot-vs-intercom","taiga-vs-jira","activepieces-vs-zapier",
    "supabase-vs-firebase","grafana-vs-datadog","metabase-vs-tableau",
    "formbricks-vs-typeform","budibase-vs-retool","directus-vs-contentful",
    "twenty-vs-hubspot","hoppscotch-vs-postman",
  ];
  for (const slug of compareSlugs) {
    xml += `
  <url>
    <loc>${BASE_URL}/compare/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});

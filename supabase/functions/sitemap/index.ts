import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

const BASE_URL = "https://ossalt.jp";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all tools
  const { data: tools } = await supabase
    .from("tools")
    .select("id, category_slug")
    .order("id");

  // Collect distinct category slugs — category_slug is a validated FK into
  // tool_categories, so no translation table is needed here anymore.
  const categorySlugs = new Set<string>();
  if (tools) {
    for (const t of tools) {
      if (t.category_slug) categorySlugs.add(t.category_slug);
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
    <loc>${BASE_URL}/alternatives</loc>
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
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/appflowy-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/baserow-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/plausible-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/coolify-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/nextcloud-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/vaultwarden-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/gitea-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/mattermost-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/vikunja-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/plane-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/outline-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/notion-alternatives</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/metabase-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/nocodb-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/guides/umami-selfhost-vps</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
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
    "clickup","pagerduty","sendgrid","heroku","calendly","mailchimp",
    "discord","monday","loom","vercel","doodle","github-actions","circleci",
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

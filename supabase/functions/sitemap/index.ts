import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

const BASE_URL = "https://find-my-alt.vercel.app";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all tools
  const { data: tools } = await supabase
    .from("tools")
    .select("id, parent_category_ja")
    .order("id");

  // Fetch distinct categories
  const categories = new Set<string>();
  if (tools) {
    for (const t of tools) {
      if (t.parent_category_ja) categories.add(t.parent_category_ja);
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
  </url>`;

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
    "stripe-billing","pinecone","bitly","canny",
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

  // Category pages
  for (const cat of categories) {
    xml += `
  <url>
    <loc>${BASE_URL}/?category=${encodeURIComponent(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});

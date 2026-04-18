/**
 * Known valid competitors — English canonical name → display name (ja or en).
 * Used to validate primary_competitor values from the DB before displaying
 * them in the AlternativeBadge.
 *
 * Keep in sync with the ALTERNATIVES map in scripts/prerender-routes.mjs
 * and the altSlugs list in supabase/functions/sitemap/index.ts.
 */
export const KNOWN_COMPETITORS: Record<string, string> = {
  "Notion": "Notion",
  "Figma": "Figma",
  "Zapier": "Zapier",
  "Slack": "Slack",
  "Firebase": "Firebase",
  "Airtable": "Airtable",
  "Trello": "Trello",
  "Jira": "Jira",
  "WordPress": "WordPress",
  "Shopify": "Shopify",
  "Google Analytics": "Google Analytics",
  "Datadog": "Datadog",
  "Auth0": "Auth0",
  "Typeform": "Typeform",
  "GitHub Copilot": "GitHub Copilot",
  "Tableau": "Tableau",
  "Contentful": "Contentful",
  "LaunchDarkly": "LaunchDarkly",
  "Google Drive": "Google Drive",
  "Intercom": "Intercom",
  "Retool": "Retool",
  "Postman": "Postman",
  "Webflow": "Webflow",
  "Evernote": "Evernote",
  "ChatGPT": "ChatGPT",
  "Devin": "Devin",
  "Stripe Billing": "Stripe Billing",
  "Pinecone": "Pinecone",
  "Bitly": "Bitly",
  "Canny": "Canny",
  "Zendesk": "Zendesk",
  "Linear": "Linear",
  "Asana": "Asana",
  "Confluence": "Confluence",
  "Sentry": "Sentry",
  "Miro": "Miro",
  "Mixpanel": "Mixpanel",
  "HubSpot": "HubSpot",
  "ClickUp": "ClickUp",
  "PagerDuty": "PagerDuty",
  "SendGrid": "SendGrid",
  // Other common ones not yet in alternatives pages
  "GitHub": "GitHub",
  "GitLab": "GitLab",
  "Vercel": "Vercel",
  "Heroku": "Heroku",
  "MongoDB": "MongoDB",
  "Elasticsearch": "Elasticsearch",
  "Algolia": "Algolia",
  "Twilio": "Twilio",
  "Segment": "Segment",
  "Amplitude": "Amplitude",
  "Loom": "Loom",
  "Calendly": "Calendly",
  "Zoom": "Zoom",
  "Monday.com": "Monday.com",
  "Okta": "Okta",
  "Cloudflare": "Cloudflare",
  "Supabase": "Supabase",
  "PlanetScale": "PlanetScale",
  "Tailwind UI": "Tailwind UI",
};

// Case-insensitive lookup set for validation
const KNOWN_LOWER = new Set(
  Object.keys(KNOWN_COMPETITORS).map((k) => k.toLowerCase())
);

/**
 * Returns true if `name` is a recognised competitor we trust to display.
 * Accepts the English `primary_competitor` value from the DB.
 */
export function isKnownCompetitor(name: string | null | undefined): boolean {
  if (!name) return false;
  return KNOWN_LOWER.has(name.trim().toLowerCase());
}

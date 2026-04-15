/** Static editorial content that supplements DB tool data for an alternatives page */

/* ── v1 fields (google-analytics.json, slack.json, etc.) ── */
export interface AlternativePageContent {
  slug: string;
  competitor: string;

  // v1 meta
  competitorUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroDescription?: string;
  whySwitchReasons?: {
    title: string;
    description: string;
    icon: "cost" | "data" | "lockin" | "community" | "customization";
  }[];
  faq?: { question: string; answer: string }[];
  relatedSlugs?: string[];

  // v2 meta (notion.json, richer format)
  seo?: { title: string; description: string };
  hero?: { headline: string; subheadline: string };
  intro?: { short: string; long: string };
  migrationReasons?: { title: string; description: string }[];
  decisionAxes?: {
    key: string;
    label: string;
    description: string;
  }[];
  quickGuide?: {
    title: string;
    steps: string[];
  };
  featuredCandidates?: {
    name: string;
    summary: string;
    bestFor?: string[];
    tradeoffs?: string[];
    selfHostDifficulty?: "low" | "medium" | "high";
    opsBurden?: "low" | "medium" | "high";
    recommendedFor?: string;
    links?: { official?: string; github?: string };
  }[];
  relatedPages?: { title: string; url: string }[];
}

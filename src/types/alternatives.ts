/** Static editorial content that supplements DB tool data for an alternatives page */
export interface AlternativePageContent {
  slug: string;
  competitor: string;
  competitorUrl: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  whySwitchReasons: {
    title: string;
    description: string;
    icon: "cost" | "data" | "lockin" | "community" | "customization";
  }[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
}

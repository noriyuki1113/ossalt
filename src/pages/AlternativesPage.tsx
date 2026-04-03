import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { AdvertiseCTA } from "@/components/ads/AdvertiseCTA";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";

const SLUG_MAP: Record<string, string> = {
  notion: "Notion",
  figma: "Figma",
  zapier: "Zapier",
  slack: "Slack",
  firebase: "Firebase",
  airtable: "Airtable",
  trello: "Trello",
  jira: "Jira",
  wordpress: "WordPress",
  shopify: "Shopify",
  "google-analytics": "Google Analytics",
  datadog: "Datadog",
  auth0: "Auth0",
  typeform: "Typeform",
  "github-copilot": "GitHub Copilot",
  tableau: "Tableau",
  contentful: "Contentful",
  launchdarkly: "LaunchDarkly",
  "google-drive": "Google Drive",
  intercom: "Intercom",
  retool: "Retool",
  postman: "Postman",
  webflow: "Webflow",
  evernote: "Evernote",
  chatgpt: "ChatGPT",
  devin: "Devin",
  "stripe-billing": "Stripe Billing",
  pinecone: "Pinecone",
  bitly: "Bitly",
  canny: "Canny",
  zendesk: "Zendesk",
};

// Reverse map: competitor name → slug
const COMPETITOR_TO_SLUG: Record<string, string> = {};
for (const [slug, name] of Object.entries(SLUG_MAP)) {
  COMPETITOR_TO_SLUG[name] = slug;
}

export { SLUG_MAP, COMPETITOR_TO_SLUG };

export default function AlternativesPage() {
  const { slug } = useParams<{ slug: string }>();
  const competitor = slug ? SLUG_MAP[slug] : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["alternatives-page", competitor],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("primary_competitor", competitor!)
        .order("stars_num", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data as Tool[]) || [];
    },
    enabled: !!competitor,
  });

  const tools = data || [];
  const count = tools.length;

  const jsonLd = competitor ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${competitor}の代替OSSツール一覧`,
    description: `${competitor}の代わりに使える無料オープンソースツール${count}件を比較。`,
    url: `https://ossalt.jp/alternatives/${slug}`,
    numberOfItems: count,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.slice(0, 10).map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: `https://ossalt.jp/tools/${t.id}`,
      })),
    },
  } : undefined;

  useSeo({
    title: competitor
      ? `${competitor}の代替OSSツール${count > 0 ? count + "選" : "一覧"} | OSSアルタナティブ`
      : "代替ツール | OSSアルタナティブ",
    description: competitor
      ? `${competitor}の代わりに使える無料オープンソースツール${count}件を比較。セルフホスト可能でライセンス費用ゼロのOSS代替を見つけよう。`
      : "",
    canonical: competitor
      ? `https://ossalt.jp/alternatives/${slug}`
      : undefined,
    jsonLd,
  });

  if (!competitor) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">ページが見つかりませんでした</p>
          <Button variant="outline" className="mt-6 gap-2" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" />ツール一覧に戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="container max-w-5xl mx-auto px-4 pt-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{competitor}の代替</span>
        </nav>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {competitor} の代替OSSツール一覧
          </h1>
          <p className="mt-2 text-muted-foreground">
            {competitor}の代わりに使える無料・オープンソースツール{" "}
            {isLoading ? "…" : `${count}件`}を比較できます。
          </p>
        </div>

        {/* Tool grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">該当するツールが見つかりませんでした</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        )}

        {/* Internal links: related alternatives */}
        {!isLoading && tools.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border/60">
            <h2 className="text-lg font-bold text-foreground mb-4">他のSaaSの代替も探す</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SLUG_MAP)
                .filter(([s]) => s !== slug)
                .slice(0, 12)
                .map(([s, name]) => (
                  <Link
                    key={s}
                    to={`/alternatives/${s}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                  >
                    {name}の代替
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Advertise CTA */}
        <div className="mt-8">
          <AdvertiseCTA variant="card" />
        </div>
      </div>

      {/* Bottom back button */}
      <div className="container max-w-5xl mx-auto px-4 pb-12 pt-6 flex justify-center">
        <Button variant="outline" className="gap-2 rounded-xl" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            ツール一覧に戻る
          </Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

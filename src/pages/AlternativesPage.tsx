import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
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

  useSeo({
    title: competitor
      ? `${competitor}の代替OSSツール一覧 | OSSアルタナティブ`
      : "代替ツール | OSSアルタナティブ",
    description: competitor
      ? `${competitor}の代わりに使える無料オープンソースツール${count}件を比較。無料・セルフホスト可能なOSS代替を探そう。`
      : "",
    canonical: competitor
      ? `https://find-my-alt.lovable.app/alternatives/${slug}`
      : undefined,
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
      {/* Top back nav */}
      <div className="container max-w-5xl mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ツール一覧に戻る
        </Link>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {competitor} の代替OSSツール一覧
          </h1>
          <p className="mt-2 text-muted-foreground">
            {competitor}の代わりに使える無料・オープンソースツール{" "}
            {isLoading ? "…" : `${count}件`}
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

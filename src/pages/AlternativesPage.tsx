import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ChevronRight, Star, CheckCircle2, Users, Server, Zap } from "lucide-react";
import { track } from "@/lib/track";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { AdvertiseCTA } from "@/components/ads/AdvertiseCTA";
import { AlternativeSponsorCTA } from "@/components/ads/AlternativeSponsorCTA";
import { useSeo } from "@/hooks/use-seo";
import { formatCount } from "@/lib/format";
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

const COMPETITOR_TO_SLUG: Record<string, string> = {};
for (const [slug, name] of Object.entries(SLUG_MAP)) {
  COMPETITOR_TO_SLUG[name] = slug;
}

export { SLUG_MAP, COMPETITOR_TO_SLUG };

/* ── Helper: generate a short "best for" label from category ── */
function getBestFor(tool: Tool): string {
  const cat = (tool.parent_category_ja || tool.category_ja || "").toLowerCase();
  if (cat.includes("ai")) return "AI・ML用途に強い";
  if (cat.includes("開発")) return "開発ワークフロー向け";
  if (cat.includes("インフラ")) return "インフラ運用向け";
  if (cat.includes("データ")) return "データ分析向け";
  if (cat.includes("ビジネス") || cat.includes("生産性")) return "チーム生産性向け";
  if (cat.includes("セキュリティ")) return "セキュリティ重視";
  if (cat.includes("コミュニティ")) return "コミュニケーション向け";
  if (cat.includes("コンテンツ")) return "コンテンツ管理向け";
  return "汎用ツール";
}

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
  const topPicks = tools.slice(0, 3);
  const restTools = tools.slice(3);

  const totalStars = useMemo(() =>
    tools.reduce((sum, t) => sum + (t.stars_num || 0), 0),
    [tools]
  );

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

        {/* ── 1. Header + Intro Summary ── */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {competitor} の代替OSSツール{!isLoading && count > 0 ? `${count}選` : "一覧"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {competitor}の月額コストやベンダーロックインに悩んでいませんか？
            ここでは{competitor}の代わりに使える無料・オープンソースのツール{!isLoading ? `${count}件` : ""}を、
            GitHubスター数順にランキング形式で比較できます。すべてセルフホスト可能で、ライセンス費用はゼロです。
          </p>

          {/* Quick stats */}
          {!isLoading && count > 0 && (
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60">
                <Zap className="h-3 w-3 text-primary" />
                {count}件の代替候補
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                合計 {formatCount(totalStars)} stars
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60">
                <Server className="h-3 w-3 text-primary" />
                すべてセルフホスト可能
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">該当するツールが見つかりませんでした</p>
        ) : (
          <>
            {/* ── 2. Top Picks (featured cards) ── */}
            {topPicks.length > 0 && (
              <section className="mb-10">
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  おすすめトップ{topPicks.length}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {topPicks.map((tool, i) => (
                    <Link
                      key={tool.id}
                      to={`/tools/${tool.id}`}
                      className="group card-unified p-4 sm:p-5 flex flex-col relative hover:border-primary/30 transition-all"
                      onClick={() => track("alt_to_detail", { competitor, tool: tool.name || "", rank: i + 1, source: "top_pick" })}
                    >
                      {/* Rank badge */}
                      <span className="absolute -top-2 -left-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        #{i + 1}
                      </span>

                      <div className="flex items-center gap-2.5 mb-2">
                        <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={28} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {tool.name}
                          </h3>
                          <StarCount count={tool.stars_num} size="sm" />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
                        {tool.description_ja || tool.description_en || ""}
                      </p>

                      {/* Best for tag */}
                      <div className="flex items-center gap-1.5 text-[10px] text-primary font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        {getBestFor(tool)}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── 3. Comparison Table ── */}
            {tools.length >= 2 && (
              <section className="mb-10">
                <h2 className="text-base font-bold text-foreground mb-4">
                  {competitor}代替の比較表
                </h2>
                <div className="card-unified overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground w-8">#</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">ツール名</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">スター数</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">言語</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">ライセンス</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">特徴</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.slice(0, 10).map((tool, i) => (
                        <tr key={tool.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="p-3 text-xs text-muted-foreground font-medium">{i + 1}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={20} />
                              <span className="text-xs font-semibold text-foreground truncate">{tool.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <StarCount count={tool.stars_num} size="sm" />
                          </td>
                          <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{tool.language || "—"}</td>
                          <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{tool.license && tool.license !== "NOASSERTION" ? tool.license : "—"}</td>
                          <td className="p-3 text-[11px] text-muted-foreground">{getBestFor(tool)}</td>
                          <td className="p-3">
                            <Link
                              to={`/tools/${tool.id}`}
                              className="text-[11px] text-primary hover:underline font-medium whitespace-nowrap"
                              onClick={() => track("alt_to_detail", { competitor, tool: tool.name || "", rank: i + 1, source: "table" })}
                            >
                              詳細 →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ── 4. Why switch section (SEO content) ── */}
            <section className="mb-10">
              <h2 className="text-base font-bold text-foreground mb-3">
                なぜ{competitor}からOSSに乗り換えるのか？
              </h2>
              <div className="card-unified p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">コスト削減</p>
                      <p>{competitor}の月額・年額費用をゼロに。チーム規模が増えても追加コストなし。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Server className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">データの自社管理</p>
                      <p>セルフホストにより、顧客データを外部に預けずに自社で完全管理。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">ロックイン回避</p>
                      <p>特定ベンダーに依存せず、いつでも別ツールへ移行可能。</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. Rest of tools grid ── */}
            {restTools.length > 0 && (
              <section className="mb-10">
                <h2 className="text-base font-bold text-foreground mb-4">
                  すべての{competitor}代替ツール
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restTools.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i + 3} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── Internal links ── */}
        {!isLoading && tools.length > 0 && (
          <section className="mt-8 pt-8 border-t border-border/60">
            <h2 className="text-base font-bold text-foreground mb-4">他のSaaSの代替も探す</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SLUG_MAP)
                .filter(([s]) => s !== slug)
                .slice(0, 15)
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

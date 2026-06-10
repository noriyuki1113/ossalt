import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ChevronRight, Star, CheckCircle2, Users, Server, Zap, Shield, Settings, HelpCircle, ExternalLink } from "lucide-react";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { AdvertiseCTA } from "@/components/ads/AdvertiseCTA";
import { AlternativeSponsorCTA } from "@/components/ads/AlternativeSponsorCTA";
import { CommunityParticipationCTA } from "@/components/CommunityParticipationCTA";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useSeo } from "@/hooks/use-seo";
import { useAlternativeContent } from "@/hooks/use-alternative-content";
import { formatCount } from "@/lib/format";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Tool } from "@/hooks/use-tools";
import { TOOL_CARD_COLUMNS } from "@/hooks/use-tools";

const CURRENT_YEAR = new Date().getFullYear();

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
  linear: "Linear",
  asana: "Asana",
  confluence: "Confluence",
  sentry: "Sentry",
  miro: "Miro",
  mixpanel: "Mixpanel",
  hubspot: "HubSpot",
  clickup: "ClickUp",
  pagerduty: "PagerDuty",
  sendgrid: "SendGrid",
  heroku: "Heroku",
  calendly: "Calendly",
  mailchimp: "Mailchimp",
  discord: "Discord",
  monday: "Monday.com",
  loom: "Loom",
  vercel: "Vercel",
  doodle: "Doodle",
  "github-actions": "GitHub Actions",
  circleci: "CircleCI",
};

const COMPETITOR_TO_SLUG: Record<string, string> = {};
for (const [slug, name] of Object.entries(SLUG_MAP)) {
  COMPETITOR_TO_SLUG[name] = slug;
}

// slug → compare page slugs involving that competitor
const COMPARE_LINKS: Record<string, { slug: string; ossName: string }[]> = {
  notion: [{ slug: "appflowy-vs-notion", ossName: "AppFlowy" }],
  slack: [{ slug: "mattermost-vs-slack", ossName: "Mattermost" }, { slug: "rocket-chat-vs-slack", ossName: "Rocket.Chat" }],
  linear: [{ slug: "plane-vs-linear", ossName: "Plane" }],
  mixpanel: [{ slug: "posthog-vs-mixpanel", ossName: "PostHog" }],
  figma: [{ slug: "penpot-vs-figma", ossName: "Penpot" }],
  confluence: [{ slug: "outline-vs-confluence", ossName: "Outline" }],
  zapier: [{ slug: "n8n-vs-zapier", ossName: "n8n" }, { slug: "activepieces-vs-zapier", ossName: "Activepieces" }],
  airtable: [{ slug: "nocodb-vs-airtable", ossName: "NocoDB" }],
  "google-analytics": [{ slug: "matomo-vs-google-analytics", ossName: "Matomo" }, { slug: "plausible-vs-google-analytics", ossName: "Plausible" }],
  auth0: [{ slug: "keycloak-vs-auth0", ossName: "Keycloak" }],
  sentry: [{ slug: "glitchtip-vs-sentry", ossName: "GlitchTip" }],
  miro: [{ slug: "excalidraw-vs-miro", ossName: "Excalidraw" }],
  sendgrid: [{ slug: "listmonk-vs-sendgrid", ossName: "Listmonk" }],
  asana: [{ slug: "vikunja-vs-asana", ossName: "Vikunja" }],
  "google-drive": [{ slug: "nextcloud-vs-google-drive", ossName: "Nextcloud" }],
  "github-copilot": [{ slug: "gitea-vs-github", ossName: "Gitea" }],
  intercom: [{ slug: "chatwoot-vs-intercom", ossName: "Chatwoot" }],
  jira: [{ slug: "taiga-vs-jira", ossName: "Taiga" }],
  firebase: [{ slug: "supabase-vs-firebase", ossName: "Supabase" }],
  datadog: [{ slug: "grafana-vs-datadog", ossName: "Grafana" }],
  tableau: [{ slug: "metabase-vs-tableau", ossName: "Metabase" }],
  typeform: [{ slug: "formbricks-vs-typeform", ossName: "Formbricks" }],
  retool: [{ slug: "budibase-vs-retool", ossName: "Budibase" }],
  contentful: [{ slug: "directus-vs-contentful", ossName: "Directus" }],
  hubspot: [{ slug: "twenty-vs-hubspot", ossName: "Twenty" }],
  postman: [{ slug: "hoppscotch-vs-postman", ossName: "Hoppscotch" }],
};

export { SLUG_MAP, COMPETITOR_TO_SLUG, COMPARE_LINKS };

/* ── Icon map for whySwitchReasons ── */
const REASON_ICONS: Record<string, React.ElementType> = {
  cost: Zap,
  data: Server,
  lockin: Users,
  community: Users,
  customization: Settings,
};

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

  /* ── Editorial JSON (optional layer) ── */
  const { content: editorial } = useAlternativeContent(slug);

  const { data, isLoading } = useQuery({
    queryKey: ["alternatives-page", competitor],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("tools")
        .select(TOOL_CARD_COLUMNS)
        .eq("primary_competitor", competitor!)
        .order("stars_num", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data as unknown as Tool[]) || [];
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

  // Build dynamic description: include top 2 tool names once data is loaded
  const topToolNames = topPicks.slice(0, 2).map(t => t.name).filter(Boolean).join("・");
  const dynamicDescription = competitor
    ? topToolNames
      ? `【${CURRENT_YEAR}年版】${competitor}の代替OSSツール${count > 0 ? count + "件" : ""}を徹底比較。${topToolNames}など月額0円・セルフホスト可能なオープンソースを日本語で紹介。`
      : `【${CURRENT_YEAR}年版】${competitor}より安く使えるOSS代替ツールを比較。セルフホスト可能なオープンソースツールを日本語で検索・比較できます。`
    : "";

  const jsonLd = competitor ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: editorial?.metaTitle || `${competitor}の代替OSSツール${count > 0 ? count + "選" : "比較"}`,
        description: editorial?.metaDescription || dynamicDescription,
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
      },
      ...(editorial?.faq && editorial.faq.length > 0 ? [{
        "@type": "FAQPage",
        mainEntity: editorial.faq.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp" },
          { "@type": "ListItem", position: 2, name: `${competitor}の代替ツール`, item: `https://ossalt.jp/alternatives/${slug}` },
        ],
      },
    ],
  } : undefined;

  useSeo({
    title: editorial?.metaTitle || (competitor
      ? `${competitor}の代替OSSツール${count > 0 ? count + "選" : "比較"}【${CURRENT_YEAR}年版・無料】`
      : "代替ツール | OSSアルタナティブ"),
    description: editorial?.metaDescription || dynamicDescription,
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
            <span className="ml-2 text-sm font-semibold text-primary/70 align-middle">【{CURRENT_YEAR}年版】</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {editorial?.heroDescription || (
              <>
                {competitor}の月額コストやベンダーロックインに悩んでいませんか？
                ここでは{competitor}の代わりに使える無料・オープンソースのツール{!isLoading ? `${count}件` : ""}を、
                GitHubスター数順にランキング形式で比較できます。すべてセルフホスト可能で、ライセンス費用はゼロです。
              </>
            )}
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
                  {competitor}代替OSS おすすめトップ{topPicks.length}（{CURRENT_YEAR}年）
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
                        <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={28} id={tool.id} />
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
                  {competitor}代替OSS 機能・ライセンス比較表（{CURRENT_YEAR}年版）
                </h2>
                <div className="card-unified overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground w-8">#</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">ツール名</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">⭐ Stars</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden md:table-cell">ライセンス</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">料金</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">セルフホスト</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">用途</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.slice(0, 10).map((tool, i) => {
                        const difficulty = tool.docker_available
                          ? "Docker対応"
                          : tool.language === "Go" || tool.language === "Rust"
                            ? "やや難"
                            : "中程度";
                        return (
                          <tr key={tool.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="p-3 text-xs text-muted-foreground font-medium">{i + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={20} id={tool.id} />
                                <span className="text-xs font-semibold text-foreground truncate">{tool.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <StarCount count={tool.stars_num} size="sm" />
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              {tool.license && tool.license !== "NOASSERTION" ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground font-mono">
                                  {tool.license}
                                </span>
                              ) : <span className="text-xs text-muted-foreground/50">—</span>}
                            </td>
                            <td className="p-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:table-cell">
                              セルフホスト無料
                            </td>
                            <td className="p-3 hidden sm:table-cell">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                tool.docker_available
                                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                  : tool.language === "Go" || tool.language === "Rust"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-muted/60 text-muted-foreground"
                              }`}>
                                {difficulty}
                              </span>
                            </td>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground/60">
                  ※ 料金はセルフホスト版の場合。クラウド版は各公式サイトをご確認ください。スター数はGitHub上の値（{CURRENT_YEAR}年時点）。
                </p>
              </section>
            )}

            {/* ── 4. Why switch section ── */}
            {/* Uses editorial JSON reasons if available, otherwise generic fallback */}
            <section className="mb-10">
              <h2 className="text-base font-bold text-foreground mb-3">
                {CURRENT_YEAR}年に{competitor}からOSSに乗り換える理由
              </h2>
              <div className="card-unified p-5">
                {editorial?.whySwitchReasons ? (
                  <div className={`grid grid-cols-1 ${editorial.whySwitchReasons.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4 text-xs text-muted-foreground leading-relaxed`}>
                    {editorial.whySwitchReasons.map((reason, i) => {
                      const Icon = REASON_ICONS[reason.icon] || Zap;
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm mb-1">{reason.title}</p>
                            <p>{reason.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
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
                )}
              </div>
            </section>

            {/* ── 5. Rest of tools grid ── */}
            {restTools.length > 0 && (
              <section className="mb-10">
                <h2 className="text-base font-bold text-foreground mb-4">
                  すべての{competitor}代替OSSツール一覧（{count}件）
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restTools.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i + 3} />
                  ))}
                </div>
              </section>
            )}

            {/* ── 6. Editorial FAQ (only when JSON exists) ── */}
            {editorial?.faq && editorial.faq.length > 0 && (
              <section className="mb-10">
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  よくある質問
                </h2>
                <div className="card-unified p-4 sm:p-5">
                  <Accordion type="single" collapsible className="w-full">
                    {editorial.faq.map((item, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
                        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            )}

            {/* ── 7. Related alternatives (only when JSON exists) ── */}
            {editorial?.relatedSlugs && editorial.relatedSlugs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-bold text-foreground mb-3">関連する代替ページ</h2>
                <div className="flex flex-wrap gap-2">
                  {editorial.relatedSlugs
                    .filter(s => SLUG_MAP[s])
                    .map(s => (
                      <Link
                        key={s}
                        to={`/alternatives/${s}`}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-medium"
                      >
                        {SLUG_MAP[s]}の代替
                      </Link>
                    ))}
                </div>
              </section>
            )}

            {/* ── 8. Compare page links ── */}
            {slug && COMPARE_LINKS[slug] && COMPARE_LINKS[slug].length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-bold text-foreground mb-3">1対1で比較する</h2>
                <div className="flex flex-wrap gap-2">
                  {COMPARE_LINKS[slug].map(({ slug: cs, ossName }) => (
                    <Link
                      key={cs}
                      to={`/compare/${cs}`}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    >
                      {ossName} vs {competitor} 比較
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── 9. Competitor source link (only when JSON exists) ── */}
            {editorial?.competitorUrl && (
              <section className="mb-10">
                <div className="card-unified p-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {competitor}の公式サイト:
                    <a
                      href={editorial.competitorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      {editorial.competitorUrl}
                    </a>
                  </span>
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

        {/* Alternative Sponsor CTA */}
        <div className="mt-8">
          <AlternativeSponsorCTA competitor={competitor} />
        </div>

        {/* Community Participation */}
        <div className="mt-6">
          <CommunityParticipationCTA context="alternatives" />
        </div>

        {/* Newsletter */}
        <div className="mt-6">
          <NewsletterSignup />
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

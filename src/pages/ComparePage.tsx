import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, ExternalLink, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { useCompareContent } from "@/hooks/use-compare-content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SLUG_MAP } from "@/pages/AlternativesPage";

function ClearbitLogo({ url, name }: { url: string; name: string }) {
  const domain = (() => { try { return new URL(url).hostname; } catch { return ""; } })();
  return domain ? (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      className="w-10 h-10 rounded-lg object-contain bg-white p-0.5"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  ) : null;
}

const ALL_COMPARE_SLUGS: Record<string, { oss: string; saas: string }> = {
  "appflowy-vs-notion": { oss: "AppFlowy", saas: "Notion" },
  "mattermost-vs-slack": { oss: "Mattermost", saas: "Slack" },
  "plane-vs-linear": { oss: "Plane", saas: "Linear" },
  "posthog-vs-mixpanel": { oss: "PostHog", saas: "Mixpanel" },
  "penpot-vs-figma": { oss: "Penpot", saas: "Figma" },
  "outline-vs-confluence": { oss: "Outline", saas: "Confluence" },
  "n8n-vs-zapier": { oss: "n8n", saas: "Zapier" },
  "nocodb-vs-airtable": { oss: "NocoDB", saas: "Airtable" },
  "matomo-vs-google-analytics": { oss: "Matomo", saas: "Google Analytics" },
  "keycloak-vs-auth0": { oss: "Keycloak", saas: "Auth0" },
  "glitchtip-vs-sentry": { oss: "GlitchTip", saas: "Sentry" },
  "excalidraw-vs-miro": { oss: "Excalidraw", saas: "Miro" },
  "listmonk-vs-sendgrid": { oss: "Listmonk", saas: "SendGrid" },
  "vikunja-vs-asana": { oss: "Vikunja", saas: "Asana" },
  "rocket-chat-vs-slack": { oss: "Rocket.Chat", saas: "Slack" },
  "nextcloud-vs-google-drive": { oss: "Nextcloud", saas: "Google Drive" },
  "gitea-vs-github": { oss: "Gitea", saas: "GitHub" },
  "plausible-vs-google-analytics": { oss: "Plausible", saas: "Google Analytics" },
  "chatwoot-vs-intercom": { oss: "Chatwoot", saas: "Intercom" },
  "taiga-vs-jira": { oss: "Taiga", saas: "Jira" },
  "activepieces-vs-zapier": { oss: "Activepieces", saas: "Zapier" },
  "supabase-vs-firebase": { oss: "Supabase", saas: "Firebase" },
  "grafana-vs-datadog": { oss: "Grafana", saas: "Datadog" },
  "metabase-vs-tableau": { oss: "Metabase", saas: "Tableau" },
  "formbricks-vs-typeform": { oss: "Formbricks", saas: "Typeform" },
  "budibase-vs-retool": { oss: "Budibase", saas: "Retool" },
  "directus-vs-contentful": { oss: "Directus", saas: "Contentful" },
  "twenty-vs-hubspot": { oss: "Twenty", saas: "HubSpot" },
  "hoppscotch-vs-postman": { oss: "Hoppscotch", saas: "Postman" },
};

export default function ComparePage() {
  const { slug } = useParams<{ slug: string }>();
  const { content, loading } = useCompareContent(slug);

  useSeo({
    title: content?.metaTitle ?? `${slug} 比較 | OSSアルタナティブ`,
    description: content?.metaDescription,
    ogImage: content ? `https://ossalt.jp/api/og?type=compare&c=${encodeURIComponent(content.ossName + " vs " + content.saasName)}` : undefined,
  });

  if (loading) {
    return (
      <SiteLayout>
        <div className="container max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </SiteLayout>
    );
  }

  if (!content) {
    return (
      <SiteLayout>
        <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">比較ページが見つかりませんでした。</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">トップへ戻る</Link>
        </div>
      </SiteLayout>
    );
  }

  const ossWins = content.comparison.filter(c => c.winner === "oss").length;
  const saasWins = content.comparison.filter(c => c.winner === "saas").length;

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/alternatives/${content.alternativeSlug}`} className="hover:text-primary transition-colors">
            {content.saasName}の代替
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{content.ossName} vs {content.saasName}</span>
        </nav>

        {/* Hero */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            OSS vs SaaS 比較
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <ClearbitLogo url={content.ossUrl} name={content.ossName} />
              <span className="font-bold text-xl">{content.ossName}</span>
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">OSS</span>
            </div>
            <span className="text-2xl font-light text-muted-foreground">vs</span>
            <div className="flex items-center gap-2">
              <ClearbitLogo url={content.saasUrl} name={content.saasName} />
              <span className="font-bold text-xl">{content.saasName}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            {content.ossName} vs {content.saasName} 徹底比較
          </h1>
          <p className="text-muted-foreground leading-relaxed">{content.heroDescription}</p>
        </section>

        {/* Score summary */}
        <div className="card-unified p-5 mb-8 flex items-center justify-between gap-4">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-primary">{ossWins}</div>
            <div className="text-xs text-muted-foreground mt-1">{content.ossName} が優位</div>
          </div>
          <div className="text-muted-foreground text-sm">項目別スコア</div>
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-foreground">{saasWins}</div>
            <div className="text-xs text-muted-foreground mt-1">{content.saasName} が優位</div>
          </div>
        </div>

        {/* Comparison table */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-foreground mb-4">項目別比較</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr] bg-muted/50 text-xs font-semibold text-muted-foreground">
              <div className="px-4 py-3">項目</div>
              <div className="px-4 py-3 border-l border-border text-primary">{content.ossName}（OSS）</div>
              <div className="px-4 py-3 border-l border-border">{content.saasName}</div>
            </div>
            {content.comparison.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr] border-t border-border text-sm">
                <div className="px-4 py-3.5 font-medium text-foreground">{row.category}</div>
                <div className={`px-4 py-3.5 border-l border-border flex items-start gap-1.5 ${row.winner === "oss" ? "bg-primary/5" : ""}`}>
                  {row.winner === "oss" && <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />}
                  {row.winner === "draw" && <Minus className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />}
                  <span className={row.winner === "oss" ? "text-foreground" : "text-muted-foreground"}>{row.oss}</span>
                </div>
                <div className={`px-4 py-3.5 border-l border-border flex items-start gap-1.5 ${row.winner === "saas" ? "bg-amber-500/5" : ""}`}>
                  {row.winner === "saas" && <Check className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />}
                  {row.winner === "draw" && <Minus className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />}
                  <span className={row.winner === "saas" ? "text-foreground" : "text-muted-foreground"}>{row.saas}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verdict */}
        <section className="mb-10">
          <div className="card-unified p-5 border-l-4 border-l-primary">
            <div className="text-xs font-semibold text-primary mb-2">結論</div>
            <p className="text-sm text-foreground leading-relaxed">{content.verdict}</p>
          </div>
        </section>

        {/* Who should use which */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-foreground mb-4">どちらを選ぶべきか</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-unified p-5">
              <div className="flex items-center gap-2 mb-3">
                <ClearbitLogo url={content.ossUrl} name={content.ossName} />
                <div>
                  <div className="font-semibold text-sm">{content.ossName} を選ぶなら</div>
                  <div className="text-xs text-primary">OSS・セルフホスト</div>
                </div>
              </div>
              <ul className="space-y-2">
                {content.ossFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-unified p-5">
              <div className="flex items-center gap-2 mb-3">
                <ClearbitLogo url={content.saasUrl} name={content.saasName} />
                <div>
                  <div className="font-semibold text-sm">{content.saasName} を選ぶなら</div>
                  <div className="text-xs text-muted-foreground">有料SaaS</div>
                </div>
              </div>
              <ul className="space-y-2">
                {content.saasFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {content.faq.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-foreground mb-4">よくある質問</h2>
            <Accordion type="single" collapsible className="card-unified divide-y divide-border">
              {content.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="px-4">
                  <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Link to alternatives page */}
        <section className="mb-10">
          <Link
            to={`/alternatives/${content.alternativeSlug}`}
            className="card-unified p-5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
          >
            <div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {content.saasName}の代替OSS一覧をすべて見る
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {content.ossName}以外のOSS代替も比較できます
              </div>
            </div>
            <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 shrink-0 group-hover:text-primary transition-colors" />
          </Link>
        </section>

        {/* Related compare pages */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-foreground mb-3">他のツールも比較する</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ALL_COMPARE_SLUGS)
              .filter(([s]) => s !== slug)
              .slice(0, 12)
              .map(([s, names]) => (
                <Link
                  key={s}
                  to={`/compare/${s}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  {names.oss} vs {names.saas}
                </Link>
              ))}
          </div>
        </section>

        {/* Related alternatives */}
        {content.relatedSlugs.length > 0 && (
          <section className="pt-6 border-t border-border/60">
            <h2 className="text-sm font-bold text-foreground mb-3">関連する代替ページ</h2>
            <div className="flex flex-wrap gap-2">
              {content.relatedSlugs
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

      </div>
    </SiteLayout>
  );
}

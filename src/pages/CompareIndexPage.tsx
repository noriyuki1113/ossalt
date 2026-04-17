import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";

const COMPARE_PAGES = [
  { slug: "appflowy-vs-notion",          oss: "AppFlowy",   saas: "Notion",          category: "ワークスペース" },
  { slug: "mattermost-vs-slack",          oss: "Mattermost", saas: "Slack",           category: "チームチャット" },
  { slug: "rocket-chat-vs-slack",         oss: "Rocket.Chat",saas: "Slack",           category: "チームチャット" },
  { slug: "plane-vs-linear",              oss: "Plane",      saas: "Linear",          category: "プロジェクト管理" },
  { slug: "vikunja-vs-asana",             oss: "Vikunja",    saas: "Asana",           category: "プロジェクト管理" },
  { slug: "nocodb-vs-airtable",           oss: "NocoDB",     saas: "Airtable",        category: "ノーコードDB" },
  { slug: "penpot-vs-figma",              oss: "Penpot",     saas: "Figma",           category: "デザイン" },
  { slug: "excalidraw-vs-miro",           oss: "Excalidraw", saas: "Miro",            category: "ホワイトボード" },
  { slug: "outline-vs-confluence",        oss: "Outline",    saas: "Confluence",      category: "ドキュメント" },
  { slug: "n8n-vs-zapier",               oss: "n8n",        saas: "Zapier",          category: "自動化" },
  { slug: "posthog-vs-mixpanel",          oss: "PostHog",    saas: "Mixpanel",        category: "プロダクト分析" },
  { slug: "matomo-vs-google-analytics",   oss: "Matomo",     saas: "Google Analytics",category: "アクセス解析" },
  { slug: "keycloak-vs-auth0",            oss: "Keycloak",   saas: "Auth0",           category: "認証" },
  { slug: "glitchtip-vs-sentry",          oss: "GlitchTip",  saas: "Sentry",          category: "エラー監視" },
  { slug: "listmonk-vs-sendgrid",         oss: "Listmonk",   saas: "SendGrid",        category: "メール配信" },
  { slug: "nextcloud-vs-google-drive",    oss: "Nextcloud",  saas: "Google Drive",    category: "ストレージ" },
  { slug: "gitea-vs-github",              oss: "Gitea",      saas: "GitHub",          category: "Gitホスティング" },
  { slug: "plausible-vs-google-analytics",oss: "Plausible",  saas: "Google Analytics",category: "アクセス解析" },
  { slug: "chatwoot-vs-intercom",         oss: "Chatwoot",   saas: "Intercom",        category: "カスタマーサポート" },
  { slug: "taiga-vs-jira",               oss: "Taiga",      saas: "Jira",            category: "プロジェクト管理" },
  { slug: "activepieces-vs-zapier",       oss: "Activepieces",saas: "Zapier",         category: "自動化" },
];

const CATEGORIES = [...new Set(COMPARE_PAGES.map(p => p.category))];

export default function CompareIndexPage() {
  useSeo({
    title: "OSS vs SaaS 比較一覧 | OSSアルタナティブ",
    description: "AppFlowy vs Notion、Mattermost vs SlackなどOSSと有料SaaSを項目別に徹底比較。コスト・機能・セルフホスト対応を一覧で確認できます。",
  });

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">OSS vs SaaS 比較</span>
        </nav>

        {/* Hero */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            OSS vs SaaS
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            OSS vs SaaS 比較一覧
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            有料SaaSの代替となるOSSツールを1対1で徹底比較。コスト・機能・セルフホスト対応・移行難易度をカテゴリ別にまとめました。
          </p>
        </section>

        {/* Compare cards by category */}
        {CATEGORIES.map(cat => (
          <section key={cat} className="mb-10">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">{cat}</h2>
            <div className="space-y-2">
              {COMPARE_PAGES.filter(p => p.category === cat).map(p => (
                <Link
                  key={p.slug}
                  to={`/compare/${p.slug}`}
                  className="card-unified p-4 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-2 font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      <span className="text-primary">{p.oss}</span>
                      <span className="text-muted-foreground text-xs">vs</span>
                      <span>{p.saas}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 hidden sm:inline">
                      OSS無料
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA to alternatives */}
        <section className="mt-8 pt-8 border-t border-border/60">
          <h2 className="text-base font-bold text-foreground mb-4">1対1比較だけでなく、代替一覧も見る</h2>
          <div className="flex flex-wrap gap-2">
            {["notion","slack","figma","zapier","jira","airtable","github-copilot","datadog","auth0","sentry","mixpanel","miro"].map(s => (
              <Link
                key={s}
                to={`/alternatives/${s}`}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-medium capitalize"
              >
                {s.replace(/-/g, " ")}の代替
              </Link>
            ))}
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}

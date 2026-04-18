import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const COMPARISONS = [
  { slug: "supabase-vs-firebase",      oss: "Supabase",   ossUrl: "https://supabase.com",             saas: "Firebase",   saasUrl: "https://firebase.google.com",       category: "BaaS" },
  { slug: "appflowy-vs-notion",        oss: "AppFlowy",   ossUrl: "https://appflowy.io",               saas: "Notion",     saasUrl: "https://notion.so",                 category: "ワークスペース" },
  { slug: "n8n-vs-zapier",             oss: "n8n",        ossUrl: "https://n8n.io",                    saas: "Zapier",     saasUrl: "https://zapier.com",                category: "自動化" },
  { slug: "grafana-vs-datadog",        oss: "Grafana",    ossUrl: "https://grafana.com",               saas: "Datadog",    saasUrl: "https://www.datadoghq.com",         category: "監視" },
  { slug: "penpot-vs-figma",           oss: "Penpot",     ossUrl: "https://penpot.app",                saas: "Figma",      saasUrl: "https://figma.com",                 category: "デザイン" },
  { slug: "posthog-vs-mixpanel",       oss: "PostHog",    ossUrl: "https://posthog.com",               saas: "Mixpanel",   saasUrl: "https://mixpanel.com",              category: "分析" },
  { slug: "metabase-vs-tableau",       oss: "Metabase",   ossUrl: "https://www.metabase.com",          saas: "Tableau",    saasUrl: "https://www.tableau.com",           category: "BIツール" },
  { slug: "plane-vs-linear",           oss: "Plane",      ossUrl: "https://plane.so",                  saas: "Linear",     saasUrl: "https://linear.app",                category: "PM" },
  { slug: "keycloak-vs-auth0",         oss: "Keycloak",   ossUrl: "https://www.keycloak.org",          saas: "Auth0",      saasUrl: "https://auth0.com",                 category: "認証" },
  { slug: "nocodb-vs-airtable",        oss: "NocoDB",     ossUrl: "https://nocodb.com",                saas: "Airtable",   saasUrl: "https://airtable.com",              category: "ノーコードDB" },
  { slug: "mattermost-vs-slack",       oss: "Mattermost", ossUrl: "https://mattermost.com",            saas: "Slack",      saasUrl: "https://slack.com",                 category: "チャット" },
  { slug: "outline-vs-confluence",     oss: "Outline",    ossUrl: "https://www.getoutline.com",        saas: "Confluence", saasUrl: "https://www.atlassian.com/software/confluence", category: "Wiki" },
];

function Logo({ url, name }: { url: string; name: string }) {
  const domain = (() => { try { return new URL(url).hostname; } catch { return ""; } })();
  return domain ? (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      className="w-5 h-5 rounded object-contain bg-white"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  ) : null;
}

export function PopularComparisonsSection() {
  return (
    <section className="border-b border-border">
      <div className="container py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">
              OSS vs SaaS 徹底比較
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              人気SaaSとOSS代替をコスト・機能・セルフホストで比べる
            </p>
          </div>
          <Link
            to="/compare"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium shrink-0"
          >
            全{COMPARISONS.length}件を見る <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              to={`/compare/${c.slug}`}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-card px-3.5 py-3 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-center gap-1.5">
                <Logo url={c.ossUrl} name={c.oss} />
                <span className="text-[10px] text-muted-foreground font-medium">vs</span>
                <Logo url={c.saasUrl} name={c.saas} />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                  {c.oss}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  vs {c.saas}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground/60 border border-border rounded-full px-1.5 py-0.5 self-start">
                {c.category}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 sm:hidden text-center">
          <Link to="/compare" className="text-xs text-primary hover:underline font-medium">
            比較一覧を見る <ArrowRight className="h-3 w-3 inline" />
          </Link>
        </div>
      </div>
    </section>
  );
}

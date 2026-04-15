import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ALTERNATIVES = [
  { slug: "notion",           name: "Notion",           emoji: "📝", category: "ワークスペース" },
  { slug: "slack",            name: "Slack",            emoji: "💬", category: "チームチャット" },
  { slug: "figma",            name: "Figma",            emoji: "🎨", category: "UIデザイン" },
  { slug: "jira",             name: "Jira",             emoji: "📋", category: "プロジェクト管理" },
  { slug: "zapier",           name: "Zapier",           emoji: "⚡", category: "自動化" },
  { slug: "airtable",         name: "Airtable",         emoji: "🗃️", category: "ノーコードDB" },
  { slug: "google-analytics", name: "Google Analytics", emoji: "📈", category: "アクセス解析" },
  { slug: "datadog",          name: "Datadog",          emoji: "🐕", category: "監視・APM" },
  { slug: "sentry",           name: "Sentry",           emoji: "🔍", category: "エラー監視" },
  { slug: "linear",           name: "Linear",           emoji: "🔄", category: "イシュー管理" },
  { slug: "confluence",       name: "Confluence",       emoji: "📚", category: "ドキュメント" },
  { slug: "mixpanel",         name: "Mixpanel",         emoji: "📊", category: "プロダクト分析" },
];

export function PopularAlternativesSection() {
  return (
    <section id="alternatives" className="border-b border-border bg-secondary/30">
      <div className="container py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">
              人気SaaSの代替を探す
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              よく検索される有料ツールのOSS代替一覧
            </p>
          </div>
          <Link
            to="/ranking"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium shrink-0"
          >
            すべて見る <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {ALTERNATIVES.map((alt) => (
            <Link
              key={alt.slug}
              to={`/alternatives/${alt.slug}`}
              className="group flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card px-3.5 py-3 hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-sm transition-all duration-150"
            >
              <span className="text-xl leading-none">{alt.emoji}</span>
              <div className="min-w-0 w-full">
                <p className="text-xs font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                  {alt.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {alt.category}
                </p>
              </div>
              <span className="text-[10px] text-primary/70 font-medium">
                代替を見る →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 sm:hidden text-center">
          <Link to="/ranking" className="text-xs text-primary hover:underline font-medium">
            もっと見る <ArrowRight className="h-3 w-3 inline" />
          </Link>
        </div>
      </div>
    </section>
  );
}

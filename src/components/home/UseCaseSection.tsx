import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, Shield, Code2, MessageSquare, FolderKanban, Compass } from "lucide-react";

const USE_CASES = [
  {
    icon: Bot,
    title: "AI・ML",
    desc: "AIアシスタント・MLパイプライン",
    examples: "LangChain, Ollama, Stable Diffusion",
    category: "AI・ML",
  },
  {
    icon: Code2,
    title: "開発ツール",
    desc: "IDE・API開発・CI/CD",
    examples: "VS Code, Hoppscotch, Gitea",
    category: "開発ツール",
  },
  {
    icon: Shield,
    title: "セキュリティ",
    desc: "SIEM・脆弱性スキャン・認証",
    examples: "Wazuh, Keycloak, CrowdSec",
    category: "セキュリティ",
  },
  {
    icon: FolderKanban,
    title: "プロジェクト管理",
    desc: "タスク管理・カンバン・チケット",
    examples: "Plane, Focalboard, Taiga",
    category: "業務ソフト",
  },
  {
    icon: BarChart3,
    title: "データ分析",
    desc: "BI・ダッシュボード・ETL",
    examples: "Metabase, Apache Superset",
    category: "データ・分析",
  },
  {
    icon: MessageSquare,
    title: "コミュニケーション",
    desc: "チャット・ビデオ・フォーラム",
    examples: "Rocket.Chat, Mattermost, Jitsi",
    category: "コミュニティ",
  },
];

export function UseCaseSection() {
  return (
    <section id="use-cases" className="container py-16 md:py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-primary bg-primary/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
          <Compass className="h-3.5 w-3.5" />
          カテゴリ
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          用途から探す
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          やりたいことからOSSツールを見つける
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {USE_CASES.map((uc) => (
          <Link
            key={uc.title}
            to={`/?category=${encodeURIComponent(uc.category)}`}
            className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <uc.icon className="h-[18px] w-[18px] text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {uc.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {uc.desc}
            </p>

            {/* Example tools */}
            <p className="text-[11px] text-muted-foreground/80 mb-3 line-clamp-1">
              例: {uc.examples}
            </p>

            {/* CTA */}
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
              ツールを見る
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

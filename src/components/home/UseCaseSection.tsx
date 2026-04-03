import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, Shield, Code2, MessageSquare, FolderKanban } from "lucide-react";

const USE_CASES = [
  { icon: Bot, title: "AI・ML", desc: "LLM基盤やMLOpsを自前で構築", examples: "Ollama, LangChain", slug: "ai-ml" },
  { icon: Code2, title: "開発ツール", desc: "エディタからCI/CDまで開発環境を整備", examples: "VS Code, Gitea", slug: "developer-tools" },
  { icon: Shield, title: "セキュリティ", desc: "認証・監視・脆弱性管理を内製化", examples: "Keycloak, Wazuh", slug: "security" },
  { icon: FolderKanban, title: "プロジェクト管理", desc: "タスク・スプリント管理をチームに最適化", examples: "Plane, Taiga", slug: "business" },
  { icon: BarChart3, title: "データ分析", desc: "BIダッシュボードを自社データで運用", examples: "Metabase, Superset", slug: "data-analytics" },
  { icon: MessageSquare, title: "コミュニケーション", desc: "社内チャットやビデオ会議を自社運用", examples: "Rocket.Chat, Jitsi", slug: "community" },
];

export function UseCaseSection() {
  return (
    <section id="use-cases" className="container py-12 md:py-20">
      <h2 className="section-title text-center mb-8 md:mb-10">
        用途から探す
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
        {USE_CASES.map((uc) => (
          <Link
            key={uc.title}
            to={`/category/${uc.slug}`}
            className="group card-unified-hover p-4 md:p-5"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <uc.icon className="h-[18px] w-[18px] text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {uc.title}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-2">{uc.desc}</p>
            <p className="text-[11px] text-muted-foreground/60 mb-3">例: {uc.examples}</p>

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

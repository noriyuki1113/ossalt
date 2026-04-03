import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, Shield, Code2, MessageSquare, FolderKanban } from "lucide-react";

const USE_CASES = [
  { icon: Bot, title: "AI・ML", desc: "AIアシスタント・MLパイプライン", examples: "LangChain, Ollama", category: "AI・ML" },
  { icon: Code2, title: "開発ツール", desc: "IDE・API開発・CI/CD", examples: "VS Code, Hoppscotch", category: "開発ツール" },
  { icon: Shield, title: "セキュリティ", desc: "SIEM・脆弱性スキャン・認証", examples: "Wazuh, Keycloak", category: "セキュリティ" },
  { icon: FolderKanban, title: "プロジェクト管理", desc: "タスク管理・カンバン", examples: "Plane, Focalboard", category: "業務ソフト" },
  { icon: BarChart3, title: "データ分析", desc: "BI・ダッシュボード", examples: "Metabase, Superset", category: "データ・分析" },
  { icon: MessageSquare, title: "コミュニケーション", desc: "チャット・ビデオ通話", examples: "Rocket.Chat, Jitsi", category: "コミュニティ" },
];

export function UseCaseSection() {
  return (
    <section id="use-cases" className="container py-16 md:py-20">
      <h2 className="section-title text-center mb-10">
        用途から探す
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {USE_CASES.map((uc) => (
          <Link
            key={uc.title}
            to={`/?category=${encodeURIComponent(uc.category)}`}
            className="group card-unified-hover p-5"
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

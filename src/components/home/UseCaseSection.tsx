import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, Shield, Code2, MessageSquare, FolderKanban } from "lucide-react";

const USE_CASES = [
  {
    icon: Bot,
    title: "AIアプリを構築",
    description: "プライベートなAIアシスタントをOSSで構築",
    category: "AI・ML",
  },
  {
    icon: FolderKanban,
    title: "プロジェクト管理",
    description: "Jira・Asanaの代替でタスク管理",
    category: "業務ソフト",
  },
  {
    icon: BarChart3,
    title: "データ可視化・分析",
    description: "Tableau・Lookerの代替でダッシュボード構築",
    category: "データ・分析",
  },
  {
    icon: Shield,
    title: "セキュリティ強化",
    description: "SIEM・脆弱性スキャンをOSSで実現",
    category: "セキュリティ",
  },
  {
    icon: Code2,
    title: "開発環境の整備",
    description: "Copilot・PostmanのOSS代替で開発改善",
    category: "開発ツール",
  },
  {
    icon: MessageSquare,
    title: "チャット・コミュニケーション",
    description: "Slack・Discordの代替を自前運用",
    category: "コミュニティ",
  },
];

export function UseCaseSection() {
  return (
    <section className="container py-16">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          用途から<span className="text-gradient">探す</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          目的に合ったOSSツールを探す
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {USE_CASES.map((uc) => (
          <Link
            key={uc.title}
            to={`/?category=${encodeURIComponent(uc.category)}`}
            className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/20 hover:bg-card/80"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <uc.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, Shield, Code2, MessageSquare, FolderKanban } from "lucide-react";

const USE_CASES = [
  {
    icon: Bot,
    title: "AIアプリを構築したい",
    description: "ChatGPT APIやLangChainの代替で、プライベートなAIアシスタントを構築",
    category: "AI・機械学習",
  },
  {
    icon: FolderKanban,
    title: "プロジェクト管理を自前で",
    description: "Jira・Asanaの代替で、チームのタスクとプロジェクトを管理",
    category: "ビジネスソフトウェア",
  },
  {
    icon: BarChart3,
    title: "データを可視化・分析",
    description: "Tableau・Lookerの代替で、ダッシュボードと分析基盤を構築",
    category: "データ・分析",
  },
  {
    icon: Shield,
    title: "セキュリティを強化",
    description: "SIEM・脆弱性スキャンの代替で、セキュリティ体制を強化",
    category: "セキュリティ・プライバシー",
  },
  {
    icon: Code2,
    title: "開発環境を整備",
    description: "GitHub Copilot・PostmanのOSS代替で、開発ワークフローを改善",
    category: "開発者ツール",
  },
  {
    icon: MessageSquare,
    title: "コミュニケーション基盤",
    description: "Slack・Discordの代替で、チームコミュニケーションを自前運用",
    category: "コミュニティ・ソーシャル",
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
          やりたいことから最適なOSSツールを見つけましょう
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

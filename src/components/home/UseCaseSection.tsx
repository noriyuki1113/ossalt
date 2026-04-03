import { Link } from "react-router-dom";
import { Bot, BarChart3, Shield, Code2, MessageSquare, FolderKanban } from "lucide-react";

const USE_CASES = [
  {
    icon: Bot,
    title: "AI・ML",
    description: "AIアシスタント・MLパイプラインをOSSで構築",
    category: "AI・ML",
  },
  {
    icon: Code2,
    title: "開発ツール",
    description: "Copilot・PostmanのOSS代替で開発を効率化",
    category: "開発ツール",
  },
  {
    icon: Shield,
    title: "セキュリティ",
    description: "SIEM・脆弱性スキャンをOSSで運用",
    category: "セキュリティ",
  },
  {
    icon: FolderKanban,
    title: "プロジェクト管理",
    description: "Jira・Asanaの代替でタスク管理",
    category: "業務ソフト",
  },
  {
    icon: BarChart3,
    title: "データ分析",
    description: "Tableau・Lookerの代替でダッシュボード構築",
    category: "データ・分析",
  },
  {
    icon: MessageSquare,
    title: "コミュニケーション",
    description: "Slack・Discordの代替を自前運用",
    category: "コミュニティ",
  },
];

export function UseCaseSection() {
  return (
    <section id="use-cases" className="container py-14">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          用途から探す
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          目的に合ったOSSツールを見つける
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {USE_CASES.map((uc) => (
          <Link
            key={uc.title}
            to={`/?category=${encodeURIComponent(uc.category)}`}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm text-center"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/8 flex items-center justify-center mx-auto mb-3">
              <uc.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
              {uc.title}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {uc.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

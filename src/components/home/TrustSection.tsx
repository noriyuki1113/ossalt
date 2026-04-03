import { Link } from "react-router-dom";
import { Github, RefreshCw, Shield, FileEdit, Database, Clock } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Github,
    title: "GitHubデータに基づく情報",
    desc: "スター数・フォーク数・最終コミット日・ライセンス・主要言語はすべてGitHub APIから直接取得しています。",
  },
  {
    icon: Clock,
    title: "毎日自動更新",
    desc: "GitHub統計は毎日深夜に自動同期。新規ツールは毎週月曜に自動取得しています。",
  },
  {
    icon: Shield,
    title: "掲載基準",
    desc: "オープンソースライセンスで公開され、GitHubで開発が継続しているプロジェクトのみを掲載しています。",
  },
  {
    icon: Database,
    title: "データソース",
    desc: "openalternative.co（CC0）のデータをベースに、日本語翻訳と独自加工を行っています。",
    link: { to: "/about", label: "詳しく見る" },
  },
  {
    icon: RefreshCw,
    title: "コミュニティ参加型",
    desc: "ツールの追加リクエストや掲載情報の修正を誰でも提案できます。",
    link: { to: "/contact", label: "提案する" },
  },
  {
    icon: FileEdit,
    title: "情報修正リクエスト",
    desc: "掲載内容に誤りを見つけた場合は、お問い合わせから修正をリクエストできます。",
    link: { to: "/contact", label: "修正を依頼" },
  },
];

export function TrustSection() {
  return (
    <section className="container py-12 md:py-20 px-4">
      <h2 className="section-title text-center mb-2 md:mb-3">
        データの信頼性について
      </h2>
      <p className="text-xs text-muted-foreground text-center mb-8 md:mb-10 max-w-lg mx-auto">
        OSSアルタナティブは「便利な一覧」ではなく、信頼できる比較データベースを目指しています。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="card-unified p-4 md:p-5 flex flex-col">
            <div className="flex items-start gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground pt-1">{item.title}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
            {item.link && (
              <Link
                to={item.link.to}
                className="text-[11px] text-primary hover:underline font-medium mt-2 self-start"
              >
                {item.link.label} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

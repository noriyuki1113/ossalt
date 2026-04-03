import { Link } from "react-router-dom";
import { Github, RefreshCw, Shield, FileEdit } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Github,
    title: "GitHubデータに基づく情報",
    desc: "スター数、フォーク数、最終コミット日などはGitHub APIから取得しています。",
  },
  {
    icon: RefreshCw,
    title: "定期的なデータ更新",
    desc: "GitHubの統計情報は定期的に自動更新され、最新の状態を維持しています。",
  },
  {
    icon: Shield,
    title: "掲載基準の透明性",
    desc: "アクティブに開発されているオープンソースプロジェクトのみを掲載しています。",
  },
  {
    icon: FileEdit,
    title: "情報修正リクエスト",
    desc: "掲載内容に誤りがあれば、お問い合わせから修正をリクエストできます。",
  },
];

export function TrustSection() {
  return (
    <section className="container py-12 md:py-20 px-4">
      <h2 className="section-title text-center mb-8 md:mb-10">
        データの信頼性について
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="card-unified p-4 md:p-5 flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center mt-6">
        <Link
          to="/contact"
          className="text-xs text-primary hover:underline font-medium"
        >
          情報の修正をリクエストする →
        </Link>
      </p>
    </section>
  );
}

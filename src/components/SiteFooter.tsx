import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const SITE_LINKS = [
  { to: "/about", label: "OSSアルタナティブについて" },
  { to: "/ranking", label: "人気ランキング" },
  { to: "/compare", label: "A vs B 比較一覧" },
  { to: "/quiz", label: "OSS診断ツール" },
  { to: "/savings", label: "コスト削減シミュレーター" },
];

const ACTION_LINKS = [
  { to: "/submit", label: "OSSを掲載する（無料）" },
  { to: "/advertise", label: "広告掲載・スポンサー" },
  { to: "/contact", label: "情報修正リクエスト" },
  { to: "/contact", label: "ツール追加リクエスト" },
];

const LEGAL_LINKS = [
  { to: "/terms", label: "掲載ポリシー" },
  { to: "/privacy", label: "プライバシーポリシー" },
  { to: "/disclaimer", label: "免責事項" },
  { to: "/contact", label: "お問い合わせ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container py-10">
        {/* Top: Brand + Links + Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-2.5">
              <img src="/logo.png" alt="OSSアルタナティブ" className="h-6 w-6 rounded-md" width={24} height={24} />
              <span className="font-bold text-sm tracking-tight text-foreground">OSSアルタナティブ</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              有料SaaSの代替となるオープンソースツールを、日本語で検索・比較できるサイトです。
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GitHubデータ: 毎日自動更新
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <nav className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">サイト</p>
              {SITE_LINKS.map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <nav className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">参加する</p>
              {ACTION_LINKS.map((l, i) => (
                <Link
                  key={`${l.to}-${i}`}
                  to={l.to}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <nav className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">法的情報</p>
              {LEGAL_LINKS.map((l) => (
                <Link
                  key={l.to + l.label}
                  to={l.to}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="lg:max-w-[260px] w-full">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">ニュースレター</p>
            <p className="text-xs text-muted-foreground mb-2">新しいOSSツールや比較ガイドの更新を受け取る</p>
            <NewsletterSignup compact />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground/70">
            © {new Date().getFullYear()} OSSアルタナティブ. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            データソース: openalternative.co (CC0) + GitHub API · すべてのOSSに感謝。
          </p>
        </div>
      </div>
    </footer>
  );
}

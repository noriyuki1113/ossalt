import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { to: "/about", label: "OSSアルタナティブについて" },
  { to: "/terms", label: "掲載ポリシー" },
  { to: "/privacy", label: "プライバシーポリシー" },
  { to: "/contact", label: "お問い合わせ" },
  { to: "/advertise", label: "広告掲載について" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container py-10">
        {/* Brand + Links */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-2.5">
              <img src="/logo.png" alt="OSSアルタナティブ" className="h-6 w-6 rounded-md" width={24} height={24} />
              <span className="font-bold text-sm tracking-tight text-foreground">OSSアルタナティブ</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              有料SaaSの代替となるオープンソースツールを、日本語で検索・比較できるサイトです。
            </p>
            {/* Data freshness indicator */}
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GitHubデータ: 毎日自動更新
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <nav className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">サイト</p>
              {FOOTER_LINKS.slice(0, 3).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <nav className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">参加する</p>
              {FOOTER_LINKS.slice(3).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ツール追加リクエスト
              </Link>
              <Link
                to="/contact"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                情報修正リクエスト
              </Link>
            </nav>
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

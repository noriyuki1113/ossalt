import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "サイト",
    links: [
      { to: "/", label: "ホーム" },
      { to: "/ranking", label: "ランキング" },
      { to: "/news", label: "ニュース" },
      { to: "/about", label: "サイトについて" },
    ],
  },
  {
    title: "法的情報",
    links: [
      { to: "/privacy", label: "プライバシーポリシー" },
      { to: "/terms", label: "利用規約" },
      { to: "/disclaimer", label: "免責事項" },
    ],
  },
  {
    title: "サポート",
    links: [
      { to: "/contact", label: "お問い合わせ" },
      { to: "/advertise", label: "広告掲載" },
      { to: "/savings", label: "節約計算" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="OSSアルタナティブ" className="h-6 w-6 rounded-md" width={24} height={24} />
              <span className="font-bold text-sm tracking-tight text-foreground">OSSアルタナティブ</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              日本語で探せる、OSS代替ツールの比較サイト
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} OSSアルタナティブ. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground">
            すべてのOSSに感謝。
          </p>
        </div>
      </div>
    </footer>
  );
}

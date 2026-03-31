import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "サイト",
    links: [
      { to: "/about", label: "サイトについて" },
      { to: "/ranking", label: "ランキング" },
      { to: "/quiz", label: "診断ツール" },
      { to: "/news", label: "ニュース" },
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
      { to: "/savings", label: "節約計算" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm">
                O
              </div>
              <span className="font-bold text-lg tracking-tight">OSSアルタナティブ</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              有料SaaSの代わりに使えるオープンソースツールを日本語で紹介する比較メディア
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OSSアルタナティブ. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            オープンソースで自由を
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

const links = [
  { to: "/about", label: "サイトについて" },
  { to: "/privacy", label: "プライバシーポリシー" },
  { to: "/terms", label: "利用規約" },
  { to: "/disclaimer", label: "免責事項" },
  { to: "/contact", label: "お問い合わせ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container py-8 space-y-4">
        <div className="text-center">
          <p className="font-medium text-foreground">OSSアルタナティブ</p>
          <p className="mt-1 text-sm text-muted-foreground">オープンソースで自由を</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} OSSアルタナティブ
        </p>
      </div>
    </footer>
  );
}

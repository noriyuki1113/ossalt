import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const EXPLORE = [
  { to: "/alternatives", label: "サービス別の代替" },
  { to: "/compare", label: "OSS比較" },
  { to: "/ranking", label: "ランキング" },
  { to: "/selfhost-vps", label: "導入ガイド" },
];

const TRUST = [
  { to: "/about", label: "掲載・ランキングの方針" },
  { to: "/advertise", label: "スポンサー・提携掲載" },
  { to: "/submit", label: "掲載情報の提案" },
  { to: "/contact", label: "お問い合わせ" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">O</span>
              <span className="font-extrabold tracking-tight text-foreground">ossalt</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              SaaSを置き換えるためのOSSを、日本語で探し、比べ、導入判断まで進めるためのガイドです。
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              通常の検索順位・比較評価は、スポンサーや提携の有無で変わりません。
            </p>
          </div>

          <nav>
            <p className="text-xs font-bold tracking-wider text-foreground">探す</p>
            <div className="mt-4 grid gap-3">
              {EXPLORE.map((item) => <Link key={item.to} to={item.to} className="text-sm text-muted-foreground transition hover:text-primary">{item.label}</Link>)}
            </div>
          </nav>

          <nav>
            <p className="text-xs font-bold tracking-wider text-foreground">信頼と参加</p>
            <div className="mt-4 grid gap-3">
              {TRUST.map((item) => <Link key={item.to} to={item.to} className="text-sm text-muted-foreground transition hover:text-primary">{item.label}</Link>)}
            </div>
          </nav>

          <div>
            <p className="text-xs font-bold tracking-wider text-foreground">週1回のOSSアップデート</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">新しい代替候補と比較ガイドを受け取る。</p>
            <div className="mt-4"><NewsletterSignup compact /></div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ossalt</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/terms" className="hover:text-foreground">掲載ポリシー</Link>
            <Link to="/privacy" className="hover:text-foreground">プライバシー</Link>
            <Link to="/disclaimer" className="hover:text-foreground">免責事項</Link>
            <a href="https://github.com/ossalt-jp" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
              <Github className="h-3.5 w-3.5" /> GitHub <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

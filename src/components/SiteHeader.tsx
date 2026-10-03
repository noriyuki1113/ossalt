import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

const NAV_ITEMS = [
  { to: "/alternatives", label: "サービスから探す" },
  { to: "/compare", label: "比較する" },
  { to: "/selfhost-vps", label: "導入ガイド" },
  { to: "/ranking", label: "ランキング" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const keyword = search.trim();
    if (!keyword) return;
    navigate(`/?search=${encodeURIComponent(keyword)}`);
    setSearch("");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="OSSアルタナティブ ホーム">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">O</span>
          <span className="text-sm font-extrabold tracking-tight text-foreground sm:text-base">ossalt</span>
        </Link>

        <nav className="ml-3 hidden items-center gap-1 lg:flex" aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${location.pathname === item.to ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="relative ml-auto hidden w-56 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="サービス名で検索"
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </form>

        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground md:ml-0"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <form onSubmit={submitSearch} className="container relative pt-4">
            <Search className="pointer-events-none absolute left-7 top-1/2 mt-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="サービス名で検索"
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </form>
          <nav className="container grid gap-1 py-4" aria-label="モバイルナビゲーション">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

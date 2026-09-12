import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { mobileMenuStore } from "@/lib/mobile-menu";
import { useTheme } from "@/hooks/use-theme";

const ALTERNATIVES_NAV = [
  { to: "/alternatives/notion",           label: "Notion の代替" },
  { to: "/alternatives/slack",            label: "Slack の代替" },
  { to: "/alternatives/figma",            label: "Figma の代替" },
  { to: "/alternatives/jira",             label: "Jira の代替" },
  { to: "/alternatives/zapier",           label: "Zapier の代替" },
  { to: "/alternatives/airtable",         label: "Airtable の代替" },
  { to: "/alternatives/google-analytics", label: "Google Analytics の代替" },
  { to: "/alternatives/datadog",          label: "Datadog の代替" },
];

const COMPARE_NAV = [
  { to: "/compare/appflowy-vs-notion",        label: "AppFlowy vs Notion" },
  { to: "/compare/mattermost-vs-slack",       label: "Mattermost vs Slack" },
  { to: "/compare/penpot-vs-figma",           label: "Penpot vs Figma" },
  { to: "/compare/plane-vs-linear",           label: "Plane vs Linear" },
  { to: "/compare/n8n-vs-zapier",             label: "n8n vs Zapier" },
  { to: "/compare/posthog-vs-mixpanel",       label: "PostHog vs Mixpanel" },
  { to: "/compare/keycloak-vs-auth0",         label: "Keycloak vs Auth0" },
  { to: "/compare/glitchtip-vs-sentry",       label: "GlitchTip vs Sentry" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, _setMobileOpen] = useState(false);
  const setMobileOpen = (v: boolean | ((p: boolean) => boolean)) => {
    _setMobileOpen((prev) => {
      const next = typeof v === "function" ? (v as (p: boolean) => boolean)(prev) : v;
      mobileMenuStore.set(next);
      return next;
    });
  };
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    _setMobileOpen(false);
    mobileMenuStore.set(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      mobileMenuStore.set(false);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch("");
      setMobileOpen(false);
    }
  };

  const isActive = (to: string) => location.pathname === to;

  const Dropdown = ({
    id, label, items, allTo, allLabel,
  }: {
    id: string;
    label: string;
    items: { to: string; label: string }[];
    allTo: string;
    allLabel: string;
  }) => (
    <div
      className="relative"
      onMouseEnter={() => setOpenDropdown(id)}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdown === id ? "rotate-180" : ""}`} />
      </button>
      {openDropdown === id && (
        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-card shadow-lg py-1 z-50">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setOpenDropdown(null)}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <Link
              to={allTo}
              className="block px-4 py-2 text-sm text-primary font-medium hover:bg-secondary transition-colors"
              onClick={() => setOpenDropdown(null)}
            >
              {allLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt="OSSアルタナティブ" className="h-7 w-7 rounded-lg dark:ring-1 dark:ring-white/20" width={28} height={28} />
          <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
            OSSアルタナティブ
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <Dropdown
            id="alt"
            label="代替を探す"
            items={ALTERNATIVES_NAV}
            allTo="/alternatives"
            allLabel="すべて見る →"
          />
          <Dropdown
            id="compare"
            label="A vs B 比較"
            items={COMPARE_NAV}
            allTo="/compare"
            allLabel="比較一覧を見る →"
          />
          {[
            { to: "/", label: "ツールを探す" },
            { to: "/selfhost-vps", label: "導入ガイド" },
            { to: "/ranking", label: "ランキング" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1.5 text-sm transition-colors rounded-md ${
                isActive(item.to)
                  ? "text-foreground font-medium bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/ossalt-jp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
          >
            GitHub
          </a>
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="サービス名で検索…"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="h-8 w-48 rounded-lg border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
          />
        </form>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
          className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Mobile search shortcut */}
        <button
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="ツールを検索"
          onClick={() => setMobileOpen(true)}
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Mobile toggle */}
        <button
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
          aria-label="メニューを開く"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav fullscreen overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-card flex flex-col h-[100dvh]">
          <div className="flex h-14 items-center justify-between px-4 border-b border-border shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <img src="/logo.png" alt="OSSアルタナティブ" className="h-7 w-7 rounded-lg dark:ring-1 dark:ring-white/20" width={28} height={28} />
              <span className="font-semibold text-sm tracking-tight text-foreground">
                OSSアルタナティブ
              </span>
            </Link>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              aria-label="メニューを閉じる"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="px-4 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ツールを検索…"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </form>
          <nav
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-1"
            style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
          >
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-3 pt-1 pb-0.5">
              代替を探す
            </p>
            {ALTERNATIVES_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/alternatives"
              className="block px-3 py-2 text-sm text-primary font-medium hover:bg-secondary transition-colors rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              すべて見る →
            </Link>
            <div className="border-t border-border pt-2 mt-2">
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-3 pb-0.5">
                A vs B 比較
              </p>
              {COMPARE_NAV.slice(0, 4).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/compare"
                className="block px-3 py-2 text-sm text-primary font-medium hover:bg-secondary transition-colors rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                比較一覧を見る →
              </Link>
            </div>
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              {[
                { to: "/", label: "ツールを探す" },
                { to: "/selfhost-vps", label: "導入ガイド" },
                { to: "/ranking", label: "ランキング" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-3 py-2 text-sm transition-colors rounded-md ${
                    isActive(item.to)
                      ? "text-foreground font-medium bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

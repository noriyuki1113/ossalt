import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const NAV = [
  {
    label: "代替を探す",
    children: [
      { to: "/alternatives/notion", label: "Notion の代替" },
      { to: "/alternatives/slack", label: "Slack の代替" },
      { to: "/alternatives/figma", label: "Figma の代替" },
      { to: "/alternatives/jira", label: "Jira の代替" },
      { to: "/alternatives/zapier", label: "Zapier の代替" },
      { to: "/alternatives/airtable", label: "Airtable の代替" },
      { to: "/alternatives/google-analytics", label: "Google Analytics の代替" },
      { to: "/alternatives/datadog", label: "Datadog の代替" },
    ],
  },
  { to: "/ranking", label: "人気ツール" },
  { to: "/workspace", label: "比較する" },
  { to: "/advertise", label: "広告掲載" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch("");
      setMobileOpen(false);
    }
  };

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt="OSSアルタナティブ" className="h-7 w-7 rounded-lg" width={28} height={28} />
          <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground">
            OSSアルタナティブ
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {/* Dropdown: 代替を探す */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
              代替を探す
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-border bg-card shadow-lg py-1 z-50">
                {NAV[0].children!.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <Link
                    to="/ranking"
                    className="block px-4 py-2 text-sm text-primary font-medium hover:bg-secondary transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    すべて見る →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to!}
              className={`px-3 py-1.5 text-sm transition-colors rounded-md ${
                isActive(item.to!)
                  ? "text-foreground font-medium bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="ツールを検索…"
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="h-8 w-48 rounded-lg border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
          />
        </form>

        {/* Mobile toggle */}
        <button
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
          aria-label="メニューを開く"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-3 pt-1 pb-0.5">
            代替を探す
          </p>
          {NAV[0].children!.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border pt-2 mt-2 space-y-1">
            {NAV.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to!}
                className={`block px-3 py-2 text-sm transition-colors rounded-md ${
                  isActive(item.to!)
                    ? "text-foreground font-medium bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <form onSubmit={handleSearch} className="pt-2">
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
        </nav>
      )}
    </header>
  );
}

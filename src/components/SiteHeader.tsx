import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { href: "/products", label: "ツール一覧" },
  { href: "/categories", label: "カテゴリ" },
  { href: "/alternatives", label: "代替サービス" },
  { href: "/submit", label: "掲載申請" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <span className="text-gradient">AltFinder</span>
          <span className="text-muted-foreground text-xs font-normal">.jp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

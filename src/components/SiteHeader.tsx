import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { href: "/alternatives", label: "Alternatives" },
  { href: "/categories", label: "Categories" },
  { href: "/self-hosted-tools", label: "Self-hosted" },
  { href: "/articles", label: "Articles" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-foreground">
          AltFinder<span className="text-muted-foreground font-normal">.jp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/submit">
            <Button variant="ghost" size="sm" className="text-sm">Submit Tool</Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="outline" size="sm" className="text-sm rounded-lg">ログイン</Button>
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-3 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t mt-2 flex gap-2 px-3">
            <Link to="/submit" className="flex-1"><Button variant="ghost" size="sm" className="w-full">Submit Tool</Button></Link>
            <Link to="/admin/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">ログイン</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}

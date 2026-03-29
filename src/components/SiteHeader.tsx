import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-foreground">
          OSSアルタナティブ
        </Link>
        <p className="hidden md:block text-sm text-muted-foreground">
          有料SaaSの代わりに使えるオープンソースツール集
        </p>
      </div>
    </header>
  );
}

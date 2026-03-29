import { Link } from "react-router-dom";
import { ExternalLink, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/hooks/use-tools";

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function getFaviconUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const favicon = getFaviconUrl(tool.url);

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="block group rounded-xl border bg-card p-5 transition-all card-glow hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 50, 600)}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {favicon && (
            <img
              src={favicon}
              alt=""
              width={20}
              height={20}
              className="rounded shrink-0"
              loading="lazy"
            />
          )}
          <h3 className="font-semibold text-lg text-foreground leading-tight truncate">
            {tool.name}
          </h3>
        </div>
        {tool.stars_num && tool.stars_num > 0 ? (
          <Badge className="shrink-0 gap-1 font-medium text-xs bg-badge-amber/15 text-badge-amber border-badge-amber/30 hover:bg-badge-amber/20">
            <Star className="h-3 w-3 fill-current" />
            {formatStars(tool.stars_num)}
          </Badge>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tool.parent_category_ja && (
          <Badge variant="secondary" className="text-xs font-normal">
            {tool.parent_category_ja}
          </Badge>
        )}
        {tool.license && (
          <Badge variant="outline" className="text-xs font-normal">
            {tool.license}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {tool.url && (
          <span
            role="link"
            className="inline-flex items-center h-8 px-3 text-xs gap-1.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors cursor-pointer"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.url!, "_blank", "noopener,noreferrer"); }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            サイト
          </span>
        )}
        {tool.github_url && (
          <span
            role="link"
            className="inline-flex items-center h-8 px-3 text-xs gap-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.github_url!, "_blank", "noopener,noreferrer"); }}
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </span>
        )}
      </div>
    </Link>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 bg-muted rounded" />
          <div className="h-5 w-32 bg-muted rounded" />
        </div>
        <div className="h-5 w-14 bg-muted rounded-full" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 bg-muted rounded-full" />
        <div className="h-5 w-16 bg-muted rounded-full" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 bg-muted rounded-lg" />
        <div className="h-8 w-20 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

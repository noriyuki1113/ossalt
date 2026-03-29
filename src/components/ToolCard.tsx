import { Link } from "react-router-dom";
import { ExternalLink, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/hooks/use-tools";

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link to={`/tools/${tool.id}`} className="block group rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-lg text-foreground leading-tight">
          {tool.name}
        </h3>
        {tool.stars_num && tool.stars_num > 0 ? (
          <Badge variant="secondary" className="shrink-0 gap-1 font-medium text-xs">
            <Star className="h-3 w-3 fill-current text-badge-amber" />
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
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-lg" asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              サイト
            </a>
          </Button>
        )}
        {tool.github_url && (
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 rounded-lg" asChild>
            <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-5 w-32 bg-muted rounded" />
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

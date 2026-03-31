import { Link } from "react-router-dom";
import { ExternalLink, Github, Star, ArrowRight } from "lucide-react";
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

const LANG_COLORS: Record<string, string> = {
  Python: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  TypeScript: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Go: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Rust: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Ruby: "bg-red-500/10 text-red-400 border-red-500/20",
  Java: "bg-amber-700/10 text-amber-600 border-amber-700/20",
  Kotlin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Swift: "bg-orange-400/10 text-orange-300 border-orange-400/20",
  "C++": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  C: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  PHP: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

function getLanguageBadgeClass(lang: string): string {
  return LANG_COLORS[lang] || "bg-muted text-muted-foreground border-border";
}

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const favicon = getFaviconUrl(tool.url);
  const competitor = tool.primary_competitor_ja || tool.primary_competitor;

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all card-glow hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 40, 500)}ms`, animationFillMode: "both" }}
    >
      {/* Header: icon + name + stars */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {favicon ? (
            <>
              <img
                src={favicon}
                alt=""
                width={24}
                height={24}
                className="rounded-md shrink-0"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <span
                className="h-6 w-6 rounded-md bg-secondary text-muted-foreground text-xs font-bold items-center justify-center shrink-0 uppercase"
                style={{ display: 'none' }}
              >
                {tool.name?.charAt(0) || '?'}
              </span>
            </>
          ) : (
            <span className="h-6 w-6 rounded-md bg-secondary text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0 uppercase">
              {tool.name?.charAt(0) || '?'}
            </span>
          )}
          <h3 className="font-bold text-base text-foreground leading-tight truncate">
            {tool.name}
          </h3>
        </div>
        {tool.stars_num && tool.stars_num > 0 ? (
          <span className="shrink-0 flex items-center gap-1 text-xs text-badge-amber font-medium">
            <Star className="h-3 w-3 fill-current" />
            {formatStars(tool.stars_num)}
          </span>
        ) : null}
      </div>

      {/* Alternative badge */}
      {competitor && competitor !== "有料SaaS" && (
        <div className="mb-3">
          <span className="inline-flex items-center text-xs font-medium text-primary bg-primary/8 border border-primary/15 rounded-md px-2 py-0.5">
            {competitor} の代替
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {tool.language && (
          <Badge className={`text-[11px] font-normal border px-2 py-0 h-5 ${getLanguageBadgeClass(tool.language)}`}>
            {tool.language}
          </Badge>
        )}
        {tool.parent_category_ja && (
          <Badge variant="secondary" className="text-[11px] font-normal px-2 py-0 h-5">
            {tool.parent_category_ja}
          </Badge>
        )}
        {tool.license && (
          <Badge variant="outline" className="text-[11px] font-normal px-2 py-0 h-5">
            {tool.license}
          </Badge>
        )}
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/40">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:text-primary/80 transition-colors">
          詳細を見る
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
        <div className="ml-auto flex items-center gap-1">
          {tool.url && (
            <span
              role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.url!, "_blank", "noopener,noreferrer"); }}
            >
              <ExternalLink className="h-3 w-3" />
              サイト
            </span>
          )}
          {tool.github_url && (
            <span
              role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.github_url!, "_blank", "noopener,noreferrer"); }}
            >
              <Github className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-secondary rounded-md" />
          <div className="h-5 w-32 bg-secondary rounded" />
        </div>
        <div className="h-4 w-12 bg-secondary rounded" />
      </div>
      <div className="h-5 w-28 bg-secondary rounded-md mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-secondary rounded" />
        <div className="h-4 w-3/4 bg-secondary rounded" />
      </div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 w-16 bg-secondary rounded-md" />
        <div className="h-5 w-20 bg-secondary rounded-md" />
      </div>
      <div className="pt-3 border-t border-border/40">
        <div className="h-4 w-20 bg-secondary rounded" />
      </div>
    </div>
  );
}

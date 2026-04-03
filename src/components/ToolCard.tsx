import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github, Star, ArrowRight, GitFork, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/hooks/use-tools";

function formatCount(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function formatRelativeDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "今日";
    if (diffDays < 30) return `${diffDays}日前`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}ヶ月前`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears}年前`;
  } catch {
    return null;
  }
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

function getGithubAvatarUrl(githubUrl: string | null): string | null {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length > 0) return `https://github.com/${parts[0]}.png?size=64`;
  } catch {}
  return null;
}

function ToolIcon({ favicon, ghAvatar, name, size = 22 }: { favicon: string | null; ghAvatar: string | null; name: string | null; size?: number }) {
  const [src, setSrc] = useState<string | null>(favicon || ghAvatar);
  const s = `${size}px`;

  if (!src) {
    return (
      <span className="rounded-md bg-secondary text-muted-foreground font-bold flex items-center justify-center shrink-0 uppercase" style={{ width: s, height: s, fontSize: `${Math.round(size * 0.45)}px` }}>
        {name?.charAt(0) || "?"}
      </span>
    );
  }

  return (
    <img src={src} alt="" width={size} height={size} className="rounded-md shrink-0 bg-secondary" loading="lazy"
      onError={() => {
        if (src === favicon && ghAvatar) setSrc(ghAvatar);
        else setSrc(null);
      }}
    />
  );
}

const LANG_COLORS: Record<string, string> = {
  Python: "bg-blue-50 text-blue-600 border-blue-200",
  TypeScript: "bg-teal-50 text-teal-600 border-teal-200",
  JavaScript: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Go: "bg-cyan-50 text-cyan-600 border-cyan-200",
  Rust: "bg-orange-50 text-orange-600 border-orange-200",
  Ruby: "bg-red-50 text-red-600 border-red-200",
  Java: "bg-amber-50 text-amber-700 border-amber-200",
  Kotlin: "bg-purple-50 text-purple-600 border-purple-200",
  Swift: "bg-orange-50 text-orange-500 border-orange-200",
  "C++": "bg-pink-50 text-pink-600 border-pink-200",
  C: "bg-gray-50 text-gray-600 border-gray-200",
  PHP: "bg-indigo-50 text-indigo-600 border-indigo-200",
};

function getLanguageBadgeClass(lang: string): string {
  return LANG_COLORS[lang] || "bg-secondary text-muted-foreground border-border";
}

function getHighlightLabel(tool: Tool): { text: string; cls: string } | null {
  if (tool.stars_num && tool.stars_num >= 50000) return { text: "🔥 人気", cls: "bg-orange-50 text-orange-600 border border-orange-200" };
  if (tool.created_at) {
    const days = Math.floor((Date.now() - new Date(tool.created_at).getTime()) / 86400000);
    if (days <= 30) return { text: "🆕 新着", cls: "bg-emerald-50 text-emerald-600 border border-emerald-200" };
  }
  return null;
}

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const favicon = getFaviconUrl(tool.url);
  const ghAvatar = getGithubAvatarUrl(tool.github_url);
  const competitor = tool.primary_competitor_ja || tool.primary_competitor;
  const highlightLabel = getHighlightLabel(tool);

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm relative"
      style={{ animationDelay: `${Math.min(index * 40, 500)}ms`, animationFillMode: "both" }}
    >
      {/* Highlight label */}
      {highlightLabel && (
        <span className={`absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${highlightLabel.cls}`}>
          {highlightLabel.text}
        </span>
      )}

      {/* Alternative badge */}
      {competitor && competitor !== "有料SaaS" && (
        <div className="mb-2">
          <span className="inline-flex items-center text-[11px] font-medium text-primary bg-primary/8 border border-primary/15 rounded-md px-2 py-0.5">
            {competitor} の代替
          </span>
        </div>
      )}

      {/* Header: icon + name + stars */}
      <div className="flex items-start gap-3 mb-2 min-w-0">
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <ToolIcon favicon={favicon} ghAvatar={ghAvatar} name={tool.name} size={22} />
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1 break-all">
            {tool.name}
          </h3>
        </div>
        {tool.stars_num && tool.stars_num > 0 ? (
          <span className="shrink-0 flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Star className="h-3 w-3 fill-current" />
            {formatCount(tool.stars_num)}
          </span>
        ) : null}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed mb-3 flex-1 break-words">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {tool.language && (
          <Badge className={`text-[10px] font-normal border px-2 py-0 h-5 ${getLanguageBadgeClass(tool.language)}`}>
            {tool.language}
          </Badge>
        )}
        {tool.parent_category_ja && (
          <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0 h-5">
            {tool.parent_category_ja}
          </Badge>
        )}
        {tool.license && tool.license !== "NOASSERTION" && (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5">
            {tool.license}
          </Badge>
        )}
        {tool.forks_num && tool.forks_num > 0 ? (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5 gap-0.5">
            <GitFork className="h-2.5 w-2.5" />
            {formatCount(tool.forks_num)}
          </Badge>
        ) : null}
        {formatRelativeDate(tool.last_commit) && (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5 gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            {formatRelativeDate(tool.last_commit)}
          </Badge>
        )}
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2 transition-all">
          詳しく見る
          <ArrowRight className="h-3 w-3" />
        </span>
        <div className="ml-auto flex items-center gap-1">
          {tool.url && (
            <span
              role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.url!, "_blank", "noopener,noreferrer"); }}
            >
              <ExternalLink className="h-3 w-3" />
              サイト
            </span>
          )}
          {tool.github_url && (
            <span
              role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
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
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-secondary rounded-md" />
          <div className="h-4 w-28 bg-secondary rounded" />
        </div>
        <div className="h-4 w-12 bg-secondary rounded" />
      </div>
      <div className="h-4 w-full bg-secondary rounded mb-3" />
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 w-14 bg-secondary rounded-md" />
        <div className="h-5 w-18 bg-secondary rounded-md" />
      </div>
      <div className="pt-3 border-t border-border">
        <div className="h-4 w-20 bg-secondary rounded" />
      </div>
    </div>
  );
}

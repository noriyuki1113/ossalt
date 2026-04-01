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

function getHighlightLabel(tool: Tool): { text: string; cls: string } | null {
  if (tool.stars_num && tool.stars_num >= 50000) return { text: "🔥 人気", cls: "bg-orange-500/20 text-orange-400 border border-orange-500/30" };
  if (tool.created_at) {
    const days = Math.floor((Date.now() - new Date(tool.created_at).getTime()) / 86400000);
    if (days <= 30) return { text: "🆕 新着", cls: "bg-green-500/20 text-green-400 border border-green-500/30" };
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
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-all card-glow hover:-translate-y-0.5 animate-fade-in relative"
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
          <span className="inline-flex items-center text-[11px] font-medium text-accent bg-accent/10 border border-accent/15 rounded-md px-2 py-0.5">
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
          <span className="shrink-0 flex items-center gap-1 text-xs text-badge-amber font-medium">
            <Star className="h-3 w-3 fill-current" />
            {formatCount(tool.stars_num)} stars
          </span>
        ) : null}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed mb-3 flex-1 break-words">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
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
        {tool.license && tool.license !== "NOASSERTION" && (
          <Badge variant="outline" className="text-[11px] font-normal px-2 py-0 h-5">
            {tool.license}
          </Badge>
        )}
        {tool.forks_num && tool.forks_num > 0 ? (
          <Badge variant="outline" className="text-[11px] font-normal px-2 py-0 h-5 gap-0.5">
            <GitFork className="h-2.5 w-2.5" />
            {formatCount(tool.forks_num)}
          </Badge>
        ) : null}
        {formatRelativeDate(tool.last_commit) && (
          <Badge variant="outline" className="text-[11px] font-normal px-2 py-0 h-5 gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            {formatRelativeDate(tool.last_commit)}
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

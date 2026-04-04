import { Link } from "react-router-dom";
import { ExternalLink, Github, ArrowRight, GitFork, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { SaveToWorkspaceButton } from "@/components/workspace/SaveToWorkspaceButton";
import { formatRelativeDate, getLanguageBadgeClass, formatCount } from "@/lib/format";
import type { Tool } from "@/hooks/use-tools";

function getHighlightLabel(tool: Tool): { text: string; cls: string } | null {
  if (tool.stars_num && tool.stars_num >= 50000) return { text: "🔥 人気", cls: "bg-orange-50 text-orange-600 border border-orange-200" };
  if (tool.created_at) {
    const days = Math.floor((Date.now() - new Date(tool.created_at).getTime()) / 86400000);
    if (days <= 30) return { text: "🆕 新着", cls: "bg-emerald-50 text-emerald-600 border border-emerald-200" };
  }
  return null;
}

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const competitor = tool.primary_competitor_ja || tool.primary_competitor;
  const highlightLabel = getHighlightLabel(tool);

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group card-unified-hover p-5 flex flex-col relative"
      style={{ animationDelay: `${Math.min(index * 40, 500)}ms`, animationFillMode: "both" }}
    >
      {highlightLabel && (
        <span className={`absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${highlightLabel.cls}`}>
          {highlightLabel.text}
        </span>
      )}

      {competitor && (
        <div className="mb-2">
          <AlternativeBadge competitor={competitor} />
        </div>
      )}

      <div className="flex items-start gap-3 mb-2 min-w-0">
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={22} />
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1 break-all">
            {tool.name}
          </h3>
        </div>
        <StarCount count={tool.stars_num} size="sm" />
        <SaveToWorkspaceButton toolId={tool.id} toolName={tool.name || undefined} variant="icon" source="tool_card" />
      </div>

      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed mb-3 flex-1 break-words">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

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

      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
          詳しく見る
          <ArrowRight className="h-3 w-3" />
        </span>
        <div className="ml-auto flex items-center gap-1">
          {tool.url && (
            <span role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.url!, "_blank", "noopener,noreferrer"); }}>
              <ExternalLink className="h-3 w-3" />
              サイト
            </span>
          )}
          {tool.github_url && (
            <span role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(tool.github_url!, "_blank", "noopener,noreferrer"); }}>
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
    <div className="card-unified p-5 animate-pulse">
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

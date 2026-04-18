import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolIcon } from "@/components/ToolIcon";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { formatCount, getLanguageBadgeClass } from "@/lib/format";
import { isKnownCompetitor } from "@/lib/competitors";
import type { Tool } from "@/hooks/use-tools";
import { track } from "@/lib/track";

/**
 * Lightweight card optimised for category pickups & featured sections.
 * Shows only: name, short desc, 1-2 badges, star count, detail link.
 * No external image fetch beyond ToolIcon (favicon).
 */
export function ToolCardCompact({
  tool,
  trackSource,
}: {
  tool: Tool;
  trackSource?: string;
}) {
  // Validate using the English canonical name; display Japanese name if available
  const competitor = isKnownCompetitor(tool.primary_competitor)
    ? (tool.primary_competitor_ja || tool.primary_competitor)
    : null;

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group card-unified-hover p-4 flex flex-col"
      onClick={() =>
        trackSource &&
        track("pickup_card_click", { tool: tool.name ?? "", source: trackSource })
      }
    >
      {/* Header: icon + name + stars */}
      <div className="flex items-center gap-2 mb-1.5 min-w-0">
        <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={20} />
        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1 flex-1 min-w-0 break-all group-hover:text-primary transition-colors">
          {tool.name}
        </h3>
        {tool.stars_num != null && tool.stars_num > 0 && (
          <span className="text-[11px] text-muted-foreground shrink-0">
            ⭐ {formatCount(tool.stars_num)}
          </span>
        )}
      </div>

      {/* Alternative badge */}
      {competitor && (
        <div className="mb-1.5">
          <AlternativeBadge competitor={competitor} size="sm" />
        </div>
      )}

      {/* Short description */}
      <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed mb-2 flex-1">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      {/* 1-2 badges max */}
      <div className="flex items-center gap-1.5 mb-2">
        {tool.language && (
          <Badge className={`text-[10px] font-normal border px-1.5 py-0 h-[18px] ${getLanguageBadgeClass(tool.language)}`}>
            {tool.language}
          </Badge>
        )}
        {tool.parent_category_ja && (
          <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-[18px]">
            {tool.parent_category_ja}
          </Badge>
        )}
      </div>

      {/* CTA */}
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary group-hover:gap-1.5 transition-all duration-200">
        詳しく見る
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

export function ToolCardCompactSkeleton() {
  return (
    <div className="card-unified p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-5 bg-secondary rounded" />
        <div className="h-4 w-24 bg-secondary rounded flex-1" />
        <div className="h-3 w-10 bg-secondary rounded" />
      </div>
      <div className="h-3 w-full bg-secondary rounded mb-2" />
      <div className="flex gap-1.5 mb-2">
        <div className="h-[18px] w-12 bg-secondary rounded" />
      </div>
      <div className="h-3 w-16 bg-secondary rounded" />
    </div>
  );
}

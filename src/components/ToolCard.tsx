import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, Github, ArrowRight, GitFork, Clock, Container, ShieldCheck, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { AlternativeBadge } from "@/components/AlternativeBadge";

import { formatRelativeDate, getLanguageBadgeClass, formatCount } from "@/lib/format";
import { getSelfhostGuideLink } from "@/lib/selfhost-guides";
import { track } from "@/lib/track";
import type { AlternativeListing } from "@/hooks/use-alternatives";

function isInactive(listing: AlternativeListing): boolean {
  if (!listing.last_commit_at) return false;
  const daysSince = (Date.now() - new Date(listing.last_commit_at).getTime()) / 86400000;
  return daysSince > 365;
}

function getHighlightLabel(listing: AlternativeListing): { text: string; cls: string } | null {
  if (isInactive(listing)) return { text: "⚠️ 非活発", cls: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20" };
  if (listing.stars_count && listing.stars_count >= 50000) return { text: "🔥 人気", cls: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
  if (listing.project_created_at) {
    const days = Math.floor((Date.now() - new Date(listing.project_created_at).getTime()) / 86400000);
    if (days <= 30) return { text: "🆕 新着", cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
  }
  return null;
}

export const ToolCard = memo(function ToolCard({ listing, index = 0 }: { listing: AlternativeListing; index?: number }) {
  const navigate = useNavigate();
  const name = listing.project_name_ja || listing.project_name;
  const competitor = listing.product_name_ja || listing.product_name;
  const highlightLabel = getHighlightLabel(listing);
  const guideLink = getSelfhostGuideLink(listing.project_name);

  return (
    <Link
      to={`/tools/${listing.project_slug}`}
      className="group card-unified-hover p-5 flex flex-col relative animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, animationFillMode: "both" }}
      onMouseEnter={() => { void import("@/pages/ToolDetail"); }}
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
          <ToolIcon url={listing.official_url} githubUrl={listing.repository_url} name={name} size={22} />
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1 break-all">
            {name}
          </h3>
        </div>
        <StarCount count={listing.stars_count} size="sm" />
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1 break-words">
        {listing.short_description_ja || "説明なし"}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {listing.primary_language && (
          <Badge className={`text-[10px] font-normal border px-2 py-0 h-5 ${getLanguageBadgeClass(listing.primary_language)}`}>
            {listing.primary_language}
          </Badge>
        )}
        {listing.category && (
          <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0 h-5">
            {listing.category}
          </Badge>
        )}
        {listing.license_spdx && (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5">
            {listing.license_spdx}
          </Badge>
        )}
        {listing.forks_count && listing.forks_count > 0 ? (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5 gap-0.5">
            <GitFork className="h-2.5 w-2.5" />
            {formatCount(listing.forks_count)}
          </Badge>
        ) : null}
        {formatRelativeDate(listing.last_commit_at) && (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5 gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            {formatRelativeDate(listing.last_commit_at)}
          </Badge>
        )}
        {listing.verification_state === "verified" && (
          <Badge className="text-[10px] font-normal border px-2 py-0 h-5 gap-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <ShieldCheck className="h-2.5 w-2.5" />
            確認済み
          </Badge>
        )}
        {listing.docker_available && (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5 gap-0.5 text-sky-400 border-sky-500/20 bg-sky-500/10">
            <Container className="h-2.5 w-2.5" />
            Docker
          </Badge>
        )}
      </div>

      {guideLink && (
        <span
          role="link"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            track("tool_card_guide_click", { tool_slug: listing.project_slug, tool_name: name ?? "" });
            navigate(guideLink);
          }}
          className="mb-3 -mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline w-fit cursor-pointer"
        >
          <Server className="h-3 w-3" />
          セルフホストガイドを見る
        </span>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
          詳しく見る
          <ArrowRight className="h-3 w-3" />
        </span>
        <div className="ml-auto flex items-center gap-1">
          {listing.official_url && (
            <span role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(listing.official_url!, "_blank", "noopener,noreferrer"); }}>
              <ExternalLink className="h-3 w-3" />
              サイト
            </span>
          )}
          {listing.repository_url && (
            <span role="link"
              className="inline-flex items-center h-7 px-2.5 text-[11px] gap-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  track("external_link_click", {
                    provider: "github",
                    tool_slug: listing.project_slug,
                    tool_name: name ?? "",
                    link_url: listing.repository_url!,
                    cta_label: "GitHub",
                    source: "tool_card",
                  });
                } catch { /* best effort */ }
                window.open(listing.repository_url!, "_blank", "noopener,noreferrer");
              }}>
              <Github className="h-3 w-3" />
              GitHub
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

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

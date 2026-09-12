import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Container, ExternalLink, Github, ShieldCheck, Star } from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { formatCount, formatRelativeDate } from "@/lib/format";
import { isKnownCompetitor } from "@/lib/competitors";
import { getSelfhostGuideLink } from "@/lib/selfhost-guides";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

function statusLabel(tool: Tool) {
  if (tool.last_commit && (Date.now() - new Date(tool.last_commit).getTime()) / 86400000 > 365) return "更新状況を要確認";
  if (tool.github_stars_updated_at) return "GitHub情報あり";
  return "公式情報を確認";
}

export const ToolCard = memo(function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const navigate = useNavigate();
  const competitor = isKnownCompetitor(tool.primary_competitor)
    ? (tool.primary_competitor_ja || tool.primary_competitor)
    : null;
  const guideLink = getSelfhostGuideLink(tool.name);
  const updated = formatRelativeDate(tool.last_commit);

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group relative flex min-h-[270px] flex-col rounded-2xl border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_22px_48px_-30px_rgba(13,201,172,0.5)] animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 35, 350)}ms`, animationFillMode: "both" }}
      onMouseEnter={() => { void import("@/pages/ToolDetail"); }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={32} id={tool.id} />
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-foreground">{tool.name}</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{tool.parent_category_ja || "OSSツール"}</p>
          </div>
        </div>
        {tool.stars_num != null && tool.stars_num > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-400">
            <Star className="h-3 w-3 fill-current" /> {formatCount(tool.stars_num)}
          </span>
        )}
      </div>

      {competitor && <div className="mt-4"><AlternativeBadge competitor={competitor} /></div>}

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {tool.description_ja || tool.description_en || "説明を準備中です。"}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tool.license && tool.license !== "NOASSERTION" && <span className="rounded-md border border-border bg-background/60 px-2 py-1 text-[10px] text-muted-foreground">{tool.license}</span>}
        {tool.language && <span className="rounded-md border border-border bg-background/60 px-2 py-1 text-[10px] text-muted-foreground">{tool.language}</span>}
        {tool.docker_available && <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] text-primary"><Container className="h-3 w-3" />Docker</span>}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span>{statusLabel(tool)}</span>
          {updated && <span className="ml-auto inline-flex items-center gap-1"><Clock className="h-3 w-3" />{updated}</span>}
        </div>
        <div className="mt-3 flex items-center">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">導入条件を見る <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          <div className="ml-auto flex items-center gap-1">
            {guideLink && (
              <span
                role="link"
                tabIndex={0}
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); track("tool_card_guide_click", { tool_id: tool.id, tool_name: tool.name ?? "" }); navigate(guideLink); }}
                className="rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground"
              >ガイド</span>
            )}
            {tool.url && <span role="link" onClick={(event) => { event.preventDefault(); event.stopPropagation(); window.open(tool.url!, "_blank", "noopener,noreferrer"); }} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /></span>}
            {tool.github_url && <span role="link" onClick={(event) => { event.preventDefault(); event.stopPropagation(); track("external_link_click", { provider: "github", tool_id: tool.id, tool_name: tool.name ?? "", link_url: tool.github_url!, source: "tool_card" }); window.open(tool.github_url!, "_blank", "noopener,noreferrer"); }} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Github className="h-3.5 w-3.5" /></span>}
          </div>
        </div>
      </div>
    </Link>
  );
});

export function ToolCardSkeleton() {
  return (
    <div className="min-h-[270px] animate-pulse rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-lg bg-secondary" /><div className="h-4 w-28 rounded bg-secondary" /></div>
      <div className="mt-6 h-4 w-full rounded bg-secondary" /><div className="mt-2 h-4 w-4/5 rounded bg-secondary" />
      <div className="mt-6 flex gap-2"><div className="h-5 w-16 rounded bg-secondary" /><div className="h-5 w-12 rounded bg-secondary" /></div>
      <div className="mt-16 h-4 w-24 rounded bg-secondary" />
    </div>
  );
}

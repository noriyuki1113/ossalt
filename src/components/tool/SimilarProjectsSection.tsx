import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { isKnownCompetitor } from "@/lib/competitors";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

interface SimilarProjectsSectionProps {
  tools: Tool[];
  currentTool: Tool;
  competitorDisplay: string | null;
  hasCompetitor: boolean;
  altSlug: string | undefined;
}

function SimilarCard({ tool }: { tool: Tool }) {
  const competitor = isKnownCompetitor(tool.primary_competitor)
    ? (tool.primary_competitor_ja || tool.primary_competitor)
    : null;

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-center gap-2.5 mb-2 min-w-0">
        <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={24} id={tool.id} />
        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate flex-1 min-w-0">
          {tool.name}
        </h4>
        <StarCount count={tool.stars_num} size="sm" />
      </div>

      {competitor && (
        <div className="mb-2">
          <AlternativeBadge competitor={competitor} size="sm" />
        </div>
      )}

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
        {tool.description_ja || tool.description_en || ""}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary group-hover:gap-1.5 transition-all">
          詳しく見る <ArrowRight className="h-3 w-3" />
        </span>
        {tool.github_url && (
          <span
            role="link"
            tabIndex={0}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                track("external_link_click", {
                  provider: "github",
                  tool_id: tool.id,
                  tool_name: tool.name ?? "",
                  link_url: tool.github_url!,
                  cta_label: "GitHub",
                  source: "similar_projects",
                });
              } catch { /* best effort */ }
              window.open(tool.github_url!, "_blank", "noopener,noreferrer");
            }}
          >
            <Github className="h-3 w-3" /> GitHub
          </span>
        )}
      </div>
    </Link>
  );
}

export function SimilarProjectsSection({
  tools,
  currentTool,
  competitorDisplay,
  hasCompetitor,
  altSlug,
}: SimilarProjectsSectionProps) {
  if (!tools.length) return null;

  const title = hasCompetitor
    ? `${competitorDisplay}の他のOSS代替`
    : `${currentTool.parent_category_ja || "関連"}の人気OSSツール`;

  const subtitle = hasCompetitor
    ? `${currentTool.name}と同様に${competitorDisplay}の代替として使えるOSS`
    : `${currentTool.parent_category_ja || "同カテゴリ"}の注目プロジェクト`;

  return (
    <section className="py-10">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        {altSlug && hasCompetitor && (
          <Link
            to={`/alternatives/${altSlug}`}
            className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          >
            すべて見る <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((t) => (
          <SimilarCard key={t.id} tool={t} />
        ))}
      </div>

      {altSlug && hasCompetitor && (
        <div className="mt-5 text-center">
          <Link
            to={`/alternatives/${altSlug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 rounded-xl px-5 py-2.5 hover:bg-primary/5 transition-colors"
          >
            {competitorDisplay}の全代替ツールを比較する
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}

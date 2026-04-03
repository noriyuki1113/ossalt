import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/SectionHeader";
import { StarCount } from "@/components/StarCount";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { ToolIcon } from "@/components/ToolIcon";
import { formatCount, getLanguageBadgeClass } from "@/lib/format";
import type { Tool } from "@/hooks/use-tools";

export function FeaturedTools() {
  const { data: tools, isLoading } = useQuery({
    queryKey: ["featured-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(6);
      if (error) throw error;
      return data as Tool[];
    },
  });

  return (
    <section className="container py-12 md:py-20">
      <SectionHeader title="注目のOSSプロジェクト" subtitle="GitHubスター数が多く、実績のあるOSS" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <FeaturedSkeleton key={i} />)
          : tools?.map((tool, i) => <FeaturedCard key={tool.id} tool={tool} rank={i + 1} />)
        }
      </div>
    </section>
  );
}

function FeaturedCard({ tool, rank }: { tool: Tool; rank: number }) {
  const competitor = tool.primary_competitor_ja || tool.primary_competitor;
  const langClass = tool.language ? getLanguageBadgeClass(tool.language) : null;

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group card-unified-hover p-5 relative flex flex-col"
    >
      <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        #{rank}
      </span>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={24} />
          <h3 className="font-bold text-[15px] text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {tool.name}
          </h3>
        </div>
        <StarCount count={tool.stars_num} />
      </div>

      {competitor && (
        <div className="mb-2">
          <AlternativeBadge competitor={competitor} />
        </div>
      )}

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {tool.language && langClass && (
          <Badge className={`text-[10px] font-normal border px-2 py-0 h-5 ${langClass}`}>
            {tool.language}
          </Badge>
        )}
        {tool.parent_category_ja && (
          <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0 h-5">
            {tool.parent_category_ja}
          </Badge>
        )}
        {tool.forks_num && tool.forks_num > 0 && (
          <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5 gap-0.5">
            <GitFork className="h-2.5 w-2.5" />
            {formatCount(tool.forks_num)}
          </Badge>
        )}
      </div>

      <div className="pt-3 border-t border-border/60">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
          詳しく見る
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="card-unified p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-32 bg-secondary rounded" />
        <div className="h-5 w-14 bg-secondary rounded" />
      </div>
      <div className="h-4 w-24 bg-secondary rounded mb-2" />
      <div className="h-4 w-full bg-secondary rounded mb-1" />
      <div className="h-4 w-3/4 bg-secondary rounded mb-3" />
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 w-16 bg-secondary rounded-md" />
        <div className="h-5 w-20 bg-secondary rounded-md" />
      </div>
      <div className="pt-3 border-t border-border">
        <div className="h-4 w-20 bg-secondary rounded" />
      </div>
    </div>
  );
}

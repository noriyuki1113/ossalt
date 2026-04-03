import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Star, ArrowRight, GitFork, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/hooks/use-tools";

function formatCount(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

const LANG_COLORS: Record<string, string> = {
  Python: "bg-blue-50 text-blue-600 border-blue-200",
  TypeScript: "bg-teal-50 text-teal-600 border-teal-200",
  JavaScript: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Go: "bg-cyan-50 text-cyan-600 border-cyan-200",
  Rust: "bg-orange-50 text-orange-600 border-orange-200",
  Ruby: "bg-red-50 text-red-600 border-red-200",
  Java: "bg-amber-50 text-amber-700 border-amber-200",
};

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
    <section className="container py-16 md:py-20">
      <div className="text-center mb-10">
        <div className="section-badge-primary">
          <Trophy className="h-3.5 w-3.5" />
          注目プロジェクト
        </div>
        <h2 className="section-title">注目のOSSプロジェクト</h2>
        <p className="section-subtitle">GitHubスター数が多く、実績のあるOSS</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
  const langClass = tool.language ? (LANG_COLORS[tool.language] || "bg-secondary text-muted-foreground border-border") : null;

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group card-unified-hover p-5 relative flex flex-col"
    >
      {/* Rank */}
      <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        #{rank}
      </span>

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[15px] text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>
        {tool.stars_num && tool.stars_num > 0 && (
          <span className="shrink-0 flex items-center gap-1 text-sm font-semibold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-current" />
            {formatCount(tool.stars_num)}
          </span>
        )}
      </div>

      {competitor && competitor !== "有料SaaS" && (
        <span className="inline-flex items-center self-start text-[11px] font-medium text-primary bg-primary/10 rounded-md px-2 py-0.5 mb-2">
          {competitor} の代替
        </span>
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

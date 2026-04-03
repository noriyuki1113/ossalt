import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { StarCount } from "@/components/StarCount";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { ToolIcon } from "@/components/ToolIcon";
import { formatRelativeDate } from "@/lib/format";
import type { Tool } from "@/hooks/use-tools";

export function NewToolsSection() {
  const { data: tools, isLoading } = useQuery({
    queryKey: ["new-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false, nullsFirst: false })
        .limit(6);
      if (error) throw error;
      return data as Tool[];
    },
  });

  return (
    <section className="container py-12 md:py-20">
      <SectionHeader title="最近追加されたツール" subtitle="新しく掲載されたOSSツール" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <NewToolSkeleton key={i} />)
          : tools?.map((tool) => <NewToolCard key={tool.id} tool={tool} />)
        }
      </div>
    </section>
  );
}

function NewToolCard({ tool }: { tool: Tool }) {
  const competitor = tool.primary_competitor_ja || tool.primary_competitor;
  const addedDate = formatRelativeDate(tool.created_at);

  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group card-unified-hover px-4 py-3.5 relative"
    >
      <span className="absolute -top-2 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
        🆕 新着
      </span>

      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>
        <StarCount count={tool.stars_num} size="sm" />
      </div>

      {competitor && (
        <div className="mb-1">
          <AlternativeBadge competitor={competitor} size="sm" />
        </div>
      )}

      <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed mb-2">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/60">
          {addedDate ? `${addedDate}に追加` : ""}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary group-hover:gap-1.5 transition-all duration-200">
          詳細
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function NewToolSkeleton() {
  return (
    <div className="card-unified px-4 py-3.5 animate-pulse">
      <div className="h-4 w-28 bg-secondary rounded mb-2" />
      <div className="h-3 w-full bg-secondary rounded mb-2" />
      <div className="h-3 w-16 bg-secondary rounded" />
    </div>
  );
}

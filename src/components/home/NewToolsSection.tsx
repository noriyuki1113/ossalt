import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Sparkles } from "lucide-react";
import type { Tool } from "@/hooks/use-tools";

function formatCount(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function formatRelativeDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (diff < 1) return "今日";
    if (diff < 30) return `${diff}日前`;
    const months = Math.floor(diff / 30);
    if (months < 12) return `${months}ヶ月前`;
    return `${Math.floor(months / 12)}年前`;
  } catch { return null; }
}

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
    <section className="container py-16 md:py-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-4 text-emerald-600 bg-emerald-50">
          <Sparkles className="h-3.5 w-3.5" />
          新着
        </div>
        <h2 className="section-title">最近追加されたツール</h2>
        <p className="section-subtitle">新しく掲載されたOSSツール</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
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
        {tool.stars_num && tool.stars_num > 0 && (
          <span className="shrink-0 flex items-center gap-0.5 text-[11px] text-amber-600 font-medium">
            <Star className="h-3 w-3 fill-current" />
            {formatCount(tool.stars_num)}
          </span>
        )}
      </div>

      {competitor && competitor !== "有料SaaS" && (
        <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5 mb-1">
          {competitor} の代替
        </span>
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

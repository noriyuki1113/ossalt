import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
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
    <section className="container py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            注目の<span className="text-gradient">OSS</span>プロジェクト
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            GitHub スター数が多い人気のOSS
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ToolCardSkeleton key={i} />)
          : tools?.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)
        }
      </div>
    </section>
  );
}

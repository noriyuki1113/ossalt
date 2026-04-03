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
    <section className="container py-14">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          注目のOSSプロジェクト
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          GitHubスター数が多い人気のOSS
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ToolCardSkeleton key={i} />)
          : tools?.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)
        }
      </div>
    </section>
  );
}

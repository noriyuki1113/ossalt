import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ToolIcon } from "@/components/ToolIcon";
import { formatCount } from "@/lib/format";
import type { Tool } from "@/hooks/use-tools";

export function FeaturedToolsRail() {
  const railRef = useRef<HTMLDivElement>(null);

  const { data: tools } = useQuery({
    queryKey: ["featured-tools-rail"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, url, github_url, description_ja, description_en, parent_category_ja, primary_competitor, stars_num")
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(16);
      if (error) throw error;
      return data as Tool[];
    },
    staleTime: 1000 * 60 * 10,
  });

  const scroll = (dir: "left" | "right") => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (!tools?.length) return null;

  return (
    <section className="py-10 md:py-14 border-t border-border">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">
              注目のOSSプロジェクト
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">GitHubスター数トップ</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="左にスクロール"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="右にスクロール"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="group shrink-0 snap-start w-52 rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-center gap-2.5">
                <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={28} />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  {tool.stars_num != null && (
                    <p className="text-[10px] text-muted-foreground">
                      ⭐ {formatCount(tool.stars_num)}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                {tool.description_ja || tool.description_en || "説明なし"}
              </p>
              {tool.primary_competitor && (
                <span className="text-[10px] text-primary/80 font-medium">
                  {tool.primary_competitor} の代替
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

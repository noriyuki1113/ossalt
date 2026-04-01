import { Link } from "react-router-dom";
import { Server, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tool } from "@/hooks/use-tools";

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

export function SelfHostSection() {
  const { data: tools } = useQuery({
    queryKey: ["self-host-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .not("primary_competitor", "is", null)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(8);
      if (error) throw error;
      return data as Tool[];
    },
  });

  if (!tools || tools.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="rounded-2xl border border-border/60 bg-card/50 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              セルフホスト向け特集
            </h2>
            <p className="text-sm text-muted-foreground">
              自前サーバーで運用できる人気のOSSツール
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="group flex min-w-0 w-full items-center gap-3 overflow-hidden rounded-lg border border-border/40 bg-background/50 p-3 hover:border-primary/20 transition-all"
            >
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {tool.name}
                </p>
                {tool.primary_competitor_ja && (
                  <p className="text-[11px] text-muted-foreground truncate">
                    {tool.primary_competitor_ja} の代替
                  </p>
                )}
              </div>
              <span className="text-xs text-badge-amber shrink-0">
                ⭐ {formatStars(tool.stars_num)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

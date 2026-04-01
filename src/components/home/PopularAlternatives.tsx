import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AlternativeGroup {
  competitor: string;
  count: number;
  topTool: string;
  topToolId: number;
}

export function PopularAlternatives() {
  const { data: groups } = useQuery({
    queryKey: ["popular-alternatives"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, primary_competitor, primary_competitor_ja, stars_num")
        .not("primary_competitor", "is", null)
        .not("primary_competitor", "eq", "有料SaaS")
        .order("stars_num", { ascending: false, nullsFirst: false });
      if (error) throw error;

      const map = new Map<string, { count: number; topTool: string; topToolId: number; label: string }>();
      for (const t of data || []) {
        const key = t.primary_competitor!;
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            count: 1,
            topTool: t.name || "",
            topToolId: t.id,
            label: t.primary_competitor_ja || key,
          });
        } else {
          existing.count++;
        }
      }

      return Array.from(map.entries())
        .map(([k, v]) => ({ competitor: v.label, count: v.count, topTool: v.topTool, topToolId: v.topToolId }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
    },
  });

  if (!groups || groups.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          よく比較される<span className="text-gradient">代替サービス</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          人気SaaSに対するOSS代替ツール
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((g) => (
          <Link
            key={g.competitor}
            to={`/tools/${g.topToolId}`}
            className="group rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/20 hover:-translate-y-0.5"
          >
            <p className="font-semibold text-sm text-foreground mb-1">{g.competitor}</p>
            <p className="text-xs text-muted-foreground mb-3">
              {g.count}件のOSS代替あり
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-medium">
                人気: {g.topTool}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

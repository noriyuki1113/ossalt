import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AlternativeGroup {
  competitor: string;
  count: number;
  topTool: string;
  topToolId: number;
  secondTool?: string;
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

      const map = new Map<string, { count: number; topTool: string; topToolId: number; label: string; secondTool?: string }>();
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
          if (!existing.secondTool) existing.secondTool = t.name || "";
        }
      }

      return Array.from(map.entries())
        .map(([, v]) => ({ competitor: v.label, count: v.count, topTool: v.topTool, topToolId: v.topToolId, secondTool: v.secondTool }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    },
  });

  if (!groups || groups.length === 0) return null;

  return (
    <section id="popular-alternatives" className="container py-14">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          よく比較される代替サービス
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          人気SaaSに対するOSS代替ツール
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {groups.map((g) => (
          <Link
            key={g.competitor}
            to={`/tools/${g.topToolId}`}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground">{g.competitor}</h3>
              <span className="text-[11px] text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                {g.count}件の代替
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              人気: {g.topTool}{g.secondTool ? `、${g.secondTool}` : ""}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
              詳細
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

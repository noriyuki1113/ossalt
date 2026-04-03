import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/SectionHeader";

const SAAS_META: Record<string, { icon: string }> = {
  Zapier:             { icon: "⚡" },
  Notion:             { icon: "📝" },
  "Google Analytics": { icon: "📊" },
  Shopify:            { icon: "🛒" },
  Asana:              { icon: "✅" },
  Datadog:            { icon: "🐶" },
  Slack:              { icon: "💬" },
  Figma:              { icon: "🎨" },
  Zendesk:            { icon: "🎧" },
  Jira:               { icon: "📋" },
  "Google Workspace": { icon: "📧" },
};

const PRIORITY = ["Notion", "Slack", "Google Analytics", "Zapier", "Datadog"];

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

      const map = new Map<string, {
        count: number; topTool: string; topToolId: number;
        label: string; key: string; secondTool?: string;
      }>();

      for (const t of data || []) {
        const key = t.primary_competitor!;
        const existing = map.get(key);
        if (!existing) {
          map.set(key, { count: 1, topTool: t.name || "", topToolId: t.id, label: t.primary_competitor_ja || key, key });
        } else {
          existing.count++;
          if (!existing.secondTool) existing.secondTool = t.name || "";
        }
      }

      const sorted = Array.from(map.values()).sort((a, b) => {
        const ai = PRIORITY.indexOf(a.key);
        const bi = PRIORITY.indexOf(b.key);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return b.count - a.count;
      });

      return sorted.slice(0, 5).map((v) => ({
        competitor: v.key, competitorJa: v.label, count: v.count,
        topTool: v.topTool, topToolId: v.topToolId, secondTool: v.secondTool,
      }));
    },
  });

  if (!groups || groups.length === 0) return null;

  return (
    <section id="popular-alternatives" className="container py-12 md:py-20 px-4 md:px-8">
      <SectionHeader title="人気の乗り換え候補" />

      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-3 scrollbar-hide max-w-6xl mx-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        {groups.map((g) => {
          const meta = SAAS_META[g.competitor];
          return (
            <Link
              key={g.competitor}
              to={`/tools/${g.topToolId}`}
              className="group card-unified-hover p-5 min-w-[220px] flex-1 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{meta?.icon ?? "🔄"}</span>
                <span className="font-semibold text-sm text-foreground">{g.competitorJa}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-sm text-primary font-medium truncate">{g.topTool}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 flex-1">
                {g.topTool}{g.secondTool ? `、${g.secondTool}` : ""}など{g.count}件のOSS代替
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground border border-border rounded-lg px-4 py-2 justify-center group-hover:text-primary group-hover:border-primary/30 transition-all">
                詳細
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

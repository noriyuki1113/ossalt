import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/SectionHeader";

const SAAS_META: Record<string, { icon: string; shortJa: string }> = {
  Zapier:             { icon: "⚡", shortJa: "Zapier" },
  Notion:             { icon: "📝", shortJa: "Notion" },
  "Google Analytics": { icon: "📊", shortJa: "Google Analytics" },
  Shopify:            { icon: "🛒", shortJa: "Shopify" },
  Asana:              { icon: "✅", shortJa: "Asana" },
  Datadog:            { icon: "🐶", shortJa: "Datadog" },
  Slack:              { icon: "💬", shortJa: "Slack" },
  Figma:              { icon: "🎨", shortJa: "Figma" },
  Zendesk:            { icon: "🎧", shortJa: "Zendesk" },
  Jira:               { icon: "📋", shortJa: "Jira" },
  "Google Workspace": { icon: "📧", shortJa: "Google Workspace" },
  "Auth0":            { icon: "🔐", shortJa: "Auth0" },
  "Okta":             { icon: "🔑", shortJa: "Okta" },
  "Bubble":           { icon: "🫧", shortJa: "Bubble" },
  "Claude Code":      { icon: "🤖", shortJa: "Claude Code" },
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
        key: string; secondTool?: string;
      }>();

      for (const t of data || []) {
        const key = t.primary_competitor!;
        const existing = map.get(key);
        if (!existing) {
          map.set(key, { count: 1, topTool: t.name || "", topToolId: t.id, key });
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
        competitor: v.key, count: v.count,
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
          const displayName = meta?.shortJa ?? g.competitor;
          return (
            <Link
              key={g.competitor}
              to={`/tools/${g.topToolId}`}
              className="group card-unified-hover p-4 md:p-5 min-w-[180px] md:min-w-[210px] flex-1 flex flex-col snap-start"
            >
              {/* SaaS name */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{meta?.icon ?? "🔄"}</span>
                <span className="font-semibold text-sm text-foreground">{displayName}</span>
              </div>

              {/* Arrow + top OSS */}
              <div className="flex items-center gap-1.5 mb-3">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                <span className="text-sm text-primary font-medium truncate">{g.topTool}</span>
              </div>

              {/* Count */}
              <p className="text-[11px] text-muted-foreground mb-4 flex-1">
                {g.count}件のOSS代替あり
              </p>

              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground border border-border rounded-lg px-4 py-2 justify-center group-hover:text-primary group-hover:border-primary/30 transition-all">
                詳細を見る
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

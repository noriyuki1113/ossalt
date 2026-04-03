import { Link } from "react-router-dom";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** SaaS descriptions for richer cards */
const SAAS_META: Record<string, { desc: string; icon: string }> = {
  Zapier:            { desc: "ノーコード自動化ツール",       icon: "⚡" },
  Notion:            { desc: "オールインワン ワークスペース", icon: "📝" },
  "Google Analytics":{ desc: "Webアクセス解析",            icon: "📊" },
  Shopify:           { desc: "ECプラットフォーム",           icon: "🛒" },
  Asana:             { desc: "プロジェクト管理",             icon: "✅" },
  Datadog:           { desc: "インフラ監視・モニタリング",     icon: "🐶" },
  Slack:             { desc: "チームチャット",               icon: "💬" },
  Figma:             { desc: "UIデザインツール",             icon: "🎨" },
  Zendesk:           { desc: "カスタマーサポート",            icon: "🎧" },
  Jira:              { desc: "課題管理・チケット管理",         icon: "📋" },
};

const PRIORITY = ["Zapier", "Notion", "Google Analytics", "Shopify", "Asana", "Datadog"];

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
        label: string; key: string; secondTool?: string; thirdTool?: string;
      }>();

      for (const t of data || []) {
        const key = t.primary_competitor!;
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            count: 1, topTool: t.name || "", topToolId: t.id,
            label: t.primary_competitor_ja || key, key,
          });
        } else {
          existing.count++;
          if (!existing.secondTool) existing.secondTool = t.name || "";
          else if (!existing.thirdTool) existing.thirdTool = t.name || "";
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

      return sorted.slice(0, 6).map((v) => ({
        competitor: v.key,
        competitorJa: v.label,
        count: v.count,
        topTool: v.topTool,
        topToolId: v.topToolId,
        secondTool: v.secondTool,
        thirdTool: v.thirdTool,
      }));
    },
  });

  if (!groups || groups.length === 0) return null;

  return (
    <section id="popular-alternatives" className="container py-16 md:py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-primary bg-primary/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
          <Repeat2 className="h-3.5 w-3.5" />
          人気の比較
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          よく比較される代替サービス
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          人気SaaSに対するOSS代替ツール
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {groups.map((g) => {
          const meta = SAAS_META[g.competitor];
          const tools = [g.topTool, g.secondTool, g.thirdTool].filter(Boolean);

          return (
            <Link
              key={g.competitor}
              to={`/tools/${g.topToolId}`}
              className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Top row: icon + name + badge */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl leading-none">{meta?.icon ?? "🔄"}</span>
                  <div>
                    <h3 className="font-semibold text-foreground text-[15px] leading-tight">
                      {g.competitorJa}
                    </h3>
                    {meta && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {meta.desc}
                      </p>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  {g.count}件
                </span>
              </div>

              {/* Popular tools */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tools.slice(0, 3).map((name) => (
                  <span
                    key={name}
                    className="inline-block text-[11px] bg-secondary text-secondary-foreground rounded-md px-2 py-0.5"
                  >
                    {name}
                  </span>
                ))}
                {g.count > 3 && (
                  <span className="inline-block text-[11px] text-muted-foreground rounded-md px-1.5 py-0.5">
                    +{g.count - 3}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
                  代替ツールを見る
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

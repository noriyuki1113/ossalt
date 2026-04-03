import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/SectionHeader";
import { useState } from "react";

const SAAS_META: Record<string, { domain: string; shortJa: string }> = {
  Zapier:             { domain: "zapier.com", shortJa: "Zapier" },
  Notion:             { domain: "notion.so", shortJa: "Notion" },
  "Google Analytics": { domain: "analytics.google.com", shortJa: "Google Analytics" },
  Shopify:            { domain: "shopify.com", shortJa: "Shopify" },
  Asana:              { domain: "asana.com", shortJa: "Asana" },
  Datadog:            { domain: "datadoghq.com", shortJa: "Datadog" },
  Slack:              { domain: "slack.com", shortJa: "Slack" },
  Figma:              { domain: "figma.com", shortJa: "Figma" },
  Zendesk:            { domain: "zendesk.com", shortJa: "Zendesk" },
  Jira:               { domain: "atlassian.com", shortJa: "Jira" },
  "Google Workspace": { domain: "workspace.google.com", shortJa: "Google Workspace" },
  Auth0:              { domain: "auth0.com", shortJa: "Auth0" },
  Okta:               { domain: "okta.com", shortJa: "Okta" },
  Bubble:             { domain: "bubble.io", shortJa: "Bubble" },
  "Claude Code":      { domain: "anthropic.com", shortJa: "Claude Code" },
};

const PRIORITY = ["Notion", "Slack", "Google Analytics", "Zapier", "Datadog"];

function SaaSLogo({ domain, name }: { domain?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const src = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : null;

  if (!src || failed) {
    return (
      <span className="flex items-center justify-center h-5 w-5 rounded bg-secondary text-[10px] font-bold text-muted-foreground uppercase shrink-0">
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={src} alt="" width={20} height={20}
      className="h-5 w-5 rounded shrink-0 bg-secondary"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
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
              {/* SaaS logo + name */}
              <div className="flex items-center gap-2 mb-3">
                <SaaSLogo domain={meta?.domain} name={displayName} />
                <span className="font-semibold text-[13px] text-foreground leading-tight">
                  {displayName}
                </span>
              </div>

              {/* Arrow + top OSS name */}
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                <span className="text-sm font-medium text-primary truncate">
                  {g.topTool}
                </span>
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

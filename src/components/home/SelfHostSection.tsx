import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Server } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ToolCardCompact, ToolCardCompactSkeleton } from "@/components/ToolCardCompact";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

export function SelfHostSection() {
  const isMobile = useIsMobile();
  const initialCount = isMobile ? 3 : 4;
  const [expanded, setExpanded] = useState(false);
  const tracked = useRef(false);

  const { data: tools, isLoading } = useQuery({
    queryKey: ["self-host-tools"],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, url, github_url, description_ja, description_en, parent_category_ja, primary_competitor, primary_competitor_ja, stars_num, language")
        .not("primary_competitor", "is", null)
        .or("url.not.is.null,github_url.not.is.null")
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(8);
      if (error) throw error;
      return data as Tool[];
    },
  });

  useEffect(() => {
    if (tools && tools.length > 0 && !tracked.current) {
      tracked.current = true;
      track("pickup_view", { section: "self_host", count: tools.length });
    }
  }, [tools]);

  if (!isLoading && (!tools || tools.length === 0)) return null;

  const visible = expanded ? tools : tools?.slice(0, initialCount);
  const hasMore = tools && tools.length > initialCount && !expanded;

  return (
    <section className="container py-16">
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 md:p-10">
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
          {isLoading
            ? Array.from({ length: initialCount }).map((_, i) => <ToolCardCompactSkeleton key={i} />)
            : visible?.map((tool) => (
                <ToolCardCompact key={tool.id} tool={tool} trackSource="self_host" />
              ))}
        </div>

        {hasMore && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => {
                setExpanded(true);
                track("pickup_show_more", { section: "self_host" });
              }}
            >
              もっと見る（+{tools!.length - initialCount}件）
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

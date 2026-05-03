import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { ToolCardCompact, ToolCardCompactSkeleton } from "@/components/ToolCardCompact";
import { useIsMobile } from "@/hooks/use-mobile";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

export function NewToolsSection() {
  const isMobile = useIsMobile();
  const initialCount = isMobile ? 3 : 4;
  const [expanded, setExpanded] = useState(false);
  const tracked = useRef(false);

  const { data: tools, isLoading } = useQuery({
    queryKey: ["new-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, url, github_url, description_ja, description_en, parent_category_ja, primary_competitor, primary_competitor_ja, stars_num, language, created_at")
        .or("url.not.is.null,github_url.not.is.null")
        .order("created_at", { ascending: false, nullsFirst: false })
        .limit(8);
      if (error) throw error;
      return data as Tool[];
    },
  });

  useEffect(() => {
    if (tools && tools.length > 0 && !tracked.current) {
      tracked.current = true;
      track("pickup_view", { section: "new_tools", count: tools.length });
    }
  }, [tools]);

  const visible = expanded ? tools : tools?.slice(0, initialCount);
  const hasMore = tools && tools.length > initialCount && !expanded;

  return (
    <section className="container py-12 md:py-20">
      <SectionHeader title="最近追加されたツール" subtitle="新しく掲載されたOSSツール" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {isLoading
          ? Array.from({ length: initialCount }).map((_, i) => <ToolCardCompactSkeleton key={i} />)
          : visible?.map((tool) => (
              <ToolCardCompact key={tool.id} tool={tool} trackSource="new_tools" />
            ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => {
              setExpanded(true);
              track("pickup_show_more", { section: "new_tools" });
            }}
          >
            もっと見る（+{tools!.length - initialCount}件）
          </Button>
        </div>
      )}
    </section>
  );
}

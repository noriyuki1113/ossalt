import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ExternalLink, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ComparisonBoard } from "@/components/workspace/ComparisonBoard";
import { useSharedComparison } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";

export default function WorkspaceSharedPage() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useSharedComparison(token);

  useSeo({
    title: data?.list ? `${data.list.title} | 共有比較 | OSSアルタナティブ` : "共有比較 | OSSアルタナティブ",
    description: "OSSツールの共有比較ボード",
  });

  const toolIds = data?.items.map((i) => i.tool_id) || [];
  const { data: toolsData } = useQuery({
    queryKey: ["tools-by-ids", toolIds],
    queryFn: async () => {
      if (toolIds.length === 0) return [];
      const { data: d, error: e } = await supabase
        .from("tools")
        .select("*")
        .in("id", toolIds);
      if (e) throw e;
      return (d || []) as Tool[];
    },
    enabled: toolIds.length > 0,
  });

  const toolsMap = useMemo(() => {
    const m = new Map<number, Tool>();
    toolsData?.forEach((t) => m.set(t.id, t));
    return m;
  }, [toolsData]);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container max-w-5xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 bg-secondary rounded" />
            <div className="h-4 w-72 bg-secondary rounded" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !data) {
    return (
      <SiteLayout>
        <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">この共有リンクは無効または期限切れです</p>
          <Button variant="outline" asChild className="mt-4 gap-2 rounded-xl">
            <Link to="/"><ArrowLeft className="h-4 w-4" />ホームに戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-2">共有された比較</p>
          <h1 className="text-xl font-bold text-foreground">{data.list.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            最終更新: {new Date(data.list.updated_at).toLocaleDateString("ja-JP")}
          </p>
        </div>

        <ComparisonBoard items={data.items} tools={toolsMap} readOnly />

        {data.list.summary_note && (
          <div className="mt-6 card-unified p-5">
            <h2 className="text-sm font-semibold text-foreground mb-2">比較メモ</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {data.list.summary_note}
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground mb-3">
            OSSアルタナティブで自分も比較を始めよう
          </p>
          <Button asChild className="gap-2 rounded-xl">
            <Link to="/">ツールを探す</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}

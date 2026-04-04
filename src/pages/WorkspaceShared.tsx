import { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ExternalLink, Github, CheckCircle2, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ComparisonBoard } from "@/components/workspace/ComparisonBoard";
import { useSharedComparison } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/use-seo";
import { normalizeText } from "@/lib/normalize-text";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

export default function WorkspaceSharedPage() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useSharedComparison(token);

  useEffect(() => {
    if (token && data) {
      track("shared_view_opened", { share_token: token, list_id: data.list.id, items_count: data.items.length });
    }
  }, [token, data]);

  useSeo({
    title: data?.list ? `${data.list.title} | 共有された比較 | OSSアルタナティブ` : "共有された比較 | OSSアルタナティブ",
    description: data?.list?.summary_note || "OSSツールの共有比較ボード",
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
          <p className="text-muted-foreground">比較の読み込みに失敗しました。再読み込みしてください。</p>
          <Button variant="outline" asChild className="mt-4 gap-2 rounded-xl">
            <Link to="/"><ArrowLeft className="h-4 w-4" />ホームに戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  // Find recommended tool (highest average score)
  const recommendation = (() => {
    let best: { toolId: number; avg: number } | null = null;
    for (const item of data.items) {
      const scores = [item.self_hosting_score, item.learning_curve_score, item.team_fit_score].filter(Boolean) as number[];
      if (scores.length === 0) continue;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (!best || avg > best.avg) best = { toolId: item.tool_id, avg };
    }
    return best;
  })();

  const recommendedTool = recommendation ? toolsMap.get(recommendation.toolId) : null;

  return (
    <SiteLayout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Share2 className="h-3.5 w-3.5" />
            <span>共有された比較</span>
            <span>·</span>
            <span>比較中の候補 {data.items.length}件</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{data.list.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            最終更新: {new Date(data.list.updated_at).toLocaleDateString("ja-JP")}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-2">
            このページでは、共有された比較結果を確認できます。
          </p>
        </div>

        {/* Summary note — prominent placement */}
        {data.list.summary_note ? (
          <div className="card-unified p-5 mb-6 bg-primary/[0.02] border-primary/10">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              📋 比較概要
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {normalizeText(data.list.summary_note)}
            </p>
            <p className="text-[10px] text-muted-foreground/50 mt-3">
              比較サマリーがあると、相手にも判断の意図が伝わりやすくなります。
            </p>
          </div>
        ) : (
          <div className="card-unified p-4 mb-6 bg-muted/20">
            <p className="text-xs text-muted-foreground">サマリーはまだありません</p>
          </div>
        )}

        {/* Recommendation banner */}
        {recommendedTool && (
          <div className="card-unified p-4 mb-6 flex items-center gap-3 bg-emerald-50/50 border-emerald-200/50">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                最終候補: {recommendedTool.name}
              </p>
              <p className="text-xs text-muted-foreground">
                評価スコアに基づく上位候補です（平均 {recommendation!.avg.toFixed(1)}/5）
              </p>
            </div>
          </div>
        )}

        {/* Comparison board */}
        <ComparisonBoard items={data.items} tools={toolsMap} readOnly />

        {/* CTA */}
        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            OSSアルタナティブで自分も比較を始めよう
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild className="gap-2 rounded-xl">
              <Link to="/">候補を探す</Link>
            </Button>
            <Button variant="outline" asChild className="gap-2 rounded-xl">
              <Link to="/workspace">ワークスペースを見る</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

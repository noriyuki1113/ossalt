import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  Bookmark, GitCompareArrows, Plus, ArrowRight,
  Clock, AlertCircle, TrendingUp, RotateCcw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { useSavedTools, useComparisonLists, useComparisonItems } from "@/hooks/use-workspace";
import { StatusBadge } from "@/components/workspace/StatusBadge";
import { EmptyWorkspaceState } from "@/components/workspace/EmptyWorkspaceState";
import { StarterTemplates } from "@/components/workspace/WorkspaceQuickActions";
import { useSeo } from "@/hooks/use-seo";
import { track } from "@/lib/track";
import { supabase } from "@/integrations/supabase/client";
import type { ToolStatus } from "@/hooks/use-workspace";

function RecentSaves({ savedTools, toolsMap }: { savedTools: any[]; toolsMap: Map<number, any> }) {
  const recent = savedTools.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          最近保存した候補
        </h2>
        <Link to="/workspace/saved" className="text-xs text-primary hover:underline">
          すべて見る
        </Link>
      </div>
      <div className="space-y-1.5">
        {recent.map((s) => {
          const tool = toolsMap.get(s.tool_id);
          return (
            <Link
              key={s.id}
              to={`/tools/${s.tool_id}`}
              className="card-unified-hover p-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {tool?.name || `Tool #${s.tool_id}`}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {tool?.description_ja || tool?.description_en || ""}
                </p>
              </div>
              <StatusBadge status={s.status as ToolStatus} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function UncomparedNudge({ savedTools, comparedToolIds }: { savedTools: any[]; comparedToolIds: Set<number> }) {
  const uncompared = savedTools.filter((s) => !comparedToolIds.has(s.tool_id));
  if (uncompared.length === 0) return null;

  return (
    <div className="card-unified p-4 mb-6 bg-accent/30 border-accent">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {uncompared.length}件の候補がまだ比較されていません
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            保存した候補を比較リストに追加して、検討を進めましょう
          </p>
          <Link
            to="/workspace/saved"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            onClick={() => track("nudge_uncompared_click")}
          >
            保存済みを確認 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResumeComparisons({ lists }: { lists: any[] }) {
  const inProgress = lists.filter((l) => !l.share_token).slice(0, 3);
  if (inProgress.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
        比較途中のリストを再開
      </h2>
      <div className="space-y-1.5">
        {inProgress.map((list) => (
          <Link
            key={list.id}
            to={`/workspace/compare/${list.id}`}
            className="card-unified-hover p-3.5 flex items-center justify-between"
            onClick={() => track("resume_comparison_click", { list_id: list.id })}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{list.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                最終更新: {new Date(list.updated_at).toLocaleDateString("ja-JP")}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PopularThemes() {
  const themes = [
    { label: "プロジェクト管理ツール", query: "project-management" },
    { label: "チャット・コミュニケーション", query: "chat" },
    { label: "ナレッジベース", query: "knowledge-base" },
  ];

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
        よく比較されているテーマ
      </h2>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <Link
            key={t.query}
            to={`/?q=${t.query}`}
            className="px-3 py-1.5 rounded-lg bg-secondary/60 text-xs text-secondary-foreground hover:bg-secondary transition-colors"
            onClick={() => track("popular_theme_click", { theme: t.query })}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function FuturePartnerSpace() {
  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="card-unified p-4 bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          OSSの導入支援・移行相談が必要ですか？{" "}
          <Link to="/contact" className="text-primary hover:underline">
            お問い合わせ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const { savedTools, isLoading: loadingSaved } = useSavedTools();
  const { lists, isLoading: loadingLists, createList } = useComparisonLists();
  const navigate = useNavigate();

  useSeo({
    title: "ワークスペース | OSSアルタナティブ",
    description: "保存したOSSツールの管理、比較リストの作成・共有ができるワークスペース",
  });

  // Fetch tool details for recent saves
  const toolIds = savedTools.map((s) => s.tool_id);
  const { data: toolsData } = useQuery({
    queryKey: ["tools-by-ids", toolIds],
    queryFn: async () => {
      if (toolIds.length === 0) return [];
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, description_ja, description_en, stars_num")
        .in("id", toolIds);
      if (error) throw error;
      return data || [];
    },
    enabled: toolIds.length > 0,
  });

  const toolsMap = useMemo(() => {
    const m = new Map<number, any>();
    toolsData?.forEach((t) => m.set(t.id, t));
    return m;
  }, [toolsData]);

  // Gather all tool IDs that are already in comparison lists
  const allListIds = lists.map((l) => l.id);
  const { data: allComparisonItems } = useQuery({
    queryKey: ["all-comparison-items", allListIds],
    queryFn: async () => {
      if (allListIds.length === 0) return [];
      const { data, error } = await supabase
        .from("comparison_list_items")
        .select("tool_id")
        .in("comparison_list_id", allListIds);
      if (error) throw error;
      return data || [];
    },
    enabled: allListIds.length > 0,
  });

  const comparedToolIds = useMemo(() => {
    return new Set((allComparisonItems || []).map((i) => i.tool_id));
  }, [allComparisonItems]);

  const handleNewComparison = async () => {
    const result = await createList.mutateAsync("無題の比較");
    track("comparison_created", { list_id: result.id });
    navigate(`/workspace/compare/${result.id}`);
  };

  if (!loadingSaved && !loadingLists && savedTools.length === 0 && lists.length === 0) {
    return (
      <SiteLayout>
        <div className="container max-w-3xl mx-auto px-4">
          <EmptyWorkspaceState />
        </div>
      </SiteLayout>
    );
  }

  const statusCounts = savedTools.reduce((acc, t) => {
    acc[t.status as ToolStatus] = (acc[t.status as ToolStatus] || 0) + 1;
    return acc;
  }, {} as Record<ToolStatus, number>);

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">ワークスペース</h1>
            <p className="text-sm text-muted-foreground mt-1">保存したツールの管理と比較</p>
          </div>
          <Button onClick={handleNewComparison} size="sm" className="gap-1.5 rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            新しい比較
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            to="/workspace/saved"
            className="card-unified-hover p-4 flex items-center gap-3"
            onClick={() => track("workspace_open_saved")}
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground tabular-nums">{savedTools.length}</p>
              <p className="text-xs text-muted-foreground">保存済みツール</p>
            </div>
          </Link>
          <Link
            to="/workspace"
            className="card-unified-hover p-4 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <GitCompareArrows className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground tabular-nums">{lists.length}</p>
              <p className="text-xs text-muted-foreground">比較リスト</p>
            </div>
          </Link>
        </div>

        {/* Uncompared nudge */}
        <UncomparedNudge savedTools={savedTools} comparedToolIds={comparedToolIds} />

        {/* Resume comparisons */}
        <ResumeComparisons lists={lists} />

        {/* Recent saves */}
        <RecentSaves savedTools={savedTools} toolsMap={toolsMap} />

        {/* Status summary */}
        {Object.keys(statusCounts).length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">ステータス別</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(statusCounts) as [ToolStatus, number][]).map(([status, count]) => (
                <Link
                  key={status}
                  to={`/workspace/saved?status=${status}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors"
                >
                  <StatusBadge status={status} />
                  <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All comparisons */}
        {lists.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">すべての比較リスト</h2>
            <div className="space-y-1.5">
              {lists.map((list) => (
                <Link
                  key={list.id}
                  to={`/workspace/compare/${list.id}`}
                  className="card-unified-hover p-3.5 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{list.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(list.updated_at).toLocaleDateString("ja-JP")}
                      {list.share_token && " · 共有済み"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular themes */}
        <PopularThemes />

        {/* Starter templates */}
        {lists.length === 0 && (
          <div className="mb-6">
            <StarterTemplates />
          </div>
        )}

        {/* Quick actions */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl">
              <Link to="/">ツールを探す</Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl">
              <Link to="/workspace/saved">保存済みを見る</Link>
            </Button>
          </div>
        </div>

        {/* Future partner/support space */}
        <FuturePartnerSpace />
      </div>
    </SiteLayout>
  );
}

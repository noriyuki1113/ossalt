import { Link } from "react-router-dom";
import { Bookmark, GitCompareArrows, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { useSavedTools, useComparisonLists } from "@/hooks/use-workspace";
import { StatusBadge } from "@/components/workspace/StatusBadge";
import { EmptyWorkspaceState } from "@/components/workspace/EmptyWorkspaceState";
import { WorkspaceOnboarding, StarterTemplates } from "@/components/workspace/WorkspaceQuickActions";
import { useSeo } from "@/hooks/use-seo";
import { track } from "@/lib/track";
import type { ToolStatus } from "@/hooks/use-workspace";

export default function WorkspacePage() {
  const { savedTools, isLoading: loadingSaved } = useSavedTools();
  const { lists, isLoading: loadingLists, createList } = useComparisonLists();

  useSeo({
    title: "ワークスペース | OSSアルタナティブ",
    description: "保存したOSSツールの管理、比較リストの作成・共有ができるワークスペース",
  });

  const handleNewComparison = async () => {
    const result = await createList.mutateAsync("無題の比較");
    track("comparison_created", { list_id: result.id });
    window.location.href = `/workspace/compare/${result.id}`;
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
        <div className="flex items-center justify-between mb-8">
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
        <div className="grid grid-cols-2 gap-3 mb-8">
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
          <div className="card-unified p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <GitCompareArrows className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground tabular-nums">{lists.length}</p>
              <p className="text-xs text-muted-foreground">比較リスト</p>
            </div>
          </div>
        </div>

        {/* Status summary */}
        {Object.keys(statusCounts).length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">ステータス</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(statusCounts) as [ToolStatus, number][]).map(([status, count]) => (
                <div key={status} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60">
                  <StatusBadge status={status} />
                  <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent comparisons */}
        {lists.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">比較リスト</h2>
            <div className="space-y-2">
              {lists.map((list) => (
                <Link
                  key={list.id}
                  to={`/workspace/compare/${list.id}`}
                  className="card-unified-hover p-4 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{list.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(list.updated_at).toLocaleDateString("ja-JP")}
                      {list.share_token && " · 共有リンクあり"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Starter templates */}
        {lists.length === 0 && (
          <div className="mt-8">
            <StarterTemplates />
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl">
              <Link to="/">ツールを探す</Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-xl">
              <Link to="/workspace/saved">保存済みを見る</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Trash2, GitCompareArrows, ChevronRight, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { StatusBadge, StatusSelect } from "@/components/workspace/StatusBadge";
import { useSavedTools, useComparisonLists, type ToolStatus, STATUS_LABELS } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/use-seo";
import { toast } from "sonner";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

export default function WorkspaceSavedPage() {
  const { savedTools, removeTool, updateStatus } = useSavedTools();
  const { lists, createList } = useComparisonLists();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") as ToolStatus | null;
  const [filter, setFilter] = useState<ToolStatus | "all">(initialStatus || "all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useSeo({
    title: "保存済みツール | ワークスペース | OSSアルタナティブ",
    description: "保存したOSSツールの一覧",
  });

  const toolIds = savedTools.map((s) => s.tool_id);
  const { data: toolsData } = useQuery({
    queryKey: ["tools-by-ids", toolIds],
    queryFn: async () => {
      if (toolIds.length === 0) return [];
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, url, description_ja, description_en, parent_category_ja, github_url, stars_num, language, license")
        .in("id", toolIds);
      if (error) throw error;
      return (data || []) as Tool[];
    },
    enabled: toolIds.length > 0,
  });

  const allListIds = lists.map((l) => l.id);
  const { data: compItems } = useQuery({
    queryKey: ["all-comparison-items-saved", allListIds],
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

  const comparedToolIds = useMemo(() => new Set((compItems || []).map((i) => i.tool_id)), [compItems]);

  const toolsMap = useMemo(() => {
    const m = new Map<number, Tool>();
    toolsData?.forEach((t) => m.set(t.id, t));
    return m;
  }, [toolsData]);

  const filtered = useMemo(() => {
    let items = savedTools;
    if (filter !== "all") items = items.filter((s) => s.status === filter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((s) => {
        const tool = toolsMap.get(s.tool_id);
        return tool?.name?.toLowerCase().includes(q) || tool?.description_ja?.toLowerCase().includes(q);
      });
    }
    return items;
  }, [savedTools, filter, search, toolsMap]);

  const toggleSelect = (toolId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) next.delete(toolId);
      else if (next.size < 5) next.add(toolId);
      return next;
    });
  };

  const handleCompareSelected = async () => {
    if (selectedIds.size < 2) {
      toast.error("比較するには候補を2件以上追加してください。");
      return;
    }
    const result = await createList.mutateAsync("保存済みからの比較");
    const inserts = Array.from(selectedIds).map((toolId, i) => ({
      comparison_list_id: result.id,
      tool_id: toolId,
      position: i,
    }));
    await supabase.from("comparison_list_items").insert(inserts);
    track("comparison_created_from_saved", { count: selectedIds.size });
    window.location.href = `/workspace/compare/${result.id}`;
  };

  const neverCompared = savedTools.filter((s) => !comparedToolIds.has(s.tool_id));

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/workspace" className="hover:text-foreground transition-colors">ワークスペース</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">保存済み</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">保存済みツール</h1>
          <span className="text-sm text-muted-foreground">保存済み {savedTools.length}件</span>
        </div>

        {/* Nudge for never-compared tools */}
        {neverCompared.length > 0 && neverCompared.length < savedTools.length && (
          <div className="card-unified p-3 mb-4 bg-accent/30 border-accent flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              まだ比較していない候補が<span className="font-medium text-foreground">{neverCompared.length}件</span>あります
            </p>
          </div>
        )}

        {/* Multi-select compare bar */}
        {selectedIds.size > 0 && (
          <div className="sticky top-16 z-30 card-unified p-3 mb-4 flex items-center justify-between bg-card/95 backdrop-blur-sm shadow-md">
            <span className="text-sm text-foreground font-medium">{selectedIds.size}件選択中</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-xs">
                解除
              </Button>
              <Button size="sm" onClick={handleCompareSelected} className="gap-1.5 rounded-xl text-xs">
                <GitCompareArrows className="h-3.5 w-3.5" />
                比較を作成
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ツールを検索…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              すべて
            </button>
            {(Object.entries(STATUS_LABELS) as [ToolStatus, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${filter === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-foreground mb-1">
              {savedTools.length === 0 ? "保存した候補がまだありません" : "条件に一致するツールがありません"}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {savedTools.length === 0
                ? "気になるツールを保存しておくと、あとで並べて比較できます。詳細ページや比較ページから追加してみましょう。"
                : "フィルターや検索条件を変えてみてください。"}
            </p>
            {savedTools.length === 0 && (
              <div className="flex items-center justify-center gap-3">
                <Button size="sm" asChild className="gap-2 rounded-xl">
                  <Link to="/">ツールを探す</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-2 rounded-xl">
                  <Link to="/workspace">ワークスペースに戻る</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((saved) => {
              const tool = toolsMap.get(saved.tool_id);
              const isExpanded = expandedId === saved.id;
              const isSelected = selectedIds.has(saved.tool_id);
              const isNeverCompared = !comparedToolIds.has(saved.tool_id);
              return (
                <div
                  key={saved.id}
                  className={`card-unified p-4 transition-colors ${isSelected ? "ring-1 ring-primary/40 bg-primary/[0.03]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Selection checkbox */}
                    <button
                      onClick={() => toggleSelect(saved.tool_id)}
                      className={`h-5 w-5 mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <Link to={`/tools/${saved.tool_id}`} className="shrink-0 mt-0.5">
                      <ToolIcon url={tool?.url} githubUrl={tool?.github_url} name={tool?.name} size={28} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/tools/${saved.tool_id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate">
                          {tool?.name || `Tool #${saved.tool_id}`}
                        </Link>
                        <button onClick={() => setExpandedId(isExpanded ? null : saved.id)}>
                          <StatusBadge status={saved.status as ToolStatus} className="cursor-pointer hover:opacity-80" />
                        </button>
                        {isNeverCompared && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">未比較</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {tool?.description_ja || tool?.description_en || ""}
                      </p>
                      <div className="flex items-center gap-3">
                        <StarCount count={tool?.stars_num} size="sm" />
                        {tool?.parent_category_ja && (
                          <span className="text-[10px] text-muted-foreground">{tool.parent_category_ja}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeTool.mutate(saved.tool_id);
                        toast("保存を解除しました");
                      }}
                      className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <p className="text-[10px] text-muted-foreground mb-2">ステータスを変更</p>
                      <StatusSelect
                        value={saved.status as ToolStatus}
                        onChange={(status) => {
                          updateStatus.mutate({ toolId: saved.tool_id, status });
                          track("status_changed", { tool_id: saved.tool_id, new_status: status, source: "saved_page" });
                          setExpandedId(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <Button variant="outline" size="sm" asChild className="gap-2 rounded-xl">
            <Link to="/workspace"><ArrowLeft className="h-3.5 w-3.5" />ワークスペースに戻る</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}

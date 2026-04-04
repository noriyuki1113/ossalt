import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Share2, Plus, ChevronRight, Trash2, Edit3, Check, FileText, MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ComparisonBoard } from "@/components/workspace/ComparisonBoard";
import { useComparisonLists, useComparisonItems, useSavedTools } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/use-seo";
import { toast } from "sonner";
import { track } from "@/lib/track";
import { useIsMobile } from "@/hooks/use-mobile";
import { normalizeText } from "@/lib/normalize-text";
import type { Tool } from "@/hooks/use-tools";

export default function WorkspaceComparePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { lists, updateList, generateShareToken, deleteList } = useComparisonLists();
  const { items, removeItem, updateItem, addItem } = useComparisonItems(id);
  const { savedTools } = useSavedTools();

  const list = lists.find((l) => l.id === id);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryValue, setSummaryValue] = useState("");
  const [showAddTool, setShowAddTool] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);

  useSeo({
    title: list ? `${list.title} | 比較 | OSSアルタナティブ` : "比較 | OSSアルタナティブ",
    description: "OSSツールの比較ボード",
  });

  const toolIds = items.map((i) => i.tool_id);
  const { data: toolsData } = useQuery({
    queryKey: ["tools-by-ids", toolIds],
    queryFn: async () => {
      if (toolIds.length === 0) return [];
      const { data, error } = await supabase.from("tools").select("*").in("id", toolIds);
      if (error) throw error;
      return (data || []) as Tool[];
    },
    enabled: toolIds.length > 0,
  });

  const toolsMap = useMemo(() => {
    const m = new Map<number, Tool>();
    toolsData?.forEach((t) => m.set(t.id, t));
    return m;
  }, [toolsData]);

  const addableToolIds = useMemo(() => {
    const inComparison = new Set(items.map((i) => i.tool_id));
    return savedTools.filter((s) => !inComparison.has(s.tool_id));
  }, [savedTools, items]);

  const addableIds = addableToolIds.map((s) => s.tool_id);
  const { data: addableToolsData } = useQuery({
    queryKey: ["tools-by-ids-addable", addableIds],
    queryFn: async () => {
      if (addableIds.length === 0) return [];
      const { data, error } = await supabase.from("tools").select("id, name, url, github_url").in("id", addableIds);
      if (error) throw error;
      return (data || []) as Tool[];
    },
    enabled: addableIds.length > 0,
  });

  const addableToolsMap = useMemo(() => {
    const m = new Map<number, Tool>();
    addableToolsData?.forEach((t) => m.set(t.id, t));
    return m;
  }, [addableToolsData]);

  const handleShare = async () => {
    if (!id) return;
    try {
      const token = await generateShareToken.mutateAsync(id);
      const url = `${window.location.origin}/workspace/shared/${token}`;
      await navigator.clipboard.writeText(url);
      track("share_link_created", { list_id: id });
      toast.success("共有リンクを作成しました", {
        description: "比較結果をそのまま共有できます",
      });
    } catch {
      toast.error("共有リンクの作成に失敗しました。もう一度お試しください。");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("この比較を削除しますか？\n削除すると元に戻せません。")) return;
    await deleteList.mutateAsync(id);
    navigate("/workspace");
  };

  const startEditTitle = () => {
    setTitleValue(list?.title || "");
    setEditingTitle(true);
  };

  const saveTitle = () => {
    if (id) updateList.mutate({ id, title: titleValue });
    setEditingTitle(false);
  };

  const parsedSummary = normalizeText(list?.summary_note);

  return (
    <SiteLayout>
      <div className="container max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 sm:mb-6">
          <Link to="/workspace" className="hover:text-foreground transition-colors">ワークスペース</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">{list?.title || "比較"}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {editingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  className="text-lg sm:text-xl font-bold bg-transparent border-b-2 border-primary focus:outline-none flex-1 min-w-0"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                />
                <button onClick={saveTitle} className="text-primary shrink-0"><Check className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{normalizeText(list?.title) || "比較"}</h1>
                <button onClick={startEditTitle} className="text-muted-foreground hover:text-foreground shrink-0">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Primary + secondary actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setShowAddTool(!showAddTool)} className="gap-1 rounded-lg text-xs h-8 px-2.5">
              <Plus className="h-3.5 w-3.5" />
              {!isMobile && "ツールを追加"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1 rounded-lg text-xs h-8 px-2.5">
              <Share2 className="h-3.5 w-3.5" />
              {!isMobile && "共有"}
            </Button>
            {/* Overflow for delete */}
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={() => setShowOverflow(!showOverflow)} className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
              {showOverflow && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowOverflow(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                    <button
                      onClick={() => { setShowOverflow(false); handleDelete(); }}
                      className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/5 flex items-center gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> 削除する
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Page hint */}
        {items.length > 0 && (
          <p className="text-[10px] text-muted-foreground/60 mb-4">
            まずは重要な比較項目を見て、最後に比較サマリーへ結論を書いておくのがおすすめです。
          </p>
        )}

        {/* Add tool panel */}
        {showAddTool && (
          <div className="card-unified p-3 sm:p-4 mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">保存済みツールから追加（最大5件）</p>
            {addableToolIds.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                追加できる保存済みツールがありません。
                <Link to="/" className="text-primary hover:underline ml-1">候補を探す</Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {addableToolIds.map((saved) => {
                  const t = addableToolsMap.get(saved.tool_id);
                  return (
                    <button
                      key={saved.tool_id}
                      onClick={() => {
                        if (items.length >= 5) { toast.error("比較するには候補を2件以上追加してください。最大5件まで。"); return; }
                        addItem.mutate({ toolId: saved.tool_id });
                        track("comparison_item_added", { list_id: id || "", tool_id: saved.tool_id });
                        toast.success("比較に追加しました");
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      {t?.name || `Tool #${saved.tool_id}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Comparison board */}
        <ComparisonBoard
          items={items}
          tools={toolsMap}
          onRemoveItem={(itemId) => {
            removeItem.mutate(itemId);
            toast("削除しました");
          }}
          onUpdateItem={(itemId, updates) => {
            updateItem.mutate({ itemId, updates });
          }}
        />

        {/* Decision Summary */}
        <div className="mt-6 sm:mt-8">
          <div className="card-unified overflow-hidden">
            <div className="px-4 py-3 border-b border-border/40 bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                比較サマリー
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                比較して分かったことを短く残しておきましょう。あとで見返すときも、共有するときも分かりやすくなります。
              </p>
            </div>
            {editingSummary ? (
              <div className="p-3 sm:p-4">
                <textarea
                  value={summaryValue}
                  onChange={(e) => setSummaryValue(e.target.value)}
                  className="w-full text-sm p-3 border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                  rows={isMobile ? 5 : 6}
                  placeholder={`■ 最有力候補: 今の時点で最も有力な候補を書いてください\n■ 採用理由: なぜ有力だと思うかを短く書いてください\n■ 懸念点: 導入前に気になる点や不安な点を書いてください\n■ 次に確認すること: 追加で確認したいことや試したいことを書いてください`}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => {
                    if (id) {
                      updateList.mutate({ id, summaryNote: summaryValue });
                      track("comparison_summary_saved", { list_id: id });
                    }
                    setEditingSummary(false);
                  }} className="rounded-lg text-xs h-8">保存</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingSummary(false)} className="text-xs h-8">キャンセル</Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSummaryValue(list?.summary_note || "");
                  setEditingSummary(true);
                }}
                className="p-4 w-full text-left hover:bg-muted/20 transition-colors"
              >
                {parsedSummary ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{parsedSummary}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">サマリーはまだありません</p>
                    <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground/60">
                      <span className="bg-secondary/50 px-2 py-0.5 rounded">最有力候補</span>
                      <span className="bg-secondary/50 px-2 py-0.5 rounded">採用理由</span>
                      <span className="bg-secondary/50 px-2 py-0.5 rounded">懸念点</span>
                      <span className="bg-secondary/50 px-2 py-0.5 rounded">次に確認すること</span>
                    </div>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Link to="/workspace">← ワークスペースに戻る</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}

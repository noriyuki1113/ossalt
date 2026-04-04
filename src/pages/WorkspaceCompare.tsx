import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Plus, ChevronRight, Trash2, Edit3, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ComparisonBoard } from "@/components/workspace/ComparisonBoard";
import { useComparisonLists, useComparisonItems, useSavedTools } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/use-seo";
import { toast } from "sonner";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

export default function WorkspaceComparePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lists, updateList, generateShareToken, deleteList } = useComparisonLists();
  const { items, removeItem, updateItem, addItem } = useComparisonItems(id);
  const { savedTools } = useSavedTools();

  const list = lists.find((l) => l.id === id);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryValue, setSummaryValue] = useState("");
  const [showAddTool, setShowAddTool] = useState(false);

  useSeo({
    title: list ? `${list.title} | 比較 | OSSアルタナティブ` : "比較 | OSSアルタナティブ",
    description: "OSSツールの比較ボード",
  });

  // Fetch tool data
  const toolIds = items.map((i) => i.tool_id);
  const { data: toolsData } = useQuery({
    queryKey: ["tools-by-ids", toolIds],
    queryFn: async () => {
      if (toolIds.length === 0) return [];
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .in("id", toolIds);
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

  // Tools that can be added (saved but not in comparison)
  const addableTools = useMemo(() => {
    const inComparison = new Set(items.map((i) => i.tool_id));
    return savedTools.filter((s) => !inComparison.has(s.tool_id));
  }, [savedTools, items]);

  const handleShare = async () => {
    if (!id) return;
    const token = await generateShareToken.mutateAsync(id);
    const url = `${window.location.origin}/workspace/shared/${token}`;
    await navigator.clipboard.writeText(url);
    toast.success("共有リンクをコピーしました", { description: "チームメンバーにこのURLを共有できます" });
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("この比較リストを削除しますか？")) return;
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

  return (
    <SiteLayout>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/workspace" className="hover:text-foreground transition-colors">ワークスペース</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">{list?.title || "比較"}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  className="text-xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                />
                <button onClick={saveTitle} className="text-primary">
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{list?.title || "比較"}</h1>
                <button onClick={startEditTitle} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddTool(!showAddTool)} className="gap-1.5 rounded-lg">
              <Plus className="h-3.5 w-3.5" />
              ツール追加
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 rounded-lg">
              <Share2 className="h-3.5 w-3.5" />
              共有
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Add tool panel */}
        {showAddTool && (
          <div className="card-unified p-4 mb-6">
            <p className="text-xs font-medium text-muted-foreground mb-3">保存済みツールから追加（最大5件）</p>
            {addableTools.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                追加できる保存済みツールがありません。
                <Link to="/" className="text-primary hover:underline ml-1">ツールを探す</Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {addableTools.map((saved) => (
                  <button
                    key={saved.tool_id}
                    onClick={() => {
                      if (items.length >= 5) {
                        toast.error("比較は最大5件までです");
                        return;
                      }
                      addItem.mutate({ toolId: saved.tool_id });
                      toast.success("追加しました");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Tool #{saved.tool_id}
                  </button>
                ))}
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

        {/* Summary note */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground mb-2">比較メモ</h2>
          {editingSummary ? (
            <div>
              <textarea
                value={summaryValue}
                onChange={(e) => setSummaryValue(e.target.value)}
                className="w-full text-sm p-3 border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                rows={4}
                placeholder="比較の結論や検討メモを記録…"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => {
                  if (id) updateList.mutate({ id, summaryNote: summaryValue });
                  setEditingSummary(false);
                }} className="rounded-lg">保存</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingSummary(false)}>キャンセル</Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setSummaryValue(list?.summary_note || "");
                setEditingSummary(true);
              }}
              className="card-unified p-4 w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {list?.summary_note || "クリックして比較メモを追加…"}
            </button>
          )}
        </div>

        {/* Back */}
        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <Button variant="outline" size="sm" asChild className="gap-2 rounded-xl">
            <Link to="/workspace">
              <ArrowLeft className="h-3.5 w-3.5" />
              ワークスペースに戻る
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}

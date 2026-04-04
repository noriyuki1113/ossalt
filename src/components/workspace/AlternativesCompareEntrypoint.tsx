import { useNavigate } from "react-router-dom";
import { GitCompareArrows, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparisonLists, useSavedTools } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

interface Props {
  competitor: string;
  tools: Tool[];
}

export function AlternativesCompareEntrypoint({ competitor, tools }: Props) {
  const navigate = useNavigate();
  const { createList } = useComparisonLists();
  const { saveTool, isToolSaved } = useSavedTools();

  const topTools = tools.slice(0, 3);

  const handleCompareAll = async () => {
    try {
      const result = await createList.mutateAsync(`${competitor}代替比較`);
      const inserts = topTools.map((t, i) => ({
        comparison_list_id: result.id,
        tool_id: t.id,
        position: i,
      }));
      await supabase.from("comparison_list_items").insert(inserts);

      track("alt_compare_all", { competitor, count: topTools.length });
      toast.success(`${competitor}代替の比較を作成しました`, {
        action: { label: "比較を見る", onClick: () => navigate(`/workspace/compare/${result.id}`) },
      });
      navigate(`/workspace/compare/${result.id}`);
    } catch {
      toast.error("作成に失敗しました");
    }
  };

  const handleSaveAll = () => {
    let saved = 0;
    topTools.forEach((t) => {
      if (!isToolSaved(t.id)) {
        saveTool.mutate(t.id);
        saved++;
      }
    });
    track("alt_save_top", { competitor, count: saved });
    if (saved > 0) {
      toast.success(`${saved}件を保存しました`, {
        action: { label: "保存済みを見る", onClick: () => navigate("/workspace/saved") },
      });
    } else {
      toast("すべて保存済みです");
    }
  };

  if (tools.length < 2) return null;

  return (
    <div className="card-unified p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {competitor}の代替候補をまとめて検討
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            上位{topTools.length}件を比較ボードで並べて検討できます
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleSaveAll} variant="outline" size="sm" className="gap-1.5 rounded-lg">
            <Bookmark className="h-3.5 w-3.5" />
            上位を保存
          </Button>
          <Button onClick={handleCompareAll} size="sm" className="gap-1.5 rounded-lg">
            <GitCompareArrows className="h-3.5 w-3.5" />
            まとめて比較
          </Button>
        </div>
      </div>
    </div>
  );
}

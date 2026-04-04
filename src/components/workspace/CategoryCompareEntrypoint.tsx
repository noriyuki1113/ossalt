import { useNavigate } from "react-router-dom";
import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparisonLists } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { track } from "@/lib/track";

interface Props {
  category: string;
}

export function CategoryCompareEntrypoint({ category }: Props) {
  const navigate = useNavigate();
  const { createList } = useComparisonLists();

  const handleStartCompare = async () => {
    try {
      const result = await createList.mutateAsync(`${category}の比較`);
      const { data: tools } = await supabase
        .from("tools")
        .select("id")
        .eq("parent_category_ja", category)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(3);

      if (tools && tools.length > 0) {
        const inserts = tools.map((t, i) => ({
          comparison_list_id: result.id,
          tool_id: t.id,
          position: i,
        }));
        await supabase.from("comparison_list_items").insert(inserts);
      }

      track("category_compare_start", { category });
      toast.success("比較を作成しました");
      navigate(`/workspace/compare/${result.id}`);
    } catch {
      toast.error("作成に失敗しました");
    }
  };

  return (
    <div className="card-unified p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">このカテゴリのツールを比較</p>
        <p className="text-xs text-muted-foreground mt-0.5">上位候補を自動で選んで比較ボードを作成</p>
      </div>
      <Button onClick={handleStartCompare} size="sm" className="gap-1.5 rounded-xl shrink-0">
        <GitCompareArrows className="h-3.5 w-3.5" />
        比較を始める
      </Button>
    </div>
  );
}

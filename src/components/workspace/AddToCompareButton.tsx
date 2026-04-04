import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparisonLists, useComparisonItems } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AddToCompareButtonProps {
  toolId: number;
  toolName?: string;
  source?: string;
  className?: string;
}

export function AddToCompareButton({
  toolId,
  toolName,
  source = "unknown",
  className,
}: AddToCompareButtonProps) {
  const navigate = useNavigate();
  const { lists, createList } = useComparisonLists();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let listId: string;

      if (lists.length > 0) {
        // Add to most recent list
        listId = lists[0].id;
      } else {
        // Create a new list
        const result = await createList.mutateAsync("無題の比較");
        listId = result.id;
      }

      // Add item to list
      const { error } = await (await import("@/integrations/supabase/client")).supabase
        .from("comparison_list_items")
        .insert({
          comparison_list_id: listId,
          tool_id: toolId,
          position: 0,
        });

      if (error) {
        if (error.code === "23505") {
          toast("このツールは既に比較リストに追加されています");
        } else {
          throw error;
        }
      } else {
        toast.success("比較に追加しました", {
          description: toolName ? `${toolName}を比較リストに追加しました` : undefined,
          action: {
            label: "比較を見る",
            onClick: () => navigate(`/workspace/compare/${listId}`),
          },
        });
        track("workspace_add_compare", { tool_id: toolId, tool_name: toolName || "", source });
      }
    } catch {
      toast.error("追加に失敗しました");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn("gap-1.5 rounded-lg", className)}
    >
      <GitCompareArrows className="h-3.5 w-3.5" />
      比較に追加
    </Button>
  );
}

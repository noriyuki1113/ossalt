import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedTools } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

interface SaveToWorkspaceButtonProps {
  toolId: number;
  toolName?: string;
  variant?: "default" | "compact" | "icon";
  source?: string;
  className?: string;
}

export function SaveToWorkspaceButton({
  toolId,
  toolName,
  variant = "default",
  source = "unknown",
  className,
}: SaveToWorkspaceButtonProps) {
  const { isToolSaved, saveTool, removeTool } = useSavedTools();
  const saved = isToolSaved(toolId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeTool.mutate(toolId, {
        onSuccess: () => toast("保存を解除しました"),
      });
    } else {
      saveTool.mutate(toolId, {
        onSuccess: () => {
          toast.success("1件保存しました", {
            description: "あとで比較できるようになりました",
            action: {
              label: "保存済みを見る",
              onClick: () => (window.location.href = "/workspace/saved"),
            },
          });
          track("workspace_save", { tool_id: toolId, tool_name: toolName || "", source });
        },
        onError: () => {
          toast.error("保存に失敗しました。時間をおいてもう一度お試しください。");
        },
      });
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded-lg transition-colors",
          saved
            ? "text-primary bg-primary/10 hover:bg-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          className
        )}
        title={saved ? "保存を解除" : "保存する"}
      >
        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-colors",
          saved
            ? "text-primary bg-primary/10 hover:bg-primary/20"
            : "text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary",
          className
        )}
      >
        {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        {saved ? "保存済み" : "保存"}
      </button>
    );
  }

  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      className={cn("gap-1.5 rounded-lg", className)}
    >
      {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {saved ? "保存済み" : "保存する"}
    </Button>
  );
}

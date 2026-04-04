import { Link } from "react-router-dom";
import { Bookmark, GitCompareArrows } from "lucide-react";
import { useSavedTools, useComparisonLists } from "@/hooks/use-workspace";
import { track } from "@/lib/track";

export function StickyCompareTray() {
  const { savedTools } = useSavedTools();
  const { lists } = useComparisonLists();

  const savedCount = savedTools.length;
  const compareCount = lists.length;

  if (savedCount === 0 && compareCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {savedCount > 0 && (
        <Link
          to="/workspace/saved"
          onClick={() => track("open_workspace_click", { source: "sticky_tray", target: "saved" })}
          className="inline-flex items-center gap-2 rounded-xl bg-card border border-border shadow-lg px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/30 hover:shadow-xl transition-all"
        >
          <Bookmark className="h-4 w-4 text-primary" />
          <span>{savedCount}件保存済み</span>
        </Link>
      )}
      {compareCount > 0 && (
        <Link
          to={`/workspace/compare/${lists[0].id}`}
          onClick={() => track("open_workspace_click", { source: "sticky_tray", target: "compare" })}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground shadow-lg px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-all"
        >
          <GitCompareArrows className="h-4 w-4" />
          <span>比較を見る</span>
        </Link>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { Bookmark, Search, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyWorkspaceState() {
  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
        <Bookmark className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">ワークスペースへようこそ</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        気になるOSSツールを保存して、候補を並べて比較・検討できます。
        まずはツールを探して「保存する」をクリックしましょう。
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild className="gap-2 rounded-xl">
          <Link to="/">
            <Search className="h-4 w-4" />
            ツールを探す
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2 rounded-xl">
          <Link to="/ranking">
            <GitCompareArrows className="h-4 w-4" />
            ランキングを見る
          </Link>
        </Button>
      </div>
    </div>
  );
}

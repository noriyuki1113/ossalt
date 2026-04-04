import { Link } from "react-router-dom";
import { Bookmark, Search, GitCompareArrows, Sparkles, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarterTemplates } from "@/components/workspace/WorkspaceQuickActions";

export function EmptyWorkspaceState() {
  return (
    <div className="py-12 max-w-lg mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
          <Bookmark className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">ワークスペースへようこそ</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          OSSツールを保存して、候補を並べて比較・検討できます。
          チームへの共有もワンクリックで。
        </p>
      </div>

      {/* How it works */}
      <div className="card-unified p-5 mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">使い方</h3>
        <div className="space-y-3">
          {[
            { icon: Bookmark, label: "保存する", desc: "ツール詳細ページで「保存する」をクリック" },
            { icon: GitCompareArrows, label: "比較する", desc: "保存した候補を2〜5件選んで横並び比較" },
            { icon: Sparkles, label: "メモを残す", desc: "各ツールに検討メモやステータスを設定" },
            { icon: Share2, label: "共有する", desc: "比較結果をURLでチームに共有" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Starter templates */}
      <div className="mb-6">
        <StarterTemplates />
      </div>

      {/* CTAs */}
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

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tool } from "@/hooks/use-tools";

interface EditorialInsightCardProps {
  tool: Tool;
  className?: string;
}

/**
 * 編集部視点 — contextual editorial commentary generated from tool data.
 * Gives the page a "curated media" feel rather than a raw database listing.
 */
export function EditorialInsightCard({ tool, className }: EditorialInsightCardProps) {
  const stars = tool.stars_num || 0;
  const forks = tool.forks_num || 0;
  const competitor = tool.primary_competitor || tool.primary_competitor_ja;
  const cat = (tool.parent_category_ja || "").toLowerCase();

  const insights: string[] = [];

  // Activity / maturity insight
  if (stars > 50000) {
    insights.push(
      `${tool.name}はGitHubスター数${Math.floor(stars / 1000)}k超の大規模プロジェクトです。企業での本番利用実績も多く、安定性を重視する方に向いています。`
    );
  } else if (stars > 10000) {
    insights.push(
      `スター数${Math.floor(stars / 1000)}k超と活発なコミュニティを持ち、継続的な改善が期待できるプロジェクトです。`
    );
  } else if (stars > 3000) {
    insights.push(
      `成長中のプロジェクトです。導入前にGitHubのIssueやリリース頻度を確認し、開発の活発さを見極めることをおすすめします。`
    );
  } else {
    insights.push(
      `まだ小規模なプロジェクトですが、ニッチな用途では最適な選択肢になることがあります。本番導入前に開発の継続性を確認してください。`
    );
  }

  // Competitor context
  if (competitor && competitor !== "有料SaaS") {
    if (stars > 20000) {
      insights.push(
        `${competitor}からの移行先として最も人気のある選択肢の一つです。フォーク数${forks > 0 ? Math.floor(forks / 100) * 100 + "+" : "も多く"}、カスタマイズして使っている組織も少なくありません。`
      );
    } else {
      insights.push(
        `${competitor}の代替として検討する場合、機能の網羅性よりも特定のユースケースでの強みに注目すると良い選択ができます。`
      );
    }
  }

  // Category-specific advice
  if (cat.includes("ai")) {
    insights.push("AI系OSSはモデルの選択肢やGPU要件が重要です。クラウドGPUとの組み合わせも検討してください。");
  } else if (cat.includes("セキュリティ")) {
    insights.push("セキュリティ系ツールは定期的なアップデートが不可欠です。自動更新の仕組みを整えてから導入することをおすすめします。");
  } else if (cat.includes("データ")) {
    insights.push("データ分析ツールは既存のデータソースとの接続性を事前に確認してから選定すると、導入がスムーズです。");
  }

  if (insights.length === 0) return null;

  return (
    <div className={cn("card-unified p-5", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
          <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">編集部の視点</h3>
      </div>
      <div className="space-y-2">
        {insights.map((text, i) => (
          <p key={i} className="text-xs text-muted-foreground leading-relaxed">
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

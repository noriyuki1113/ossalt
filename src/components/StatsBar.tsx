import { Package, Tags, Star } from "lucide-react";
import { useToolStats } from "@/hooks/use-tools";
import { CountUp } from "@/components/CountUp";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0).replace(/\.0$/, "")}K+`;
  return String(n);
}

export function StatsBar() {
  const { data } = useToolStats();

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">
          {data ? <><CountUp end={data.toolCount} />件</> : "---"}
        </span>
        <span>ツール数</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Tags className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">
          {data ? <><CountUp end={data.categoryCount} />カテゴリ</> : "---"}
        </span>
        <span>カテゴリ</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Star className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">
          {data ? <CountUp end={data.totalStars} formatter={formatNumber} /> : "---"}
        </span>
        <span>総スター数</span>
      </div>
    </div>
  );
}

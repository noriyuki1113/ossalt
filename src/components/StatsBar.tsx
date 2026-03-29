import { Package, Tags, Star } from "lucide-react";
import { useToolStats } from "@/hooks/use-tools";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0).replace(/\.0$/, "")}K+`;
  return String(n);
}

export function StatsBar() {
  const { data } = useToolStats();

  const stats = [
    { icon: Package, label: "ツール数", value: data ? `${data.toolCount}件` : "---" },
    { icon: Tags, label: "カテゴリ", value: data ? `${data.categoryCount}カテゴリ` : "---" },
    { icon: Star, label: "総スター数", value: data ? formatNumber(data.totalStars) : "---" },
  ];

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground">
          <s.icon className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{s.value}</span>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

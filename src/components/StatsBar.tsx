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
    <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
      {[
        { icon: Package, value: data?.toolCount, suffix: "件", label: "ツール数" },
        { icon: Tags, value: data?.categoryCount, suffix: "カテゴリ", label: "カテゴリ" },
        { icon: Star, value: data?.totalStars, formatter: formatNumber, label: "総スター数" },
      ].map(({ icon: Icon, value, suffix, formatter, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg text-foreground tabular-nums">
              {value != null ? (
                formatter ? <CountUp end={value} formatter={formatter} /> : <><CountUp end={value} />{suffix && <span className="text-sm font-normal text-muted-foreground ml-0.5">{suffix}</span>}</>
              ) : "—"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

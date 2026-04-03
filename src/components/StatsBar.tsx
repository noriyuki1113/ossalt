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

  const stats = [
    { icon: Package, value: data?.toolCount, suffix: "件", label: "ツール数", formatter: undefined },
    { icon: Tags, value: data?.categoryCount, suffix: "", label: "カテゴリ", formatter: undefined },
    { icon: Star, value: data?.totalStars, suffix: "", label: "総スター数", formatter: formatNumber },
  ];

  return (
    <section className="container py-16 md:py-20">
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {stats.map(({ icon: Icon, value, suffix, label, formatter }) => (
          <div key={label} className="text-center card-unified p-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-bold text-xl md:text-2xl text-foreground tabular-nums">
                {value != null ? (
                  formatter ? <CountUp end={value} formatter={formatter} /> : <><CountUp end={value} />{suffix}</>
                ) : "—"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-muted-foreground/50 mt-3">
        GitHubデータをもとに集計
      </p>
    </section>
  );
}

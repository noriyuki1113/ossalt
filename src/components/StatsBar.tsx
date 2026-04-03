import { Package, Tags, Star } from "lucide-react";
import { useToolStats } from "@/hooks/use-tools";
import { CountUp } from "@/components/CountUp";
import { formatLargeNumber } from "@/lib/format";

export function StatsBar() {
  const { data } = useToolStats();

  const stats = [
    { icon: Package, value: data?.toolCount, suffix: "件", label: "ツール数", formatter: undefined },
    { icon: Tags, value: data?.categoryCount, suffix: "", label: "カテゴリ", formatter: undefined },
    { icon: Star, value: data?.totalStars, suffix: "", label: "総スター数", formatter: formatLargeNumber },
  ];

  return (
    <section className="container py-10 md:py-20">
      <div className="grid grid-cols-3 gap-2.5 md:gap-4 max-w-2xl mx-auto">
        {stats.map(({ icon: Icon, value, suffix, label, formatter }) => (
          <div key={label} className="text-center card-unified p-3 md:p-5">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1">
              <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
              <span className="font-bold text-lg md:text-2xl text-foreground tabular-nums">
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

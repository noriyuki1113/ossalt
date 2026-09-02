import type { ElementType } from "react";
import { Package, Tags, Star, Server } from "lucide-react";
import { useToolStats } from "@/hooks/use-tools";
import { CountUp } from "@/components/CountUp";
import { formatLargeNumber } from "@/lib/format";

export function StatsBar() {
  const { data } = useToolStats();

  return (
    <section className="container py-10">
      <div className="glass rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        <StatCell
          icon={Package}
          label="OSSツール"
          value={data?.toolCount}
          suffix="件"
        />
        <StatCell
          icon={Tags}
          label="カテゴリ"
          value={data?.categoryCount}
        />
        <StatCell
          icon={Star}
          label="総スター数"
          value={data?.totalStars}
          formatter={formatLargeNumber}
          highlight
        />
        <StatCell
          icon={Server}
          label="セルフホストガイド"
          value={15}
          isStatic
        />
      </div>
    </section>
  );
}

function StatCell({
  icon: Icon,
  label,
  value,
  suffix,
  formatter,
  highlight,
  isStatic,
}: {
  icon: ElementType;
  label: string;
  value?: number;
  suffix?: string;
  formatter?: (n: number) => string;
  highlight?: boolean;
  isStatic?: boolean;
}) {
  const displayValue = () => {
    if (value == null) return "—";
    if (formatter) {
      return isStatic ? formatter(value) : <CountUp end={value} formatter={formatter} />;
    }
    return isStatic ? `${value}${suffix ?? ""}` : <><CountUp end={value} />{suffix}</>;
  };

  return (
    <div className="text-center py-6 px-4">
      <div
        className={`font-display text-2xl md:text-3xl font-extrabold tabular-nums ${
          highlight ? "text-gradient" : "text-foreground"
        }`}
      >
        {displayValue()}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-1.5">
        <Icon className="h-3 w-3 text-muted-foreground/60" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

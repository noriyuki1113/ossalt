import { type ToolStatus, STATUS_LABELS, STATUS_COLORS } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { CircleDot, Search, Pause, CheckCircle2, XCircle } from "lucide-react";

const STATUS_ICONS: Record<ToolStatus, typeof CircleDot> = {
  candidate: CircleDot,
  reviewing: Search,
  on_hold: Pause,
  adopted: CheckCircle2,
  rejected: XCircle,
};

interface StatusBadgeProps {
  status: ToolStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = STATUS_ICONS[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
      STATUS_COLORS[status],
      className
    )}>
      <Icon className="h-3 w-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}

interface StatusSelectProps {
  value: ToolStatus;
  onChange: (status: ToolStatus) => void;
  className?: string;
}

export function StatusSelect({ value, onChange, className }: StatusSelectProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {(Object.keys(STATUS_LABELS) as ToolStatus[]).map((key) => {
        const Icon = STATUS_ICONS[key];
        const isActive = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              isActive ? STATUS_COLORS[key] : "bg-secondary/40 text-muted-foreground hover:bg-secondary"
            )}
          >
            <Icon className="h-3 w-3" />
            {STATUS_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}

import { Star } from "lucide-react";
import { formatCount } from "@/lib/format";

interface StarCountProps {
  count: number | null | undefined;
  size?: "sm" | "default";
}

export function StarCount({ count, size = "default" }: StarCountProps) {
  if (!count || count <= 0) return null;

  const isSm = size === "sm";
  return (
    <span className={`shrink-0 flex items-center gap-0.5 font-medium text-amber-600 ${isSm ? "text-[11px]" : "text-sm font-semibold"}`}>
      <Star className={`${isSm ? "h-3 w-3" : "h-3.5 w-3.5"} fill-current`} />
      {formatCount(count)}
    </span>
  );
}

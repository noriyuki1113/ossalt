import { cn } from "@/lib/utils";

interface AdSlotProps {
  /** Unique identifier for this ad placement */
  slotId: string;
  /** Visual format */
  format?: "horizontal" | "rectangle" | "leaderboard";
  /** Optional className */
  className?: string;
}

/**
 * Generic ad placement component.
 * Currently renders a placeholder; swap internals for AdSense or direct sponsor content.
 */
export function AdSlot({ slotId, format = "horizontal", className }: AdSlotProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center",
        className,
      )}
      data-ad-slot={slotId}
      data-ad-format={format}
    >
      <SponsorLabel />
      <div
        className={cn(
          "w-full max-w-4xl rounded-lg border border-border/50 bg-secondary/30 flex items-center justify-center text-muted-foreground/40 text-xs",
          format === "horizontal" && "h-[90px] md:h-[90px]",
          format === "rectangle" && "h-[250px] max-w-[300px]",
          format === "leaderboard" && "h-[90px]",
        )}
      >
        {/* AdSense or sponsor creative goes here */}
        <span className="select-none">広告枠</span>
      </div>
    </div>
  );
}

/** Small label indicating sponsored/ad content */
export function SponsorLabel({ label = "広告" }: { label?: string }) {
  return (
    <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase mb-1.5 select-none">
      {label}
    </span>
  );
}

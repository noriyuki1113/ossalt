interface AlternativeBadgeProps {
  competitor: string | null | undefined;
  size?: "sm" | "default";
}

// Values that look like placeholders or catch-alls — suppress the badge
const INVALID_COMPETITORS = new Set([
  "有料SaaS", "有料SaaSサービス", "商用ツール", "その他",
  "unknown", "Unknown", "n/a", "N/A", "TBD", "tbd", "none", "None", "-",
]);

export function AlternativeBadge({ competitor, size = "default" }: AlternativeBadgeProps) {
  if (!competitor || INVALID_COMPETITORS.has(competitor.trim())) return null;

  const isSm = size === "sm";
  return (
    <span className={`inline-flex items-center font-medium text-primary bg-primary/10 rounded-md ${isSm ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5 border border-primary/15"}`}>
      {competitor} の代替
    </span>
  );
}

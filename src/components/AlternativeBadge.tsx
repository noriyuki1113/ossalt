interface AlternativeBadgeProps {
  competitor: string | null | undefined;
  size?: "sm" | "default";
}

export function AlternativeBadge({ competitor, size = "default" }: AlternativeBadgeProps) {
  if (!competitor || competitor === "有料SaaS") return null;

  const isSm = size === "sm";
  return (
    <span className={`inline-flex items-center font-medium text-primary bg-primary/10 rounded-md ${isSm ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5 border border-primary/15"}`}>
      {competitor} の代替
    </span>
  );
}

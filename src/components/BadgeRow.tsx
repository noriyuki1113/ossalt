import { Badge } from "@/components/ui/badge";

interface BadgeItem {
  label: string;
  active?: boolean;
}

export function BadgeRow({ items }: { items: BadgeItem[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.filter(i => i.active).map((item) => (
        <Badge key={item.label} variant="secondary" className="text-xs font-normal">
          {item.label}
        </Badge>
      ))}
    </div>
  );
}

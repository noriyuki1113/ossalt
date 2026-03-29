import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterChipsProps {
  filters: {
    japaneseOnly: boolean;
    selfHostOnly: boolean;
    cloudOnly: boolean;
    ossOnly: boolean;
  };
  onToggle: (key: string) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
}

export function FilterChips({ filters, onToggle, sortBy = "popular", onSortChange }: FilterChipsProps) {
  const chips = [
    { key: "japaneseOnly", label: "日本語対応", active: filters.japaneseOnly },
    { key: "selfHostOnly", label: "セルフホスト", active: filters.selfHostOnly },
    { key: "cloudOnly", label: "クラウドあり", active: filters.cloudOnly },
    { key: "ossOnly", label: "OSS限定", active: filters.ossOnly },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onToggle(chip.key)}
          className={`
            inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all
            ${chip.active
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }
          `}
        >
          {chip.active && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          )}
          {chip.label}
        </button>
      ))}

      {onSortChange && (
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-8 w-[100px] rounded-full text-sm border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">人気順</SelectItem>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="stars">Stars順</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

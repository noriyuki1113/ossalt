import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  /** Size variant */
  size?: "default" | "hero";
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Notion, Zapier, Google Analytics, 認証, プロジェクト管理",
  onSubmit,
  size = "default",
}: SearchBarProps) {
  const isHero = size === "hero";

  return (
    <div className="relative flex items-center rounded-xl border border-border bg-card shadow-sm focus-within:shadow-md focus-within:border-primary/40 transition-all duration-200 mx-1 md:mx-0">
      <Search className={`absolute ${isHero ? "left-4 md:left-5" : "left-3.5 md:left-4"} h-4 w-4 md:h-5 md:w-5 text-muted-foreground/50`} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${isHero ? "h-12 md:h-16 pl-12 md:pl-14 pr-[5.5rem] md:pr-[7rem] text-sm md:text-base" : "h-11 md:h-12 pl-11 md:pl-12 pr-[5rem] md:pr-[5.5rem] text-sm"} w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-xl`}
      />
      <Button
        size="sm"
        className={`absolute right-2 rounded-lg font-semibold ${isHero ? "px-6 md:px-8 h-10 md:h-11 text-sm" : "px-5 h-9 text-xs"}`}
        onClick={onSubmit}
      >
        検索
      </Button>
    </div>
  );
}

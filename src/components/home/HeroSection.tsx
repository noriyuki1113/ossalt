import { SearchBar } from "@/components/SearchBar";
import { Search } from "lucide-react";
import { track } from "@/lib/track";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

const QUICK_CHIPS = [
  { label: "Notion", search: "Notion" },
  { label: "Slack", search: "Slack" },
  { label: "Zapier", search: "Zapier" },
  { label: "GA", search: "Google Analytics" },
  { label: "Figma", search: "Figma" },
  { label: "Jira", search: "Jira" },
];

export function HeroSection({ search, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle bg accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-primary/[0.025] rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-10 w-[250px] h-[250px] bg-primary/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="container relative pt-5 pb-4 md:pt-28 md:pb-24 text-center px-4">
        {/* Mobile: minimal tagline above search */}
        <p className="md:hidden text-xs text-muted-foreground mb-3">
          有料SaaSの代わりに使える<span className="text-foreground font-medium">OSS</span>を日本語で検索
        </p>

        {/* Desktop: full headline */}
        <h1 className="hidden md:block text-[2.75rem] md:text-5xl font-black leading-[1.2] text-foreground whitespace-nowrap">
          有料SaaS、もういらない。
        </h1>
        <p className="hidden md:block text-base text-muted-foreground mt-2">
          有料SaaSの代替OSSを日本語で検索・比較
        </p>

        {/* Search bar — the hero */}
        <div className="mt-1 md:mt-10 max-w-[640px] mx-auto">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Notion の代替を探す…"
            size="hero"
            onSubmit={() => {
              track("hero_search", { keyword: search });
              const el = document.getElementById("popular-alternatives");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Quick chips */}
          <div className="mt-2.5 md:mt-3 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            <span className="text-[11px] text-muted-foreground/50 mr-0.5 flex items-center gap-0.5">
              <Search className="h-2.5 w-2.5" />
              人気:
            </span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => { track("quick_chip_click", { chip: chip.label }); onSearchChange(chip.search); }}
                className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Mobile value badges — compact, below chips */}
          <div className="md:hidden flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground/60">
            <span>✓ 完全無料</span>
            <span>✓ 日本語対応</span>
            <span>✓ OSS限定</span>
          </div>
        </div>
      </div>
    </section>
  );
}

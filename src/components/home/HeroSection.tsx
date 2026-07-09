import { SearchBar } from "@/components/SearchBar";
import { Search } from "lucide-react";
import { track } from "@/lib/track";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
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
      {/* Background accent blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-1/4 w-[400px] h-[400px] bg-primary/[0.07] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/[0.06] rounded-full blur-[90px]" />
      </div>

      <div className="container relative pt-12 pb-8 md:pt-28 md:pb-24 text-center px-4">
        {/* Headline — visible on all breakpoints */}
        <h1 className="text-[1.75rem] md:text-5xl font-black leading-[1.15] text-foreground">
          有料SaaSの代わりに使えるOSSを探す
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3 md:mt-3 leading-relaxed max-w-md md:max-w-xl mx-auto">
          Notion・Zapier・Figmaなどの代替OSSを、
          <br className="hidden sm:inline" />
          日本語で検索・比較できます。
        </p>

        {/* Search bar — the hero */}
        <div className="mt-5 md:mt-10 max-w-[640px] mx-auto">
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
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            <span className="text-[11px] text-muted-foreground/50 mr-0.5 flex items-center gap-0.5">
              <Search className="h-2.5 w-2.5" />
              人気:
            </span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => { track("quick_chip_click", { chip: chip.label }); onSearchChange(chip.search); }}
                className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Value badges */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-muted-foreground">
            <span>✓ 完全無料</span>
            <span>✓ 日本語対応</span>
            <span>✓ OSS限定</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

const QUICK_CHIPS = [
  { label: "Notion", search: "Notion" },
  { label: "Slack", search: "Slack" },
  { label: "Zapier", search: "Zapier" },
  { label: "Google Analytics", search: "Google Analytics" },
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

      <div className="container relative pt-6 pb-5 md:pt-28 md:pb-24 text-center px-4">
        <p className="text-[13px] md:text-base text-muted-foreground mb-2 md:mb-0 md:order-none">
          有料SaaSの代替OSSを日本語で検索
        </p>
        <h1 className="hidden md:block text-[2.75rem] md:text-5xl font-black leading-[1.2] text-foreground whitespace-nowrap mt-1">
          有料SaaS、もういらない。
        </h1>

        <div className="mt-3 md:mt-10 max-w-[640px] mx-auto">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Notion の代替を探す…"
            size="hero"
            onSubmit={() => {
              const el = document.getElementById("popular-alternatives");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Quick chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            <span className="text-[11px] text-muted-foreground/50 mr-0.5">人気:</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSearchChange(chip.search)}
                className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

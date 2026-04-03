import { SearchBar } from "@/components/SearchBar";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

export function HeroSection({ search, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle bg accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-primary/[0.025] rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-10 w-[250px] h-[250px] bg-primary/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="container relative pt-14 pb-12 md:pt-28 md:pb-24 text-center px-5">
        <h1 className="text-[1.65rem] sm:text-[2.75rem] md:text-5xl font-black leading-[1.2] text-foreground">
          有料SaaS、もういらない。
        </h1>

        <p className="mt-4 md:mt-6 text-[13px] md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          680以上の高品質なOSSツールを、日本語で簡単に検索。データ主権とコスト削減の両立へ、最適な選択肢を見つけよう。
        </p>

        <div className="mt-8 md:mt-12 max-w-[640px] mx-auto">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            size="hero"
            onSubmit={() => {
              const el = document.getElementById("popular-alternatives");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <p className="mt-3 text-xs text-muted-foreground/50">
            例: Notion、Slack、Jira、Google Analytics など
          </p>
        </div>
      </div>
    </section>
  );
}

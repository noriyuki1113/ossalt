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

      <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        <h1 className="text-3xl sm:text-[2.75rem] md:text-5xl font-black leading-[1.15] text-foreground">
          有料SaaS、もういらない。
        </h1>

        <p className="mt-5 md:mt-6 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          680以上の高品質なOSSツールを、日本語で簡単に検索。
          <br />
          データ主権とコスト削減の両立へ、最適な選択肢を見つけよう。
        </p>

        <div className="mt-10 md:mt-12 max-w-[640px] mx-auto">
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
            Examples: Notion, Zapier, Google Analytics
          </p>
        </div>
      </div>
    </section>
  );
}

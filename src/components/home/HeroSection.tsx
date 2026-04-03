import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

export function HeroSection({ search, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle network/node background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-primary/[0.025] rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-10 w-[250px] h-[250px] bg-primary/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        {/* Headline — large, bold, spacious */}
        <h1 className="text-3xl sm:text-[2.75rem] md:text-5xl font-black leading-[1.15] text-foreground">
          有料SaaS、もういらない。
        </h1>

        {/* Subtitle — clean 2-line */}
        <p className="mt-5 md:mt-6 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          680以上の高品質なOSSツールを、日本語で簡単に検索。
          <br />
          データ主権とコスト削減の両立へ、最適な選択肢を見つけよう。
        </p>

        {/* ─── Search bar — prominent, wide ─── */}
        <div className="mt-10 md:mt-12 max-w-[640px] mx-auto">
          <div className="relative flex items-center rounded-xl border border-border bg-card shadow-sm focus-within:shadow-md focus-within:border-primary/40 transition-all duration-200">
            <Search className="absolute left-5 h-5 w-5 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Notion, Zapier, Google Analytics, 認証, プロジェクト管理"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-14 md:h-16 w-full bg-transparent pl-13 md:pl-14 pr-[6rem] md:pr-[7rem] text-sm md:text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-xl"
            />
            <Button
              size="default"
              className="absolute right-2 rounded-lg px-6 md:px-8 h-10 md:h-11 text-sm font-semibold"
              onClick={() => {
                const el = document.getElementById("popular-alternatives");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              検索
            </Button>
          </div>

          {/* Example hint — subtle */}
          <p className="mt-3 text-xs text-muted-foreground/50">
            Examples: Notion, Zapier, Google Analytics
          </p>
        </div>
      </div>
    </section>
  );
}

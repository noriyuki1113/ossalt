import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_CHIPS = [
  { label: "Notionの代替", category: "Notion" },
  { label: "Zapierの代替", category: "Zapier" },
  { label: "Slackの代替", category: "Slack" },
  { label: "セルフホスト可", category: "セルフホスト" },
];

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

export function HeroSection({ search, onSearchChange, onCategorySelect }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-card border-b border-border">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent rounded-full blur-[100px]" />
      </div>

      <div className="container relative py-16 md:py-24 text-center max-w-3xl mx-auto">
        {/* Main headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] text-foreground">
          有料SaaS、もういらない。
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          680以上の高品質なOSSツールを、日本語で簡単に検索。
          <br className="hidden sm:block" />
          データ主権とコスト削減の両立へ、最適な選択肢を見つけよう。
        </p>

        {/* Search bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center rounded-xl border border-border bg-background shadow-sm">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Notion, Zapier, Google Analytics, 認証, プロジェクト管理"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-13 md:h-14 w-full rounded-xl bg-transparent pl-12 pr-24 text-sm md:text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <Button
              size="sm"
              className="absolute right-2 rounded-lg px-5 h-9 text-sm font-semibold"
              onClick={() => {
                const el = document.getElementById("popular-alternatives");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              検索
            </Button>
          </div>
        </div>

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSearchChange(chip.category)}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Value badges */}
        <div className="mt-8 flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {[
            { emoji: "🌐", text: "日本語で探せる" },
            { emoji: "💻", text: "OSS限定" },
            { emoji: "🖥️", text: "セルフホスト対応" },
            { emoji: "🆓", text: "ログイン不要・無料" },
          ].map(({ emoji, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{emoji}</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

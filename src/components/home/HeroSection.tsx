import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_CHIPS = [
  { label: "Notionの代替", search: "Notion" },
  { label: "Zapierの代替", search: "Zapier" },
  { label: "Slackの代替", search: "Slack" },
  { label: "Google Analyticsの代替", search: "Google Analytics" },
  { label: "セルフホスト可", search: "セルフホスト" },
];

const VALUE_BADGES = [
  "🌐 日本語で探せる",
  "💻 OSS限定",
  "🖥️ セルフホスト対応",
  "🆓 ログイン不要・無料",
];

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

export function HeroSection({ search, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-card border-b border-border">
      {/* Subtle bg accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="container relative pt-14 pb-12 md:pt-20 md:pb-16 text-center">
        {/* Headline */}
        <h1 className="text-[1.75rem] sm:text-4xl md:text-[2.75rem] font-black tracking-tight leading-[1.2] text-foreground whitespace-nowrap">
          有料SaaS、もういらない。
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-[13px] sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
          680以上の高品質なOSSツールを、日本語で簡単に検索。
          <br />
          データ主権とコスト削減の両立へ、最適な選択肢を見つけよう。
        </p>

        {/* ─── Search bar ─── */}
        <div className="mt-8 md:mt-10 max-w-2xl mx-auto px-1">
          <div className="relative flex items-center rounded-2xl border border-border bg-background shadow-sm ring-1 ring-transparent focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
            <Search className="absolute left-4 md:left-5 h-5 w-5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Notion, Zapier, Google Analytics, 認証, プロジェクト管理"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-14 md:h-[3.75rem] w-full rounded-2xl bg-transparent pl-12 md:pl-14 pr-[5.5rem] text-sm md:text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <Button
              size="sm"
              className="absolute right-2 rounded-xl px-5 md:px-6 h-10 text-sm font-semibold shadow-sm"
              onClick={() => {
                const el = document.getElementById("popular-alternatives");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              検索
            </Button>
          </div>

          {/* Example hint */}
          <p className="mt-2.5 text-[11px] text-muted-foreground/50">
            Examples: Notion, Zapier, Google Analytics
          </p>
        </div>

        {/* ─── Quick chips ─── */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSearchChange(chip.search)}
              className="text-xs px-3.5 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/[0.04] transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* ─── Value badges ─── */}
        <div className="mt-8 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
          {VALUE_BADGES.map((badge) => (
            <span key={badge} className="text-xs text-muted-foreground tracking-wide">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

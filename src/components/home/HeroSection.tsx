import { SearchBar } from "@/components/SearchBar";
import { track } from "@/lib/track";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const QUICK_CHIPS = [
  { label: "Notion代替", search: "Notion" },
  { label: "Airtable代替", search: "Airtable" },
  { label: "Google Analytics代替", search: "Google Analytics" },
  { label: "Slack代替", search: "Slack" },
  { label: "Zapier代替", search: "Zapier" },
  { label: "Figma代替", search: "Figma" },
];

export function HeroSection({ search, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden flex items-center min-h-[88vh] md:min-h-[80vh]">
      {/* Mesh gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.13] rounded-full blur-[130px] animate-float" />
        <div className="absolute -top-20 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-accent/[0.10] rounded-full blur-[110px] animate-float [animation-delay:2.5s]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-blue-600/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 py-20 md:py-28 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-8">
          <span
            className="w-1.5 h-1.5 bg-green-500 rounded-full"
            style={{ boxShadow: "0 0 6px #22c55e" }}
          />
          <span className="text-xs text-primary font-medium tracking-wide">280+ OSSツールを収録</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.6rem] font-black leading-[1.12] tracking-[-0.03em] mb-5 max-w-3xl mx-auto min-h-[8.4rem] sm:min-h-[11rem] md:min-h-[14rem]">
          高額SaaSを<br />
          <span className="text-gradient">OSSで代替する</span><br />
          最短ルートを探す
        </h1>

        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto mb-10 min-h-[4.5rem] md:min-h-[5.5rem]">
          Notion・Airtable・Google Analytics…<br />
          使い続けるのか、OSSに切り替えるのか。<br />
          日本語で比較・検討できる唯一のディレクトリ。
        </p>

        {/* Search */}
        <div className="max-w-[620px] mx-auto mb-5">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="「Notion 代替」「セルフホスト」「無料 BI」など..."
            size="hero"
            onSubmit={() => track("hero_search", { keyword: search })}
          />
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                track("quick_chip_click", { chip: chip.label });
                onSearchChange(chip.search);
              }}
              className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:bg-primary/[0.06] hover:text-primary hover:-translate-y-0.5 transition-all duration-150"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Value props */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <span className="text-green-500/80">✓</span> 完全無料
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-500/80">✓</span> 日本語対応
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-500/80">✓</span> OSS限定
          </span>
        </div>
      </div>
    </section>
  );
}

import { SearchBar } from "@/components/SearchBar";
import { track } from "@/lib/track";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const QUICK_CHIPS = [
  { label: "Notion代替", search: "Notion" },
  { label: "Airtable代替", search: "Airtable" },
  { label: "Google Analytics代替", search: "Google Analytics" },
  { label: "Slack代替", search: "Slack" },
  { label: "Zapier代替", search: "Zapier" },
  { label: "Figma代替", search: "Figma" },
];

export function HeroSection({ search, onSearchChange, onSearchSubmit }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden flex items-center">
      {/* Mesh gradient blobs — static (no animation): a continuously animated
          transform on a heavily blurred layer forces the browser to
          recomposite an expensive blur every frame, which reads as jank/
          freezing on load, especially on mobile GPUs. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.13] rounded-full blur-[130px]" />
        <div className="absolute -top-20 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-accent/[0.10] rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-blue-600/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 py-8 md:py-12 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
          <span
            className="w-1.5 h-1.5 bg-green-500 rounded-full"
            style={{ boxShadow: "0 0 6px #22c55e" }}
          />
          <span className="text-xs text-primary font-medium tracking-wide">280+ OSSツールを収録</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.6rem] font-black leading-[1.12] tracking-[-0.03em] mb-5 max-w-3xl mx-auto">
          いま使っているSaaSの<br />
          <span className="text-gradient">代替OSSを探す</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
          Notion・Airtable・Google Analytics…<br />
          使い続けるのか、OSSに切り替えるのか。<br />
          日本語の紹介と比較で、用途に合うツールを探せます。
        </p>

        {/* Search */}
        <div className="max-w-[620px] mx-auto mb-5">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="代替を探したいサービス名（例：Notion）"
            size="hero"
            onSubmit={() => { track("hero_search", { keyword: search }); onSearchSubmit(); }}
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
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="text-green-500/80">✓</span> サイト利用無料
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-500/80">✓</span> 日本語で紹介
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-500/80">✓</span> 比較記事あり
          </span>
        </div>
      </div>
    </section>
  );
}

import { ArrowDown, CheckCircle2, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { track } from "@/lib/track";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const QUICK_CHIPS = [
  { label: "Notion", search: "Notion" },
  { label: "Slack", search: "Slack" },
  { label: "Figma", search: "Figma" },
  { label: "Zapier", search: "Zapier" },
  { label: "Google Analytics", search: "Google Analytics" },
];

export function HeroSection({ search, onSearchChange, onSearchSubmit }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-[8%] top-20 h-40 w-40 rounded-full border border-primary/25" />
        <div className="absolute left-[6%] top-44 h-16 w-16 rounded-full bg-accent/15 blur-xl" />
      </div>

      <div className="container relative py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> 日本語で探す OSS移行ナビ
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-[-0.04em] text-foreground md:text-6xl">
            使っているSaaSを、
            <span className="block text-gradient">次の選択肢へ。</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            サービス名から代替OSSを探し、導入条件を比較し、公式情報を確認する。
            <br className="hidden md:block" />移行の判断を日本語で支えます。
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="置き換えたいサービス名を入力（例：Notion）"
              size="hero"
              onSubmit={() => { track("hero_search", { keyword: search, journey: "rebuild" }); onSearchSubmit(); }}
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="mr-1 py-1 text-xs text-muted-foreground">よく探されるサービス</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => { track("quick_chip_click", { chip: chip.label, journey: "rebuild" }); onSearchChange(chip.search); }}
                className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-primary/10"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {["サービス別の代替候補", "比較・導入ガイド", "公式情報への導線"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-5 text-muted-foreground">
        <ArrowDown className="h-4 w-4" />
      </div>
    </section>
  );
}

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatsBar } from "@/components/StatsBar";
import { ValueProps } from "@/components/home/ValueProps";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const POPULAR_CATEGORIES = [
  { label: "AI・ML", category: "AI・ML" },
  { label: "開発ツール", category: "開発ツール" },
  { label: "業務ソフト", category: "業務ソフト" },
  { label: "インフラ・運用", category: "インフラ・運用" },
  { label: "セキュリティ", category: "セキュリティ" },
];

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

export function HeroSection({ search, onSearchChange, onCategorySelect }: HeroSectionProps) {
  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-accent/4 rounded-full blur-[100px]" />
      </div>

      <div className="container relative py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-xs text-muted-foreground mb-6 animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          680+ のOSSツールを日本語で検索
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] animate-fade-in" style={{ animationDelay: '100ms' }}>
          <span className="text-gradient">有料SaaS、もういらない。</span>
        </h1>

        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          毎月のSaaSコストを、OSSで削減しよう
        </p>

        {/* Value Props */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <ValueProps />
        </div>

        {/* Search */}
        <div className="mt-8 max-w-xl mx-auto relative animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="ツール名やカテゴリで検索…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-14 pl-12 pr-4 rounded-xl text-base border-border/60 bg-card/80 backdrop-blur-sm focus-visible:ring-primary focus-visible:border-primary/50 placeholder:text-muted-foreground/60"
          />
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-xl px-8 text-base shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold"
            onClick={scrollToCatalog}
          >
            無料でOSSを探す
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-xl px-8 text-base border-border/60"
            onClick={() => onCategorySelect("すべて")}
          >
            代替ツールを見つける
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '550ms', animationFillMode: 'both' }}>
          ログイン不要・無料
        </p>

        {/* Popular category chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <span className="text-xs text-muted-foreground mr-1 self-center">人気:</span>
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.category}
              onClick={() => onCategorySelect(cat.category)}
              className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
          <StatsBar />
        </div>
      </div>
    </section>
  );
}
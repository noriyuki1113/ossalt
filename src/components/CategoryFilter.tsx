import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/lib/category-tree";

// Kept for the deferred pages (Ranking.tsx, use-tools.ts, search-client.ts)
// that still query the old `tools` table by its long-form Japanese category
// value. Not used by the CategoryFilter component itself anymore — Phase A's
// Index.tsx sources categories dynamically via useCategories() instead.
export const CATEGORY_MAP: Record<string, string> = {
  "すべて": "すべて",
  "AI・ML": "AI・機械学習",
  "業務ソフト": "ビジネスソフトウェア",
  "開発ツール": "開発者ツール",
  "インフラ・運用": "インフラ・運用",
  "データ・分析": "データ・分析",
  "コンテンツ": "コンテンツ・パブリッシング",
  "生産性・便利ツール": "生産性・ユーティリティ",
  "セキュリティ": "セキュリティ・プライバシー",
  "コミュニティ": "コミュニティ・ソーシャル",
  "その他": "その他",
};

interface CategoryFilterProps {
  categories: CategoryNode[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilter({ categories, selectedSlug, onSelect }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-1.5">
      <div className="flex gap-1.5 px-1.5 pb-1">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all",
            selectedSlug === null
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          )}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={cn(
              "shrink-0 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all",
              selectedSlug === cat.slug
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            {cat.nameJa}
          </button>
        ))}
      </div>
    </div>
  );
}

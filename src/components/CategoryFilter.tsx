import { cn } from "@/lib/utils";

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

const CATEGORIES = Object.keys(CATEGORY_MAP);

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-1.5">
      <div className="flex gap-1.5 px-1.5 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              "shrink-0 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all",
              selected === cat
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

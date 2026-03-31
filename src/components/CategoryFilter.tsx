import { cn } from "@/lib/utils";

const CATEGORIES = [
  "すべて",
  "AI・機械学習",
  "ビジネスソフトウェア",
  "開発者ツール",
  "インフラ・運用",
  "データ・分析",
  "コンテンツ・パブリッシング",
  "生産性・ユーティリティ",
  "セキュリティ・プライバシー",
  "コミュニティ・ソーシャル",
  "その他",
];

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
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all",
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

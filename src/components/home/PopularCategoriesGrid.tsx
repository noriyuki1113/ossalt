import { Link } from "react-router-dom";
import { Brain, Code2, Server, BarChart2, FileText, Zap, Shield, Users, Box, ArrowRight } from "lucide-react";
import { useToolCategories } from "@/hooks/use-tools";
import { track } from "@/lib/track";

const CATEGORIES = [
  { slug: "ai-ml",            label: "AI・ML",          icon: Brain,    color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-950/30",  border: "border-violet-100 dark:border-violet-900/40" },
  { slug: "developer-tools",  label: "開発ツール",      icon: Code2,    color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-950/30",      border: "border-blue-100 dark:border-blue-900/40" },
  { slug: "infrastructure",   label: "インフラ・運用",  icon: Server,   color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-950/30",  border: "border-orange-100 dark:border-orange-900/40" },
  { slug: "data-analytics",   label: "データ・分析",    icon: BarChart2,color: "text-cyan-500",    bg: "bg-cyan-50 dark:bg-cyan-950/30",      border: "border-cyan-100 dark:border-cyan-900/40" },
  { slug: "content",          label: "コンテンツ",      icon: FileText, color: "text-green-500",   bg: "bg-green-50 dark:bg-green-950/30",    border: "border-green-100 dark:border-green-900/40" },
  { slug: "productivity",     label: "生産性・便利",    icon: Zap,      color: "text-yellow-500",  bg: "bg-yellow-50 dark:bg-yellow-950/30",  border: "border-yellow-100 dark:border-yellow-900/40" },
  { slug: "security",         label: "セキュリティ",    icon: Shield,   color: "text-red-500",     bg: "bg-red-50 dark:bg-red-950/30",        border: "border-red-100 dark:border-red-900/40" },
  { slug: "community",        label: "コミュニティ",    icon: Users,    color: "text-pink-500",    bg: "bg-pink-50 dark:bg-pink-950/30",      border: "border-pink-100 dark:border-pink-900/40" },
  { slug: "business",         label: "業務ソフト",      icon: Box,      color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-950/30",  border: "border-indigo-100 dark:border-indigo-900/40" },
  { slug: "other",            label: "その他",          icon: ArrowRight,color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-950/30",    border: "border-slate-100 dark:border-slate-900/40" },
];

const JA_TO_SLUG: Record<string, string> = {
  "AI・ML": "ai-ml",
  "開発ツール": "developer-tools",
  "インフラ・運用": "infrastructure",
  "データ・分析": "data-analytics",
  "コンテンツ": "content",
  "生産性・便利ツール": "productivity",
  "セキュリティ": "security",
  "コミュニティ": "community",
  "業務ソフト": "business",
  "その他": "other",
};

export function PopularCategoriesGrid() {
  const { data: categoryData } = useToolCategories();

  const countMap: Record<string, number> = {};
  if (categoryData) {
    for (const c of categoryData) {
      const slug = JA_TO_SLUG[c.name];
      if (slug) countMap[slug] = c.count;
    }
  }

  return (
    <section id="categories" className="container py-14 md:py-20">
      <div className="mb-6 text-center">
        <h2 className="section-title">カテゴリから探す</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          用途別にOSSを絞り込み。
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {CATEGORIES.map(({ slug, label, icon: Icon, color, bg, border }) => {
          const count = countMap[slug];
          return (
            <Link
              key={slug}
              to={`/category/${slug}`}
              onClick={() => track("category_click", { category: slug })}
              className={`group flex items-center gap-3 rounded-xl border ${border} ${bg} px-3.5 py-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all duration-150 cursor-pointer touch-manipulation min-h-[56px]`}
            >
              <div className={`shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                  {label}
                </p>
                {count != null && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{count}件</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

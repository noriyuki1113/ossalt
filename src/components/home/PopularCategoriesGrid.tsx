import { Link } from "react-router-dom";
import { Brain, Code2, Server, BarChart2, FileText, Zap, Shield, Users, Box, ArrowRight } from "lucide-react";
import { useToolCategories } from "@/hooks/use-tools";
import { track } from "@/lib/track";

const CATEGORIES = [
  { slug: "ai-ml",           label: "AI・ML",         icon: Brain,     color: "text-violet-400",  bg: "bg-violet-500/10"  },
  { slug: "developer-tools", label: "開発ツール",     icon: Code2,     color: "text-blue-400",    bg: "bg-blue-500/10"    },
  { slug: "infrastructure",  label: "インフラ・運用", icon: Server,    color: "text-orange-400",  bg: "bg-orange-500/10"  },
  { slug: "data-analytics",  label: "データ・分析",   icon: BarChart2, color: "text-cyan-400",    bg: "bg-cyan-500/10"    },
  { slug: "content",         label: "コンテンツ",     icon: FileText,  color: "text-green-400",   bg: "bg-green-500/10"   },
  { slug: "productivity",    label: "生産性・便利",   icon: Zap,       color: "text-yellow-400",  bg: "bg-yellow-500/10"  },
  { slug: "security",        label: "セキュリティ",   icon: Shield,    color: "text-red-400",     bg: "bg-red-500/10"     },
  { slug: "community",       label: "コミュニティ",   icon: Users,     color: "text-pink-400",    bg: "bg-pink-500/10"    },
  { slug: "business",        label: "業務ソフト",     icon: Box,       color: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  { slug: "other",           label: "その他",         icon: ArrowRight, color: "text-slate-400", bg: "bg-slate-500/10"   },
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
      <div className="mb-8 text-center">
        <div className="section-badge-primary">
          <span>カテゴリ</span>
        </div>
        <h2 className="section-title">どのSaaSを<span className="text-gradient">置き換えたい</span>？</h2>
        <p className="section-subtitle">用途別にOSSを絞り込めます</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map(({ slug, label, icon: Icon, color, bg }) => {
          const count = countMap[slug];
          return (
            <Link
              key={slug}
              to={`/category/${slug}`}
              onClick={() => track("category_click", { category: slug })}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg} flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">
                  {label}
                </p>
                {count != null && (
                  <p className="text-xs text-muted-foreground mt-0.5">{count}件</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { useCategoryProductCount } from "@/hooks/use-data";

const categoryEmoji: Record<string, string> = {
  "form-survey": "📝",
  "collaboration-chat": "💬",
  "project-management": "📋",
  "cms": "🌐",
  "ecommerce": "🛒",
  "analytics": "📊",
};

export function CategoryCard({ category }: { category: any }) {
  const { data: count } = useCategoryProductCount(category.id);

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="surface-elevated rounded-lg p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      <span className="text-3xl">{categoryEmoji[category.slug] || "📦"}</span>
      <h2 className="mt-3 font-semibold group-hover:text-primary transition-colors">{category.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{category.description}</p>
      {typeof count === "number" && (
        <p className="mt-2 text-xs text-muted-foreground">{count} ツール</p>
      )}
    </Link>
  );
}

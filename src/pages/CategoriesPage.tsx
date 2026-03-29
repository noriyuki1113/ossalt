import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LoadingState, ErrorState } from "@/components/StateDisplays";
import { useCategories } from "@/hooks/use-data";

const categoryIcons: Record<string, string> = {
  "form": "📝", "note-wiki": "📓", "chat": "💬", "project-management": "📋",
  "cms": "🌐", "ec": "🛒", "analytics": "📊", "email": "📧",
  "automation": "⚡", "crm": "👥", "payment": "💳", "dev-tools": "🔧",
};

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <SiteLayout>
      <div className="container py-10">
        <Breadcrumbs items={[{ label: "カテゴリ" }]} />
        <h1 className="text-3xl font-bold">カテゴリ一覧</h1>
        <p className="mt-2 text-muted-foreground">目的や用途別にツールを探せます</p>

        {isLoading ? <LoadingState /> : error ? <ErrorState /> : (
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="surface-elevated rounded-lg p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <span className="text-3xl">{categoryIcons[cat.slug] || "📦"}</span>
                <h2 className="mt-3 font-semibold group-hover:text-primary transition-colors">{cat.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

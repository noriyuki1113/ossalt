import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryCard } from "@/components/CategoryCard";
import { LoadingState, ErrorState } from "@/components/StateDisplays";
import { useCategories } from "@/hooks/use-data";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <SiteLayout>
      <div className="container py-10">
        <Breadcrumbs items={[{ label: "カテゴリ" }]} />
        <h1 className="text-3xl font-bold">カテゴリ一覧</h1>
        <p className="mt-2 text-muted-foreground">用途・目的別にオープンソースツールを探す</p>

        {isLoading ? <LoadingState /> : error ? <ErrorState /> : (
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories?.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

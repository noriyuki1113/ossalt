import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryCard } from "@/components/CategoryCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/StateDisplays";
import { useCategories } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  useSeo({
    title: "カテゴリ一覧 — 用途別にオープンソースツールを探す",
    description: "フォーム、チャット、CMS、EC、プロジェクト管理など、用途別にオープンソースの代替ツールを探せます。",
    canonical: "https://altfinder.jp/categories",
  });

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14">
        <Breadcrumbs items={[{ label: "カテゴリ" }]} />

        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold">カテゴリ一覧</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            用途・目的別にオープンソースツールを探す。各カテゴリには代替候補が登録されています。
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : error ? (
            <ErrorState />
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories?.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

import { useParams } from "react-router-dom";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { SearchInput } from "@/components/SearchInput";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateDisplays";
import { useCategory, useProducts } from "@/hooks/use-data";

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: catLoading } = useCategory(slug || "");
  const [search, setSearch] = useState("");
  const [japaneseOnly, setJapaneseOnly] = useState(false);
  const [ossOnly, setOssOnly] = useState(false);
  const [selfHostOnly, setSelfHostOnly] = useState(false);
  const [cloudOnly, setCloudOnly] = useState(false);

  const { data: products, isLoading: productsLoading } = useProducts({
    categorySlug: slug,
    search: search || undefined,
    japaneseOnly: japaneseOnly || undefined,
    ossOnly: ossOnly || undefined,
    selfHostOnly: selfHostOnly || undefined,
    cloudOnly: cloudOnly || undefined,
  });

  if (catLoading) return <SiteLayout><div className="container py-10"><LoadingState /></div></SiteLayout>;
  if (!category) return <SiteLayout><div className="container py-10"><ErrorState message="カテゴリが見つかりません" /></div></SiteLayout>;

  return (
    <SiteLayout>
      <div className="container py-10">
        <Breadcrumbs items={[{ label: "カテゴリ", href: "/categories" }, { label: category.name }]} />
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>

        <div className="mt-6 space-y-4">
          <SearchInput value={search} onChange={setSearch} placeholder="このカテゴリ内を検索..." className="max-w-lg" />
          <FilterBar
            japaneseOnly={japaneseOnly} setJapaneseOnly={setJapaneseOnly}
            ossOnly={ossOnly} setOssOnly={setOssOnly}
            selfHostOnly={selfHostOnly} setSelfHostOnly={setSelfHostOnly}
            cloudOnly={cloudOnly} setCloudOnly={setCloudOnly}
          />
        </div>

        <div className="mt-8">
          {productsLoading ? <LoadingState /> : products && products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">{products.length} 件のツール</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          ) : (
            <EmptyState title="このカテゴリにはまだツールがありません" />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

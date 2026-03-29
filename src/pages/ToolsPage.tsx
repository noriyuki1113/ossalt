import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { SearchInput } from "@/components/SearchInput";
import { FilterBar } from "@/components/FilterBar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState, EmptyState } from "@/components/StateDisplays";
import { useProducts, useCategories } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { useSeo } from "@/hooks/use-seo";

export default function ToolsPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [japaneseOnly, setJapaneseOnly] = useState(false);
  const [ossOnly, setOssOnly] = useState(false);
  const [selfHostOnly, setSelfHostOnly] = useState(false);
  const [cloudOnly, setCloudOnly] = useState(false);

  useSeo({
    title: "ツール一覧 — オープンソース代替サービスを検索",
    description: "オープンソースの代替サービスを検索・フィルタリング。日本語対応やセルフホスト可否でツールを絞り込めます。",
    canonical: "https://altfinder.jp/products",
  });

  const { data: products, isLoading, error } = useProducts({
    search: searchQuery || undefined,
    categorySlug: selectedCategory || undefined,
    japaneseOnly: japaneseOnly || undefined,
    ossOnly: ossOnly || undefined,
    selfHostOnly: selfHostOnly || undefined,
    cloudOnly: cloudOnly || undefined,
  });
  const { data: categories } = useCategories();

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14">
        <Breadcrumbs items={[{ label: "ツール一覧" }]} />
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold">ツール一覧</h1>
          <p className="mt-3 text-lg text-muted-foreground">オープンソースの代替サービスを検索・フィルタリング</p>
        </div>

        <div className="mt-8 space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="ツール名で検索..." className="max-w-md" />

          <FilterBar
            japaneseOnly={japaneseOnly} setJapaneseOnly={setJapaneseOnly}
            ossOnly={ossOnly} setOssOnly={setOssOnly}
            selfHostOnly={selfHostOnly} setSelfHostOnly={setSelfHostOnly}
            cloudOnly={cloudOnly} setCloudOnly={setCloudOnly}
          />

          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedCategory === "" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setSelectedCategory("")}>すべて</Badge>
              {categories.map((cat) => (
                <Badge key={cat.id} variant={selectedCategory === cat.slug ? "default" : "secondary"} className="cursor-pointer" onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}>{cat.name}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : error ? (
            <ErrorState />
          ) : products && products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-5">{products.length} 件のツール</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          ) : (
            <EmptyState title="ツールが見つかりませんでした" description="検索条件を変更してみてください" />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

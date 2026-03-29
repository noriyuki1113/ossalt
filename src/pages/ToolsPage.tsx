import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateDisplays";
import { useProducts, useCategories, useTags } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const { data: products, isLoading, error } = useProducts({
    search: searchQuery || undefined,
    categorySlug: selectedCategory || undefined,
    tagSlug: selectedTag || undefined,
  });
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  return (
    <SiteLayout>
      <div className="container py-10">
        <Breadcrumbs items={[{ label: "ツール一覧" }]} />
        <h1 className="text-3xl font-bold">ツール一覧</h1>
        <p className="mt-2 text-muted-foreground">すべてのサービスを検索・絞り込みできます</p>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="サービス名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category filters */}
        {categories && categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("")}
            >
              すべて
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.slug ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-8">
          {isLoading ? <LoadingState /> : error ? <ErrorState /> : products && products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <EmptyState title="ツールが見つかりませんでした" description="検索条件を変更してみてください" />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

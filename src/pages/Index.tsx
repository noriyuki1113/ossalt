import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Layers, RefreshCw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { AlternativeCard } from "@/components/AlternativeCard";
import { CategoryCard } from "@/components/CategoryCard";
import { LoadingState, EmptyState } from "@/components/StateDisplays";
import { useProducts, useCategories, useAlternatives } from "@/hooks/use-data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: featuredProducts, isLoading: productsLoading } = useProducts({ featured: true });
  const { data: jpProducts } = useProducts({ japaneseOnly: true });
  const { data: categories } = useCategories();
  const { data: alternatives } = useAlternatives({ featured: true });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            OSSで見つける最適な代替サービス
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            商用SaaSの
            <span className="text-gradient">オープンソース代替</span>
            を比較しよう
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Notion、Slack、Shopifyなど人気サービスのOSS代替を日本語で比較。セルフホストやコスト削減に。
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ツール名で検索... (例: Notion, Slack, Typeform)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-full border-2 border-primary/20 focus-visible:border-primary"
            />
          </form>
        </div>
      </section>

      {/* Popular Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" />人気の代替ページ</h2>
              <p className="text-sm text-muted-foreground mt-1">よく検索されるサービスの代替を探す</p>
            </div>
            <Link to="/alternatives">
              <Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {alternatives.slice(0, 6).map((alt) => (
              <AlternativeCard key={alt.id} alternative={alt} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-secondary/30 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />カテゴリ</h2>
              <p className="text-sm text-muted-foreground mt-1">用途別にツールを探す</p>
            </div>
            <Link to="/categories">
              <Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories?.slice(0, 6).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">注目のOSSツール</h2>
            <p className="text-sm text-muted-foreground mt-1">厳選されたオープンソースの代替サービス</p>
          </div>
          <Link to="/products">
            <Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </Link>
        </div>
        {productsLoading ? (
          <LoadingState />
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="まだツールが登録されていません" description="管理画面からツールを追加してください" />
        )}
      </section>

      {/* Japanese-friendly tools */}
      {jpProducts && jpProducts.length > 0 && (
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />日本語対応ツール</h2>
                <p className="text-sm text-muted-foreground mt-1">UIが日本語に対応しているツール</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jpProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">あなたのOSSツールを掲載しませんか？</h2>
          <p className="mt-2 text-primary-foreground/80">無料でツールを掲載して、日本のユーザーにリーチしましょう。</p>
          <Link to="/submit">
            <Button size="lg" variant="secondary" className="mt-6">掲載を申請する <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

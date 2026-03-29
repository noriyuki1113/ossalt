import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, ArrowRight, Sparkles, Layers, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard, SponsorCard } from "@/components/ProductCard";
import { AlternativeCard } from "@/components/AlternativeCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FilterChips } from "@/components/FilterChips";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/StateDisplays";
import { useProducts, useCategories, useAlternativesWithCounts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    japaneseOnly: false,
    selfHostOnly: false,
    cloudOnly: false,
    ossOnly: false,
  });
  const navigate = useNavigate();

  useSeo({
    title: "AltFinder.jp — オープンソース代替サービス比較",
    description: "Notion、Slack、Shopifyなど人気SaaSのオープンソース代替を日本語で比較。セルフホスト・コスト削減・プライバシー重視の方に。",
  });

  const activeFilters = {
    featured: true,
    ...(filters.japaneseOnly && { japaneseOnly: true }),
    ...(filters.selfHostOnly && { selfHostOnly: true }),
    ...(filters.cloudOnly && { cloudOnly: true }),
    ...(filters.ossOnly && { ossOnly: true }),
  };

  const { data: featuredProducts, isLoading: productsLoading } = useProducts({ featured: true });
  const { data: filteredProducts } = useProducts(activeFilters);
  const { data: categories } = useCategories();
  const { data: alternatives, isLoading: altsLoading } = useAlternativesWithCounts();
  const { data: allProducts, isLoading: allLoading } = useProducts({});

  const featuredAlts = alternatives?.filter(a => a.featured) || [];
  const sponsorProducts = featuredProducts?.slice(0, 3) || [];
  const popularProducts = allProducts?.slice(0, 8) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const toggleFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/[0.03] via-background to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            日本語で探せるオープンソース代替サービス
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Notion・Slack・Typeformなどの代替ツールをすぐに比較検索
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex gap-0">
            <Input
              placeholder="ツール名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-l-xl rounded-r-none border-r-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button type="submit" className="h-12 px-6 rounded-l-none rounded-r-xl text-base font-medium">
              検索
            </Button>
          </form>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="container -mt-2 mb-8">
        <div className="flex justify-center">
          <FilterChips filters={filters} onToggle={toggleFilter} />
        </div>
      </section>

      {/* Sponsor / Featured Tools */}
      <section className="container pb-14">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-bold">おすすめツール</h2>
          <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-400 text-xs font-medium">スポンサー</Badge>
        </div>
        {productsLoading ? (
          <LoadingSkeleton count={3} />
        ) : sponsorProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sponsorProducts.map((product) => (
              <SponsorCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      {/* Popular OSS Tools */}
      <section className="bg-secondary/40 py-14">
        <div className="container">
          <h2 className="text-xl font-bold mb-5">人気のオープンソースツール</h2>
          {allLoading ? (
            <LoadingSkeleton count={8} />
          ) : popularProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title="まだツールが登録されていません" />
          )}
          <div className="mt-6 text-center">
            <Link to="/products">
              <Button variant="outline" className="rounded-xl">
                すべてのツールを見る <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Alternatives */}
      <section className="container py-14">
        <SectionHeader
          title="人気の代替ページ"
          description="よく検索されるサービスのオープンソース代替を探す"
          action={<Link to="/alternatives"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>}
        />
        {altsLoading ? (
          <LoadingSkeleton count={6} />
        ) : featuredAlts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredAlts.slice(0, 6).map((alt) => (
              <AlternativeCard key={alt.id} alternative={alt} />
            ))}
          </div>
        ) : null}
      </section>

      {/* Categories */}
      <section className="bg-secondary/40 py-14">
        <div className="container">
          <SectionHeader
            title="カテゴリ"
            description="用途別にオープンソースツールを探す"
            icon={<Layers className="h-5 w-5 text-primary" />}
            action={<Link to="/categories"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            あなたのOSSツールを掲載しませんか？
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            無料でツールを掲載して、日本のユーザーにリーチしましょう。
          </p>
          <Link to="/submit">
            <Button size="lg" variant="secondary" className="mt-6 rounded-xl">
              掲載を申請する <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

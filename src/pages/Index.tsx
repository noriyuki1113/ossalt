import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, ArrowRight, Sparkles, Layers, RefreshCw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { AlternativeCard } from "@/components/AlternativeCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { LoadingState, EmptyState } from "@/components/StateDisplays";
import { useProducts, useCategories, useAlternativesWithCounts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useSeo({
    title: "AltFinder.jp — オープンソース代替サービス比較",
    description: "Notion、Slack、Shopifyなど人気SaaSのオープンソース代替を日本語で比較。セルフホスト・コスト削減・プライバシー重視の方に。",
  });

  const { data: featuredProducts, isLoading: productsLoading } = useProducts({ featured: true });
  const { data: jpProducts } = useProducts({ japaneseOnly: true });
  const { data: categories } = useCategories();
  const { data: alternatives, isLoading: altsLoading } = useAlternativesWithCounts();

  const featuredAlts = alternatives?.filter(a => a.featured) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            オープンソースで見つける最適な代替サービス
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            商用SaaSの
            <br className="hidden sm:block" />
            <span className="text-gradient">オープンソース代替</span>
            を比較
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Notion・Slack・Shopifyなど人気サービスのOSS代替を
            <br className="hidden md:block" />
            日本語で検索・比較できるディレクトリサイト
          </p>

          <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="ツール名で検索... (例: Notion, Slack, Typeform)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base rounded-2xl border-2 border-primary/20 focus-visible:border-primary shadow-sm"
            />
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            {["Notion", "Slack", "Shopify", "WordPress"].map((name) => (
              <Link
                key={name}
                to={`/alternatives/${name.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {name}の代替
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Alternatives */}
      <section className="container py-16 md:py-20">
        <SectionHeader
          title="人気の代替ページ"
          description="よく検索されるサービスのオープンソース代替を探す"
          icon={<RefreshCw className="h-5 w-5 text-primary" />}
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
      <section className="bg-secondary/30 py-16 md:py-20">
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

      {/* Featured Products */}
      <section className="container py-16 md:py-20">
        <SectionHeader
          title="注目のOSSツール"
          description="厳選されたオープンソースの代替サービス"
          action={<Link to="/products"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>}
        />
        {productsLoading ? (
          <LoadingSkeleton count={6} />
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="まだツールが登録されていません" />
        )}
      </section>

      {/* Japanese-friendly tools */}
      {jpProducts && jpProducts.length > 0 && (
        <section className="bg-secondary/30 py-16 md:py-20">
          <div className="container">
            <SectionHeader
              title="日本語対応ツール"
              description="UIが日本語に対応しているオープンソースツール"
              icon={<Globe className="h-5 w-5 text-primary" />}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jpProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 md:py-20">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            あなたのOSSツールを掲載しませんか？
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            無料でツールを掲載して、日本のユーザーにリーチしましょう。審査の上、サイトに追加されます。
          </p>
          <Link to="/submit">
            <Button size="lg" variant="secondary" className="mt-8 rounded-xl">
              掲載を申請する <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

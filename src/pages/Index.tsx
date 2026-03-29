import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { LoadingState, EmptyState } from "@/components/StateDisplays";
import { useProducts, useCategories, useAlternatives } from "@/hooks/use-data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categoryIcons: Record<string, string> = {
  "form": "📝", "note-wiki": "📓", "chat": "💬", "project-management": "📋",
  "cms": "🌐", "ec": "🛒", "analytics": "📊", "email": "📧",
  "automation": "⚡", "crm": "👥", "payment": "💳", "dev-tools": "🔧",
};

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts({ featured: true });
  const { data: categories } = useCategories();
  const { data: alternatives } = useAlternatives({ featured: true });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            日本語で探す代替サービス
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            あなたに最適な
            <span className="text-gradient">代替サービス</span>
            を見つけよう
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            人気ツールのオープンソース・国産代替サービスを比較。コスト削減や乗り換えに。
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="サービス名で検索... (例: Notion, Slack)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-full border-2 border-primary/20 focus-visible:border-primary"
            />
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />カテゴリ</h2>
            <p className="text-sm text-muted-foreground mt-1">目的別にツールを探す</p>
          </div>
          <Link to="/categories">
            <Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories?.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="surface-elevated rounded-lg p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <span className="text-2xl">{categoryIcons[cat.slug] || "📦"}</span>
              <p className="mt-2 text-sm font-medium group-hover:text-primary transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" />人気の代替ページ</h2>
                <p className="text-sm text-muted-foreground mt-1">よく検索される代替サービス</p>
              </div>
              <Link to="/alternatives">
                <Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {alternatives.slice(0, 6).map((alt) => (
                <Link
                  key={alt.id}
                  to={`/alternatives/${alt.source_slug}`}
                  className="surface-elevated rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{alt.source_name}の代替</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{alt.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">注目のツール</h2>
            <p className="text-sm text-muted-foreground mt-1">厳選されたおすすめサービス</p>
          </div>
          <Link to="/tools">
            <Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
          </Link>
        </div>
        {productsLoading ? (
          <LoadingState />
        ) : products && products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="まだツールが登録されていません" description="管理画面からツールを追加してください" />
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">あなたのサービスを掲載しませんか？</h2>
          <p className="mt-2 text-primary-foreground/80">無料でサービスを掲載して、多くのユーザーにリーチしましょう。</p>
          <Link to="/submit">
            <Button size="lg" variant="secondary" className="mt-6">掲載を申請する <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

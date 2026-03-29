import { useParams, Link } from "react-router-dom";
import { ExternalLink, Github, Star, GitFork, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FeatureIndicator, DifficultyBadge } from "@/components/ProductCard";
import { LoadingState, ErrorState } from "@/components/StateDisplays";
import { useProduct } from "@/hooks/use-data";

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");

  if (isLoading) return <SiteLayout><div className="container py-10"><LoadingState /></div></SiteLayout>;
  if (!product) return <SiteLayout><div className="container py-10"><ErrorState message="ツールが見つかりません" /></div></SiteLayout>;

  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <SiteLayout>
      <div className="container py-10 max-w-4xl">
        <Breadcrumbs items={[{ label: "ツール一覧", href: "/products" }, { label: product.name }]} />

        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            {product.logo_url ? (
              <img src={product.logo_url} alt={product.name} className="h-12 w-12 object-contain" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">{product.name[0]}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {(product as any).japanese_name && (product as any).japanese_name !== product.name && (
              <p className="text-lg text-muted-foreground">{(product as any).japanese_name}</p>
            )}
            <p className="mt-1 text-lg text-muted-foreground">{product.short_description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.categories?.map((cat: any) => (
                <Link key={cat.id} to={`/categories/${cat.slug}`}>
                  <Badge variant="secondary">{cat.name}</Badge>
                </Link>
              ))}
              {product.tags?.map((tag: any) => (
                <Badge key={tag.id} variant="outline">{tag.name}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub stats & links */}
        <div className="mt-6 flex flex-wrap gap-3">
          {product.website_url && (
            <a href={product.website_url} target="_blank" rel="noopener noreferrer">
              <Button><ExternalLink className="mr-2 h-4 w-4" />公式サイト</Button>
            </a>
          )}
          {product.github_url && (
            <a href={product.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />GitHub
                {(product as any).github_stars > 0 && (
                  <span className="ml-2 flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3" />{formatStars((product as any).github_stars)}
                  </span>
                )}
              </Button>
            </a>
          )}
        </div>

        {/* Feature grid */}
        <section className="mt-10 surface-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">機能・特徴</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <FeatureIndicator value={product.is_open_source} label="オープンソース" />
            <FeatureIndicator value={product.is_self_hostable} label="セルフホスト可能" />
            <FeatureIndicator value={product.has_cloud} label="クラウド版あり" />
            <FeatureIndicator value={product.supports_japanese} label="日本語対応" />
          </div>
          {(product as any).license && (
            <div className="mt-3 text-sm text-muted-foreground">ライセンス: <span className="font-medium text-foreground">{(product as any).license}</span></div>
          )}
          {(product as any).self_host_difficulty && product.is_self_hostable && (
            <div className="mt-2 text-sm flex items-center gap-2">
              セルフホスト難易度: <DifficultyBadge difficulty={(product as any).self_host_difficulty} />
            </div>
          )}
        </section>

        {/* Description */}
        {product.description && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">詳細説明</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
            </div>
          </section>
        )}

        {/* Best for / Not good for */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {(product as any).best_for && (
            <div className="surface-elevated rounded-lg p-5">
              <h3 className="font-semibold text-accent flex items-center gap-2"><Check className="h-4 w-4" />向いている人</h3>
              <p className="mt-2 text-sm text-muted-foreground">{(product as any).best_for}</p>
            </div>
          )}
          {(product as any).not_good_for && (
            <div className="surface-elevated rounded-lg p-5">
              <h3 className="font-semibold text-destructive flex items-center gap-2"><X className="h-4 w-4" />向いていない人</h3>
              <p className="mt-2 text-sm text-muted-foreground">{(product as any).not_good_for}</p>
            </div>
          )}
        </div>

        {/* Related alternatives */}
        {product.relatedAlternatives && product.relatedAlternatives.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">関連する代替ページ</h2>
            <div className="flex flex-wrap gap-2">
              {product.relatedAlternatives.map((alt: any) => (
                <Link key={alt.source_slug} to={`/alternatives/${alt.source_slug}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">{alt.source_name}の代替</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

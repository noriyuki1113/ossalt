import { useParams, Link } from "react-router-dom";
import { ExternalLink, Github, Star, Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductLogo } from "@/components/ProductLogo";
import { FeatureIndicator, DifficultyBadge } from "@/components/ProductCard";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/StateDisplays";
import { useProduct } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildSoftwareAppJsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");

  const name = product?.name || "";
  const jpName = (product as any)?.japanese_name;

  useSeo({
    title: product
      ? `${name}とは？特徴・使い方・代替との違いを解説`
      : "ツール詳細",
    description: product
      ? `${name}${jpName && jpName !== name ? `（${jpName}）` : ""}の特徴や使い方、メリット・デメリットを解説。${product.is_self_hostable ? "セルフホスト可能。" : ""}${product.supports_japanese ? "日本語対応。" : ""}${product.license ? `ライセンス: ${product.license}。` : ""}オープンソース代替ツールとして注目されています。`
      : undefined,
    canonical: slug ? `https://altfinder.jp/products/${slug}` : undefined,
  });

  if (isLoading) {
    return <SiteLayout><div className="container py-10 max-w-4xl"><DetailSkeleton /></div></SiteLayout>;
  }
  if (!product) {
    return <SiteLayout><div className="container py-10"><ErrorState message="ツールが見つかりません" /></div></SiteLayout>;
  }

  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const relatedAlts = product.relatedAlternatives || [];
  const categories = product.categories || [];

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "ツール一覧", url: "https://altfinder.jp/products" },
        { name, url: `https://altfinder.jp/products/${slug}` },
      ])} />
      <JsonLd data={buildSoftwareAppJsonLd(product)} />

      <div className="container py-10 md:py-14 max-w-4xl">
        <Breadcrumbs items={[{ label: "ツール一覧", href: "/products" }, { label: name }]} />

        {/* Header */}
        <div className="flex items-start gap-5">
          <ProductLogo
            name={name}
            logoUrl={product.logo_url}
            logoGithubReadmeUrl={(product as any).logo_github_readme_url}
            logoGithubAvatarUrl={(product as any).logo_github_avatar_url}
            logoFaviconUrl={(product as any).logo_favicon_url}
            websiteUrl={product.website_url}
            githubUrl={product.github_url}
            size="xl"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{name}とは</h1>
            {jpName && jpName !== name && (
              <p className="text-lg text-muted-foreground mt-0.5">{jpName}</p>
            )}
            <p className="mt-2 text-lg text-muted-foreground leading-relaxed">{product.short_description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <Link key={cat.id} to={`/categories/${cat.slug}`}>
                  <Badge variant="secondary" className="hover:bg-primary/10">{cat.name}</Badge>
                </Link>
              ))}
              {product.tags?.map((tag: any) => (
                <Badge key={tag.id} variant="outline">{tag.name}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          {product.website_url && (
            <a href={product.website_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-xl"><ExternalLink className="mr-2 h-4 w-4" />公式サイト</Button>
            </a>
          )}
          {product.github_url && (
            <a href={product.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-xl">
                <Github className="mr-2 h-4 w-4" />GitHub
                {(product as any).github_stars > 0 && (
                  <span className="ml-2 flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3.5 w-3.5" />{formatStars((product as any).github_stars)}
                  </span>
                )}
              </Button>
            </a>
          )}
        </div>

        {/* 特徴 */}
        <section className="mt-10 surface-elevated rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-5">{name}の特徴</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            <FeatureIndicator value={product.is_open_source} label="オープンソース" />
            <FeatureIndicator value={product.is_self_hostable} label="セルフホスト可能" />
            <FeatureIndicator value={product.has_cloud} label="クラウド版あり" />
            <FeatureIndicator value={product.supports_japanese} label="日本語対応" />
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            {(product as any).license && (
              <div className="text-sm flex items-center gap-2">
                <span className="text-muted-foreground">ライセンス:</span>
                <span className="font-medium">{(product as any).license}</span>
              </div>
            )}
            {(product as any).self_host_difficulty && product.is_self_hostable && (
              <div className="text-sm flex items-center gap-2">
                <span className="text-muted-foreground">セルフホスト難易度:</span>
                <DifficultyBadge difficulty={(product as any).self_host_difficulty} />
              </div>
            )}
          </div>
        </section>

        {/* 詳細説明 */}
        {product.description && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">{name}の使い方・概要</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</div>
          </section>
        )}

        {/* メリット・デメリット */}
        {((product as any).best_for || (product as any).not_good_for) && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">メリット・デメリット</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {(product as any).best_for && (
                <div className="surface-elevated rounded-xl p-6">
                  <h3 className="font-semibold text-accent flex items-center gap-2 mb-3">
                    <Check className="h-4 w-4" />向いている人
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{(product as any).best_for}</p>
                </div>
              )}
              {(product as any).not_good_for && (
                <div className="surface-elevated rounded-xl p-6">
                  <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
                    <X className="h-4 w-4" />向いていない人
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{(product as any).not_good_for}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 関連 alternatives */}
        {relatedAlts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">他ツールとの違い・関連する代替ページ</h2>
            <p className="text-sm text-muted-foreground mb-3">
              {name}が代替候補として紹介されているサービスの一覧です。
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedAlts.map((alt: any) => (
                <Link key={alt.source_slug} to={`/alternatives/${alt.source_slug}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 text-sm py-1.5 px-4">
                    {alt.source_name}の代替
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* カテゴリリンク */}
        {categories.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">関連カテゴリ</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <Link key={cat.id} to={`/categories/${cat.slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 text-sm py-1.5 px-4">
                    {cat.japanese_name || cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-12 surface-elevated rounded-xl p-6 md:p-8 text-center">
          <p className="text-muted-foreground mb-3">他のオープンソースツールも比較してみませんか？</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/alternatives">
              <Button variant="outline" size="sm" className="rounded-xl">代替サービス一覧 <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="sm" className="rounded-xl">OSSツール一覧 <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

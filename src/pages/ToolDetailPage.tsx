import { useParams, Link } from "react-router-dom";
import { ExternalLink, Github, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FeatureIndicator } from "@/components/ProductCard";
import { LoadingState, ErrorState } from "@/components/StateDisplays";
import { useProduct } from "@/hooks/use-data";

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");

  if (isLoading) return <SiteLayout><div className="container py-10"><LoadingState /></div></SiteLayout>;
  if (!product) return <SiteLayout><div className="container py-10"><ErrorState message="ツールが見つかりません" /></div></SiteLayout>;

  return (
    <SiteLayout>
      <div className="container py-10 max-w-4xl">
        <Breadcrumbs items={[{ label: "ツール一覧", href: "/tools" }, { label: product.name }]} />

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

        <div className="mt-6 flex gap-3">
          {product.website_url && (
            <a href={product.website_url} target="_blank" rel="noopener noreferrer">
              <Button><ExternalLink className="mr-2 h-4 w-4" />公式サイト</Button>
            </a>
          )}
          {product.github_url && (
            <a href={product.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline"><Github className="mr-2 h-4 w-4" />GitHub</Button>
            </a>
          )}
        </div>

        {/* Features */}
        <section className="mt-10 surface-elevated rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">機能・特徴</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <FeatureIndicator value={product.has_free_plan} label="無料プランあり" />
            <FeatureIndicator value={product.is_open_source} label="オープンソース" />
            <FeatureIndicator value={product.is_self_hostable} label="セルフホスト可能" />
            <FeatureIndicator value={product.has_cloud} label="クラウド版あり" />
            <FeatureIndicator value={product.supports_japanese} label="日本語対応" />
          </div>
        </section>

        {/* Description */}
        {product.description && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">詳細説明</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>
          </section>
        )}

        {/* Pricing */}
        {product.pricing_summary && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">料金概要</h2>
            <p className="text-muted-foreground">{product.pricing_summary}</p>
          </section>
        )}

        {/* Target Audience */}
        {product.target_audience && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">こんな方におすすめ</h2>
            <p className="text-muted-foreground">{product.target_audience}</p>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

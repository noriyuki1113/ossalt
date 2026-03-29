import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCardDetailed } from "@/components/ProductCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState, ErrorState } from "@/components/StateDisplays";
import { useAlternative } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export default function AlternativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: alternative, isLoading } = useAlternative(slug || "");

  useSeo({
    title: alternative ? `${alternative.source_name}の代替サービス — オープンソース比較` : "代替サービス",
    description: alternative?.description || undefined,
    canonical: slug ? `https://altfinder.jp/alternatives/${slug}` : undefined,
  });

  if (isLoading) {
    return <SiteLayout><div className="container py-10 max-w-5xl"><DetailSkeleton /></div></SiteLayout>;
  }
  if (!alternative) {
    return <SiteLayout><div className="container py-10"><ErrorState message="ページが見つかりません" /></div></SiteLayout>;
  }

  const products = alternative.products?.map((ap: any) => ap.products).filter(Boolean) || [];
  const altProducts = alternative.products || [];
  const relatedAlts = (alternative as any).relatedAlternatives || [];

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[
          { label: "代替サービス", href: "/alternatives" },
          { label: `${alternative.source_name}の代替` },
        ]} />

        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold">{alternative.source_name}の代替サービス</h1>
          {(alternative as any).japanese_source_description && (
            <p className="mt-3 text-muted-foreground">
              {(alternative as any).japanese_source_description}
            </p>
          )}
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{alternative.description}</p>
          {(alternative as any).source_url && (
            <a
              href={(alternative as any).source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {alternative.source_name}の公式サイト
            </a>
          )}
        </div>

        {/* Comparison Table */}
        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-5">比較表</h2>
            <ComparisonTable products={products} />
          </section>
        )}

        {/* Product Cards */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">
            代替候補一覧
            {products.length > 0 && (
              <span className="text-base font-normal text-muted-foreground ml-2">({products.length}件)</span>
            )}
          </h2>
          {altProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {altProducts.map((ap: any) => {
                const p = ap.products;
                if (!p) return null;
                return (
                  <ProductCardDetailed
                    key={ap.id}
                    product={p}
                    reason={ap.reason_summary}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState title="代替候補はまだ登録されていません" />
          )}
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">よくある質問</h2>
          <div className="space-y-4">
            <details className="surface-elevated rounded-xl p-5 group" open>
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                {alternative.source_name}のオープンソース代替はありますか？
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                はい、上記で紹介しているツールはすべてオープンソースです。セルフホストすることでデータの完全なコントロールが可能になり、プライバシーやセキュリティの観点でもメリットがあります。
              </p>
            </details>
            <details className="surface-elevated rounded-xl p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                {alternative.source_name}から乗り換える際の注意点は？
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                データのエクスポート機能の有無、移行ツールの存在、日本語対応の状況を事前にご確認ください。また、チームで利用する場合は無料版の制限や有料プランの価格も比較することをおすすめします。
              </p>
            </details>
            <details className="surface-elevated rounded-xl p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                セルフホストとクラウド版はどちらがおすすめですか？
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                データ管理やセキュリティを重視する場合はセルフホスト、手軽に始めたい場合はクラウド版がおすすめです。上記の比較表で各ツールの対応状況をご確認ください。
              </p>
            </details>
          </div>
        </section>

        {/* Related Alternatives */}
        {relatedAlts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-5">関連する代替ページ</h2>
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
      </div>
    </SiteLayout>
  );
}

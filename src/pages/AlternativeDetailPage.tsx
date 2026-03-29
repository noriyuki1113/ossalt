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
import { ExternalLink, CheckCircle, Server, Globe, Shield } from "lucide-react";
import { JsonLd, buildItemListJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/components/JsonLd";

export default function AlternativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: alternative, isLoading } = useAlternative(slug || "");

  const products = alternative?.products?.map((ap: any) => ap.products).filter(Boolean) || [];
  const altProducts = alternative?.products || [];
  const relatedAlts = (alternative as any)?.relatedAlternatives || [];
  const productCount = products.length;
  const sourceName = alternative?.source_name || "";
  const year = new Date().getFullYear();

  useSeo({
    title: alternative
      ? `${sourceName}の代替OSSおすすめ${productCount > 0 ? productCount + "選" : ""}【${year}年版】`
      : "代替サービス",
    description: alternative
      ? `${sourceName}の代替となるオープンソースツールを比較。${products.slice(0, 3).map((p: any) => p.name).join("や")}など、特徴・日本語対応・セルフホスト可否をわかりやすく解説します。`
      : undefined,
    canonical: slug ? `https://altfinder.jp/alternatives/${slug}` : undefined,
  });

  if (isLoading) {
    return <SiteLayout><div className="container py-10 max-w-5xl"><DetailSkeleton /></div></SiteLayout>;
  }
  if (!alternative) {
    return <SiteLayout><div className="container py-10"><ErrorState message="ページが見つかりません" /></div></SiteLayout>;
  }

  const faqs = [
    {
      question: `${sourceName}のオープンソース代替はありますか？`,
      answer: `はい、${productCount}件のオープンソース代替ツールがあります。${products.slice(0, 3).map((p: any) => p.name).join("、")}などが人気です。セルフホストすることでデータの完全なコントロールが可能になります。`,
    },
    {
      question: `${sourceName}から乗り換える際の注意点は？`,
      answer: "データのエクスポート機能の有無、移行ツールの存在、日本語対応の状況を事前にご確認ください。また、チームで利用する場合は無料版の制限や有料プランの価格も比較することをおすすめします。",
    },
    {
      question: "セルフホストとクラウド版はどちらがおすすめですか？",
      answer: "データ管理やセキュリティを重視する場合はセルフホスト、手軽に始めたい場合はクラウド版がおすすめです。上記の比較表で各ツールの対応状況をご確認ください。",
    },
    {
      question: `${sourceName}の代替で日本語対応しているツールは？`,
      answer: `上記一覧で「日本語対応」マークが付いているツールが日本語UIに対応しています。対応状況は随時更新されます。`,
    },
  ];

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "代替一覧", url: "https://altfinder.jp/alternatives" },
        { name: `${sourceName}の代替`, url: `https://altfinder.jp/alternatives/${slug}` },
      ])} />
      <JsonLd data={buildItemListJsonLd(
        products.map((p: any) => ({ name: p.name, url: `https://altfinder.jp/products/${p.slug}` }))
      )} />
      <JsonLd data={buildFaqJsonLd(faqs)} />

      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[
          { label: "代替サービス", href: "/alternatives" },
          { label: `${sourceName}の代替` },
        ]} />

        {/* H1 */}
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold">
            {sourceName}の代替OSSおすすめ{productCount > 0 ? `${productCount}選` : ""}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {sourceName}は{(alternative as any).japanese_source_description || alternative.description || "広く使われている商用サービス"}です。
            ここでは{sourceName}の代わりに使えるオープンソースの代替ツールを{productCount}件紹介します。
            コスト削減やプライバシー強化、セルフホスト運用を検討されている方はぜひ参考にしてください。
          </p>
          {(alternative as any).source_url && (
            <a href={(alternative as any).source_url} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" />
              {sourceName}の公式サイト
            </a>
          )}
        </div>

        {/* 代替を選ぶポイント */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">{sourceName}の代替を選ぶポイント</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="surface-elevated rounded-xl p-5 flex gap-3">
              <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">OSSを選ぶメリット</h3>
                <p className="text-sm text-muted-foreground mt-1">ソースコードが公開されているため透明性が高く、ベンダーロックインを回避できます。コミュニティによる改善も期待できます。</p>
              </div>
            </div>
            <div className="surface-elevated rounded-xl p-5 flex gap-3">
              <Server className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">セルフホスト vs SaaS</h3>
                <p className="text-sm text-muted-foreground mt-1">セルフホストならデータを完全に管理可能。SaaS版なら手軽に始められます。チーム規模や技術力に合わせて選びましょう。</p>
              </div>
            </div>
            <div className="surface-elevated rounded-xl p-5 flex gap-3">
              <Globe className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">日本語対応の確認</h3>
                <p className="text-sm text-muted-foreground mt-1">UIの日本語対応状況はツールにより異なります。チーム導入の場合は日本語対応が重要な判断基準になります。</p>
              </div>
            </div>
            <div className="surface-elevated rounded-xl p-5 flex gap-3">
              <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">ライセンスの確認</h3>
                <p className="text-sm text-muted-foreground mt-1">MIT、Apache 2.0、AGPLなどライセンスにより利用条件が異なります。商用利用の場合は特に確認しましょう。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-5">各ツールの特徴比較</h2>
            <ComparisonTable products={products} />
          </section>
        )}

        {/* Product Cards */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">
            {sourceName}の代替おすすめ一覧
            {productCount > 0 && (
              <span className="text-base font-normal text-muted-foreground ml-2">({productCount}件)</span>
            )}
          </h2>
          {altProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {altProducts.map((ap: any) => {
                const p = ap.products;
                if (!p) return null;
                return (
                  <ProductCardDetailed key={ap.id} product={p} reason={ap.reason_summary} />
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
            {faqs.map((faq, i) => (
              <details key={i} className="surface-elevated rounded-xl p-5 group" open={i === 0}>
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* まとめ */}
        <section className="mt-12 surface-elevated rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">まとめ</h2>
          <p className="text-muted-foreground leading-relaxed">
            {sourceName}の代替として{productCount}件のオープンソースツールを紹介しました。
            {products.length >= 2 && `${products[0]?.name}や${products[1]?.name}がとくに人気です。`}
            セルフホストによるコスト削減やプライバシー強化を重視する方は、ぜひ各ツールの詳細ページもご確認ください。
            最適なツールは用途やチーム規模によって異なりますので、比較表を参考に検討してみてください。
          </p>
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

        {/* CTA */}
        <section className="mt-12 text-center">
          <p className="text-muted-foreground">
            他にも代替ツールをお探しですか？
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link to="/alternatives">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 py-1.5 px-4">代替サービス一覧</Badge>
            </Link>
            <Link to="/categories">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 py-1.5 px-4">カテゴリから探す</Badge>
            </Link>
            <Link to="/products">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 py-1.5 px-4">OSSツール一覧</Badge>
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

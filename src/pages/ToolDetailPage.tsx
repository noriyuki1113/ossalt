import { useParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/StateDisplays";
import { useProduct, useProducts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildSoftwareAppJsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";
import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductFeatures } from "@/components/product-detail/ProductFeatures";
import { ProductProsCons } from "@/components/product-detail/ProductProsCons";
import { ProductRelatedAlternatives } from "@/components/product-detail/ProductRelatedAlternatives";
import { ProductCategoryLinks } from "@/components/product-detail/ProductCategoryLinks";
import { ProductCTA } from "@/components/product-detail/ProductCTA";
import { SameCategoryProducts } from "@/components/product-detail/SameCategoryProducts";
import { ComparisonTable } from "@/components/ComparisonTable";

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const categories = product?.categories || [];
  const primaryCat = categories[0];
  const { data: sameCatProducts } = useProducts({ categorySlug: primaryCat?.slug });

  const name = product?.name || "";
  const jpName = product?.japanese_name;

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

  const relatedAlts = product.relatedAlternatives || [];
  const comparisonProducts = (sameCatProducts || [])
    .filter((p: any) => p.slug !== slug)
    .slice(0, 8);

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "ツール一覧", url: "https://altfinder.jp/products" },
        { name, url: `https://altfinder.jp/products/${slug}` },
      ])} />
      <JsonLd data={buildSoftwareAppJsonLd(product)} />

      <div className="container py-8 md:py-14 max-w-4xl space-y-10 md:space-y-14">
        <Breadcrumbs items={[{ label: "ツール一覧", href: "/products" }, { label: name }]} />

        {/* ① Hero */}
        <ProductHero product={product} relatedAlts={relatedAlts} />

        {/* ③ 概要 */}
        {product.description && (
          <section>
            <h2 className="text-xl font-bold mb-4">{name}とは？</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
              {product.description}
            </div>
          </section>
        )}

        {/* ④ 特徴 */}
        <ProductFeatures product={product} />

        {/* ⑤⑥⑦ メリット・デメリット */}
        <ProductProsCons product={product} />

        {/* ⑧ 比較テーブル */}
        {comparisonProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-5">同カテゴリのツールと比較</h2>
            <ComparisonTable products={comparisonProducts} />
          </section>
        )}

        {/* ⑨ 代替元 */}
        <ProductRelatedAlternatives name={name} relatedAlts={relatedAlts} />

        {/* ⑪ 関連ツール */}
        <SameCategoryProducts
          products={sameCatProducts || []}
          currentSlug={slug || ""}
          categoryName={primaryCat?.japanese_name || primaryCat?.name}
          categorySlug={primaryCat?.slug}
        />

        {/* ⑫⑬ カテゴリ・タグ */}
        <ProductCategoryLinks categories={categories} tags={product.tags} />

        {/* CTA */}
        <ProductCTA product={product} />
      </div>
    </SiteLayout>
  );
}

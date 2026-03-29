import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AlternativeCard } from "@/components/AlternativeCard";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/StateDisplays";
import { useAlternativesWithCounts, useProducts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";
import { TrendingUp } from "lucide-react";

export default function PopularPage() {
  const { data: alternatives, isLoading: altsLoading } = useAlternativesWithCounts();
  const { data: products, isLoading: prodsLoading } = useProducts({ featured: true });

  useSeo({
    title: "人気の代替サービスランキング【2026年版】",
    description: "最も検索されるオープンソース代替サービスの人気ランキング。Notion、Slack、Shopifyなどの代替ツールを比較できます。",
    canonical: "https://altfinder.jp/popular",
  });

  const sortedAlts = [...(alternatives || [])].sort((a, b) => b.product_count - a.product_count);

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "人気ランキング", url: "https://altfinder.jp/popular" },
      ])} />
      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[{ label: "人気ランキング" }]} />
        <h1 className="text-3xl md:text-4xl font-bold">人気の代替サービスランキング</h1>
        <p className="mt-3 text-lg text-muted-foreground">よく検索されるサービスのオープンソース代替を人気順に紹介します。</p>

        <section className="mt-10">
          <SectionHeader title="人気の代替ページ" icon={<TrendingUp className="h-5 w-5 text-primary" />} />
          {altsLoading ? <LoadingSkeleton count={6} /> : sortedAlts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAlts.map(alt => <AlternativeCard key={alt.id} alternative={alt} />)}
            </div>
          ) : <EmptyState title="データがありません" />}
        </section>

        {products && products.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="注目のOSSツール" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 9).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

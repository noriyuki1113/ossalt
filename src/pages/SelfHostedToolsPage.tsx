import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/StateDisplays";
import { useProducts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";

export default function SelfHostedToolsPage() {
  const { data: products, isLoading } = useProducts({ selfHostOnly: true });

  useSeo({
    title: "セルフホスト可能なツール一覧【2026年最新】",
    description: "自分のサーバーで運用できるセルフホスト対応ツールの一覧。データの完全なコントロールとプライバシー保護を実現できます。",
    canonical: "https://altfinder.jp/self-hosted-tools",
  });

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "セルフホスト可能ツール", url: "https://altfinder.jp/self-hosted-tools" },
      ])} />
      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[{ label: "セルフホスト可能ツール" }]} />
        <h1 className="text-3xl md:text-4xl font-bold">セルフホスト可能なツール一覧</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          自社サーバーやVPSで運用できるセルフホスト対応ツールを紹介。データの完全管理、プライバシー保護、コスト削減に最適です。
        </p>

        <section className="mt-10">
          {isLoading ? <LoadingSkeleton count={9} /> : products && products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : <EmptyState title="該当するツールがありません" />}
        </section>
      </div>
    </SiteLayout>
  );
}

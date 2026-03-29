import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/StateDisplays";
import { useProducts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";

export default function OssToolsPage() {
  const { data: products, isLoading } = useProducts({ ossOnly: true });

  useSeo({
    title: "オープンソースツール一覧【2026年最新】",
    description: "オープンソースで利用できるツールの一覧。ソースコードが公開されており、自由にカスタマイズ・セルフホストが可能なツールを紹介します。",
    canonical: "https://altfinder.jp/open-source-tools",
  });

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "OSSツール一覧", url: "https://altfinder.jp/open-source-tools" },
      ])} />
      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[{ label: "OSSツール一覧" }]} />
        <h1 className="text-3xl md:text-4xl font-bold">オープンソースツール一覧</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          ソースコードが公開されているオープンソースツールを一覧で紹介。透明性が高く、自由にカスタマイズ可能なツールを見つけましょう。
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

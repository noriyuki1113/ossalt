import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/StateDisplays";
import { useProducts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";

export default function JapaneseSupportedToolsPage() {
  const { data: products, isLoading } = useProducts({ japaneseOnly: true });

  useSeo({
    title: "日本語対応OSSツール一覧【2026年最新】",
    description: "UIが日本語に対応しているオープンソースツールの一覧。英語が苦手なチームでも安心して導入できるツールを紹介します。",
    canonical: "https://altfinder.jp/japanese-supported-tools",
  });

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "日本語対応ツール", url: "https://altfinder.jp/japanese-supported-tools" },
      ])} />
      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[{ label: "日本語対応ツール" }]} />
        <h1 className="text-3xl md:text-4xl font-bold">日本語対応OSSツール一覧</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          UIが日本語に対応しているオープンソースツールを一覧で紹介。日本語チームでの導入に適したツールを見つけましょう。
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

import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/StateDisplays";
import { useArticles } from "@/hooks/use-articles";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";

export default function ArticlesPage() {
  const { data: articles, isLoading } = useArticles({ status: "published" });

  useSeo({
    title: "代替サービス比較記事一覧 | AltFinder.jp",
    description: "人気SaaSのオープンソース代替ツールを比較する記事一覧。Notion、Slack、Shopifyなどの代替をわかりやすく解説します。",
    canonical: "https://altfinder.jp/articles",
  });

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "記事一覧", url: "https://altfinder.jp/articles" },
      ])} />
      <div className="container py-10 md:py-14 max-w-5xl">
        <Breadcrumbs items={[{ label: "記事一覧" }]} />
        <h1 className="text-3xl md:text-4xl font-bold">代替サービス比較記事</h1>
        <p className="mt-3 text-lg text-muted-foreground">人気SaaSのオープンソース代替を比較した記事を掲載しています。</p>

        <section className="mt-10">
          {isLoading ? <LoadingSkeleton count={6} /> : articles && articles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((a: any) => <ArticleCard key={a.id} article={a} />)}
            </div>
          ) : <EmptyState title="記事がまだありません" />}
        </section>
      </div>
    </SiteLayout>
  );
}

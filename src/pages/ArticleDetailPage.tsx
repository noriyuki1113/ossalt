import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/StateDisplays";
import { useArticle } from "@/hooks/use-articles";
import { useSeo } from "@/hooks/use-seo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/JsonLd";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug || "");

  useSeo({
    title: article?.meta_title || article?.title || "記事",
    description: article?.meta_description || article?.excerpt || undefined,
    canonical: slug ? `https://altfinder.jp/articles/${slug}` : undefined,
  });

  if (isLoading) return <SiteLayout><div className="container py-10 max-w-4xl"><DetailSkeleton /></div></SiteLayout>;
  if (!article) return <SiteLayout><div className="container py-10"><ErrorState message="記事が見つかりません" /></div></SiteLayout>;

  const date = article.published_at || article.created_at;

  return (
    <SiteLayout>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "ホーム", url: "https://altfinder.jp/" },
        { name: "記事一覧", url: "https://altfinder.jp/articles" },
        { name: article.title, url: `https://altfinder.jp/articles/${slug}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.meta_description || article.excerpt,
        datePublished: article.published_at || article.created_at,
        dateModified: article.updated_at,
        url: `https://altfinder.jp/articles/${slug}`,
        publisher: { "@type": "Organization", name: "AltFinder.jp" },
      }} />

      <div className="container py-10 md:py-14 max-w-4xl">
        <Breadcrumbs items={[
          { label: "記事一覧", href: "/articles" },
          { label: article.title },
        ]} />

        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{article.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {new Date(date).toLocaleDateString("ja-JP")}
        </div>

        {article.excerpt && (
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4">
            {article.excerpt}
          </p>
        )}

        <div className="mt-8">
          <MarkdownRenderer content={article.content || ""} />
        </div>

        {/* CTA */}
        <section className="mt-12 surface-elevated rounded-xl p-6 md:p-8 text-center">
          <p className="text-muted-foreground mb-3">他の代替ツールも比較してみませんか？</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/alternatives"><Button variant="outline" size="sm" className="rounded-xl">代替サービス一覧 <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>
            <Link to="/products"><Button variant="outline" size="sm" className="rounded-xl">OSSツール一覧 <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>
            <Link to="/submit"><Button variant="outline" size="sm" className="rounded-xl">掲載を申請する <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button></Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

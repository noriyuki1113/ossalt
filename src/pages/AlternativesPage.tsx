import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateDisplays";
import { useAlternatives } from "@/hooks/use-data";

export default function AlternativesPage() {
  const { data: alternatives, isLoading, error } = useAlternatives();

  return (
    <SiteLayout>
      <div className="container py-10">
        <Breadcrumbs items={[{ label: "代替サービス" }]} />
        <h1 className="text-3xl font-bold">代替サービス一覧</h1>
        <p className="mt-2 text-muted-foreground">人気サービスの代替候補を探す</p>

        {isLoading ? <LoadingState /> : error ? <ErrorState /> : alternatives && alternatives.length > 0 ? (
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {alternatives.map((alt) => (
              <Link
                key={alt.id}
                to={`/alternatives/${alt.source_slug}`}
                className="surface-elevated rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <h2 className="font-semibold group-hover:text-primary transition-colors">{alt.source_name}の代替</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{alt.description}</p>
                {alt.featured && (
                  <span className="mt-2 inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">人気</span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="代替ページはまだありません" />
        )}
      </div>
    </SiteLayout>
  );
}

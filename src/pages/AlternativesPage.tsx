import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AlternativeCard } from "@/components/AlternativeCard";
import { SearchInput } from "@/components/SearchInput";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateDisplays";
import { useAlternatives } from "@/hooks/use-data";

export default function AlternativesPage() {
  const [search, setSearch] = useState("");
  const { data: alternatives, isLoading, error } = useAlternatives({ search: search || undefined });

  return (
    <SiteLayout>
      <div className="container py-10">
        <Breadcrumbs items={[{ label: "代替サービス" }]} />
        <h1 className="text-3xl font-bold">代替サービス一覧</h1>
        <p className="mt-2 text-muted-foreground">「○○の代替」を探す — 人気サービスのオープンソース代替候補を比較</p>

        <div className="mt-6">
          <SearchInput value={search} onChange={setSearch} placeholder="サービス名で検索... (例: Notion, Slack)" className="max-w-lg" />
        </div>

        {isLoading ? <LoadingState /> : error ? <ErrorState /> : alternatives && alternatives.length > 0 ? (
          <>
            <p className="mt-6 text-sm text-muted-foreground">{alternatives.length} 件の代替ページ</p>
            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {alternatives.map((alt) => (
                <AlternativeCard key={alt.id} alternative={alt} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="代替ページが見つかりませんでした" />
        )}
      </div>
    </SiteLayout>
  );
}

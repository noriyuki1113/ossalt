import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AlternativeCard } from "@/components/AlternativeCard";
import { SearchInput } from "@/components/SearchInput";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState, ErrorState } from "@/components/StateDisplays";
import { useAlternativesWithCounts } from "@/hooks/use-data";
import { useSeo } from "@/hooks/use-seo";

export default function AlternativesPage() {
  const [search, setSearch] = useState("");
  const { data: alternatives, isLoading, error } = useAlternativesWithCounts();

  useSeo({
    title: "代替サービス一覧 — 人気SaaSのオープンソース代替を比較",
    description: "Notion、Slack、Shopify、WordPressなど人気サービスのオープンソース代替候補を一覧で比較。日本語対応やセルフホスト可否もチェック。",
    canonical: "https://altfinder.jp/alternatives",
  });

  const filtered = search
    ? alternatives?.filter(a =>
        a.source_name.toLowerCase().includes(search.toLowerCase()) ||
        (a.description?.toLowerCase().includes(search.toLowerCase()))
      )
    : alternatives;

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14">
        <Breadcrumbs items={[{ label: "代替サービス" }]} />

        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold">代替サービス一覧</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            「○○の代替」を探す — 人気SaaSのオープンソース代替候補を比較検討できます
          </p>
        </div>

        <div className="mt-8">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="サービス名で検索... (例: Notion, Slack)"
            className="max-w-md"
          />
        </div>

        <div className="mt-8">
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : error ? (
            <ErrorState />
          ) : filtered && filtered.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-5">{filtered.length} 件の代替ページ</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((alt) => (
                  <AlternativeCard key={alt.id} alternative={alt} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="代替ページが見つかりませんでした"
              description={search ? `「${search}」に一致するページはありません。検索条件を変更してください。` : undefined}
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

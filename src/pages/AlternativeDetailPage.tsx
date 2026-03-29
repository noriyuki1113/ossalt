import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard, FeatureIndicator, DifficultyBadge } from "@/components/ProductCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateDisplays";
import { useAlternative } from "@/hooks/use-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, ExternalLink } from "lucide-react";

export default function AlternativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: alternative, isLoading } = useAlternative(slug || "");

  if (isLoading) return <SiteLayout><div className="container py-10"><LoadingState /></div></SiteLayout>;
  if (!alternative) return <SiteLayout><div className="container py-10"><ErrorState message="ページが見つかりません" /></div></SiteLayout>;

  const products = alternative.products?.map((ap: any) => ap.products || ap.product).filter(Boolean) || [];
  const altProducts = alternative.products || [];
  const relatedAlts = (alternative as any).relatedAlternatives || [];

  return (
    <SiteLayout>
      <div className="container py-10 max-w-5xl">
        <Breadcrumbs items={[{ label: "代替サービス", href: "/alternatives" }, { label: `${alternative.source_name}の代替` }]} />

        <h1 className="text-3xl font-bold">{alternative.source_name}の代替サービス</h1>
        {(alternative as any).japanese_source_description && (
          <p className="mt-2 text-muted-foreground">{(alternative as any).japanese_source_description}</p>
        )}
        <p className="mt-2 text-muted-foreground text-lg">{alternative.description}</p>
        {(alternative as any).source_url && (
          <a href={(alternative as any).source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ExternalLink className="h-3 w-3" />{alternative.source_name}公式サイト
          </a>
        )}

        {/* Comparison Table */}
        {products.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">比較表</h2>
            <div className="overflow-x-auto surface-elevated rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">サービス名</TableHead>
                    <TableHead>OSS</TableHead>
                    <TableHead>セルフホスト</TableHead>
                    <TableHead>Cloud</TableHead>
                    <TableHead>日本語</TableHead>
                    <TableHead>難易度</TableHead>
                    <TableHead>ライセンス</TableHead>
                    <TableHead>Stars</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link to={`/products/${p.slug}`} className="font-medium text-primary hover:underline">{p.name}</Link>
                      </TableCell>
                      <TableCell>{p.is_open_source ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.is_self_hostable ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.has_cloud ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.supports_japanese ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell><DifficultyBadge difficulty={p.self_host_difficulty} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.license || "—"}</TableCell>
                      <TableCell>
                        {p.github_stars > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" />
                            {p.github_stars >= 1000 ? `${(p.github_stars / 1000).toFixed(1)}k` : p.github_stars}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* Product cards */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">代替候補一覧</h2>
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {altProducts.map((ap: any) => {
                const p = ap.products || ap.product;
                if (!p) return null;
                return (
                  <div key={ap.id} className="surface-elevated rounded-lg p-5">
                    <ProductCard product={p} />
                    {ap.reason_summary && (
                      <p className="mt-3 text-sm text-muted-foreground border-t pt-3">💡 {ap.reason_summary}</p>
                    )}
                    {p.best_for && (
                      <p className="mt-2 text-xs text-accent">✓ {p.best_for}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="代替候補はまだ登録されていません" />
          )}
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="surface-elevated rounded-lg p-5">
              <h3 className="font-semibold">{alternative.source_name}の代替でオープンソースのものはありますか？</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                はい、上記で紹介しているツールはすべてオープンソースです。セルフホストすることでデータを完全にコントロールできます。
              </p>
            </div>
            <div className="surface-elevated rounded-lg p-5">
              <h3 className="font-semibold">{alternative.source_name}から乗り換える際の注意点は？</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                データのエクスポート機能や、移行ツールの有無を事前に確認することをおすすめします。また、日本語対応の有無も重要なポイントです。
              </p>
            </div>
            <div className="surface-elevated rounded-lg p-5">
              <h3 className="font-semibold">セルフホストとクラウド版、どちらを選ぶべきですか？</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                データの管理やセキュリティを重視する場合はセルフホスト、手軽に始めたい場合はクラウド版がおすすめです。上記の比較表で対応状況を確認してください。
              </p>
            </div>
          </div>
        </section>

        {/* Related alternatives */}
        {relatedAlts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">関連する代替ページ</h2>
            <div className="flex flex-wrap gap-2">
              {relatedAlts.map((alt: any) => (
                <Link key={alt.source_slug} to={`/alternatives/${alt.source_slug}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 text-sm py-1 px-3">{alt.source_name}の代替</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

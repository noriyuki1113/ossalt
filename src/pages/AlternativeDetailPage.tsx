import { useParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard, FeatureIndicator } from "@/components/ProductCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/StateDisplays";
import { useAlternative } from "@/hooks/use-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, ExternalLink } from "lucide-react";

export default function AlternativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: alternative, isLoading } = useAlternative(slug || "");

  if (isLoading) return <SiteLayout><div className="container py-10"><LoadingState /></div></SiteLayout>;
  if (!alternative) return <SiteLayout><div className="container py-10"><ErrorState message="ページが見つかりません" /></div></SiteLayout>;

  const products = alternative.products?.map((ap: any) => ap.products || ap.product).filter(Boolean) || [];
  const altProducts = alternative.products || [];

  return (
    <SiteLayout>
      <div className="container py-10 max-w-4xl">
        <Breadcrumbs items={[{ label: "代替サービス", href: "/alternatives" }, { label: `${alternative.source_name}の代替` }]} />

        <h1 className="text-3xl font-bold">{alternative.source_name}の代替サービス</h1>
        <p className="mt-3 text-muted-foreground text-lg">{alternative.description}</p>

        {/* Comparison Table */}
        {products.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">比較表</h2>
            <div className="overflow-x-auto surface-elevated rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">サービス名</TableHead>
                    <TableHead>無料プラン</TableHead>
                    <TableHead>OSS</TableHead>
                    <TableHead>セルフホスト</TableHead>
                    <TableHead>日本語対応</TableHead>
                    <TableHead>料金</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.has_free_plan ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.is_open_source ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.is_self_hostable ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.supports_japanese ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell className="text-sm">{p.pricing_summary || "—"}</TableCell>
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
                      <p className="mt-3 text-sm text-muted-foreground border-t pt-3">{ap.reason_summary}</p>
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
              <h3 className="font-semibold">{alternative.source_name}の代替サービスは無料で使えますか？</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                多くの代替サービスには無料プランが用意されています。上の比較表で「無料プラン」列をご確認ください。
              </p>
            </div>
            <div className="surface-elevated rounded-lg p-5">
              <h3 className="font-semibold">{alternative.source_name}から乗り換える際の注意点は？</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                データのエクスポート機能や、移行ツールの有無を事前に確認することをおすすめします。
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

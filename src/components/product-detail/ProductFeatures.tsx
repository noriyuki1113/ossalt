import { Check, X } from "lucide-react";
import { DifficultyBadge } from "@/components/ProductCard";

interface ProductFeaturesProps {
  product: any;
}

export function ProductFeatures({ product }: ProductFeaturesProps) {
  const name = product.name;

  return (
    <section className="surface-elevated rounded-xl p-6 md:p-8">
      <h2 className="text-xl font-bold mb-5">{name}の主な特徴</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <FeatureRow value={product.is_open_source} label="オープンソース" description="ソースコードが公開されています" />
        <FeatureRow value={product.is_self_hostable} label="セルフホスト可能" description="自分のサーバーで運用できます" />
        <FeatureRow value={product.has_cloud} label="クラウド版あり" description="SaaS版が利用できます" />
        <FeatureRow value={product.supports_japanese} label="日本語対応" description="UIが日本語で利用可能です" />
      </div>
      {(product.license || (product.self_host_difficulty && product.is_self_hostable)) && (
        <div className="mt-5 pt-5 border-t space-y-2.5">
          {product.license && (
            <div className="text-sm flex items-center gap-2">
              <span className="text-muted-foreground">ライセンス:</span>
              <span className="font-medium">{product.license}</span>
            </div>
          )}
          {product.self_host_difficulty && product.is_self_hostable && (
            <div className="text-sm flex items-center gap-2">
              <span className="text-muted-foreground">セルフホスト難易度:</span>
              <DifficultyBadge difficulty={product.self_host_difficulty} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function FeatureRow({ value, label, description }: { value: boolean | null; label: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
      {value ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 mt-0.5">
          <Check className="h-3.5 w-3.5 text-accent" />
        </span>
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      )}
      <div>
        <span className={`text-sm font-medium ${value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

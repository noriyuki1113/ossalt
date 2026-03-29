import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { forwardRef } from "react";

interface ProductCardProps {
  product: any;
}

export const ProductCard = forwardRef<HTMLAnchorElement, ProductCardProps>(({ product }, ref) => {
  const stars = product.github_stars;
  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <Link
      ref={ref}
      to={`/products/${product.slug}`}
      className="group surface-elevated rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
          {product.logo_url ? (
            <img src={product.logo_url} alt={product.name} className="h-8 w-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">{product.name[0]}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {product.name}
            </h3>
            {stars > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                <Star className="h-3 w-3" />
                {formatStars(stars)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.is_open_source && <Badge variant="secondary" className="text-xs">OSS</Badge>}
            {product.supports_japanese && <Badge variant="secondary" className="text-xs">🇯🇵 日本語</Badge>}
            {product.is_self_hostable && <Badge variant="outline" className="text-xs">セルフホスト</Badge>}
            {product.has_cloud && <Badge variant="outline" className="text-xs">Cloud</Badge>}
            {product.license && <Badge variant="outline" className="text-xs">{product.license}</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = "ProductCard";

export function ProductCardDetailed({ product, reason }: { product: any; reason?: string | null }) {
  const stars = product.github_stars;
  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="surface-elevated rounded-xl p-6 hover:shadow-sm transition-shadow">
      <Link to={`/products/${product.slug}`} className="group">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            {product.logo_url ? (
              <img src={product.logo_url} alt={product.name} className="h-10 w-10 object-contain" />
            ) : (
              <span className="text-xl font-bold text-muted-foreground">{product.name[0]}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {stars > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />{formatStars(stars)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {product.is_open_source && <Badge variant="secondary" className="text-xs">OSS</Badge>}
        {product.supports_japanese && <Badge variant="secondary" className="text-xs">🇯🇵 日本語</Badge>}
        {product.is_self_hostable && <Badge variant="outline" className="text-xs">セルフホスト</Badge>}
        {product.has_cloud && <Badge variant="outline" className="text-xs">Cloud</Badge>}
        {product.license && <Badge variant="outline" className="text-xs">{product.license}</Badge>}
      </div>

      {reason && (
        <p className="mt-3 text-sm text-muted-foreground border-t pt-3">💡 {reason}</p>
      )}
      {product.best_for && (
        <p className="mt-2 text-xs text-accent">✓ 向いている人: {product.best_for}</p>
      )}
    </div>
  );
}

export function FeatureIndicator({ value, label }: { value: boolean | null; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm py-1">
      {value ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10">
          <Check className="h-3 w-3 text-accent" />
        </span>
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
          <X className="h-3 w-3 text-muted-foreground" />
        </span>
      )}
      <span className={value ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty?: string | null }) {
  if (!difficulty) return null;
  const styles: Record<string, string> = {
    easy: "bg-accent/10 text-accent",
    medium: "bg-badge-amber/10 text-badge-amber",
    hard: "bg-destructive/10 text-destructive",
  };
  const labels: Record<string, string> = { easy: "簡単", medium: "普通", hard: "難しい" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[difficulty] || ""}`}>
      {labels[difficulty] || difficulty}
    </span>
  );
}

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Star, ArrowRight, Shield } from "lucide-react";
import { forwardRef } from "react";
import { ProductLogo } from "@/components/ProductLogo";

interface ProductCardProps {
  product: any;
}

/** Compact card for grid listings */
export const ProductCard = forwardRef<HTMLAnchorElement, ProductCardProps>(({ product }, ref) => {
  const stars = product.github_stars;
  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <Link
      ref={ref}
      to={`/products/${product.slug}`}
      className="group bg-card border rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col"
    >
      <div className="flex items-center gap-3">
        <ProductLogo
          name={product.name}
          logoUrl={product.logo_url}
          websiteUrl={product.website_url}
          githubUrl={product.github_url}
          size="md"
        />
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-base">
          {product.name}
        </h3>
      </div>

      <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 flex-1">{product.short_description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.is_open_source && <Badge variant="secondary" className="text-xs font-normal">OSS</Badge>}
        {product.is_self_hostable && <Badge variant="secondary" className="text-xs font-normal">セルフホスト</Badge>}
        {product.has_cloud && <Badge variant="secondary" className="text-xs font-normal">クラウド</Badge>}
        {product.supports_japanese && <Badge variant="secondary" className="text-xs font-normal">🇯🇵 日本語</Badge>}
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {stars > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              {formatStars(stars)}
            </span>
          )}
          {product.license && (
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {product.license}
            </span>
          )}
        </div>
        <span className="text-primary font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          詳細 <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
});
ProductCard.displayName = "ProductCard";

/** Sponsor-style featured card with CTA button */
export function SponsorCard({ product }: { product: any }) {
  return (
    <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <ProductLogo
        name={product.name}
        logoUrl={product.logo_url}
        websiteUrl={product.website_url}
        githubUrl={product.github_url}
        size="lg"
      />
      <h3 className="mt-3 font-bold text-lg">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{product.short_description}</p>
      <Link to={`/products/${product.slug}`} className="mt-4 w-full">
        <Button className="w-full rounded-lg">
          詳しく見る <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

/** Detailed card used on alternative detail pages */
export function ProductCardDetailed({ product, reason }: { product: any; reason?: string | null }) {
  const stars = product.github_stars;
  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="bg-card border rounded-xl p-6 hover:shadow-sm transition-shadow">
      <Link to={`/products/${product.slug}`} className="group">
        <div className="flex items-start gap-4">
          <ProductLogo
            name={product.name}
            logoUrl={product.logo_url}
            websiteUrl={product.website_url}
            githubUrl={product.github_url}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {stars > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{formatStars(stars)}
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
        {product.is_self_hostable && <Badge variant="secondary" className="text-xs">セルフホスト</Badge>}
        {product.has_cloud && <Badge variant="secondary" className="text-xs">クラウド</Badge>}
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
    medium: "bg-amber-50 text-amber-600",
    hard: "bg-destructive/10 text-destructive",
  };
  const labels: Record<string, string> = { easy: "簡単", medium: "普通", hard: "難しい" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[difficulty] || ""}`}>
      {labels[difficulty] || difficulty}
    </span>
  );
}

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Check, X } from "lucide-react";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/tools/${product.slug}`}
      className="group surface-elevated rounded-lg p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
          {product.logo_url ? (
            <img src={product.logo_url} alt={product.name} className="h-8 w-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">{product.name[0]}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.has_free_plan && <Badge variant="secondary" className="text-xs">無料プランあり</Badge>}
            {product.is_open_source && <Badge variant="secondary" className="text-xs">OSS</Badge>}
            {product.supports_japanese && <Badge variant="secondary" className="text-xs">日本語対応</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardCompact({ product }: { product: Product }) {
  return (
    <Link
      to={`/tools/${product.slug}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
    >
      <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center shrink-0">
        {product.logo_url ? (
          <img src={product.logo_url} alt={product.name} className="h-6 w-6 object-contain" />
        ) : (
          <span className="text-sm font-bold text-muted-foreground">{product.name[0]}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground truncate">{product.short_description}</p>
      </div>
    </Link>
  );
}

export function FeatureIndicator({ value, label }: { value: boolean | null; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {value ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted-foreground" />}
      <span className={value ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

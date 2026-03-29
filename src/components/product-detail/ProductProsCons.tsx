import { Check, X, User, UserX } from "lucide-react";

interface ProductProsConsProps {
  product: any;
}

export function ProductProsCons({ product }: ProductProsConsProps) {
  if (!product.best_for && !product.not_good_for) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-5">メリット・デメリット</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {product.best_for && (
          <div className="surface-elevated rounded-xl p-6 border-l-4 border-l-accent">
            <h3 className="font-semibold text-accent flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />こんな人におすすめ
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.best_for}</p>
          </div>
        )}
        {product.not_good_for && (
          <div className="surface-elevated rounded-xl p-6 border-l-4 border-l-destructive">
            <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
              <UserX className="h-4 w-4" />向いていないケース
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.not_good_for}</p>
          </div>
        )}
      </div>
    </section>
  );
}

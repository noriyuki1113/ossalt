import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  products: any[];
  currentSlug: string;
  categoryName?: string;
  categorySlug?: string;
}

export function SameCategoryProducts({ products, currentSlug, categoryName, categorySlug }: Props) {
  const filtered = products.filter(p => p.slug !== currentSlug).slice(0, 6);
  if (!filtered.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">関連ツール</h2>
        {categorySlug && (
          <Link to={`/categories/${categorySlug}`}>
            <Button variant="ghost" size="sm" className="text-sm">
              もっと見る <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

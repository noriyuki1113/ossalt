import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { forwardRef } from "react";

interface AlternativeCardProps {
  alternative: any;
}

export const AlternativeCard = forwardRef<HTMLAnchorElement, AlternativeCardProps>(({ alternative }, ref) => {
  const count = alternative.product_count;

  return (
    <Link
      ref={ref}
      to={`/alternatives/${alternative.source_slug}`}
      className="surface-elevated rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {alternative.source_name}の代替
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{alternative.description}</p>
          <div className="mt-3 flex items-center gap-2">
            {typeof count === "number" && count > 0 && (
              <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
                {count} ツール
              </span>
            )}
            {alternative.category_hint && (
              <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
                {alternative.category_hint}
              </span>
            )}
            {alternative.featured && (
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">人気</span>
            )}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
});
AlternativeCard.displayName = "AlternativeCard";

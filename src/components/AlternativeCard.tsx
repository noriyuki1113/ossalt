import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function AlternativeCard({ alternative }: { alternative: any }) {
  return (
    <Link
      to={`/alternatives/${alternative.source_slug}`}
      className="surface-elevated rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold group-hover:text-primary transition-colors">
          {alternative.source_name}の代替
        </h3>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{alternative.description}</p>
      {alternative.category_hint && (
        <span className="mt-2 inline-block text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
          {alternative.category_hint}
        </span>
      )}
      {alternative.featured && (
        <span className="mt-2 ml-1 inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">人気</span>
      )}
    </Link>
  );
}

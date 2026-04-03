import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface Guide {
  title: string;
  description: string;
  href: string;
}

interface RelatedGuideCardProps {
  guides: Guide[];
  className?: string;
}

/**
 * Related guide links — shows curated comparison/selection guides.
 * Guides can be internal pages or future article URLs.
 */
export function RelatedGuideCard({ guides, className }: RelatedGuideCardProps) {
  if (guides.length === 0) return null;

  return (
    <div className={cn("card-unified p-5", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">関連ガイド</h3>
      </div>
      <div className="space-y-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            to={guide.href}
            className="group flex items-start gap-2.5 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => track("guide_click", { title: guide.title, href: guide.href })}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                {guide.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {guide.description}
              </p>
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}

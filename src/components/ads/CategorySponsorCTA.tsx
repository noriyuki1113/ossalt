import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface CategorySponsorCTAProps {
  className?: string;
  category?: string;
}

/**
 * CTA for category pages — encourages sponsors to advertise in a specific category.
 */
export function CategorySponsorCTA({ className, category }: CategorySponsorCTAProps) {
  return (
    <div className={cn("card-unified p-5", className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Megaphone className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {category ? `「${category}」の読者に届けたい方へ` : "このカテゴリの読者に届けたい方へ"}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        開発者・CTOが比較検討しているタイミングで、自然に認知を広げられます。
      </p>
      <Link
        to="/advertise#contact"
        onClick={() => track("revenue_cta_click", { cta: "category_sponsor", category: category || null })}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        カテゴリスポンサーについて相談する →
      </Link>
    </div>
  );
}

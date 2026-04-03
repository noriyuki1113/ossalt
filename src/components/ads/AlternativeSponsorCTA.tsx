import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface AlternativeSponsorCTAProps {
  className?: string;
  competitor?: string;
}

/**
 * CTA for alternative comparison pages — encourages sponsors targeting users comparing alternatives.
 */
export function AlternativeSponsorCTA({ className, competitor }: AlternativeSponsorCTAProps) {
  return (
    <div className={cn("card-unified p-5", className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {competitor ? `${competitor}代替を探しているユーザーに届けたい方へ` : "この比較を見ているユーザーに届けたい方へ"}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        マネージド版、導入支援、ホスティング、周辺サービスなど、関連性の高いソリューションを自然な文脈で掲載できます。
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/advertise#contact"
          onClick={() => track("revenue_cta_click", { cta: "alt_sponsor", competitor: competitor || null })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          掲載について相談する →
        </Link>
        <Link
          to="/submit"
          onClick={() => track("revenue_cta_click", { cta: "alt_free_listing", competitor: competitor || null })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          無料で掲載申請する →
        </Link>
      </div>
    </div>
  );
}

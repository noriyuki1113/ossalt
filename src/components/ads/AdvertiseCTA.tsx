import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvertiseCTAProps {
  className?: string;
  variant?: "inline" | "card";
}

/**
 * Subtle CTA linking to the /advertise page.
 * Use "inline" for footer-like placements, "card" for section-level placements.
 */
export function AdvertiseCTA({ className, variant = "inline" }: AdvertiseCTAProps) {
  if (variant === "inline") {
    return (
      <Link
        to="/advertise"
        className={cn(
          "text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap",
          className,
        )}
      >
        広告掲載について
      </Link>
    );
  }

  return (
    <Link
      to="/advertise"
      className={cn(
        "card-unified p-5 flex items-center gap-4 hover:border-primary/30 transition-colors group",
        className,
      )}
    >
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Megaphone className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          広告掲載・スポンサーについて
        </p>
        <p className="text-xs text-muted-foreground">
          OSSを探しているユーザーに、自然に届けませんか。
        </p>
      </div>
    </Link>
  );
}

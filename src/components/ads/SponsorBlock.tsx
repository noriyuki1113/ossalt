import { ExternalLink } from "lucide-react";
import { SponsorLabel } from "./AdSlot";
import { cn } from "@/lib/utils";

interface Sponsor {
  name: string;
  tagline: string;
  url: string;
  logoUrl?: string;
}

interface SponsorBlockProps {
  sponsor?: Sponsor;
  className?: string;
}

/**
 * Direct sponsor placement — replaces AdSlot when a direct sponsor is sold.
 * Falls back to a placeholder when no sponsor is provided.
 */
export function SponsorBlock({ sponsor, className }: SponsorBlockProps) {
  if (!sponsor) {
    return null;
  }

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      <SponsorLabel label="スポンサー" />
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="w-full max-w-4xl card-unified p-4 flex items-center gap-4 hover:border-primary/30 transition-colors group"
      >
        {sponsor.logoUrl && (
          <img
            src={sponsor.logoUrl}
            alt={sponsor.name}
            className="h-8 w-8 rounded-md object-contain shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {sponsor.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{sponsor.tagline}</p>
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
      </a>
    </div>
  );
}

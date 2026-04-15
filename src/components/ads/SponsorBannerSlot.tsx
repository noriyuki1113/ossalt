import { cn } from "@/lib/utils";
import { SponsorBlock } from "./SponsorBlock";
import { AdvertiseCTA } from "./AdvertiseCTA";

interface SponsorConfig {
  name: string;
  tagline: string;
  url: string;
  logoUrl?: string;
}

/**
 * Sponsor/advertise placement that shows a real SponsorBlock when a sponsor
 * is configured, and falls back to the AdvertiseCTA card otherwise.
 *
 * Sponsors can be loaded from a static config or CMS; currently hardcoded
 * for easy swapping when the first sponsor is sold.
 */

// ── Static sponsor registry ────────────────────────────────────────────────
// Add entries here when direct sponsors are sold.
// Key: slotId. Value: sponsor data (null = no sponsor, show fallback).
const SPONSORS: Record<string, SponsorConfig | null> = {
  "alternatives-top": null,
  "category-top": null,
  "detail-before-related": null,
};

interface SponsorBannerSlotProps {
  slotId: keyof typeof SPONSORS;
  /** Text shown under the section heading in AdvertiseCTA fallback card */
  fallbackContext?: string;
  className?: string;
}

export function SponsorBannerSlot({ slotId, fallbackContext: _fc, className }: SponsorBannerSlotProps) {
  const sponsor = SPONSORS[slotId];

  if (sponsor) {
    return (
      <div className={cn("py-4", className)}>
        <SponsorBlock sponsor={sponsor} />
      </div>
    );
  }

  // No active sponsor — show the AdvertiseCTA card as a useful fallback
  return (
    <div className={cn("py-4", className)}>
      <AdvertiseCTA variant="card" />
    </div>
  );
}

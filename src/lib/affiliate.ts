/**
 * Affiliate click tracking — best-effort.
 * Never blocks navigation; failures are silently swallowed.
 */
import { track } from "./track";
import type { AffiliateVps } from "@/config/affiliateLinks";

export function trackAffiliateClick(params: {
  provider: AffiliateVps["id"];
  ctaLabel: string;
  linkUrl: string;
}) {
  const payload = {
    event_type: "affiliate_click" as const,
    provider: params.provider,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    link_url: params.linkUrl,
    cta_label: params.ctaLabel,
    timestamp: new Date().toISOString(),
  };

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("[affiliate_click]", payload);
  }

  try {
    track("affiliate_click", {
      provider: payload.provider,
      page_path: payload.page_path,
      link_url: payload.link_url,
      cta_label: payload.cta_label,
      timestamp: payload.timestamp,
    });
  } catch {
    // best-effort
  }
}

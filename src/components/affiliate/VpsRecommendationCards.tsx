import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AFFILIATE_REL, AFFILIATE_VPS, getAffiliateHref } from "@/config/affiliateLinks";

interface Props {
  heading?: string;
  description?: string;
}

export function VpsRecommendationCards({
  heading = "用途別おすすめVPS",
  description = "OSSセルフホストでよく選ばれる4つのVPSをまとめました。",
}: Props) {
  return (
    <section className="container pb-10">
      {heading && (
        <h2 className="text-2xl font-bold text-foreground mb-2">{heading}</h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mb-5 max-w-3xl">{description}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AFFILIATE_VPS.map((v) => (
          <div key={v.id} className="card-unified p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-foreground">{v.name}</h3>
            <p className="text-xs text-primary mt-0.5">{v.recommendedFor}</p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
              {v.description}
            </p>
            <Button asChild className="mt-4 w-full min-h-[44px]">
              <a
                href={getAffiliateHref(v)}
                target="_blank"
                rel={AFFILIATE_REL}
              >
                {v.ctaLabel} <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

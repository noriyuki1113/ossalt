import { Link } from "react-router-dom";
import { ArrowRight, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  heading?: string;
  description?: string;
  ctaLabel?: string;
}

export function AffiliateVpsCTA({
  heading = "まだVPSを決めていませんか？",
  description = "OSSツールをセルフホストするなら、用途に合ったVPS選びが重要です。",
  ctaLabel = "OSSセルフホスト向けVPSを比較する",
}: Props) {
  return (
    <section className="container pb-10">
      <div className="card-unified p-6 md:p-8 max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-primary mb-2">
          <Server className="h-3.5 w-3.5" />
          <span>VPSを選ぶ</span>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2 w-full min-w-0 whitespace-normal break-words">
          {heading}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed w-full min-w-0 whitespace-normal break-words">
          {description}
        </p>
        <div className="mt-4">
          <Button asChild className="min-h-[44px]">
            <Link to="/selfhost-vps">
              {ctaLabel} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

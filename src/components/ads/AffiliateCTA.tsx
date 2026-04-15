import { ExternalLink, Sparkles } from "lucide-react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

interface AffiliateCTAProps {
  toolName: string;
  affiliateUrl: string;
  className?: string;
}

/**
 * Rendered when a tool has an affiliate_url set.
 * Links to a managed/hosted version or partner service.
 * Uses rel="sponsored" per Google guidelines.
 */
export function AffiliateCTA({ toolName, affiliateUrl, className }: AffiliateCTAProps) {
  return (
    <div className={cn("rounded-xl border border-primary/20 bg-primary/[0.03] p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-0.5">
            {toolName}のマネージド版を試す
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            セルフホストが難しい場合は、マネージドサービスとして手軽に使い始めることもできます。
          </p>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => track("affiliate_click", { tool: toolName, url: affiliateUrl })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3.5 py-1.5 hover:bg-primary/10 transition-colors"
          >
            マネージド版を見る <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/50 mt-3 text-right">
        ※ アフィリエイトリンクを含む場合があります
      </p>
    </div>
  );
}

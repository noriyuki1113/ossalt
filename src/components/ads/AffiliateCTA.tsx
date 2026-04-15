import { ExternalLink, Sparkles } from "lucide-react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import type { PartnerCard } from "@/hooks/use-partner-cards";

interface AffiliateCTAProps {
  toolName: string;
  cards: PartnerCard[];
  className?: string;
}

/**
 * Rendered when partner_cards has active rows for a tool.
 * Supports multiple cards (e.g. managed hosting + consulting).
 * Uses rel="sponsored" per Google guidelines.
 */
export function AffiliateCTA({ toolName, cards, className }: AffiliateCTAProps) {
  if (!cards.length) return null;

  // Single card: show compact banner
  if (cards.length === 1) {
    const card = cards[0];
    if (!card.url) return null;

    return (
      <div className={cn("rounded-xl border border-primary/20 bg-primary/[0.03] p-5", className)}>
        <div className="flex items-start gap-3">
          {card.logo_url ? (
            <img
              src={card.logo_url}
              alt={card.partner_name}
              className="h-8 w-8 rounded-md object-contain shrink-0 mt-0.5"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-0.5">
              {card.description
                ? card.partner_name
                : `${toolName}のマネージド版を試す`}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {card.description || "セルフホストが難しい場合は、マネージドサービスとして手軽に使い始めることもできます。"}
            </p>
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => track("partner_card_click", { tool: toolName, partner: card.partner_name, url: card.url })}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3.5 py-1.5 hover:bg-primary/10 transition-colors"
            >
              {card.label} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground/50 mt-3 text-right">
          ※ 提携リンクを含む場合があります
        </p>
      </div>
    );
  }

  // Multiple cards: list layout
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-5", className)}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        提携サービス
      </p>
      <div className="space-y-3">
        {cards.map((card) => {
          if (!card.url) return null;
          return (
            <a
              key={card.id}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => track("partner_card_click", { tool: toolName, partner: card.partner_name, url: card.url })}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/[0.02] transition-colors group"
            >
              {card.logo_url ? (
                <img src={card.logo_url} alt={card.partner_name} className="h-7 w-7 rounded object-contain shrink-0" />
              ) : (
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{card.partner_name}</p>
                {card.description && (
                  <p className="text-[10px] text-muted-foreground truncate">{card.description}</p>
                )}
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            </a>
          );
        })}
      </div>
      <p className="text-[9px] text-muted-foreground/50 mt-3 text-right">
        ※ 提携リンクを含む場合があります
      </p>
    </div>
  );
}

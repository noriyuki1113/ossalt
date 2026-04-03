import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsultationCTAProps {
  className?: string;
  toolName?: string;
}

/**
 * Future-ready CTA for "導入相談" or "OSS選定相談".
 * Currently links to /contact; can be swapped for a dedicated consultation page later.
 */
export function ConsultationCTA({ className, toolName }: ConsultationCTAProps) {
  return (
    <div className={cn("card-unified p-5 text-center", className)}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-foreground">
          OSS導入について相談する
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-3 max-w-md mx-auto">
        {toolName
          ? `${toolName}の導入や移行についてお悩みですか？お気軽にご相談ください。`
          : "OSSの選定や導入についてお悩みですか？お気軽にご相談ください。"}
      </p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        お問い合わせ →
      </Link>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Server, HardDrive, Settings, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface PartnerCTAProps {
  className?: string;
  toolName?: string;
}

/**
 * Partner / managed-service CTA for tool detail pages.
 * Shows links for managed hosting, deployment support, and related services.
 */
export function PartnerCTA({ className, toolName }: PartnerCTAProps) {
  const items = [
    { icon: Server, label: "マネージド版を比較する", desc: "サーバー管理不要のホスティングサービス" },
    { icon: Settings, label: "導入支援を探す", desc: "移行・構築をプロに任せたい方へ" },
    { icon: HardDrive, label: "関連サービスを見る", desc: "バックアップ・監視・認証などの周辺ツール" },
  ];

  return (
    <div className={cn("card-unified p-5", className)}>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-foreground">
          {toolName ? `${toolName}の導入・運用をサポート` : "導入・運用をサポート"}
        </p>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">提携</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        セルフホストが難しい方や、プロのサポートが必要な方向けのサービスです。
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            to="/advertise#contact"
            onClick={() => track("revenue_cta_click", { cta: "partner", tool: toolName || null, action: item.label })}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
              <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-3 text-center">
        パートナー掲載をご希望の方は{" "}
        <Link to="/advertise" className="text-primary hover:underline">こちら</Link>
      </p>
    </div>
  );
}

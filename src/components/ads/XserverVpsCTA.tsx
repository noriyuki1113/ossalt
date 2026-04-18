import { ExternalLink, Server } from "lucide-react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const XSERVER_VPS_URL = "https://vps.xserver.ne.jp/";

interface XserverVpsCTAProps {
  toolName?: string;
  className?: string;
}

export function XserverVpsCTA({ toolName, className }: XserverVpsCTAProps) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-[#E8380D]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Server className="h-4.5 w-4.5 text-[#E8380D]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-0.5">
            {toolName ? `${toolName}をVPSで動かす` : "OSSをVPSでセルフホスト"}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Xserver VPS なら月額660円〜、高速NVMe SSD搭載で手軽にセルフホスト環境を構築できます。
            OSイメージからワンクリックでセットアップ可能。
          </p>
          <a
            href={XSERVER_VPS_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() =>
              track("xserver_vps_click", {
                tool: toolName ?? "unknown",
                url: XSERVER_VPS_URL,
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8380D] border border-[#E8380D]/30 rounded-lg px-3.5 py-1.5 hover:bg-[#E8380D]/10 transition-colors"
          >
            Xserver VPS を見る <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/50 mt-3 text-right">
        ※ 提携リンクを含む場合があります
      </p>
    </div>
  );
}

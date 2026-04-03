import { Link } from "react-router-dom";
import { MessageSquarePlus, PenLine, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface CommunityParticipationCTAProps {
  className?: string;
  toolName?: string;
  context?: "detail" | "alternatives" | "category";
}

/**
 * Community participation CTA — encourages corrections, submissions, and future voting.
 * Gives the site a participatory, open-source community feel.
 */
export function CommunityParticipationCTA({ className, toolName, context = "detail" }: CommunityParticipationCTAProps) {
  const contactQuery = toolName ? `?subject=${encodeURIComponent(`${toolName}の情報修正`)}` : "";

  return (
    <div className={cn("card-unified p-5", className)}>
      <h3 className="text-sm font-semibold text-foreground mb-3">コミュニティに参加する</h3>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        OSSアルタナティブはオープンなディレクトリです。情報の修正やツールの追加にご協力ください。
      </p>
      <div className="space-y-2">
        <Link
          to={`/contact${contactQuery}`}
          className="group flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
          onClick={() => track("community_action", { action: "correction", tool: toolName || null, context })}
        >
          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
            <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">情報の修正を提案する</p>
            <p className="text-[10px] text-muted-foreground">誤りや古い情報があればお知らせください</p>
          </div>
        </Link>
        <Link
          to="/submit"
          className="group flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
          onClick={() => track("community_action", { action: "submit_tool", context })}
        >
          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
            <MessageSquarePlus className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">OSSツールを掲載申請する</p>
            <p className="text-[10px] text-muted-foreground">無料で掲載できます</p>
          </div>
        </Link>
        <div className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg opacity-50">
          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
            <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">おすすめ投票・レビュー</p>
            <p className="text-[10px] text-muted-foreground">近日公開予定</p>
          </div>
        </div>
      </div>
    </div>
  );
}

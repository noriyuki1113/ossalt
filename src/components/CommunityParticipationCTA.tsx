import { Link } from "react-router-dom";
import { MessageSquarePlus, PenLine, ThumbsUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface CommunityParticipationCTAProps {
  className?: string;
  toolName?: string;
  context?: "detail" | "alternatives" | "category";
}

export function CommunityParticipationCTA({ className, toolName, context = "detail" }: CommunityParticipationCTAProps) {
  const contactQuery = toolName ? `?subject=${encodeURIComponent(`${toolName}の情報修正`)}` : "";

  const actions = [
    {
      icon: PenLine,
      title: context === "detail" && toolName
        ? `${toolName}の情報を修正する`
        : "掲載情報の修正を提案する",
      desc: context === "detail"
        ? "誤りや古くなった情報があればお知らせください"
        : "誤りや古い情報を見つけたらお知らせください",
      to: `/contact${contactQuery}`,
      trackAction: "correction",
    },
    {
      icon: MessageSquarePlus,
      title: "OSSツールを掲載申請する",
      desc: "無料で掲載できます（審査あり）",
      to: "/submit",
      trackAction: "submit_tool",
    },
    ...(context === "alternatives" ? [{
      icon: Send,
      title: "比較してほしいテーマを送る",
      desc: "「○○ vs △△」など比較ページのリクエスト",
      to: `/contact?subject=${encodeURIComponent("比較テーマのリクエスト")}`,
      trackAction: "compare_request",
    }] : []),
  ];

  return (
    <div className={cn("card-unified p-5", className)}>
      <h3 className="text-sm font-semibold text-foreground mb-3">コミュニティに参加する</h3>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        OSSアルタナティブはオープンなディレクトリです。情報の修正やツールの追加にご協力ください。
      </p>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.trackAction}
            to={action.to}
            className="group flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => track("community_action", { action: action.trackAction, tool: toolName || null, context })}
          >
            <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
              <action.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{action.title}</p>
              <p className="text-[10px] text-muted-foreground">{action.desc}</p>
            </div>
          </Link>
        ))}
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

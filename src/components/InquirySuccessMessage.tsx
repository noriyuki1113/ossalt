import { CheckCircle2, Mail, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InquirySuccessMessageProps {
  type?: "contact" | "advertise";
}

export function InquirySuccessMessage({ type = "contact" }: InquirySuccessMessageProps) {
  const isAdvertise = type === "advertise";

  return (
    <div className="text-center p-8 md:p-10 rounded-xl border border-primary/30 bg-primary/5 space-y-6 animate-fade-in">
      {/* Success icon */}
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-7 w-7 text-primary" />
      </div>

      {/* Main message */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          {isAdvertise ? "お問い合わせを受け付けました" : "送信が完了しました"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {isAdvertise
            ? "広告掲載に関するお問い合わせありがとうございます。担当者が内容を確認し、ご連絡いたします。"
            : "お問い合わせありがとうございます。内容を確認の上、必要に応じてご連絡いたします。"}
        </p>
      </div>

      {/* Info cards */}
      <div className="space-y-3 max-w-sm mx-auto text-left">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
          <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">自動返信メールをお送りしています</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              届かない場合は迷惑メールフォルダをご確認ください。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
          <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">
              {isAdvertise ? "2〜3営業日以内にご返信します" : "通常1〜3営業日以内にご返信します"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAdvertise
                ? "掲載プランやご予算に合わせたご提案をお送りします。"
                : "内容によってはお時間をいただく場合があります。"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
          <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">返信が届かない場合</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              3営業日を過ぎても返信がない場合は、お手数ですが再度{" "}
              <Link to="/contact" className="text-primary hover:underline">お問い合わせページ</Link>
              {" "}からご連絡ください。
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <Button variant="outline" className="rounded-lg gap-2" asChild>
          <Link to="/">
            <ArrowLeft className="h-3.5 w-3.5" />
            トップページに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}

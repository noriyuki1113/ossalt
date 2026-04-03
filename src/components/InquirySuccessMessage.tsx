import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InquirySuccessMessageProps {
  type?: "contact" | "advertise";
}

export function InquirySuccessMessage({ type = "contact" }: InquirySuccessMessageProps) {
  return (
    <div className="text-center p-8 md:p-10 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-fade-in">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Check className="h-6 w-6 text-primary" />
      </div>

      <h2 className="text-xl font-bold text-foreground">送信が完了しました</h2>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
        {type === "advertise"
          ? "広告掲載に関するお問い合わせありがとうございます。2〜3営業日以内にご連絡いたします。"
          : "お問い合わせありがとうございます。内容を確認の上、必要に応じてご連絡いたします。"}
      </p>

      <div className="space-y-2 text-xs text-muted-foreground/70 pt-2">
        <p>📧 自動返信メールをお送りしています。届かない場合は迷惑メールフォルダをご確認ください。</p>
        <p>⏰ 通常1〜3営業日以内に返信いたします。</p>
      </div>

      <div className="pt-4">
        <Button variant="outline" className="rounded-lg" asChild>
          <Link to="/">トップページに戻る</Link>
        </Button>
      </div>
    </div>
  );
}

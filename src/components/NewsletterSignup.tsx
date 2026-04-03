import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface NewsletterSignupProps {
  className?: string;
  compact?: boolean;
}

/**
 * Newsletter signup CTA — placeholder for future email list.
 * Stores sign-up intent via tracking; actual email service integration TBD.
 */
export function NewsletterSignup({ className, compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    track("newsletter_signup", { email: email.trim() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={cn("card-unified p-5 text-center", className)}>
        <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">登録ありがとうございます！</p>
        <p className="text-xs text-muted-foreground mt-1">新しいOSSツールや比較ガイドの情報をお届けします。</p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 pl-9 text-xs rounded-lg"
            required
          />
        </div>
        <Button type="submit" size="sm" className="h-9 rounded-lg text-xs px-4">
          登録
        </Button>
      </form>
    );
  }

  return (
    <div className={cn("card-unified p-5", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Mail className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">OSS情報をメールで受け取る</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        新しいOSSツールの追加や比較ガイドの公開をお知らせします。週1回程度、スパムなし。
      </p>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 pl-9 text-xs rounded-lg"
            required
          />
        </div>
        <Button type="submit" size="sm" className="h-9 rounded-lg text-xs px-4 shrink-0">
          登録する
        </Button>
      </form>
    </div>
  );
}

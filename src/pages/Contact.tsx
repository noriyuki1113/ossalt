import { useState } from "react";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { InquirySuccessMessage } from "@/components/InquirySuccessMessage";
import { track } from "@/lib/track";

const CATEGORIES = ["掲載内容の誤り", "ツールの追加リクエスト", "その他"] as const;

function validate(form: { name: string; email: string; category: string; message: string }) {
  const errors: Record<string, string> = {};
  const trimmedEmail = form.email.trim();
  if (!trimmedEmail) {
    errors.email = "メールアドレスを入力してください";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "有効なメールアドレスを入力してください";
  } else if (trimmedEmail.length > 320) {
    errors.email = "メールアドレスが長すぎます";
  }
  const msg = form.message.trim();
  if (!msg) {
    errors.message = "メッセージを入力してください";
  } else if (msg.length > 5000) {
    errors.message = "メッセージは5000文字以内で入力してください";
  }
  return errors;
}

export default function ContactPage() {
  useSeo({
    title: "お問い合わせ",
    description: "OSSアルタナティブへのお問い合わせはこちらから。掲載内容の誤り報告やツール追加リクエストを受け付けています。",
    canonical: "https://ossalt.jp/contact",
  });

  const [form, setForm] = useState({ name: "", email: "", category: "その他", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("contacts").insert({
        name: form.name || null,
        email: form.email,
        category: form.category,
        message: form.message,
      });

      if (error) {
        toast.error("送信に失敗しました。もう一度お試しください。");
        return;
      }

      // Send email notification (fire-and-forget, DB save already succeeded)
      supabase.functions.invoke("send-contact-email", {
        body: {
          name: form.name || null,
          email: form.email,
          category: form.category,
          message: form.message,
          inquiry_type: "contact",
        },
      }).then(({ data, error: fnErr }) => {
        if (fnErr) console.error("Email notification failed:", fnErr);
        else console.log("Email notification result:", data);
      });

      setSubmitted(true);
      track("form_submit", { form: "contact", category: form.category });
      toast.success("お問い合わせを送信しました。");
    } catch {
      toast.error("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="container max-w-xl mx-auto py-20 px-4">
          <InquirySuccessMessage type="contact" />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageBackTop />
      <div className="container max-w-xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          お問い合わせ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">お名前（任意）</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="お名前"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              メールアドレス <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="email@example.com"
              maxLength={320}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">お問い合わせ種別</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              メッセージ <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="お問い合わせ内容をご記入ください"
              maxLength={5000}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full gap-2 rounded-xl" disabled={submitting}>
            <Send className="h-4 w-4" />
            {submitting ? "送信中…" : "送信する"}
          </Button>
        </form>
      </div>
      <PageBackBottom />
    </SiteLayout>
  );
}

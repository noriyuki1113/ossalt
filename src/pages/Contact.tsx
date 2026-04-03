import { useState } from "react";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";
import { z } from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().trim().email("有効なメールアドレスを入力してください").max(320),
  category: z.string().min(1),
  message: z.string().trim().min(1, "メッセージを入力してください").max(5000, "メッセージは5000文字以内で入力してください"),
});

const CATEGORIES = ["掲載内容の誤り", "ツールの追加リクエスト", "その他"] as const;

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

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contacts").insert({
      name: form.name || null,
      email: form.email,
      category: form.category,
      message: form.message,
    });
    setSubmitting(false);

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
    toast.success("お問い合わせを送信しました。");
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="container max-w-xl mx-auto py-20 px-4 text-center animate-fade-in">
          <div className="rounded-2xl border bg-card p-10 space-y-4">
            <div className="text-4xl">✉️</div>
            <h1 className="text-2xl font-bold">送信完了</h1>
            <p className="text-muted-foreground">
              お問い合わせありがとうございます。内容を確認の上、必要に応じてご連絡いたします。
            </p>
          </div>
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
              メールアドレス <span className="text-red-400">*</span>
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
            {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
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
              メッセージ <span className="text-red-400">*</span>
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
            {errors.message && <p className="text-sm text-red-400">{errors.message}</p>}
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

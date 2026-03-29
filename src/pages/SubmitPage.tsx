import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    website_url: "",
    github_url: "",
    email: "",
    message: "",
  });

  useSeo({
    title: "掲載申請 — あなたのOSSツールをAltFinder.jpに掲載",
    description: "オープンソースツールの掲載を申請できます。審査の上、AltFinder.jpに掲載されます。",
    canonical: "https://altfinder.jp/submit",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_name.trim() || !form.website_url.trim() || !form.email.trim()) {
      toast.error("必須項目を入力してください");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("submissions").insert({
      product_name: form.product_name.trim(),
      website_url: form.website_url.trim(),
      email: form.email.trim(),
      message: form.message.trim() || null,
    });
    setLoading(false);

    if (error) {
      toast.error("送信に失敗しました。入力内容をご確認ください。");
    } else {
      setSubmitted(true);
      toast.success("掲載申請を受け付けました！");
      setForm({ product_name: "", website_url: "", github_url: "", email: "", message: "" });
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="container py-20 max-w-lg text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold">申請を受け付けました</h1>
          <p className="mt-3 text-muted-foreground">
            ご申請ありがとうございます。審査の上、掲載させていただきます。結果はメールでお知らせします。
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
            もう一件申請する
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container py-10 md:py-14 max-w-lg">
        <Breadcrumbs items={[{ label: "掲載申請" }]} />

        <h1 className="text-3xl font-bold">掲載申請</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          あなたのOSSツールをAltFinder.jpに掲載しませんか？以下のフォームから申請してください。審査の上、サイトに追加されます。
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product_name">ツール名 <span className="text-destructive">*</span></Label>
            <Input
              id="product_name"
              value={form.product_name}
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
              required
              maxLength={200}
              placeholder="例: AppFlowy"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">公式サイトURL <span className="text-destructive">*</span></Label>
            <Input
              id="website_url"
              type="url"
              value={form.website_url}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
              required
              maxLength={500}
              placeholder="https://example.com"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              maxLength={500}
              placeholder="https://github.com/..."
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              maxLength={320}
              placeholder="you@example.com"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">メッセージ（任意）</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              maxLength={1000}
              placeholder="ツールの特徴やおすすめポイントなど"
              className="rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base">
            <Send className="mr-2 h-4 w-4" />
            {loading ? "送信中..." : "申請を送信する"}
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}

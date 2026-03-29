import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ product_name: "", website_url: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_name.trim() || !form.website_url.trim() || !form.email.trim()) {
      toast.error("必須項目を入力してください");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("submissions").insert(form);
    setLoading(false);
    if (error) {
      toast.error("送信に失敗しました");
    } else {
      toast.success("掲載申請を受け付けました！");
      setForm({ product_name: "", website_url: "", email: "", message: "" });
    }
  };

  return (
    <SiteLayout>
      <div className="container py-10 max-w-lg">
        <Breadcrumbs items={[{ label: "掲載申請" }]} />
        <h1 className="text-3xl font-bold">掲載申請</h1>
        <p className="mt-2 text-muted-foreground">あなたのサービスをAltFinder.jpに掲載しませんか？</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="product_name">サービス名 *</Label>
            <Input id="product_name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} required maxLength={200} />
          </div>
          <div>
            <Label htmlFor="website_url">公式サイトURL *</Label>
            <Input id="website_url" type="url" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} required maxLength={500} />
          </div>
          <div>
            <Label htmlFor="email">メールアドレス *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={320} />
          </div>
          <div>
            <Label htmlFor="message">メッセージ（任意）</Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} maxLength={1000} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Send className="mr-2 h-4 w-4" />{loading ? "送信中..." : "申請を送信する"}
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}

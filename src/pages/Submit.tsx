import { useState } from "react";
import { Link } from "react-router-dom";
import { track } from "@/lib/track";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2, ArrowRight, Star, Zap, Megaphone,
  Mail, Clock, AlertTriangle, ArrowLeft,
} from "lucide-react";

const CATEGORIES = [
  "AI・ML", "業務ソフト", "開発ツール", "インフラ・運用",
  "データ・分析", "コンテンツ", "生産性・便利ツール", "セキュリティ",
  "コミュニティ", "その他",
];

const UPSELL_OPTIONS = [
  {
    icon: Zap,
    title: "優先掲載で早く公開する",
    desc: "通常審査をスキップし、優先的に掲載されます。",
    cta: "優先掲載について相談する",
    link: "/advertise#contact",
    leadType: "expedited",
  },
  {
    icon: Star,
    title: "注目掲載でカテゴリ内で目立つ",
    desc: "カテゴリページ・比較ページで上位に表示されます。",
    cta: "注目掲載について相談する",
    link: "/advertise#contact",
    leadType: "featured",
  },
  {
    icon: Megaphone,
    title: "スポンサー掲載で広くリーチする",
    desc: "トップページやカテゴリページのスポンサー枠に掲載できます。",
    cta: "スポンサー掲載について相談する",
    link: "/advertise",
    leadType: "sponsor",
  },
];

export default function Submit() {
  useSeo({
    title: "無料掲載申請 | OSSアルタナティブ",
    description: "自作・運営中のOSSプロジェクトをOSSアルタナティブに無料で掲載申請できます。カテゴリ・GitHubリンクを入力するだけの簡単フォーム。",
    canonical: "https://ossalt.jp/submit",
  });

  const [form, setForm] = useState({
    name: "", website_url: "", github_url: "", category: "",
    description: "", contact_name: "", contact_email: "", message: "",
    agreed_policy: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.website_url.trim() || !form.contact_name.trim() || !form.contact_email.trim()) {
      setError("必須項目を入力してください。");
      return;
    }
    if (!form.agreed_policy) {
      setError("掲載ポリシーへの同意が必要です。");
      return;
    }
    setSubmitting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: dbError } = await supabase.from("listing_requests").insert({
        name: form.name.trim(),
        website_url: form.website_url.trim(),
        github_url: form.github_url.trim() || null,
        category: form.category || null,
        description: form.description.trim() || null,
        contact_name: form.contact_name.trim(),
        contact_email: form.contact_email.trim(),
        message: form.message.trim() || null,
        agreed_policy: form.agreed_policy,
      });
      if (dbError) { setError("送信に失敗しました。もう一度お試しください。"); return; }

      supabase.functions.invoke("send-contact-email", {
        body: {
          name: form.contact_name.trim(),
          email: form.contact_email.trim(),
          message: `掲載申請: ${form.name.trim()} (${form.website_url.trim()})`,
          inquiry_type: "listing",
        },
      }).catch(() => {});

      track("form_submit", { form: "listing_request", category: form.category || "none", referrer: document.referrer });
      setSubmitted(true);
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="container max-w-lg mx-auto px-4 py-16">
          {/* Success message */}
          <div className="text-center p-8 rounded-xl border border-primary/30 bg-primary/5 space-y-5 animate-fade-in mb-10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">掲載申請を受け付けました</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                通常審査の後、掲載を開始します。審査には通常3〜5営業日ほどお時間をいただきます。
              </p>
            </div>
            <div className="space-y-3 max-w-sm mx-auto text-left">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
                <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">確認メールをお送りしています</p>
                  <p className="text-xs text-muted-foreground mt-0.5">届かない場合は迷惑メールフォルダをご確認ください。</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">審査完了後にご連絡します</p>
                  <p className="text-xs text-muted-foreground mt-0.5">掲載開始時にメールでお知らせします。</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/60">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">5営業日以上かかる場合</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    お手数ですが{" "}
                    <Link to="/contact" className="text-primary hover:underline">お問い合わせページ</Link>
                    {" "}からご連絡ください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upsell cards */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground text-center mb-4">掲載をもっと効果的にするオプション</p>
            {UPSELL_OPTIONS.map((opt) => (
              <Link
                key={opt.leadType}
                to={opt.link}
                onClick={() => track("upsell_click", { source: "listing_thanks", type: opt.leadType })}
                className="card-unified p-4 flex items-start gap-3 hover:border-primary/30 transition-colors group block"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <opt.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{opt.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary mt-2">
                    {opt.cta} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="rounded-lg gap-2" asChild>
              <Link to="/"><ArrowLeft className="h-3.5 w-3.5" /> トップページに戻る</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">無料掲載申請</h1>
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          OSSプロジェクトや関連サービスを無料で掲載申請できます。
          <br className="hidden sm:block" />
          審査の上、サイトに掲載を開始します。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>プロジェクト / サービス名 <span className="text-destructive">*</span></Label>
            <Input required maxLength={200} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="例: Appflowy" />
          </div>
          <div className="space-y-2">
            <Label>公式サイトURL <span className="text-destructive">*</span></Label>
            <Input required maxLength={500} type="url" value={form.website_url} onChange={(e) => setForm((p) => ({ ...p, website_url: e.target.value }))} placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input maxLength={500} type="url" value={form.github_url} onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label>カテゴリ</Label>
            <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
              <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>プロジェクトの説明</Label>
            <Textarea maxLength={2000} rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="どのようなツールか、何の代替になるかを簡潔に" />
          </div>

          <div className="border-t border-border/60 pt-5">
            <p className="text-xs font-medium text-muted-foreground mb-3">担当者情報</p>
          </div>
          <div className="space-y-2">
            <Label>お名前 <span className="text-destructive">*</span></Label>
            <Input required maxLength={200} value={form.contact_name} onChange={(e) => setForm((p) => ({ ...p, contact_name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>メールアドレス <span className="text-destructive">*</span></Label>
            <Input required type="email" maxLength={320} value={form.contact_email} onChange={(e) => setForm((p) => ({ ...p, contact_email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>補足メッセージ（任意）</Label>
            <Textarea maxLength={2000} rows={3} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="policy"
              checked={form.agreed_policy}
              onCheckedChange={(checked) => setForm((p) => ({ ...p, agreed_policy: !!checked }))}
              className="mt-0.5"
            />
            <Label htmlFor="policy" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              <Link to="/terms" className="text-primary hover:underline" target="_blank">掲載ポリシー</Link>
              に同意します
            </Label>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full rounded-lg" disabled={submitting}>
            {submitting ? "送信中..." : "掲載を申請する（無料）"}
          </Button>
        </form>

        <div className="mt-8 card-unified p-4 text-center">
          <p className="text-xs text-muted-foreground">
            早く掲載したい方には{" "}
            <Link to="/advertise" className="text-primary hover:underline">優先掲載オプション</Link>
            もあります
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

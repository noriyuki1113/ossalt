import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { Eye, LayoutGrid, FolderOpen, Check, Star, Zap, Crown, Users, Building, Globe } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "¥4,900",
    period: "/月",
    icon: Zap,
    recommended: false,
    features: [
      "ランキングページ上部に表示",
      "クリック数レポート（月次）",
    ],
  },
  {
    name: "Standard",
    price: "¥9,800",
    period: "/月",
    icon: Star,
    recommended: true,
    features: [
      "トップページ・ランキング・カテゴリページに表示",
      "クリック＋表示数レポート（月次）",
      'プロダクトページに「Featured」バッジ',
    ],
  },
  {
    name: "Premium",
    price: "¥19,800",
    period: "/月",
    icon: Crown,
    recommended: false,
    features: [
      "全ページに表示（表示頻度2倍）",
      "トップページにロゴ固定表示",
      "「おすすめ」バッジ",
      "月次詳細レポート",
      "掲載内容の編集サポート",
    ],
  },
];

const audiences = [
  { icon: Users, text: "OSSプロジェクトのメンテナー" },
  { icon: Building, text: "開発者向けSaaSを提供している企業" },
  { icon: Globe, text: "日本市場に参入したい海外OSSチーム" },
];

const faqs = [
  {
    q: "掲載開始までどのくらいかかりますか？",
    a: "お申し込み確認後、通常2〜3営業日以内に掲載開始します。",
  },
  {
    q: "契約期間の縛りはありますか？",
    a: "月単位の契約です。いつでもキャンセル可能です。",
  },
  {
    q: "効果測定はできますか？",
    a: "クリック数・表示数のレポートを毎月メールでお送りします。",
  },
];

export default function Advertise() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    product_name: "",
    plan: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formState.name.trim() || !formState.email.trim() || !formState.product_name.trim()) {
      setError("必須項目を入力してください。");
      return;
    }
    setSubmitting(true);
    const { error: dbError } = await supabase.from("advertise_inquiries").insert({
      name: formState.name.trim(),
      email: formState.email.trim(),
      product_name: formState.product_name.trim(),
      plan: formState.plan || "undecided",
      message: formState.message.trim() || null,
    });
    setSubmitting(false);
    if (dbError) {
      setError("送信に失敗しました。もう一度お試しください。");
      return;
    }
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            日本のエンジニアにリーチしよう
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8">
            ossalt.jpは日本語圏唯一のOSS代替ツールディレクトリです。
            OSSを積極的に探しているエンジニア・IT担当者に、あなたのプロダクトを届けましょう。
          </p>
          <Button
            size="lg"
            className="rounded-xl px-8 text-base shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold"
            onClick={scrollToForm}
          >
            掲載を申し込む
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Eye, label: "月間ページビュー", value: "準備中" },
            { icon: LayoutGrid, label: "掲載ツール数", value: "680+" },
            { icon: FolderOpen, label: "カテゴリ数", value: "50+" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <s.icon className="h-8 w-8 text-primary" />
              <span className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10">掲載プラン</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  plan.recommended
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    おすすめ
                  </span>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <plan.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="flex-1 space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.recommended ? "default" : "outline"}
                  className="w-full rounded-lg"
                  onClick={scrollToForm}
                >
                  申し込む
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="py-12 md:py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">こんな方におすすめ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {audiences.map((a) => (
              <div key={a.text} className="flex flex-col items-center text-center gap-3 p-6 rounded-xl border border-border bg-card">
                <a.icon className="h-8 w-8 text-primary" />
                <span className="text-sm text-muted-foreground">{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">よくある質問</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            掲載を申し込む・お問い合わせ
          </h2>

          {submitted ? (
            <div className="text-center p-8 rounded-xl border border-primary/30 bg-primary/5">
              <Check className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-foreground font-medium">お問い合わせありがとうございます。</p>
              <p className="text-muted-foreground text-sm mt-1">2〜3営業日以内にご連絡します。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="adv-name">お名前 <span className="text-destructive">*</span></Label>
                <Input
                  id="adv-name"
                  required
                  maxLength={200}
                  value={formState.name}
                  onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-email">メールアドレス <span className="text-destructive">*</span></Label>
                <Input
                  id="adv-email"
                  type="email"
                  required
                  maxLength={320}
                  value={formState.email}
                  onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-product">プロダクト名 <span className="text-destructive">*</span></Label>
                <Input
                  id="adv-product"
                  required
                  maxLength={200}
                  value={formState.product_name}
                  onChange={(e) => setFormState((p) => ({ ...p, product_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>ご希望のプラン</Label>
                <Select
                  value={formState.plan}
                  onValueChange={(v) => setFormState((p) => ({ ...p, plan: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="undecided">まだ決めていない</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-message">メッセージ（任意）</Label>
                <Textarea
                  id="adv-message"
                  maxLength={5000}
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full rounded-lg" disabled={submitting}>
                {submitting ? "送信中..." : "送信する"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

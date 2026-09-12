import { useState } from "react";
import { track } from "@/lib/track";
import { SiteLayout } from "@/components/SiteLayout";
import { InquirySuccessMessage } from "@/components/InquirySuccessMessage";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check, Users, Code2, Building, Globe,
  LayoutGrid, FileText, Shield, ArrowRight,
  Eye, Search, Zap, Server, Megaphone,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── Data ── */

const AUDIENCES = [
  { icon: Code2, title: "エンジニア・開発者", desc: "SaaSからOSSへの移行を検討している技術者" },
  { icon: Building, title: "技術責任者・CTO", desc: "コスト削減やデータ主権を重視する意思決定者" },
  { icon: Users, title: "スタートアップ", desc: "低コストで高品質なツールを探しているチーム" },
  { icon: Server, title: "運用・インフラ担当", desc: "セルフホスト環境を構築・運用する担当者" },
];

const PLANS = [
  {
    name: "カテゴリスポンサー",
    price: "個別見積もり",
    desc: "特定カテゴリの読者に向けて、スポンサー枠として掲載します。テーマが明確な読者層に対して、関連するサービスを届けたい企業に向いています。",
    items: [
      { label: "対象", text: "開発者向けSaaS / クラウド / インフラ / 周辺ツール" },
      { label: "掲載面", text: "カテゴリページのスポンサー枠" },
      { label: "表示ラベル", text: "スポンサー" },
      { label: "順位への影響", text: "なし" },
    ],
    value: "category-sponsor",
    popular: true,
  },
  {
    name: "関連サービス掲載",
    price: "個別見積もり",
    desc: "特定ツールを検討中のユーザーに、導入支援、マネージド版、ホスティングなどの関連サービスとして掲載します。",
    items: [
      { label: "対象", text: "導入支援 / マネージド版 / ホスティング / インフラ提供企業" },
      { label: "掲載面", text: "関連するツール詳細ページ" },
      { label: "表示ラベル", text: "提携" },
      { label: "順位への影響", text: "なし" },
    ],
    value: "detail-partner",
  },
  {
    name: "掲載情報の確認",
    price: "無償",
    desc: "OSSプロジェクトの提供元による掲載内容の修正・確認を受け付けます。確認済みの情報として表示しますが、検索順位や評価は変わりません。",
    items: [
      { label: "対象", text: "掲載中または新規のOSSプロジェクト" },
      { label: "内容", text: "公式URL、説明、ライセンス、導入情報の確認" },
      { label: "表示ラベル", text: "確認済み" },
      { label: "順位への影響", text: "なし" },
    ],
    value: "listing-review",
  },
];

const PLACEMENTS = [
  { icon: LayoutGrid, title: "トップページ", desc: "サイト全体の入口で、幅広い認知を獲得できます。" },
  { icon: Search, title: "カテゴリページ", desc: "特定テーマに関心がある読者へ、文脈に沿って訴求できます。" },
  { icon: Megaphone, title: "代替比較ページ", desc: "「Notion代替」「Slack代替」など、比較検討中の高意図ユーザーに届きます。" },
  { icon: FileText, title: "ツール詳細ページ", desc: "特定ツールを深く見ているユーザーに、関連サービスとして訴求できます。" },
];

const POLICIES = [
  { icon: Shield, text: "広告・スポンサー・提携であることを明示します" },
  { icon: Search, text: "自然な検索順位やランキングとは完全に分離します" },
  { icon: Users, text: "ユーザーの比較体験を損なう掲載はお断りします" },
  { icon: Eye, text: "掲載面と表示内容は事前にご確認いただけます" },
];

const GOOD_FIT = [
  { icon: Globe, title: "OSSプロジェクト", desc: "ホスティング、マネージド版、導入支援の告知" },
  { icon: Zap, title: "開発者向けSaaS・クラウドサービス", desc: "CI/CD、監視、API管理、開発基盤など" },
  { icon: Building, title: "OSS導入支援・コンサルティング会社", desc: "セルフホスト構築支援、移行コンサル、技術導入支援など" },
  { icon: Server, title: "ホスティング・インフラプロバイダー", desc: "VPS、マネージドDB、CDN、クラウド基盤など" },
  { icon: Code2, title: "開発者向けツール・サービス", desc: "IDE、テストツール、運用支援ツールなど" },
];

const STEPS = [
  { n: "01", title: "お問い合わせ", desc: "フォームから掲載目的をご連絡ください。" },
  { n: "02", title: "内容確認", desc: "掲載先ページや掲載内容を確認します。" },
  { n: "03", title: "クリエイティブ確認", desc: "表示内容、リンク先、文言を確認します。" },
  { n: "04", title: "掲載開始", desc: "掲載内容と関連性を確認してから開始します。" },
];

const FAQ = [
  { q: "掲載には広告ラベルが付きますか？", a: "はい。有償掲載には「スポンサー」または「提携」のラベルが付きます。掲載情報の確認は「確認済み」と表示します。" },
  { q: "スポンサー掲載で順位は上がりますか？", a: "いいえ。スポンサー掲載は自然順位やランキングとは完全に分離しています。" },
  { q: "まずは1か月だけ試せますか？", a: "はい。掲載期間や表示回数は、計測方法を含めて個別にご案内します。" },
  { q: "どのプランが合うか分かりません", a: "掲載目的に応じて、相性の良いプランをご案内します。まずはお気軽にご相談ください。" },
];

export default function Advertise() {
  useSeo({
    title: "スポンサー・関連サービス掲載 | ossalt",
    description: "ossalt は、OSSの導入・比較を検討する読者に関連サービスを届けるための掲載窓口です。",
    canonical: "https://ossalt.jp/advertise",
  });

  const [form, setForm] = useState({ name: "", email: "", product_name: "", plan: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const scrollToForm = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  const scrollToPlans = () => document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });

  const selectPlan = (planValue: string) => {
    setForm((p) => ({ ...p, plan: planValue }));
    track("plan_card_click", { plan: planValue });
    scrollToForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.product_name.trim()) {
      setError("必須項目を入力してください。");
      return;
    }
    setSubmitting(true);
    const { supabase } = await import("@/integrations/supabase/client");
    const { error: dbError } = await supabase.from("advertise_inquiries").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      product_name: form.product_name.trim(),
      plan: form.plan || "undecided",
      message: form.message.trim() || null,
    });
    setSubmitting(false);
    if (dbError) { setError("送信に失敗しました。もう一度お試しください。"); return; }

    supabase.functions.invoke("send-contact-email", {
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim() || `広告掲載の相談: ${form.product_name.trim()}`,
        inquiry_type: "advertise",
        product_name: form.product_name.trim(),
        plan: form.plan || "undecided",
      },
    }).then(({ error: fnErr }) => {
      if (fnErr) console.error("Advertise email failed:", fnErr);
    });

    track("form_submit", { form: "advertise", plan: form.plan || "undecided", referrer: document.referrer });
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-5 leading-tight">
            OSSを探しているユーザーに、
            <br className="hidden sm:block" />
            自然に届けませんか。
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-3 max-w-2xl mx-auto">
            ossalt は、有料SaaSの代替となるオープンソースツールを日本語で探せる比較サイトです。
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            導入を検討しているエンジニア、技術責任者、スタートアップ、運用・インフラ担当に向けて、自然な文脈で認知を広げられます。
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
            {[
              { icon: LayoutGrid, text: "680+ のOSSツールを掲載" },
              { icon: Eye, text: "比較・導入を検討する読者" },
              { icon: Users, text: "比較検討中の高意図ユーザーが中心" },
            ].map((h) => (
              <span key={h.text} className="inline-flex items-center gap-1.5">
                <h.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs md:text-sm">{h.text}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="rounded-xl px-8 text-sm font-semibold" onClick={scrollToForm}>
              掲載について相談する <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl px-8 text-sm font-semibold" onClick={scrollToPlans}>
              プランを見る
            </Button>
          </div>
        </div>
      </section>

      {/* ── 2. Audience ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">届けられる読者</h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            比較検討中の高意図ユーザーに、自然な文脈でリーチできます。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="card-unified p-5 flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <a.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{a.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 & 4. Pricing ── */}
      <section id="plans" className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">スポンサー・関連サービス掲載</h2>
          <p className="text-sm text-muted-foreground text-center mb-3 max-w-xl mx-auto">
            掲載内容と計測方法を確認したうえで、関連性の高い枠をご案内します。
          </p>
          <p className="text-xs text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            検索順位やランキングへの影響はなく、すべての有償掲載にラベルを表示します。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PLANS.map((p) => (
              <div
                key={p.value}
                className={`card-unified p-6 flex flex-col relative ${p.popular ? "border-primary/40 ring-1 ring-primary/20" : ""}`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full">
                    おすすめ
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                    <span className="text-sm font-semibold text-primary">{p.price}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>

                <div className="space-y-2 text-xs text-muted-foreground flex-1 mb-5">
                  {p.items.map((item) => (
                    <div key={item.label} className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <span>
                        <span className="text-foreground font-medium">{item.label}:</span> {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={p.popular ? "default" : "outline"}
                  size="sm"
                  className="w-full rounded-lg text-xs"
                  onClick={() => selectPlan(p.value)}
                >
                  このプランで相談する <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Placements ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">掲載できる場所</h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            読者の検討段階に合わせて、適切な掲載面をご案内します。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLACEMENTS.map((p) => (
              <div key={p.title} className="card-unified p-5 flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <p.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{p.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Policy ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">掲載ポリシー</h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            ossalt では、比較体験の信頼性を守るため、以下の方針で運営しています。
          </p>
          <div className="card-unified p-6 md:p-8 space-y-4">
            {POLICIES.map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <item.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Good Fit ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">相性の良い掲載主</h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            以下のようなサービスや企業と相性が良い掲載面をご用意しています。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GOOD_FIT.map((item) => (
              <div key={item.title} className="card-unified p-5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Flow ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">掲載までの流れ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="card-unified p-5 text-center">
                <span className="text-2xl font-bold text-primary/30">{s.n}</span>
                <p className="text-sm font-semibold text-foreground mt-2 mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">よくある質問</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="card-unified border-0 overflow-hidden">
                <AccordionTrigger className="px-5 py-4 text-sm font-medium text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 10. Final CTA ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card-unified p-8 md:p-12 text-center">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">
              比較検討中の高意図ユーザーに、自然な文脈で届けたい方へ
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-lg mx-auto">
              認知拡大、比較検討中ユーザーへの訴求、導入支援の送客など、目的に応じて最適な掲載面をご案内します。
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              まずはお気軽にお問い合わせください。
            </p>
            <Button size="lg" className="rounded-xl px-8 text-sm font-semibold" onClick={scrollToForm}>
              お問い合わせする <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── 11. Contact Form ── */}
      <section id="contact" className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">お問い合わせ</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">以下を添えてご連絡ください。</p>

          {submitted ? (
            <InquirySuccessMessage type="advertise" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="adv-name">会社名 / プロジェクト名 <span className="text-destructive">*</span></Label>
                <Input
                  id="adv-name"
                  required
                  maxLength={200}
                  placeholder="株式会社○○ / プロジェクト名"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-email">メールアドレス <span className="text-destructive">*</span></Label>
                <Input
                  id="adv-email"
                  type="email"
                  required
                  maxLength={320}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-product">サービスURL <span className="text-destructive">*</span></Label>
                <Input
                  id="adv-product"
                  required
                  maxLength={500}
                  placeholder="https://..."
                  value={form.product_name}
                  onChange={(e) => setForm((p) => ({ ...p, product_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>希望プラン</Label>
                <Select value={form.plan} onValueChange={(v) => setForm((p) => ({ ...p, plan: v }))}>
                  <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                  <SelectContent>
                    {PLANS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.name}（{p.price}）</SelectItem>
                    ))}
                    <SelectItem value="undecided">まだ決めていない</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-message">
                  ご相談内容
                  <span className="text-muted-foreground text-xs ml-1.5 font-normal">
                    掲載したいカテゴリやページ、開始希望時期なども添えていただけると助かります
                  </span>
                </Label>
                <Textarea
                  id="adv-message"
                  maxLength={5000}
                  rows={5}
                  placeholder="掲載したいカテゴリ、対象ページ、開始希望時期、その他ご質問など"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
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

      {/* Free listing nudge */}
      <section className="pb-14">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <p className="text-xs text-muted-foreground mb-3">OSSツールの通常掲載は無料です</p>
          <Button variant="outline" className="rounded-xl gap-2" asChild>
            <Link to="/submit">無料で掲載申請する <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

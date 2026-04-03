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
import { supabase } from "@/integrations/supabase/client";
import {
  Check, Users, Code2, Building, Globe, Search,
  LayoutGrid, FileText, Shield, ArrowRight, Megaphone,
  Eye, FolderOpen, Star, Zap, Server, HelpCircle,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── Data ── */

const AUDIENCES = [
  { icon: Code2, title: "エンジニア・開発者", desc: "SaaSからOSSへの移行を検討している技術者" },
  { icon: Building, title: "技術責任者・CTO", desc: "コスト削減やデータ主権を重視する意思決定者" },
  { icon: Users, title: "スタートアップ", desc: "低コストで高品質なツールを探しているチーム" },
  { icon: Globe, title: "運用・インフラ担当", desc: "セルフホスト環境を構築・運用する担当者" },
];

const PLANS = [
  {
    name: "優先掲載",
    price: "単発",
    target: "早く掲載されたいOSSプロジェクト",
    placement: "通常審査をスキップし、優先的に掲載",
    effect: "公開までの時間を短縮",
    label: "優先掲載",
    value: "expedited",
    color: "bg-secondary",
  },
  {
    name: "注目掲載",
    price: "月額",
    target: "カテゴリ内で認知を広げたいプロジェクト",
    placement: "カテゴリページ・比較ページで上位に表示",
    effect: "対象カテゴリの読者に継続的にリーチ",
    label: "注目",
    value: "featured",
    color: "bg-primary/10",
    popular: true,
  },
  {
    name: "カテゴリスポンサー",
    price: "月額",
    target: "特定カテゴリの読者に訴求したい企業",
    placement: "カテゴリページにスポンサー枠として掲載",
    effect: "関心の高い読者層に自然にリーチ",
    label: "スポンサー",
    value: "category-sponsor",
    color: "bg-primary/10",
  },
  {
    name: "トップスポンサー",
    price: "月額",
    target: "サイト全体の読者にリーチしたい企業",
    placement: "トップページのスポンサー枠に掲載",
    effect: "月間5,000+PVの読者に広くリーチ",
    label: "スポンサー",
    value: "top-sponsor",
    color: "bg-primary/10",
  },
  {
    name: "詳細ページ関連掲載",
    price: "月額",
    target: "導入支援・マネージド版・インフラ提供企業",
    placement: "ツール詳細ページの関連サービス枠に掲載",
    effect: "導入を検討中の高意図ユーザーに送客",
    label: "提携",
    value: "detail-partner",
    color: "bg-secondary",
  },
];

const GOOD_FIT = [
  { text: "OSSプロジェクト（ホスティング・マネージド版の告知）", example: "例: Supabase, GitLab, Mattermost" },
  { text: "開発者向けSaaS・クラウドサービス", example: "例: CI/CDツール, モニタリングサービス" },
  { text: "OSS導入支援・コンサルティング会社", example: "例: セルフホスト構築支援, 移行コンサル" },
  { text: "ホスティング・インフラプロバイダー", example: "例: VPS, マネージドDB, CDN" },
  { text: "開発者向けツール・サービス", example: "例: IDE, API管理, テストツール" },
];

const STEPS = [
  { step: "01", title: "お問い合わせ", desc: "下記フォームまたは掲載プランを選んでご連絡ください。" },
  { step: "02", title: "ヒアリング", desc: "掲載目的・ご予算に合わせたプランをご提案します。" },
  { step: "03", title: "クリエイティブ確認", desc: "掲載内容を確認・調整します。" },
  { step: "04", title: "掲載開始", desc: "通常2〜3営業日で掲載を開始します。" },
];

const POLICIES = [
  { icon: Shield, text: "広告・スポンサーであることを必ず明示します" },
  { icon: Search, text: "自然な検索順位やランキングとは完全に分離します" },
  { icon: Users, text: "ユーザーの比較体験を損なう掲載はお断りします" },
  { icon: Eye, text: "掲載面・ラベルは事前に確認いただけます" },
];

const FAQ = [
  { q: "最低掲載期間はありますか？", a: "月額プランは最低1ヶ月から。単発の優先掲載は1回限りです。契約の縛りはありません。" },
  { q: "掲載内容は自分で決められますか？", a: "はい。掲載テキスト、リンク先、ロゴなどはご自身でご用意いただけます。掲載前に内容を確認・調整いたします。" },
  { q: "効果測定はできますか？", a: "掲載期間中のクリック数・表示回数をレポートとして共有します（準備中）。" },
  { q: "OSSプロジェクトでも広告を出せますか？", a: "はい。マネージド版やホスティングサービスの告知、コントリビューター募集など、OSSプロジェクトの掲載も歓迎します。" },
  { q: "無料で掲載できますか？", a: "はい。OSSツールとしての通常掲載は無料です。優先掲載や注目掲載など、目立たせるオプションが有料となります。" },
];

export default function Advertise() {
  useSeo({
    title: "広告掲載・スポンサー | OSSアルタナティブ",
    description: "OSSアルタナティブは、有料SaaSの代替OSSを探すユーザーに自然にリーチできる掲載プラットフォームです。",
    canonical: "https://ossalt.jp/advertise",
  });

  const [form, setForm] = useState({ name: "", email: "", product_name: "", plan: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToForm = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            OSSを探しているユーザーに、
            <br className="hidden sm:block" />
            自然に届けませんか。
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            OSSアルタナティブは、有料SaaSの代替となるオープンソースツールを日本語で探せる比較サイトです。
            導入を検討している開発者、技術責任者、スタートアップに向けて、自然な形で認知を広げられます。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="rounded-xl px-8 text-sm font-semibold" onClick={scrollToForm}>
              掲載について相談する <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl px-8 text-sm font-semibold" asChild>
              <Link to="/submit">無料で掲載申請する</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 py-10">
        <div className="container mx-auto px-4 grid grid-cols-3 gap-6 text-center max-w-2xl">
          {[
            { icon: Eye, value: "5,000+", label: "月間ページビュー" },
            { icon: LayoutGrid, value: "680+", label: "掲載ツール数" },
            { icon: FolderOpen, value: "50+", label: "カテゴリ数" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-xl md:text-2xl font-bold text-foreground">{s.value}</span>
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">届けられる読者像</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">比較検討中の高意図ユーザーに、自然な文脈でリーチできます</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="card-unified p-5 flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <a.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans Comparison ── */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">掲載プラン</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">目的に合わせた掲載オプションをご用意しています</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANS.map((p) => (
              <div key={p.value} className={`card-unified p-5 flex flex-col relative ${p.popular ? "border-primary/40 ring-1 ring-primary/20" : ""}`}>
                {p.popular && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full">
                    おすすめ
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">{p.price}</span>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground flex-1">
                  <div className="flex items-start gap-2">
                    <Users className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    <span><span className="text-foreground font-medium">対象:</span> {p.target}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <LayoutGrid className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    <span><span className="text-foreground font-medium">掲載面:</span> {p.placement}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    <span><span className="text-foreground font-medium">効果:</span> {p.effect}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                    <span>明示ラベル:「{p.label}」</span>
                  </div>
                </div>
                <Button
                  variant={p.popular ? "default" : "outline"}
                  size="sm"
                  className="w-full mt-4 rounded-lg text-xs"
                  onClick={() => selectPlan(p.value)}
                >
                  このプランで相談する
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            すべてのプランは個別にお見積もりします。まずはお気軽にご相談ください。
          </p>
        </div>
      </section>

      {/* Placements visual */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">掲載できる場所</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: LayoutGrid, title: "トップページ", desc: "セクション間の自然なスポンサー枠。最も多くのユーザーが目にします。", label: "スポンサー" },
              { icon: FileText, title: "ツール詳細ページ", desc: "特定ツールを検討中のユーザーに、関連ソリューションとして表示。", label: "提携" },
              { icon: Search, title: "カテゴリ・検索結果", desc: "特定カテゴリを閲覧中のユーザーにリーチ。", label: "スポンサー" },
              { icon: Megaphone, title: "代替比較ページ", desc: "「Notion代替」「Slack代替」など高意図ページに掲載。", label: "注目" },
            ].map((p) => (
              <div key={p.title} className="card-unified p-5 flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <p.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">掲載ポリシー</h2>
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

      {/* Good fit */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">相性の良い掲載主</h2>
          <div className="space-y-3 max-w-lg mx-auto">
            {GOOD_FIT.map((text) => (
              <div key={text} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">掲載までの流れ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.step} className="card-unified p-5 text-center">
                <span className="text-2xl font-bold text-primary/30">{s.step}</span>
                <p className="text-sm font-semibold text-foreground mt-2 mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">
            <HelpCircle className="inline h-5 w-5 mr-2 text-primary" />
            よくある質問
          </h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="card-unified overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-foreground pr-4">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-14 md:py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">お問い合わせ</h2>

          {submitted ? (
            <InquirySuccessMessage type="advertise" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="adv-name">お名前 <span className="text-destructive">*</span></Label>
                <Input id="adv-name" required maxLength={200} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-email">メールアドレス <span className="text-destructive">*</span></Label>
                <Input id="adv-email" type="email" required maxLength={320} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-product">プロダクト / サービス名 <span className="text-destructive">*</span></Label>
                <Input id="adv-product" required maxLength={200} value={form.product_name} onChange={(e) => setForm((p) => ({ ...p, product_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>ご興味のある掲載プラン</Label>
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
                <Label htmlFor="adv-message">メッセージ（任意）</Label>
                <Textarea id="adv-message" maxLength={5000} rows={4} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
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

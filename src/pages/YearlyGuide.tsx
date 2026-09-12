/**
 * 「2026年版 [SaaS]代替 おすすめOSS」テンプレートページ
 *
 * URL: /guides/yearly/:slug
 * 対象: /guides/yearly/notion, /guides/yearly/slack, /guides/yearly/figma ...
 *
 * このページは AlternativesPage のコンテンツを流用しつつ、
 * - 年次更新記事としての Article スキーマ
 * - HowTo 移行ガイド
 * - より詳細な比較表
 * を提供する。
 */

import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight, ChevronRight, Star, CheckCircle2, AlertCircle,
  Server, Zap, Lock, BarChart3, HelpCircle, ExternalLink, CalendarDays,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { ToolCardSkeleton } from "@/components/ToolCard";
import { useSeo } from "@/hooks/use-seo";
import { formatCount } from "@/lib/format";
import { track } from "@/lib/track";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Tool } from "@/hooks/use-tools";
import { SLUG_MAP } from "@/pages/AlternativesPage";

const YEAR = new Date().getFullYear();

// ── 移行難易度ラベル ────────────────────────────────────────────────────────

function getSelfHostLabel(tool: Tool): { label: string; cls: string } {
  if (tool.docker_available)
    return { label: "Docker対応・簡単", cls: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" };
  if (tool.language === "Go" || tool.language === "Rust")
    return { label: "中程度", cls: "text-amber-600 dark:text-amber-400 bg-amber-500/10" };
  return { label: "標準", cls: "text-sky-600 dark:text-sky-400 bg-sky-500/10" };
}

// ── 汎用 FAQ（SaaS名を挿入） ───────────────────────────────────────────────

function buildFaq(competitor: string, count: number) {
  return [
    {
      q: `${competitor}の代替OSSは何件ありますか？`,
      a: `OSSアルタナティブでは現在${count}件の${competitor}代替ツールを掲載しています。すべてGitHubスター数・ライセンス・最終コミット日を確認済みです。`,
    },
    {
      q: `${competitor}からOSSへの移行は難しいですか？`,
      a: `ツールによります。Dockerに対応しているツールは比較的簡単で、VPS1台に1〜2時間程度で構築できます。データ移行（エクスポート→インポート）の手順は各ツールの公式ドキュメントをご確認ください。`,
    },
    {
      q: "セルフホストにはどのくらいのサーバースペックが必要ですか？",
      a: "多くのツールはメモリ1〜2GB・vCPU 1〜2のVPSで動作します。チーム規模や同時接続数によって変わるため、最小スペックは各ツールのREADMEで確認することを推奨します。",
    },
    {
      q: `${competitor}のデータをエクスポートできますか？`,
      a: `${competitor}は「設定 → データのエクスポート」からCSV・JSON形式でダウンロードできる場合がほとんどです。エクスポート後、代替OSSのインポート機能を使って移行します。`,
    },
    {
      q: "無料で使えるクラウド版はありますか？",
      a: "掲載ツールの多くはセルフホスト版が完全無料です。クラウド版（マネージドSaaS）を提供しているツールもあり、無料プランがある場合もあります。各ツールの詳細ページからご確認ください。",
    },
  ];
}

// ── メインコンポーネント ───────────────────────────────────────────────────

export default function YearlyGuide() {
  const { slug } = useParams<{ slug: string }>();
  const competitor = slug ? SLUG_MAP[slug] : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["yearly-guide", competitor],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, url, github_url, description_ja, description_en, parent_category_ja, primary_competitor, primary_competitor_ja, competitor_slug, stars_num, language, license, forks_num, last_commit, scorecard_score, docker_available, created_at")
        .eq("competitor_slug", slug!)
        .order("stars_num", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data as unknown as Tool[]) || [];
    },
    enabled: !!competitor,
    staleTime: 10 * 60 * 1000,
  });

  const tools = data || [];
  const count = tools.length;
  const topPicks = tools.slice(0, Math.min(5, count));
  const faq = useMemo(() => competitor ? buildFaq(competitor, count) : [], [competitor, count]);
  const totalStars = useMemo(() => tools.reduce((s, t) => s + (t.stars_num || 0), 0), [tools]);

  const canonicalUrl = `https://ossalt.jp/guides/yearly/${slug}`;
  const pageTitle = competitor
    ? `${YEAR}年版 ${competitor}代替 おすすめOSS${count > 0 ? ` ${count}選` : ""}【無料・セルフホスト可】`
    : `${YEAR}年版 OSS代替ガイド`;
  const pageDesc = competitor
    ? `${YEAR}年最新。${competitor}より安く使えるOSS代替ツール${count > 0 ? count + "件" : ""}を徹底比較。月額0円・セルフホスト可能。ライセンス・機能・移行難易度を一覧で確認できます。`
    : "";

  const jsonLd = useMemo(() => !competitor ? undefined : ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: pageTitle,
        description: pageDesc,
        url: canonicalUrl,
        datePublished: `${YEAR}-01-01`,
        dateModified: new Date().toISOString().split("T")[0],
        inLanguage: "ja",
        author: { "@type": "Organization", name: "OSSアルタナティブ", url: "https://ossalt.jp" },
        publisher: {
          "@type": "Organization",
          name: "OSSアルタナティブ",
          logo: { "@type": "ImageObject", url: "https://ossalt.jp/logo.png" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
        isPartOf: { "@id": "https://ossalt.jp/#website" },
      },
      {
        "@type": "ItemList",
        name: `${competitor}の代替OSSツール一覧`,
        numberOfItems: count,
        itemListElement: topPicks.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `https://ossalt.jp/tools/${t.id}`,
          description: t.description_ja || t.description_en || undefined,
        })),
      },
      ...(faq.length > 0 ? [{
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp" },
          { "@type": "ListItem", position: 2, name: "ガイド", item: "https://ossalt.jp/guides" },
          { "@type": "ListItem", position: 3, name: pageTitle, item: canonicalUrl },
        ],
      },
    ],
  }), [competitor, count, topPicks, faq, pageTitle, pageDesc, canonicalUrl, YEAR]);

  useSeo({ title: pageTitle, description: pageDesc, canonical: canonicalUrl, ogType: "article", jsonLd });

  if (!competitor) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">ページが見つかりませんでした</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/">トップに戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="container max-w-4xl mx-auto px-4 py-8">

        {/* ── パンくず ── */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="パンくずリスト">
          <Link to="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/alternatives/${slug}`} className="hover:text-foreground transition-colors">{competitor}の代替</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{YEAR}年版ガイド</span>
        </nav>

        {/* ── ヘッダー ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              <CalendarDays className="h-3 w-3" />
              {YEAR}年版 最新ガイド
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-foreground mb-4">
            {YEAR}年版 {competitor}代替<br className="sm:hidden" />
            おすすめOSS
            {!isLoading && count > 0 && <span className="text-primary"> {count}選</span>}
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
            {competitor}の月額コスト・ベンダーロックインに悩んでいませんか？
            {count > 0 && `本記事では${competitor}の代替として使える無料OSSを${count}件、`}
            ライセンス・GitHub Stars・セルフホスト難易度で徹底比較します。
            すべて{YEAR}年時点で活発にメンテナンスされているプロジェクトです。
          </p>

          {/* クイックスタット */}
          {!isLoading && count > 0 && (
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {count}件の代替候補
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                合計 {formatCount(totalStars)} GitHub Stars
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground">
                <Server className="h-3 w-3 text-primary" />
                すべてセルフホスト可能
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground">
                <Zap className="h-3 w-3 text-primary" />
                ライセンス費用ゼロ
              </span>
            </div>
          )}
        </header>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ToolCardSkeleton key={i} />)}
          </div>
        ) : tools.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">該当するツールが見つかりませんでした</p>
        ) : (
          <>
            {/* ── セクション1: トップおすすめ ── */}
            <section className="mb-12" aria-labelledby="top-picks-heading">
              <h2 id="top-picks-heading" className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                {competitor}代替OSS おすすめトップ{topPicks.length}（{YEAR}年）
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                GitHubスター数・活発度・セルフホスト容易性を基準に厳選しました。
              </p>

              <div className="space-y-4">
                {topPicks.map((tool, i) => {
                  const sh = getSelfHostLabel(tool);
                  return (
                    <Link
                      key={tool.id}
                      to={`/tools/${tool.id}`}
                      className="group card-unified p-5 flex gap-4 hover:border-primary/40 transition-all"
                      onClick={() => track("yearly_guide_pick", { competitor, tool: tool.name || "", rank: i + 1 })}
                    >
                      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                        <span className="text-lg font-black text-primary/40">#{i + 1}</span>
                        <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={32} id={tool.id} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <StarCount count={tool.stars_num} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                          {tool.description_ja || tool.description_en}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {tool.license && tool.license !== "NOASSERTION" && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground font-mono">
                              {tool.license}
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${sh.cls}`}>
                            {sh.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                            セルフホスト無料
                          </span>
                          {tool.language && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground">
                              {tool.language}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* ── セクション2: 詳細比較表 ── */}
            <section className="mb-12" aria-labelledby="comparison-table-heading">
              <h2 id="comparison-table-heading" className="text-xl font-bold text-foreground mb-2">
                {competitor}代替OSS 機能・ライセンス比較表（{YEAR}年版）
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                スター数・ライセンス・料金・セルフホスト難易度を一覧比較。クリックで詳細を確認できます。
              </p>

              <div className="card-unified overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">#</th>
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">ツール名</th>
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">⭐ Stars</th>
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">ライセンス</th>
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">料金（SH）</th>
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">SH難易度</th>
                      <th className="text-left p-3.5 text-xs font-semibold text-muted-foreground">言語</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.slice(0, 15).map((tool, i) => {
                      const sh = getSelfHostLabel(tool);
                      return (
                        <tr
                          key={tool.id}
                          className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3.5 text-xs text-muted-foreground/60 font-medium">{i + 1}</td>
                          <td className="p-3.5">
                            <Link
                              to={`/tools/${tool.id}`}
                              className="flex items-center gap-2 min-w-0 group"
                              onClick={() => track("yearly_guide_table", { competitor, tool: tool.name || "", rank: i + 1 })}
                            >
                              <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={18} id={tool.id} />
                              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {tool.name}
                              </span>
                            </Link>
                          </td>
                          <td className="p-3.5">
                            <StarCount count={tool.stars_num} size="sm" />
                          </td>
                          <td className="p-3.5">
                            {tool.license && tool.license !== "NOASSERTION" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground font-mono">
                                {tool.license}
                              </span>
                            ) : <span className="text-xs text-muted-foreground/40">—</span>}
                          </td>
                          <td className="p-3.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            無料
                          </td>
                          <td className="p-3.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${sh.cls}`}>
                              {sh.label}
                            </span>
                          </td>
                          <td className="p-3.5 text-xs text-muted-foreground">
                            {tool.language || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground/50">
                SH = セルフホスト。料金はセルフホスト版の場合。スター数は{YEAR}年時点のGitHub値。
              </p>
            </section>

            {/* ── セクション3: 移行メリット ── */}
            <section className="mb-12" aria-labelledby="why-switch-heading">
              <h2 id="why-switch-heading" className="text-xl font-bold text-foreground mb-5">
                {YEAR}年に{competitor}からOSSへ移行する3つの理由
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "コスト削減",
                    body: `${competitor}の月額・年額ライセンス費用をゼロに。チーム規模が増えても追加コストなし。VPS代（月1,000〜3,000円程度）のみで運用できます。`,
                  },
                  {
                    icon: Lock,
                    title: "データ主権の確保",
                    body: "自社サーバーにデータを保持することで、外部サービスへの依存を排除。GDPR・個人情報保護法への対応も自社で完全制御できます。",
                  },
                  {
                    icon: BarChart3,
                    title: "ベンダーロックイン回避",
                    body: `${competitor}が値上げ・機能削除・サービス終了しても影響ゼロ。OSSは自由にフォーク・カスタマイズ・移行できます。`,
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="card-unified p-5">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── セクション4: 移行ステップ ── */}
            <section className="mb-12" aria-labelledby="migration-heading">
              <h2 id="migration-heading" className="text-xl font-bold text-foreground mb-5">
                {competitor}からOSSへの移行ステップ
              </h2>
              <div className="card-unified p-6">
                <ol className="space-y-5">
                  {[
                    {
                      step: "1",
                      title: `${competitor}からデータをエクスポート`,
                      detail: `設定 → データエクスポートからCSV・JSONでダウンロード。${competitor}のエクスポート機能を使い、全データを手元に保存します。`,
                    },
                    {
                      step: "2",
                      title: "代替OSSをVPS / ローカルに構築",
                      detail: "上記の比較表から自分に合うツールを選び、公式のDockerイメージまたはDocumentation手順でインストール。多くはDocker Composeで5〜15分で起動できます。",
                    },
                    {
                      step: "3",
                      title: "データをインポートして動作確認",
                      detail: "エクスポートしたデータを代替OSSのインポート機能で読み込み、機能・表示を確認します。ツールごとにインポート形式が異なるため公式ドキュメントを参照してください。",
                    },
                    {
                      step: "4",
                      title: "チームへ共有・段階的移行",
                      detail: "まず自分1人で試験運用してから、チームへ展開するのが安全です。移行完了後は元サービスの解約・自動更新のキャンセルを忘れずに。",
                    },
                  ].map(({ step, title, detail }) => (
                    <li key={step} className="flex gap-4">
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-black text-primary">
                        {step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* ── セクション5: FAQ ── */}
            {faq.length > 0 && (
              <section className="mb-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  よくある質問（FAQ）
                </h2>
                <Accordion type="single" collapsible className="card-unified overflow-hidden">
                  {faq.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/40 last:border-0 px-4">
                      <AccordionTrigger className="text-sm font-medium text-foreground py-4 text-left hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* ── CTA ── */}
            <section className="card-unified p-6 text-center">
              <h2 className="text-base font-bold text-foreground mb-2">
                すべての{competitor}代替OSSを比較する
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {count}件の{competitor}代替OSSをフィルター・ソートで絞り込めます。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild>
                  <Link
                    to={`/alternatives/${slug}`}
                    onClick={() => track("yearly_guide_cta", { competitor, action: "alternatives" })}
                  >
                    {competitor}代替一覧を見る
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/" onClick={() => track("yearly_guide_cta", { competitor, action: "search" })}>
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    全OSSを検索する
                  </Link>
                </Button>
              </div>
            </section>

            {/* ── 注記 ── */}
            <aside className="mt-6 flex gap-2 text-[11px] text-muted-foreground/60 items-start">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>
                本記事は{YEAR}年時点の情報に基づいています。ライセンス・機能・価格は変更される場合があります。
                最新情報は各ツールの公式サイト・GitHubリポジトリでご確認ください。
              </p>
            </aside>
          </>
        )}
      </article>
    </SiteLayout>
  );
}

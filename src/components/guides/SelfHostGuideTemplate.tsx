import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Cpu, HardDrive, Server, TerminalSquare, ShieldAlert, Workflow } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { HttpsCaddySection } from "@/components/guides/HttpsCaddySection";

export interface SelfHostGuideConfig {
  toolName: string;
  /** SaaS代替名（例: "Slack"） */
  replaces: string;
  /** /guides/xxx-selfhost-vps の xxx 部分 */
  slug: string;
  /** タイトル末尾用ラベル（例: "Slack代替OSSを自分のサーバーで動かす"） */
  titleSuffix: string;
  metaDescription: string;
  heroDescription: string;
  publishedAt: string;
  /** 「○○とは」セクション本文の箇条書き */
  about: string[];
  /** VPSセルフホストするメリット */
  whyVps: string[];
  specs: { icon: typeof Cpu; title: string; desc: string }[];
  stack: string[];
  composeYaml: string;
  composeNote?: string;
  /** Caddy HTTPS化用 */
  https: { domain: string; upstream: string; note?: string };
  /** 運用注意点 */
  ops: string[];
  faq: { q: string; a: string }[];
  related: { name: string; desc: string; href: string }[];
  /** 関連ガイド（slugとtitle） */
  relatedGuides: { slug: string; title: string; desc: string }[];
  /** Schema.org HowTo用 */
  howToSteps: { name: string; text: string }[];
}

export function SelfHostGuideTemplate({ config }: { config: SelfHostGuideConfig }) {
  const TITLE = `${config.toolName}をVPSでセルフホストする方法｜${config.titleSuffix}`;
  const URL = `https://ossalt.jp/guides/${config.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: config.metaDescription,
        mainEntityOfPage: URL,
        author: { "@type": "Organization", name: "OSSアルタナティブ" },
        publisher: { "@type": "Organization", name: "OSSアルタナティブ" },
        datePublished: config.publishedAt,
        dateModified: config.publishedAt,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "ガイド", item: "https://ossalt.jp/guides" },
          { "@type": "ListItem", position: 3, name: `${config.toolName}をVPSでセルフホストする方法`, item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: config.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "HowTo",
        name: `${config.toolName}をVPSでセルフホストする`,
        description: `VPS上にUbuntu + Docker Composeで${config.toolName}を起動する手順の概要。`,
        step: config.howToSteps.map((s) => ({ "@type": "HowToStep", name: s.name, text: s.text })),
      },
    ],
  };

  useSeo({ title: TITLE, description: config.metaDescription, canonical: URL, ogType: "article", jsonLd });

  return (
    <SiteLayout>
      <div className="container pt-4">
        <nav className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-foreground">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/selfhost-vps" className="hover:text-foreground">セルフホスト</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{config.toolName}をVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Workflow className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {config.toolName}をVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            {config.heroDescription}
          </p>
          <div className="mt-6">
            <Button asChild size="lg" variant="outline">
              <Link to="/selfhost-vps">
                セルフホストに必要な環境を見る <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Section title={`${config.toolName}とは`}>
        <ul className="space-y-2 list-disc pl-5">
          {config.about.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          {config.whyVps.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </Section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">必要なスペック</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.specs.map((s) => (
            <div key={s.title} className="card-unified p-5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AffiliateVpsCTA
        heading="セルフホストに必要な環境を確認する"
        description={`${config.toolName}を実運用するためのVPS選びを、OSSセルフホスト向けに整理した運用環境ガイドで比較できます。`}
        ctaLabel="OSSセルフホスト向けの環境を確認する"
      />

      <Section title="基本構成">
        <p>シンプルな構成は次のようなレイヤーになります。</p>
        <ul className="space-y-1.5 list-disc pl-5">
          {config.stack.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </Section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeの最小構成例</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          動作確認用の最小構成です。本番運用では環境変数管理、認証、バックアップ、SSL設定を必ず追加してください。
        </p>
        <div className="card-unified overflow-hidden max-w-3xl">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{config.composeYaml}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            {config.composeNote ?? "このサンプルはあくまで雛形です。環境変数・認証・データベース・ボリュームのバックアップ方針は、運用前に必ず公式ドキュメントを確認して設計してください。"}
          </p>
        </div>
      </section>

      <HttpsCaddySection domain={config.https.domain} upstream={config.https.upstream} note={config.https.note} />

      <Section title="運用時の注意点">
        <ul className="space-y-2 list-disc pl-5">
          {config.ops.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </Section>

      <AffiliateVpsCTA
        heading="VPS運用ガイドで環境を確認する"
        description={`${config.toolName}を動かすVPSは、料金・スペック・サポートで選び方が変わります。OSSセルフホスト向けに整理した運用環境ガイドから探せます。`}
        ctaLabel="VPS運用ガイドを見る"
      />

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ツール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.related.map((t) => (
            <Link
              key={t.href + t.name}
              to={t.href}
              className="card-unified p-4 hover:border-primary/40 transition-colors group"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {t.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {config.relatedGuides.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="card-unified p-5 hover:border-primary/40 transition-colors group"
            >
              <p className="text-xs text-primary mb-1">セルフホストガイド</p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {g.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-12">
        <h2 className="text-2xl font-bold text-foreground mb-5">よくある質問</h2>
        <div className="space-y-3 max-w-3xl">
          {config.faq.map((f) => (
            <details key={f.q} className="card-unified p-5 group">
              <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between gap-2">
                {f.q}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container pb-12">
        <AffiliateDisclosure />
      </section>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="container pb-10">
      <div className="card-unified p-6 md:p-8 max-w-3xl">
        <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

// よく使うspec iconsの再エクスポート
export { Cpu, HardDrive, Server, TerminalSquare };

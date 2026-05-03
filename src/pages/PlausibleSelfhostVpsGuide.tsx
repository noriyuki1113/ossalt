import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  HardDrive,
  Server,
  TerminalSquare,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

const TITLE = "PlausibleをVPSでセルフホストする方法｜Google Analytics代替OSSを自分のサーバーで動かす";
const DESC =
  "Google Analytics代替のOSSアクセス解析ツールPlausibleをVPSでセルフホストする方法を初心者向けに解説。必要なスペック、Docker構成、運用時の注意点、VPS選びまで紹介します。";
const URL = "https://ossalt.jp/guides/plausible-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1〜2 vCPU。アクセス量が多いサイトでは2 vCPU以上を推奨。" },
  { icon: Server, title: "メモリ", desc: "最低2GB、推奨4GB以上。ClickHouseがメモリを使う。" },
  { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。イベント蓄積で増えやすい。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const NOTES = [
  "PostgreSQLとClickHouseが含まれるため、構成はn8nよりやや複雑になる",
  "アクセス解析データを継続的に蓄積するので、両DBの定期バックアップを設定する",
  "独自ドメインとHTTPS化（Caddy / Nginx + Let's Encrypt）はほぼ必須",
  "招待・通知機能などを使う場合はSMTPなどメール送信設定が必要",
  "アップデート前には必ずバックアップを取得してから実施する",
  "データ保持期間とストレージ容量を運用ポリシーとしてあらかじめ決めておく",
];

const RELATED = [
  { name: "Plausible", desc: "Google Analytics代替の軽量解析", href: "/tools/340" },
  { name: "Umami", desc: "シンプルでモダンなOSS解析", href: "/tools/346" },
  { name: "Matomo", desc: "高機能なフル機能アクセス解析", href: "/tools/337" },
  { name: "PostHog", desc: "プロダクト分析+セッション分析", href: "/tools/341" },
  { name: "n8n", desc: "Zapier代替の自動化。データ連携にも", href: "/tools/415" },
  { name: "Metabase", desc: "BIツール。解析データの可視化に", href: "/tools/358" },
];

const FAQ = [
  {
    q: "Plausibleは無料で使えますか？",
    a: "セルフホスト版はOSSとして利用できますが、クラウド版や商用利用条件については公式情報を確認してください。",
  },
  {
    q: "Google Analyticsの完全代替になりますか？",
    a: "用途によります。シンプルなアクセス解析やプライバシー重視の運用には向いていますが、高度な広告計測や細かな探索分析ではGoogle Analyticsの方が強い場面もあります。",
  },
  {
    q: "1GB VPSでも動きますか？",
    a: "小規模な検証なら可能な場合がありますが、PostgreSQLやClickHouseを使うため、実運用では2GB以上、できれば4GB以上を推奨します。",
  },
  {
    q: "ClickHouseとは何ですか？",
    a: "大量のアクセス解析データを高速に集計するためのデータベースです。Plausibleでは解析イベントの保存・集計に使われます。",
  },
  {
    q: "個人ブログにも向いていますか？",
    a: "はい。軽量で見やすいため、個人ブログ、OSSサイト、個人開発サービスと相性が良いです。",
  },
];

const COMPOSE = `# 構成イメージ（本番運用には環境変数・SSL・バックアップ等の追加設定が必要）
version: "3.8"

services:
  plausible:
    image: plausible/analytics:latest
    restart: always
    ports:
      - "8000:8000"
    environment:
      - BASE_URL=https://plausible.example.com
      - SECRET_KEY_BASE=\${SECRET_KEY_BASE}
      - DATABASE_URL=postgres://plausible:\${DB_PASSWORD}@db:5432/plausible
      - CLICKHOUSE_DATABASE_URL=http://ch:8123/plausible_events
    depends_on:
      - db
      - ch

  db:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=plausible
      - POSTGRES_USER=plausible
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data

  ch:
    image: clickhouse/clickhouse-server:latest
    restart: always
    volumes:
      - ch_data:/var/lib/clickhouse

volumes:
  pg_data:
  ch_data:`;

export default function PlausibleSelfhostVpsGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: DESC,
        mainEntityOfPage: URL,
        author: { "@type": "Organization", name: "OSSアルタナティブ" },
        publisher: { "@type": "Organization", name: "OSSアルタナティブ" },
        datePublished: "2026-05-03",
        dateModified: "2026-05-03",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "ガイド", item: "https://ossalt.jp/guides" },
          { "@type": "ListItem", position: 3, name: "PlausibleをVPSでセルフホストする方法", item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "HowTo",
        name: "PlausibleをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker Compose + PostgreSQL + ClickHouseでPlausibleを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "2GB以上（推奨4GB）のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: "Plausible + PostgreSQL + ClickHouseを起動", text: "Docker Composeでアプリと2つのDBを永続ボリューム付きで立ち上げる。" },
          { "@type": "HowToStep", name: "リバースプロキシとSSLを設定", text: "Caddy / Nginxで独自ドメインに紐付け、Let's EncryptでHTTPS化する。" },
          { "@type": "HowToStep", name: "バックアップ運用を整える", text: "PostgreSQLとClickHouseの定期バックアップ・復元手順を用意する。" },
        ],
      },
    ],
  };

  useSeo({ title: TITLE, description: DESC, canonical: URL, ogType: "article", jsonLd });

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="container pt-4">
        <nav className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-foreground">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <span>ガイド</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">PlausibleをVPSでセルフホストする方法</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <BarChart3 className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            PlausibleをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Google Analytics代替として使えるプライバシー重視のOSSアクセス解析ツール Plausible を、自分のVPSで動かすための基本構成を解説します。
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link to="/selfhost-vps">
                VPS比較を見る <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Section title="Plausibleとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Google Analytics代替として使えるOSSアクセス解析ツール。</li>
          <li>軽量でシンプルなダッシュボードが特徴。</li>
          <li>Cookieレスでの解析に対応し、プライバシー重視のサイト運営と相性が良い。</li>
          <li>クラウド版とセルフホスト版の両方が提供されている。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>アクセス解析データを自分の環境で管理できる。</li>
          <li>Google Analyticsへの依存を減らせる。</li>
          <li>OSSサイトや個人開発サイトのプライバシー方針と整合させやすい。</li>
          <li>複数サイトの解析基盤として一台のVPSにまとめられる。</li>
        </ul>
      </Section>

      {/* Specs */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">必要なスペック</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPECS.map((s) => (
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

      <Section title="基本構成">
        <p>シンプルな構成は次のようなレイヤーになります。</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>Plausible 本体（コンテナ）</li>
          <li>PostgreSQL（メタデータ用）</li>
          <li>ClickHouse（イベント集計用）</li>
          <li>独自ドメイン + SSL（Let's Encrypt）</li>
          <li>バックアップ（DB両方）</li>
        </ul>
      </Section>

      {/* Compose */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeでの導入イメージ</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          以下はあくまで構成イメージです。本番運用では環境変数の安全管理、PostgreSQLとClickHouseの永続化、SSL化、バックアップ運用が必須です。
        </p>
        <div className="card-unified overflow-hidden">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
      </section>

      {/* Notes */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">セルフホスト時の注意点</h2>
        <div className="max-w-3xl space-y-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              PlausibleはClickHouseを含むため、n8nより構成が複雑です。最初は小規模サイトで試し、バックアップとアップデート手順を固めてから本番に展開しましょう。
            </p>
          </div>
          <ul className="card-unified p-5 space-y-2 list-disc pl-9 text-sm text-muted-foreground leading-relaxed">
            {NOTES.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-10">
        <div className="card-unified p-6 md:p-8 max-w-3xl">
          <h2 className="text-xl font-semibold text-foreground mb-2">おすすめVPS</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Plausibleをセルフホストするなら、最低2GB、できれば4GB以上のVPSから始めるのがおすすめです。VPSごとの違いは以下で比較しています。
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link to="/selfhost-vps">
                OSSセルフホスト向けVPS比較を見る <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ossalt note */}
      <Section title="ossalt.jpとの相性">
        <p>
          ossalt.jpのようなOSSディレクトリサイトでは、どのツールページが読まれているか、どの代替キーワードから流入しているかを把握することが重要です。
          Plausibleのような軽量アクセス解析を使うと、サイト改善のヒントを得やすくなります。
        </p>
      </Section>

      {/* Related tools */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連OSSツール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RELATED.map((t) => (
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

      {/* Related guides */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {[
            { to: "/guides/n8n-selfhost-vps", title: "n8nをVPSでセルフホストする方法", desc: "Zapier代替のn8nを自分のサーバーで動かす基本構成と注意点" },
            { to: "/guides/appflowy-selfhost-vps", title: "AppFlowyをVPSでセルフホストする方法", desc: "Notion代替のAppFlowyを自分のサーバーで動かす構成と運用ポイント" },
            { to: "/guides/baserow-selfhost-vps", title: "BaserowをVPSでセルフホストする方法", desc: "Airtable代替のBaserowを自分のサーバーで動かす構成と運用ポイント" },
          ].map((g) => (
            <Link
              key={g.to}
              to={g.to}
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

      {/* FAQ */}
      <section className="container pb-12">
        <h2 className="text-2xl font-bold text-foreground mb-5">よくある質問</h2>
        <div className="space-y-3 max-w-3xl">
          {FAQ.map((f) => (
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
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="container pb-10">
      <div className="card-unified p-6 md:p-8 max-w-3xl">
        <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

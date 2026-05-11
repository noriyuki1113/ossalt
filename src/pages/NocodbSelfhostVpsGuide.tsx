import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Cpu, HardDrive, Server, TerminalSquare, ShieldAlert, Table2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "NocoDBをVPSでセルフホストする方法｜Airtable代替OSSを自分のDBで動かす";
const DESC = "Airtable代替のOSSノーコードデータベースNocoDBをVPSでセルフホストする方法を解説。既存のMySQL・PostgreSQLをスプレッドシートUIで操作できるようになります。";
const URL = "https://ossalt.jp/guides/nocodb-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1 vCPUから動作。大規模テーブルや多ユーザー利用は2 vCPU以上。" },
  { icon: Server, title: "メモリ", desc: "最低1GB。実運用は2GB以上を推奨。" },
  { icon: HardDrive, title: "ストレージ", desc: "10GB以上のSSD。接続DBのデータは別途確保。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const OPS = [
  "管理者アカウントのメールアドレスとパスワードを初回セットアップ時に強固に設定する",
  "NC_AUTH_JWT_SECRETを必ずランダムな文字列に変更する（デフォルト値は使わない）",
  "接続するDBの認証情報は .env で管理し、リポジトリには含めない",
  "NocoDBイメージは定期的に最新版へアップデートする",
  "独自ドメイン + SSL（Caddy / Nginx）でHTTPS化してから公開する",
];

const RELATED = [
  { name: "NocoDB", desc: "Airtable代替のOSSノーコードDB", href: "/tools/418" },
  { name: "Baserow", desc: "Airtable代替。UIがモダンで直感的", href: "/tools/217" },
  { name: "Teable", desc: "Airtable代替の新興OSS", href: "/tools/449" },
  { name: "n8n", desc: "Zapier代替。NocoDBと連携して自動化も", href: "/tools/415" },
  { name: "Metabase", desc: "NocoDBのデータをBIダッシュボードで可視化", href: "/tools/358" },
  { name: "Airtable の代替を比較", href: "/alternatives/airtable", desc: "ノーコードDBのOSS代替をまとめて見る" },
];

const FAQ = [
  { q: "既存のMySQLやPostgreSQLに接続できますか？", a: "はい。NocoDBの最大の特徴は既存のRDBMS（MySQL、PostgreSQL、SQLite、MariaDB等）をスプレッドシートのUIで操作できる点です。新規データも作成できます。" },
  { q: "Airtableのデータをインポートできますか？", a: "CSV経由でのインポートが可能です。Airtableからエクスポートしたファイルを読み込んで移行できます。" },
  { q: "1GB VPSでも動きますか？", a: "軽量なため1GBでも動作しますが、複数ユーザーが同時に利用する場合は2GB以上を推奨します。" },
  { q: "Baserowとどう違いますか？", a: "NocoDBは既存DBへの接続が強みです。Baserowは独自のデータストアを持ち、UI・UXが洗練されています。既存DBがある場合はNocoDB、ゼロから始める場合はBaserowが選びやすい傾向があります。" },
];

const COMPOSE = `services:
  nocodb:
    image: nocodb/nocodb:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      - NC_DB=pg://db:5432?u=\${NC_DB_USER}&p=\${NC_DB_PASS}&d=nocodb
      - NC_AUTH_JWT_SECRET=\${NC_JWT_SECRET}
      - NC_PUBLIC_URL=https://nocodb.example.com
    depends_on:
      - db
    volumes:
      - nocodb_data:/usr/app/data

  db:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=nocodb
      - POSTGRES_USER=\${NC_DB_USER}
      - POSTGRES_PASSWORD=\${NC_DB_PASS}
    volumes:
      - nocodb_pg:/var/lib/postgresql/data

volumes:
  nocodb_data:
  nocodb_pg:`;

export default function NocodbSelfhostVpsGuide() {
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
        datePublished: "2026-05-11",
        dateModified: "2026-05-11",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "ガイド", item: "https://ossalt.jp/guides" },
          { "@type": "ListItem", position: 3, name: "NocoDBをVPSでセルフホストする方法", item: URL },
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
        name: "NocoDBをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker ComposeでNocoDBを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "1GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: ".envファイルを作成", text: "DB認証情報とJWTシークレットを.envに記述する。" },
          { "@type": "HowToStep", name: "docker-compose.ymlを配置して起動", text: "docker compose up -dで起動しポート8080にアクセスする。" },
          { "@type": "HowToStep", name: "リバースプロキシとSSLを設定", text: "Caddy / Nginxで独自ドメインに紐付け、HTTPS化する。" },
        ],
      },
    ],
  };

  useSeo({ title: TITLE, description: DESC, canonical: URL, ogType: "article", jsonLd });

  return (
    <SiteLayout>
      <div className="container pt-4">
        <nav className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-foreground">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <span>ガイド</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">NocoDBをVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Table2 className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            NocoDBをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Airtable代替として人気のOSSノーコードDB NocoDB を、自分のVPSで動かすための構成と注意点を解説します。
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

      <Section title="NocoDBとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Airtable代替のOSSノーコードデータベース。</li>
          <li>既存のMySQL・PostgreSQL・SQLiteをスプレッドシートのUIで操作できるのが最大の特徴。</li>
          <li>API・Webhookも自動生成され、外部サービスとの連携が容易。</li>
          <li>GitHub 50k+ stars。MIT ライセンス。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>Airtableの月額課金なしに、自社DBをスプレッドシートUIで操作できる。</li>
          <li>既存のPostgreSQLやMySQLに接続するだけで即座に使い始められる。</li>
          <li>APIが自動生成されるため、フロントエンドやn8nとの連携がすぐできる。</li>
        </ul>
      </Section>

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

      <AffiliateVpsCTA
        heading="セルフホストに必要な環境を確認する"
        description="NocoDBは軽量なため2GB VPSでも快適に動きます。OSSセルフホスト向けに整理した運用環境ガイドで比較できます。"
        ctaLabel="OSSセルフホスト向けの環境を確認する"
      />

      <Section title="基本構成">
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>NocoDB（Dockerコンテナ）</li>
          <li>PostgreSQL（NocoDBのメタデータ保存用）</li>
          <li>リバースプロキシ（Caddy / Nginx）+ SSL</li>
        </ul>
        <p className="mt-2">既存DBに接続する場合は、NocoDBのUIから後から追加接続できます。</p>
      </Section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeの構成例</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          PostgreSQLをメタデータDBとして使う構成です。<code>NC_JWT_SECRET</code> は必ずランダムな文字列に変更してください。
        </p>
        <div className="card-unified overflow-hidden">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            <code>NC_AUTH_JWT_SECRET</code> のデフォルト値は使わないでください。必ずランダムな文字列を生成して設定してください（例：<code>openssl rand -hex 32</code>）。
          </p>
        </div>
      </section>

      <Section title="運用時の注意点">
        <ul className="space-y-2 list-disc pl-5">
          {OPS.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </Section>

      <AffiliateVpsCTA
        heading="VPS運用ガイドで環境を確認する"
        description="NocoDBは比較的軽量ですが、接続するDBと同じサーバーに置く場合はメモリに余裕を持たせると安定します。"
        ctaLabel="VPS運用ガイドを見る"
      />

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ツール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RELATED.map((t) => (
            <Link key={t.href + t.name} to={t.href} className="card-unified p-4 hover:border-primary/40 transition-colors group">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {[
            { to: "/guides/baserow-selfhost-vps", label: "BaserowをVPSでセルフホストする方法", desc: "Airtable代替のノーコードDBをセルフホスト" },
            { to: "/guides/metabase-selfhost-vps", label: "MetabaseをVPSでセルフホストする方法", desc: "BIダッシュボードでNocoDBのデータを可視化" },
            { to: "/guides/n8n-selfhost-vps", label: "n8nをVPSでセルフホストする方法", desc: "NocoDBと連携してワークフロー自動化" },
          ].map((g) => (
            <Link key={g.to} to={g.to} className="card-unified p-5 hover:border-primary/40 transition-colors group">
              <p className="text-xs text-primary mb-1">セルフホストガイド</p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{g.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
            </Link>
          ))}
        </div>
      </section>

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

      <section className="container pb-12">
        <AffiliateDisclosure />
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

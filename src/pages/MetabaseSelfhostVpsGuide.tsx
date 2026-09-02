import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Cpu, HardDrive, Server, TerminalSquare, ShieldAlert, BarChart3 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "MetabaseをVPSでセルフホストする方法｜Tableau代替OSSのBI環境を自前で構築";
const DESC = "Tableau・Looker代替のOSSダッシュボードツールMetabaseをVPSでセルフホストする方法を解説。必要なスペック、Docker Compose構成、運用時の注意点まで紹介します。";
const URL = "https://ossalt.jp/guides/metabase-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "2 vCPU以上推奨。クエリが増えるほどCPUを使う。" },
  { icon: Server, title: "メモリ", desc: "最低2GB、実運用は4GB以上を推奨。" },
  { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。分析データが増える場合は余裕を持たせる。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const OPS = [
  "管理者アカウントのパスワードを強固に設定し、外部公開前に必ず変更する",
  "PostgreSQL等の外部DBに接続する場合、認証情報を .env で管理する",
  "MetabaseのDockerイメージは定期的に最新版へアップデートする",
  "接続先DBの認証情報・APIキーはSecretsとして管理し、UIに直接入力しない",
  "独自ドメイン + SSL（Caddy / Nginx + Let's Encrypt）でHTTPS化する",
];

const RELATED = [
  { name: "Metabase", desc: "Tableau代替のOSSビジネスインテリジェンス", href: "/tools/358" },
  { name: "Grafana", desc: "時系列データ・インフラ監視ダッシュボード", href: "/tools/334" },
  { name: "Redash", desc: "SQLベースのOSSダッシュボード", href: "/?search=redash" },
  { name: "Baserow", desc: "Airtable代替のノーコードDB", href: "/tools/217" },
  { name: "n8n", desc: "Zapier代替。Metabaseと連携してレポート自動送信も", href: "/tools/415" },
  { name: "Tableau の代替を比較", desc: "BIツールのOSS代替をまとめて見る", href: "/alternatives/tableau" },
];

const FAQ = [
  { q: "Metabaseは無料で使えますか？", a: "OSSのコミュニティ版は無料でセルフホストできます。有料のEnterprise版もありますが、個人・小規模チームにはコミュニティ版で十分な機能があります。" },
  { q: "どんなデータベースに接続できますか？", a: "PostgreSQL、MySQL、BigQuery、Snowflake、Redshift、MongoDB など多数に対応しています。接続先のリストは公式ドキュメントを確認してください。" },
  { q: "2GB VPSでも動きますか？", a: "小規模な用途なら動きますが、複数ユーザーが同時にクエリを実行する場合は4GB以上を推奨します。" },
  { q: "データはMetabaseのサーバーに保存されますか？", a: "分析するデータは接続先DBに保存されます。Metabase自体が保存するのはダッシュボード設定・ユーザー情報・実行履歴などです。" },
];

const COMPOSE = `services:
  metabase:
    image: metabase/metabase:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - MB_DB_TYPE=postgres
      - MB_DB_DBNAME=metabase
      - MB_DB_PORT=5432
      - MB_DB_USER=\${MB_DB_USER}
      - MB_DB_PASS=\${MB_DB_PASS}
      - MB_DB_HOST=db
      - JAVA_TIMEZONE=Asia/Tokyo
    depends_on:
      - db

  db:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=metabase
      - POSTGRES_USER=\${MB_DB_USER}
      - POSTGRES_PASSWORD=\${MB_DB_PASS}
    volumes:
      - metabase_db:/var/lib/postgresql/data

volumes:
  metabase_db:`;

export default function MetabaseSelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "MetabaseをVPSでセルフホストする方法", item: URL },
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
        name: "MetabaseをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker ComposeでMetabaseとPostgreSQLを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "2GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: ".envファイルを作成", text: "DB認証情報を.envに記述し、リポジトリには含めない。" },
          { "@type": "HowToStep", name: "docker-compose.ymlを配置して起動", text: "本記事の構成例を参考にdocker compose up -dで起動する。" },
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
          <span className="text-foreground">MetabaseをVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <BarChart3 className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            MetabaseをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Tableau・Looker代替として人気のOSS BIツール Metabase を、自分のVPSで動かすための構成と運用ポイントを解説します。
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

      <Section title="Metabaseとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Tableau・Looker代替のOSSビジネスインテリジェンスツール。</li>
          <li>SQLを書かずにグラフ・ダッシュボードを作成でき、非エンジニアでも使いやすい。</li>
          <li>PostgreSQL、MySQL、BigQuery等の主要DBに接続して可視化できる。</li>
          <li>コミュニティ版は無料。企業向けのEnterprise版は有料機能がある。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>クラウド版Metabaseは有料だが、セルフホストならコミュニティ版を無料で利用できる。</li>
          <li>分析するデータを外部サービスに送らず、自社インフラ内で完結できる。</li>
          <li>接続するDBと同じVPSや同一ネットワークに置けば、クエリのレイテンシを低く保てる。</li>
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
        description="Metabaseは4GB以上のメモリがあると快適に動作します。OSSセルフホスト向けに整理した運用環境ガイドで比較できます。"
        ctaLabel="OSSセルフホスト向けの環境を確認する"
      />

      <Section title="基本構成">
        <p>MetabaseはJavaアプリです。内部設定はPostgreSQLで管理するのが本番推奨です。</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>Metabase（Dockerコンテナ）</li>
          <li>PostgreSQL（Metabase設定の保存用）</li>
          <li>リバースプロキシ（Caddy / Nginx）+ SSL</li>
        </ul>
      </Section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeの構成例</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          PostgreSQLをMetabaseの設定DBとして使う構成です。環境変数は <code>.env</code> ファイルで管理してください。
        </p>
        <div className="card-unified overflow-hidden">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            このサンプルはあくまで雛形です。DB認証情報を <code>.env</code> に記述し、
            リポジトリには絶対に含めないでください。本番前に公式ドキュメントで最新の推奨設定を確認してください。
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
        description="MetabaseはCPU・メモリを比較的多く使うツールです。OSSセルフホスト向けに整理した運用環境ガイドから環境を選べます。"
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
            { to: "/guides/n8n-selfhost-vps", label: "n8nをVPSでセルフホストする方法", desc: "Zapier代替のワークフロー自動化をセルフホスト" },
            { to: "/guides/baserow-selfhost-vps", label: "BaserowをVPSでセルフホストする方法", desc: "Airtable代替のノーコードDBをセルフホスト" },
            { to: "/guides/umami-selfhost-vps", label: "UmamiをVPSでセルフホストする方法", desc: "Google Analytics代替の軽量解析をセルフホスト" },
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

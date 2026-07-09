import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Cpu, HardDrive, Server, TerminalSquare, ShieldAlert, LineChart } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "UmamiをVPSでセルフホストする方法｜Google Analytics代替OSSをプライバシー重視で運用";
const DESC = "Google Analytics代替のOSSアクセス解析ツールUmamiをVPSでセルフホストする方法を解説。Cookieなし・軽量・GDPR対応で、訪問データを自分のサーバーで完全管理できます。";
const URL = "https://ossalt.jp/guides/umami-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1 vCPUで十分。トラフィックが多い場合は2 vCPU。" },
  { icon: Server, title: "メモリ", desc: "最低512MB。実運用は1GB以上を推奨。" },
  { icon: HardDrive, title: "ストレージ", desc: "10GB以上のSSD。アクセスデータが蓄積するので余裕を持たせる。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const OPS = [
  "初回ログイン後すぐにデフォルトパスワード（admin/umami）を変更する",
  "APP_SECRETを必ずランダムな文字列に変更する（デフォルト値は使わない）",
  "PostgreSQLのバックアップを定期的に取得する",
  "Umamiイメージ・PostgreSQLは定期的に最新版へアップデートする",
  "独自ドメイン + SSL（Caddy / Nginx）でHTTPS化してからトラッキングスクリプトを埋め込む",
];

const RELATED = [
  { name: "Umami", desc: "Google Analytics代替の軽量OSSアクセス解析", href: "/tools/346" },
  { name: "Plausible Analytics", desc: "Google Analytics代替。よりシンプルなUI", href: "/tools/340" },
  { name: "Matomo", desc: "高機能なGA代替OSS。GDPR対応", href: "/tools/337" },
  { name: "n8n", desc: "Zapier代替。Umamiのデータを使った自動化も", href: "/tools/415" },
  { name: "Metabase", desc: "アクセスデータをBIダッシュボードで可視化", href: "/tools/358" },
  { name: "Google Analytics の代替を比較", href: "/alternatives/google-analytics", desc: "アクセス解析のOSS代替をまとめて見る" },
];

const FAQ = [
  { q: "Umamiは本当にCookieを使わないのですか？", a: "はい。UmamiはCookieを使わずにユニーク訪問者を識別します。そのためCookiebanner（クッキー同意バナー）が不要で、GDPRにも対応しやすいです。" },
  { q: "Google Analyticsからデータを移行できますか？", a: "直接のデータ移行機能はありません。Umamiを導入した時点からデータを蓄積していく形になります。" },
  { q: "複数サイトを一つのUmamiで管理できますか？", a: "はい。一つのUmamiインスタンスで複数のサイト・ドメインを管理できます。サイトごとにトラッキングスクリプトが発行されます。" },
  { q: "512MB VPSでも動きますか？", a: "軽量なため512MBでも動作しますが、PostgreSQLと同居させる場合は1GB以上を推奨します。" },
];

const COMPOSE = `services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://\${UMAMI_DB_USER}:\${UMAMI_DB_PASS}@db:5432/umami
      - APP_SECRET=\${UMAMI_APP_SECRET}
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=umami
      - POSTGRES_USER=\${UMAMI_DB_USER}
      - POSTGRES_PASSWORD=\${UMAMI_DB_PASS}
    volumes:
      - umami_db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $UMAMI_DB_USER -d umami"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  umami_db:`;

export default function UmamiSelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "UmamiをVPSでセルフホストする方法", item: URL },
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
        name: "UmamiをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker ComposeでUmamiを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "1GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: ".envファイルを作成", text: "DB認証情報とAPP_SECRETを.envに記述する。" },
          { "@type": "HowToStep", name: "docker-compose.ymlを配置して起動", text: "docker compose up -dで起動しポート3000にアクセスする。" },
          { "@type": "HowToStep", name: "デフォルトパスワードを変更", text: "admin/umamiでログインし、すぐにパスワードを変更する。" },
          { "@type": "HowToStep", name: "トラッキングスクリプトを埋め込む", text: "UmamiのUIからサイトを登録し、発行されたスクリプトタグをサイトに設置する。" },
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
          <span className="text-foreground">UmamiをVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <LineChart className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            UmamiをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Google Analytics代替として人気のOSSアクセス解析ツール Umami を、プライバシー重視で自分のVPSで運用するための構成を解説します。
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

      <Section title="Umamiとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Google Analytics代替のOSSアクセス解析ツール。</li>
          <li>Cookieを使わないため、GDPR対応が容易でCookiebanner不要。</li>
          <li>軽量なトラッキングスクリプト（約2KB）でページ表示速度への影響が少ない。</li>
          <li>シンプルなUIで非エンジニアでも使いやすい。GitHub 22k+ stars。MIT ライセンス。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>訪問データが自分のサーバーだけに保存され、Googleに送信されない。</li>
          <li>広告ブロッカーに検出されにくく、計測漏れが少ない。</li>
          <li>クラウド版は月額課金だが、セルフホストなら無料で複数サイトを管理できる。</li>
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
        description="Umamiは最も軽量なセルフホストOSSの一つです。1GB VPSから快適に動作します。"
        ctaLabel="OSSセルフホスト向けの環境を確認する"
      />

      <Section title="基本構成">
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>Umami（Dockerコンテナ）</li>
          <li>PostgreSQL（アクセスデータの保存用）</li>
          <li>リバースプロキシ（Caddy / Nginx）+ SSL</li>
        </ul>
      </Section>

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeの構成例</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          PostgreSQLをデータストアとして使う構成です。<code>APP_SECRET</code> は必ずランダムな文字列に変更してください。
        </p>
        <div className="card-unified overflow-hidden">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            初回ログインのデフォルト認証情報は <strong>admin / umami</strong> です。
            ログイン後すぐにパスワードを変更してください。<code>APP_SECRET</code> も必ず変更が必要です（例：<code>openssl rand -hex 32</code>）。
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
        description="Umamiは軽量で小さなVPSでも動きますが、高トラフィックサイトの計測には余裕のあるスペックを選ぶと安心です。"
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
            { to: "/guides/plausible-selfhost-vps", label: "PlausibleをVPSでセルフホストする方法", desc: "Google Analytics代替のもう一つの有力OSS" },
            { to: "/guides/metabase-selfhost-vps", label: "MetabaseをVPSでセルフホストする方法", desc: "Umamiのデータをより深く分析するBI環境を構築" },
            { to: "/guides/n8n-selfhost-vps", label: "n8nをVPSでセルフホストする方法", desc: "アクセスデータを使った自動通知・レポートを自動化" },
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

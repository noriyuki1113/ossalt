import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  HardDrive,
  Server,
  TerminalSquare,
  ShieldAlert,
  Database,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "BaserowをVPSでセルフホストする方法｜Airtable代替OSSを自分のサーバーで動かす";
const DESC =
  "Airtable代替のOSSデータベースツールBaserowをVPSでセルフホストする方法を初心者向けに解説。必要なスペック、Docker構成、運用時の注意点、VPS選びまで紹介します。";
const URL = "https://ossalt.jp/guides/baserow-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1〜2 vCPU。テーブル・ユーザー数が増えるなら2 vCPU以上。" },
  { icon: Server, title: "メモリ", desc: "最低2GB、推奨4GB以上。1GBでは安定運用が難しい。" },
  { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。データ・添付ファイル増を見込む。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const NOTES = [
  "業務データを扱うため、PostgreSQLとアセットの定期バックアップを必ず設定する",
  "ユーザー・行数・添付ファイルが増えるとメモリ消費が伸びやすい",
  "DockerボリュームでPostgreSQLを永続化し、誤って消さない構成にする",
  "WebアクセスはCaddy / Nginxでリバースプロキシ + HTTPS化する",
  "管理者アカウント・ワークスペース権限・APIトークンの管理を整理する",
  "アップデート前には必ずバックアップを取得してから実施する",
];

const RELATED = [
  { name: "Baserow", desc: "Airtable代替のノーコードDB", href: "/tools/217" },
  { name: "NocoDB", desc: "既存DBにも繋げるAirtable代替", href: "/tools/418" },
  { name: "Grist", desc: "数式に強い表計算型DB", href: "/tools/356" },
  { name: "n8n", desc: "Zapier代替の自動化。Baserowと連携も", href: "/tools/415" },
  { name: "AppFlowy", desc: "Notion代替のワークスペース", href: "/tools/185" },
  { name: "Metabase", desc: "BIツール。Baserowのデータ可視化に", href: "/tools/358" },
];

const FAQ = [
  {
    q: "Baserowは無料で使えますか？",
    a: "セルフホスト版はOSSとして利用できますが、商用利用や有料機能については公式情報を確認してください。",
  },
  {
    q: "BaserowはAirtableの完全代替になりますか？",
    a: "用途によります。表形式のデータ管理には向いていますが、Airtable特有の外部連携やテンプレートまで完全に同じではありません。",
  },
  {
    q: "1GB VPSでも動きますか？",
    a: "小規模な検証なら可能な場合がありますが、実運用では2GB以上、できれば4GB以上を推奨します。",
  },
  {
    q: "PostgreSQLの知識は必要ですか？",
    a: "最初は深い知識がなくても始められますが、バックアップや復元の基本は理解しておくと安心です。",
  },
  {
    q: "業務利用できますか？",
    a: "可能ですが、バックアップ、権限管理、セキュリティ、アップデート運用を整えることが重要です。",
  },
];

const COMPOSE = `# 構成イメージ（本番運用には環境変数・SSL・バックアップ等の追加設定が必要）
version: "3.8"

services:
  baserow:
    image: baserow/baserow:latest
    restart: always
    ports:
      - "80:80"
    environment:
      - BASEROW_PUBLIC_URL=https://baserow.example.com
      - DATABASE_HOST=db
      - DATABASE_NAME=baserow
      - DATABASE_USER=baserow
      - DATABASE_PASSWORD=\${DB_PASSWORD}
    volumes:
      - baserow_data:/baserow/data
    depends_on:
      - db

  db:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=baserow
      - POSTGRES_USER=baserow
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  baserow_data:
  pg_data:`;

export default function BaserowSelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "BaserowをVPSでセルフホストする方法", item: URL },
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
        name: "BaserowをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker Compose + PostgreSQLでBaserowを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "2GB以上（推奨4GB）のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: "Baserow + PostgreSQLを起動", text: "Docker Composeでアプリ本体とDBを永続ボリューム付きで立ち上げる。" },
          { "@type": "HowToStep", name: "リバースプロキシとSSLを設定", text: "Caddy / Nginxで独自ドメインに紐付け、Let's EncryptでHTTPS化する。" },
          { "@type": "HowToStep", name: "バックアップ運用を整える", text: "PostgreSQLダンプとアセットの定期バックアップ・復元手順を用意する。" },
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
          <span className="text-foreground">BaserowをVPSでセルフホストする方法</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Database className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            BaserowをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Airtable代替として使えるOSSデータベースツール Baserow を、自分のVPSで動かすための基本構成を解説します。
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

      {/* CTA #1: after intro */}
      <AffiliateVpsCTA
        heading="Baserowを動かすVPSを比較する"
        description="Airtable代替のBaserowは業務データを扱うので、信頼できるVPSを選ぶことが大切です。OSSセルフホスト向けVPS比較もあわせてご覧ください。"
      />

      <Section title="Baserowとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Airtable代替として使えるOSSのデータベースツール。</li>
          <li>表形式でデータを管理でき、ノーコードで業務データベースが作れる。</li>
          <li>API経由で他のアプリと連携でき、自動化ツールとも相性が良い。</li>
          <li>クラウド版に加え、セルフホスト運用も選択できる。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>Airtableへの依存を減らし、データを自分の環境で管理できる。</li>
          <li>業務データを社内ネットワーク寄りの構成で運用しやすい。</li>
          <li>チーム共通のデータベースとして長期運用できる。</li>
          <li>n8n / Metabase など他のOSSと組み合わせやすい。</li>
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

      {/* CTA #2: after specs */}
      <AffiliateVpsCTA
        heading="Baserowは2GB以上のVPSが目安"
        description="PostgreSQLと同居させるBaserowは、最低2GB、利用ユーザーが増えるなら4GB以上のVPSが安心です。料金やサポートはVPS比較ページで比較できます。"
      />

      <Section title="基本構成">
        <p>シンプルな構成は次のようなレイヤーになります。</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>Baserow 本体（コンテナ）</li>
          <li>PostgreSQL（永続ボリューム）</li>
          <li>独自ドメイン + SSL（Let's Encrypt）</li>
          <li>バックアップ（DBダンプ + アセット保存先）</li>
        </ul>
      </Section>

      {/* Compose */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeでの導入イメージ</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          以下はあくまで構成イメージです。本番運用では環境変数の安全管理、永続化ボリュームの保護、SSL化、バックアップ運用が必須です。
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
              業務データを扱う前提のツールです。バックアップ、永続化、HTTPS化、権限管理を最初に整えてから本格運用に入りましょう。
            </p>
          </div>
          <ul className="card-unified p-5 space-y-2 list-disc pl-9 text-sm text-muted-foreground leading-relaxed">
            {NOTES.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA #3: end-of-article */}
      <AffiliateVpsCTA
        heading="まだVPSを決めていませんか？"
        description="Baserowをセルフホストするなら、料金・サポート・拡張性で選び方が変わります。OSSセルフホスト向けに比較した一覧から探せます。"
      />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <Link
            to="/guides/n8n-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              n8nをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Zapier代替のn8nを自分のサーバーで動かす基本構成と注意点
            </p>
          </Link>
          <Link
            to="/guides/appflowy-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              AppFlowyをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notion代替のAppFlowyを自分のサーバーで動かす構成と運用ポイント
            </p>
          </Link>
          <Link
            to="/guides/plausible-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              PlausibleをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Google Analytics代替のPlausibleを自分のサーバーで動かす構成と注意点
            </p>
          </Link>
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

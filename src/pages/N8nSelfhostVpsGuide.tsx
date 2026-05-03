import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  HardDrive,
  Server,
  TerminalSquare,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

const TITLE = "n8nをVPSでセルフホストする方法｜Zapier代替OSSを自分のサーバーで動かす";
const DESC =
  "Zapier代替のOSS自動化ツールn8nをVPSでセルフホストする方法を初心者向けに解説。必要なサーバースペック、Docker Compose、運用時の注意点まで紹介します。";
const URL = "https://ossalt.jp/guides/n8n-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1〜2 vCPUから。複数フローを並行で動かすなら2 vCPU以上。" },
  { icon: Server, title: "メモリ", desc: "最低1GB、実運用は2GB以上を推奨。" },
  { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。ログ・実行履歴の蓄積を見込む。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const OPS = [
  "管理画面の認証（Basic AuthやUser Management）を必ず有効化する",
  "実行履歴・credentials・PostgreSQLボリュームを定期バックアップする",
  "n8n本体・Dockerイメージ・ホストOSを定期的にアップデートする",
  "WebhookエンドポイントはHTTPS化（Caddy / Nginx + Let's Encrypt）",
  "API キーやDB認証情報は .env で管理し、リポジトリに含めない",
];

const RELATED = [
  { name: "n8n", desc: "Zapier代替のワークフロー自動化", href: "/tools/415" },
  { name: "ActivePieces", desc: "OSSのワークフロー自動化、UIがモダン", href: "/tools/395" },
  { name: "AppFlowy", desc: "Notion代替。n8nと連携してデータ収集も", href: "/tools/185" },
  { name: "Baserow", desc: "Airtable代替DB。n8nのデータ保存先に", href: "/tools/217" },
  { name: "Huginn / Node-RED を探す", desc: "他のOSS自動化ツールを検索", href: "/?search=automation" },
  { name: "Zapier の代替を比較", desc: "Zapier代替OSSをまとめて見る", href: "/alternatives/zapier" },
];

const FAQ = [
  {
    q: "n8nは無料で使えますか？",
    a: "セルフホスト版はOSSとして利用できますが、ライセンスや商用利用条件は公式情報を必ず確認してください。",
  },
  {
    q: "1GB VPSでも動きますか？",
    a: "小規模な検証なら動く場合がありますが、実運用では2GB以上を推奨します。",
  },
  {
    q: "Dockerなしでも使えますか？",
    a: "可能ですが、初心者にはDocker Composeでの導入のほうがアップデートやバックアップが扱いやすいです。",
  },
  {
    q: "Zapierから完全に置き換えできますか？",
    a: "使い方によります。対応サービス、認証方式、運用負荷を確認したうえで判断するのがおすすめです。",
  },
];

const COMPOSE = `version: "3.8"

services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.example.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.example.com/
      - GENERIC_TIMEZONE=Asia/Tokyo
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=\${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=\${N8N_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:`;

export default function N8nSelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "n8nをVPSでセルフホストする方法", item: URL },
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
        name: "n8nをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker Composeでn8nを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "2GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: "docker-compose.ymlを配置", text: "本記事の最小構成例をベースに環境変数を設定する。" },
          { "@type": "HowToStep", name: "リバースプロキシとSSLを設定", text: "Caddy / Nginxで独自ドメインに紐付け、Let's EncryptでHTTPS化する。" },
          { "@type": "HowToStep", name: "起動と動作確認", text: "docker compose up -dで起動し、Webhookとログイン認証を確認する。" },
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
          <span className="text-foreground">n8nをVPSでセルフホストする方法</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Workflow className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            n8nをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Zapier代替として人気のOSS自動化ツール n8n を、自分のVPSで動かすための基本構成を解説します。
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

      {/* What is n8n */}
      <Section title="n8nとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Zapier / Make 代替の OSS ワークフロー自動化ツール。</li>
          <li>API連携、Webhook、スケジュール実行、条件分岐などをノードで組み立てられる。</li>
          <li>マネージドのクラウド版もあるが、セルフホストでデータを自分の管理下に置ける。</li>
        </ul>
      </Section>

      {/* Why VPS */}
      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>SaaSのタスク数課金から解放され、月額コストを抑えやすい。</li>
          <li>機密データを外部に出さず、自分のサーバーで処理できる。</li>
          <li>常時稼働で複数の自動化処理を同時に走らせやすい。</li>
          <li>同じVPSにAppFlowyやBaserowなど他のOSSを同居させて連携できる。</li>
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

      {/* Architecture */}
      <Section title="基本構成">
        <p>シンプルな構成は次のようなレイヤーになります。</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>n8n（Dockerコンテナ）</li>
          <li>リバースプロキシ（Caddy / Nginx）</li>
          <li>独自ドメイン + SSL（Let's Encrypt）</li>
        </ul>
      </Section>

      {/* Compose */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeの最小構成例</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          動作確認用の最小構成です。本番運用では環境変数管理、認証、バックアップ、SSL設定を必ず追加してください。
        </p>
        <div className="card-unified overflow-hidden">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            このサンプルはあくまで雛形です。Webhook URL、Basic Auth、データベース、ボリュームのバックアップ方針は、
            運用前に必ず公式ドキュメントを確認して設計してください。
          </p>
        </div>
      </section>

      {/* Operations */}
      <Section title="運用時の注意点">
        <ul className="space-y-2 list-disc pl-5">
          {OPS.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Section>

      {/* CTA to VPS comparison */}
      <section className="container pb-10">
        <div className="card-unified p-6 md:p-8 max-w-3xl">
          <h2 className="text-xl font-semibold text-foreground mb-2">おすすめVPS</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            n8nを常時稼働させるなら、2GB以上のVPSから始めるのがおすすめです。VPSごとの違いは以下で比較しています。
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

      {/* Related */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ツール</h2>
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

      {/* Related guide */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
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
            to="/guides/baserow-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              BaserowをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Airtable代替のBaserowを自分のサーバーで動かす構成と運用ポイント
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

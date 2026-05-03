import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  HardDrive,
  Server,
  TerminalSquare,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "AppFlowyをVPSでセルフホストする方法｜Notion代替OSSを自分のサーバーで動かす";
const DESC =
  "Notion代替のOSSツールAppFlowyをVPSでセルフホストする方法を初心者向けに解説。必要なスペック、Docker構成、運用時の注意点、VPS選びまで紹介します。";
const URL = "https://ossalt.jp/guides/appflowy-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "2 vCPU以上を推奨。複数ユーザーで使うならさらに余裕を。" },
  { icon: Server, title: "メモリ", desc: "最低2GB、できれば4GB以上。1GBでは厳しい場面が多い。" },
  { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。添付ファイルや履歴で増えやすい。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
];

const NOTES = [
  "AppFlowyはn8nより構成が重めになりやすく、1GB VPSでは安定運用が難しい",
  "本番運用では最低2GB、推奨4GB以上のVPSを選ぶ",
  "DBとアセットを定期バックアップする運用フローを必ず作る",
  "AppFlowy本体・Dockerイメージ・ホストOSを定期的にアップデートする",
  "チーム利用するなら認証・権限・共有範囲を事前に確認する",
];

const RELATED = [
  { name: "AppFlowy", desc: "Notion代替のオールインワンワークスペース", href: "/tools/185" },
  { name: "n8n", desc: "Zapier代替のワークフロー自動化", href: "/tools/415" },
  { name: "Baserow", desc: "Airtable代替のノーコードDB", href: "/tools/217" },
  { name: "Outline", desc: "チーム向けナレッジベース", href: "/tools/303" },
  { name: "AnyType", desc: "ローカルファースト型のNotion代替", href: "/tools/595" },
  { name: "Logseq", desc: "アウトライナー型ナレッジツール", href: "/tools/603" },
];

const FAQ = [
  {
    q: "AppFlowyは無料で使えますか？",
    a: "OSSとして利用できますが、クラウド版や商用利用条件などは公式情報を確認してください。",
  },
  {
    q: "AppFlowyはNotionの完全代替になりますか？",
    a: "用途によります。ドキュメント管理やタスク管理には向いていますが、Notion特有のテンプレートや外部連携まで完全に同じではありません。",
  },
  {
    q: "1GB VPSでも動きますか？",
    a: "検証なら可能な場合がありますが、実運用では2GB以上、できれば4GB以上を推奨します。",
  },
  {
    q: "Dockerは必要ですか？",
    a: "必須ではありませんが、セルフホストではDocker Composeを使う構成が管理しやすいです。",
  },
  {
    q: "初心者でも運用できますか？",
    a: "可能ですが、n8nよりはやや難易度が高いです。まずはVPS、Docker、バックアップの基本を押さえるのがおすすめです。",
  },
];

export default function AppFlowySelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "AppFlowyをVPSでセルフホストする方法", item: URL },
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
        name: "AppFlowyをVPSでセルフホストする",
        description: "VPS上にUbuntu + Docker ComposeでAppFlowyを起動する手順の概要。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "2GB以上（推奨4GB）のメモリ、Ubuntu LTSのVPSを契約する。" },
          { "@type": "HowToStep", name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
          { "@type": "HowToStep", name: "AppFlowy + DBを起動", text: "公式リポジトリのDocker Compose構成を参考に、本体とDBを立ち上げる。" },
          { "@type": "HowToStep", name: "リバースプロキシとSSLを設定", text: "Caddy / Nginxで独自ドメインに紐付け、Let's EncryptでHTTPS化する。" },
          { "@type": "HowToStep", name: "バックアップと監視を設定", text: "DBダンプとアセット保存先の定期バックアップ、稼働監視を整える。" },
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
          <span className="text-foreground">AppFlowyをVPSでセルフホストする方法</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <BookOpen className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            AppFlowyをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Notion代替として人気のOSSツール AppFlowy を、自分のVPSで動かすための基本構成を解説します。
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
        heading="AppFlowyを動かすVPSを比較する"
        description="Notion代替のAppFlowyを安定して使うには、ある程度のメモリと拡張性が必要です。OSSセルフホスト向けにまとめたVPS比較もあわせてご覧ください。"
      />

        <ul className="space-y-2 list-disc pl-5">
          <li>Notion代替として使えるOSSのオールインワンワークスペース。</li>
          <li>ドキュメント、タスク管理、データベース、ナレッジ管理などをひとつにまとめられる。</li>
          <li>クラウド版もあるが、セルフホストでデータを自分の管理下に置く選択肢がある。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>機密情報を含むドキュメントを自分のサーバー内で管理できる。</li>
          <li>SaaSのユーザー数課金を避け、OSSとして長期運用しやすい。</li>
          <li>チーム共有のナレッジベースとして社内に閉じた構成を作れる。</li>
          <li>Notionへのロックインを減らし、データ移行の自由度が上がる。</li>
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
        heading="AppFlowyは2GB以上のVPSが目安"
        description="軽量なn8nと比べてAppFlowyは重めです。最低2GB、できれば4GB以上のVPSが安心です。各VPSのスペックや料金はVPS比較ページで整理しています。"
      />

        <p>シンプルな構成は次のようなレイヤーになります。</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>VPS（Ubuntu LTS）</li>
          <li>Docker / Docker Compose</li>
          <li>AppFlowy 本体（コンテナ）</li>
          <li>データベース（PostgreSQL など）</li>
          <li>独自ドメイン + SSL（Let's Encrypt）</li>
          <li>バックアップ（DBダンプ + アセット保存先）</li>
        </ul>
      </Section>

      {/* Notes */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">セルフホスト時の注意点</h2>
        <div className="max-w-3xl space-y-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              AppFlowyはn8nより重めです。最初から2GB以上、ユーザーが増える想定なら4GB以上のVPSを選ぶと安定します。
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
        description="AppFlowyのセルフホスト先は、メモリ、サポート、料金で選び方が変わります。OSSセルフホスト向けに比較した一覧から探せます。"
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

      {/* Related guide */}
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

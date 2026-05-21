import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  HardDrive,
  Server,
  TerminalSquare,
  ShieldAlert,
  Box,
  GitBranch,
  Globe,
  Layers,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "CoolifyをVPSでセルフホストする方法｜Heroku/Vercel代替OSSを1コマンドで構築";
const DESC =
  "Heroku・Vercel・Renderの代替OSSであるCoolifyをVPSでセルフホストする方法を解説。n8n・AppFlowy・Baserow・GitLabなど200以上のOSSを自分のサーバーからWebUIで1クリックデプロイできます。";
const URL = "https://ossalt.jp/guides/coolify-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "2 vCPU以上。複数OSS同居なら4 vCPU推奨。" },
  { icon: Server, title: "メモリ", desc: "最低 2GB。n8n/AppFlowy等を追加するなら 4〜8GB。" },
  { icon: HardDrive, title: "ストレージ", desc: "40GB以上のSSD。Dockerイメージが積み重なるので余裕を持って。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu 22.04 LTS 推奨。Dockerは自動インストールされる。" },
];

const STEPS = [
  {
    step: "1",
    title: "VPSを用意する",
    desc: "Ubuntu 22.04 LTS・2GB RAM・2vCPU以上のVPSを契約する。IPv4アドレスを確認しておく。",
  },
  {
    step: "2",
    title: "インストールスクリプトを実行",
    desc: "rootまたはsudoユーザーでSSHしてワンコマンドを実行。Docker・Traefik・PostgreSQLが自動セットアップされる。",
    code: "curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash",
  },
  {
    step: "3",
    title: "管理画面にアクセス",
    desc: "ブラウザで http://<VPSのIP>:8000 にアクセス。初回は管理者アカウントを作成する。",
  },
  {
    step: "4",
    title: "サーバーを登録する",
    desc: "「Servers → Add Server」から自分のVPSを登録（localhost = インストール先のVPS）。Coolifyが自動で接続テストを行う。",
  },
  {
    step: "5",
    title: "ドメイン + SSL を設定",
    desc: "「Settings → Instance Settings」でドメインを設定する。Traefik + Let's EncryptによりSSL証明書が自動取得・更新される。",
  },
  {
    step: "6",
    title: "カタログからOSSをデプロイ",
    desc: "「Resources → New」→「Marketplace」から n8n・AppFlowy・Nextcloud・GitLabなど200以上のOSSを選ぶと設定項目が自動入力される。",
  },
];

const OSS_EXAMPLES = [
  { name: "n8n", desc: "Zapier代替のワークフロー自動化", href: "/guides/n8n-selfhost-vps" },
  { name: "AppFlowy", desc: "Notion代替のオールインワンワークスペース", href: "/guides/appflowy-selfhost-vps" },
  { name: "Baserow", desc: "Airtable代替のノーコードDB", href: "/guides/baserow-selfhost-vps" },
  { name: "Umami", desc: "Google Analytics代替の軽量解析", href: "/guides/umami-selfhost-vps" },
  { name: "Metabase", desc: "Tableau代替のBIダッシュボード", href: "/guides/metabase-selfhost-vps" },
  { name: "Plausible", desc: "Google Analytics代替のシンプル解析", href: "/guides/plausible-selfhost-vps" },
];

const FEATURES = [
  { icon: Box, title: "Marketplace（200以上のOSS）", desc: "n8n・Nextcloud・GitLab・Plausible・WordPressなど主要OSSを選ぶだけでdocker-compose.ymlを自動生成してデプロイ。" },
  { icon: GitBranch, title: "GitOps統合", desc: "GitHubやGitLabと接続し、mainブランチへのpushで自動デプロイ（CI/CDパイプライン不要）。" },
  { icon: Globe, title: "SSL自動取得", desc: "TraefikとLet's Encryptを内蔵。ドメインを設定するだけでHTTPS証明書が自動発行・更新される。" },
  { icon: Layers, title: "複数サーバー管理", desc: "1つのCoolifyダッシュボードから複数VPSを一元管理。本番・ステージング環境を分けやすい。" },
];

const OPS = [
  "Coolify自体のバックアップ：Supabase/S3互換ストレージへの自動バックアップ設定を必ず行う",
  "デプロイしたOSSのデータボリュームも別途定期バックアップを設定する",
  "管理者アカウントのパスワードと2FAを必ず有効化する",
  "ポート8000はCoolify専用。外部公開する場合は独自ドメイン＋SSL経由にする",
  "Coolify本体のアップデートは管理画面の「Updates」から定期的に実施する",
  "各OSSのメモリ使用量を確認し、VPSのプランアップグレードのタイミングを見極める",
];

const FAQ = [
  {
    q: "Coolifyは無料で使えますか？",
    a: "CoolifyはApache-2.0ライセンスのOSSです。セルフホスト版は無料で使えます。クラウド版（coollabs.io）は有料プランもあります。",
  },
  {
    q: "Heroku・Vercelとの違いは何ですか？",
    a: "Heroku・Vercel・Renderはマネージドサービスで使用量に応じた課金が発生します。CoolifyはVPSを自分で用意してその上で動かすため、固定のVPS料金のみで何個でもアプリをデプロイできます。",
  },
  {
    q: "n8nやAppFlowyはCoolify経由でデプロイできますか？",
    a: "はい。CoolifyのMarketplaceにn8n・AppFlowy・Baserowなどが含まれています。設定済みのdocker-composeが自動で適用されるため、個別にdocker-compose.ymlを書く必要がありません。",
  },
  {
    q: "2GB VPSでCoolify本体と複数OSSを動かせますか？",
    a: "Coolify本体は軽量ですが、n8n・AppFlowy等を同居させる場合は4GB以上を推奨します。最初は1つのOSSから始めて、必要に応じてメモリをスケールアップするのが現実的です。",
  },
  {
    q: "既存のDockerコンテナもCoolifyで管理できますか？",
    a: "はい。「Resources → New → Docker Compose」から任意のdocker-compose.ymlを貼り付けることで既存の構成をCoolify管理下に移行できます。",
  },
];

export default function CoolifySelfhostVpsGuide() {
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
        datePublished: "2026-05-21",
        dateModified: "2026-05-21",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "ガイド", item: "https://ossalt.jp/guides" },
          { "@type": "ListItem", position: 3, name: "CoolifyをVPSでセルフホストする方法", item: URL },
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
        name: "CoolifyをVPSでセルフホストする",
        description: "Ubuntu VPS上にCoolifyをインストールして、Heroku/Vercel代替の自己ホストPaaSを構築する手順。",
        step: STEPS.map((s) => ({
          "@type": "HowToStep",
          name: s.title,
          text: s.desc,
        })),
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
          <span className="text-foreground">CoolifyをVPSでセルフホストする方法</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Server className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            CoolifyをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Heroku・Vercel・Renderの代替OSS「Coolify」をVPSにインストールし、
            n8n・AppFlowy・Baserowなどのツールを自分のサーバーから
            <strong className="text-foreground">WebUIで1クリックデプロイ</strong>できる環境を構築します。
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

      {/* What is Coolify */}
      <Section title="Coolifyとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Heroku / Vercel / Railway / Render の代替OSS。自分のVPS上で動作するセルフホストPaaS。</li>
          <li>DockerコンテナやDocker Compose、Nixpacksアプリを管理画面からデプロイ・管理できる。</li>
          <li>GitHubとの連携でブランチpushによる自動デプロイ（CI/CD）をノーコードで設定可能。</li>
          <li>Marketplaceに200以上のOSSテンプレートが収録。n8n・AppFlowy・GitLab・Nextcloud等もワンクリックで起動できる。</li>
          <li>Traefik + Let's Encryptを内蔵しているため、SSLの取得・更新を自動で処理する。</li>
        </ul>
      </Section>

      {/* Why Self-Host */}
      <Section title="Coolifyをセルフホストする理由">
        <ul className="space-y-2 list-disc pl-5">
          <li>Heroku/RenderのようなPaaSの月額課金を、固定のVPS費用（月1,000〜3,000円）に置き換えられる。</li>
          <li>1台のVPSにn8n・Baserow・Umamiなど複数のOSSをまとめて管理。docker-composeをツールごとに書く手間がなくなる。</li>
          <li>GitOps統合でコードのpushからデプロイまで自動化でき、個人・スタートアップのCI/CD環境を無料で構築できる。</li>
          <li>データはすべて自分のサーバーに保存されるため、外部クラウドへの依存を排除できる。</li>
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
        <p className="mt-4 text-sm text-muted-foreground max-w-3xl">
          ※ Coolify本体は軽量（200MB程度）ですが、上にデプロイするOSSの分も加算されます。
          n8n + AppFlowy を同居させる場合は <strong className="text-foreground">4GB RAM</strong> を目安にしてください。
        </p>
      </section>

      {/* VPS CTA */}
      <AffiliateVpsCTA
        heading="セルフホストに必要な環境を確認する"
        description="Coolify + 複数OSS構成は4GB RAM以上が目安。OSSセルフホスト向けに整理した運用環境ガイドで、料金・スペック・サポートを比較できます。"
        ctaLabel="OSSセルフホスト向けの環境を確認する"
      />

      {/* Install Steps */}
      <section className="container pb-10">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">インストール手順</h2>
          <div className="space-y-5">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  {s.code && (
                    <div className="mt-3 card-unified overflow-hidden">
                      <pre className="overflow-x-auto p-4 text-sm text-foreground bg-secondary/30">
                        <code>{s.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              インストールスクリプトはroot権限で実行されます。本番環境では実行前に
              <a href="https://github.com/coollabsio/coolify" target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline mx-1">
                公式GitHubリポジトリ
              </a>
              でスクリプトの内容を確認してください。
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">主な機能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-unified p-5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OSS Examples */}
      <section className="container pb-10">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            CoolifyからデプロイできるOSS（一例）
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            ossalt.jpで紹介しているツールの多くがCoolify Marketplaceに収録されています。
            各ツールのセルフホストガイドも合わせて参照ください。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OSS_EXAMPLES.map((t) => (
              <Link
                key={t.href}
                to={t.href}
                className="card-unified p-4 hover:border-primary/40 transition-colors group"
              >
                <p className="text-xs text-primary mb-1">セルフホストガイド →</p>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                  {t.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
              </Link>
            ))}
          </div>
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

      {/* CTA: after operations */}
      <AffiliateVpsCTA
        heading="VPS運用ガイドで環境を確認する"
        description="Coolifyを動かすVPSは料金・スペック・サポートで選び方が変わります。OSSセルフホスト向けに整理した運用環境ガイドから探せます。"
        ctaLabel="VPS運用ガイドを見る"
      />

      {/* Related Guides */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {[
            { slug: "n8n-selfhost-vps", name: "n8nをVPSでセルフホストする方法", desc: "Zapier代替のワークフロー自動化をCoolifyと組み合わせて構築" },
            { slug: "appflowy-selfhost-vps", name: "AppFlowyをVPSでセルフホストする方法", desc: "Notion代替のワークスペースをCoolify経由で管理" },
            { slug: "baserow-selfhost-vps", name: "BaserowをVPSでセルフホストする方法", desc: "Airtable代替のノーコードDBをCoolifyからデプロイ" },
            { slug: "metabase-selfhost-vps", name: "MetabaseをVPSでセルフホストする方法", desc: "Tableau代替のBIダッシュボードを構築する手順" },
          ].map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="card-unified p-5 hover:border-primary/40 transition-colors group"
            >
              <p className="text-xs text-primary mb-1">セルフホストガイド</p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {g.name}
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
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
      </div>
    </section>
  );
}

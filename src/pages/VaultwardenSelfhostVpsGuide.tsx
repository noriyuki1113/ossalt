import { Link } from "react-router-dom";
import {
  ArrowRight, ChevronRight, Cpu, HardDrive, Server,
  TerminalSquare, ShieldAlert, Key, Shield, Smartphone, Lock,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "VaultwardenをVPSでセルフホストする方法｜1Password/Bitwarden代替OSSで自前パスワード管理";
const DESC = "1Password・Bitwarden代替のOSS「Vaultwarden」をVPSでセルフホストする方法を初心者向けに解説。Rustで書かれた超軽量サーバーで、Bitwardenの公式クライアントアプリをそのまま使えます。";
const URL = "https://ossalt.jp/guides/vaultwarden-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1 vCPUで十分。Rustで書かれており非常に軽量。" },
  { icon: Server, title: "メモリ", desc: "256MB〜512MBで動作。他のOSSと同居しやすい。" },
  { icon: HardDrive, title: "ストレージ", desc: "10GB以上あれば十分。データ本体は暗号化されて数MB程度。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu 22.04 LTS + Docker Compose。" },
];

const FEATURES = [
  { icon: Key, title: "Bitwardenクライアント互換", desc: "公式のBitwarden拡張機能・iOS/Androidアプリ・デスクトップアプリをそのまま使用できる。切り替えも簡単。" },
  { icon: Shield, title: "エンドツーエンド暗号化", desc: "パスワードはクライアント側で暗号化されてサーバーに送信される。サーバー管理者でも中身を見ることができない。" },
  { icon: Smartphone, title: "WebAuthn / FIDO2 / TOTP", desc: "ハードウェアキー（YubiKey等）やスマートフォンの2段階認証に対応。" },
  { icon: Lock, title: "緊急アクセス・組織機能", desc: "緊急時に信頼できる人にアクセス権を委任する機能や、組織でのパスワード共有が可能。" },
];

const COMPOSE = `services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: always
    environment:
      DOMAIN: "https://vault.example.com"      # 実際のドメインに変更
      SIGNUPS_ALLOWED: "false"                 # 初期設定後は必ず false に
      ADMIN_TOKEN: "\${VAULTWARDEN_ADMIN_TOKEN}"  # 長いランダム文字列を設定
      SMTP_HOST: "\${SMTP_HOST}"               # メール通知を使う場合
      SMTP_FROM: "\${SMTP_FROM}"
      SMTP_PORT: "587"
      SMTP_SECURITY: "starttls"
      SMTP_USERNAME: "\${SMTP_USERNAME}"
      SMTP_PASSWORD: "\${SMTP_PASSWORD}"
    volumes:
      - vw_data:/data
    ports:
      - "3000:80"

volumes:
  vw_data:`;

const OPS = [
  "SIGNUPS_ALLOWEDは初期アカウント作成後すぐにfalseに設定し、不正登録を防ぐ",
  "ADMIN_TOKENはopenssl rand -base64 48などで生成した強力なランダム文字列を使用する",
  "リバースプロキシ（Caddy / Nginx）でHTTPS化する。HTTPSなしでは動作しない機能がある",
  "定期的にvw_dataボリュームをバックアップする（暗号化済みなので安全にS3等に保存できる）",
  "Vaultwardenのアップデートは定期的に実施する（docker pull → docker compose up -d）",
  "ログインに使うメールアドレスが管理画面にもアクセスできるため、管理者アカウントは厳重に管理する",
];

const FAQ = [
  { q: "公式Bitwardenとの違いは何ですか？", a: "Vaultwardenは公式Bitwardenサーバーの非公式互換実装です。Bitwardenの公式クライアントアプリがそのまま使える一方、公式が有料で提供する一部機能（組織の高度な権限等）も無料で利用できます。ただし公式サポートはなく、動作確認は自己責任です。" },
  { q: "既存のBitwarden/1Passwordのデータは移行できますか？", a: "はい。Bitwarden・1Password・LastPass・Dashlane等からJSONまたはCSVでエクスポートし、Vaultwardenのインポート機能で取り込むことができます。" },
  { q: "HTTPSなしで動かせますか？", a: "技術的には可能ですが、セキュリティ上のリスクが高く、モバイルアプリの一部機能がHTTPS必須のため非推奨です。Let's Encryptで無料のSSL証明書を取得してください。" },
  { q: "家族や社内チームで共有できますか？", a: "組織機能と共有コレクションを使うことでチームでのパスワード共有が可能です。各メンバーが個別のアカウントを持ちながら、共有パスワードを管理できます。" },
  { q: "外出先でスマートフォンからアクセスできますか？", a: "はい。独自ドメインでHTTPS公開することで、公式BitwardenのiOS/AndroidアプリのサーバーURLを自分のVaultwardenに変更して利用できます。" },
];

export default function VaultwardenSelfhostVpsGuide() {
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
        datePublished: "2026-05-22",
        dateModified: "2026-05-22",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "ガイド", item: "https://ossalt.jp/guides" },
          { "@type": "ListItem", position: 3, name: "VaultwardenをVPSでセルフホストする方法", item: URL },
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
          <span className="text-foreground">VaultwardenをVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Server className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            VaultwardenをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            1Password・Bitwarden代替のOSSとして注目される「Vaultwarden」を
            自分のVPSで動かす方法を解説します。
            <strong className="text-foreground">256MBのメモリで動く超軽量サーバー</strong>で、
            Bitwardenの公式アプリをそのまま使えます。
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

      <Section title="Vaultwardenとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>1Password / LastPass / Bitwarden（クラウド版）代替のセルフホストパスワードマネージャー。</li>
          <li>公式BitwardenサーバーのAPI互換実装。Bitwardenの全公式クライアント（拡張機能・iOS・Android・デスクトップ）をそのまま利用できる。</li>
          <li>RustでゼロからビルドされたためVPS上のリソース消費が極めて少ない（他のOSSとの同居が容易）。</li>
          <li>AGPL-3.0ライセンス。商用・個人問わず無料で利用可能。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>1Password（月額約390円〜）やLastPass（月額約500円〜）の課金が不要になる。</li>
          <li>パスワードデータがすべて自分のサーバーに保存される。外部クラウドへの依存ゼロ。</li>
          <li>エンドツーエンド暗号化のため、サーバーに侵入されても平文パスワードは読めない。</li>
          <li>家族・チームでの共有も、公式Bitwardenの高額な組織プランなしで利用できる。</li>
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
        <p className="mt-4 text-sm text-muted-foreground max-w-3xl">
          Vaultwardenはすべてのセルフホストガイドの中でも<strong className="text-foreground">最も軽量</strong>です。
          すでにn8nやNextcloudを動かしているVPSに追加してもほぼ影響ありません。
        </p>
      </section>

      <AffiliateVpsCTA
        heading="セルフホストに必要な環境を確認する"
        description="Vaultwardenは軽量なので既存VPSへの追加も容易です。まだVPSをお持ちでない方はOSSセルフホスト向けの運用環境ガイドを参照ください。"
        ctaLabel="OSSセルフホスト向けの環境を確認する"
      />

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

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">Docker Composeの最小構成例</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          動作確認用の最小構成です。本番運用では必ずHTTPS化とADMIN_TOKENの設定を行ってください。
        </p>
        <div className="card-unified overflow-hidden max-w-3xl">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            パスワードマネージャーはセキュリティが最重要です。ADMIN_TOKENは必ず強力なランダム文字列を使用し、
            SIGNUPS_ALLOWEDは自分のアカウント作成後すぐにfalseに変更してください。
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
        description="Vaultwardenは軽量なのでコスパの高い小さめのプランでも十分です。他のOSSとの同居も踏まえてVPS選びをしたい方はガイドを参照ください。"
        ctaLabel="VPS運用ガイドを見る"
      />

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {[
            { slug: "coolify-selfhost-vps", name: "CoolifyをVPSでセルフホストする方法", desc: "VaultwardenをCoolify Marketplace経由でデプロイする" },
            { slug: "nextcloud-selfhost-vps", name: "NextcloudをVPSでセルフホストする方法", desc: "ファイル管理もセルフホストしてGoogle依存を完全排除" },
            { slug: "n8n-selfhost-vps", name: "n8nをVPSでセルフホストする方法", desc: "Zapier代替で同じVPSにワークフロー自動化を追加" },
            { slug: "gitea-selfhost-vps", name: "GiteaをVPSでセルフホストする方法", desc: "コードリポジトリもセルフホストして完全自前化" },
          ].map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="card-unified p-5 hover:border-primary/40 transition-colors group">
              <p className="text-xs text-primary mb-1">セルフホストガイド</p>
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{g.name}</p>
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

      <section className="container pb-12"><AffiliateDisclosure /></section>
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

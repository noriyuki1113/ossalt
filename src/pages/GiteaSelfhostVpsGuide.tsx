import { Link } from "react-router-dom";
import {
  ArrowRight, ChevronRight, Cpu, HardDrive, Server,
  TerminalSquare, ShieldAlert, GitBranch, GitMerge, Package, Users,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "GiteaをVPSでセルフホストする方法｜GitHub代替OSSを自分のサーバーで構築";
const DESC = "GitHub代替のOSS「Gitea」をVPSでセルフホストする方法を初心者向けに解説。GitHubと同様のUI・Issues・Pull Request・Actionsを自分のサーバーで無料で運用できます。Forgejoへの移行方法も紹介します。";
const URL = "https://ossalt.jp/guides/gitea-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "1〜2 vCPU。Goで書かれているため非常に効率的。" },
  { icon: Server, title: "メモリ", desc: "最低 512MB。実運用（チームで使用）なら 1〜2GB。" },
  { icon: HardDrive, title: "ストレージ", desc: "リポジトリのサイズ次第。初期は20GBから始めて増やす。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu 22.04 LTS + Docker Compose。SQLiteまたはPostgreSQL。" },
];

const FEATURES = [
  { icon: GitBranch, title: "Git リポジトリ管理", desc: "GitHubと同様のUIでリポジトリ・ブランチ・コミット履歴を管理。プライベートリポジトリが無制限かつ無料。" },
  { icon: GitMerge, title: "Issues & Pull Requests", desc: "GitHubのIssue・PRワークフローをそのまま再現。コードレビュー・マージ・マイルストーン管理に対応。" },
  { icon: Package, title: "Gitea Actions（CI/CD）", desc: "GitHub Actionsと互換のCI/CD機能。既存のworkflow.ymlファイルをほぼそのまま移行できる。" },
  { icon: Users, title: "組織・チーム管理", desc: "Organization・Teamを作成し、リポジトリへのアクセス権限を細かく制御。社内GitHubとして活用できる。" },
];

const COMPOSE = `services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    restart: always
    environment:
      USER_UID: 1000
      USER_GID: 1000
      GITEA__database__DB_TYPE: sqlite3
      GITEA__server__DOMAIN: git.example.com        # 実際のドメインに変更
      GITEA__server__ROOT_URL: "https://git.example.com"
      GITEA__server__SSH_DOMAIN: git.example.com
      GITEA__server__SSH_PORT: 2222
      GITEA__service__DISABLE_REGISTRATION: "true"  # 初期設定後はtrue推奨
    volumes:
      - gitea_data:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"   # HTTP
      - "2222:22"     # SSH（git push用）

volumes:
  gitea_data:`;

const OPS = [
  "DISABLE_REGISTRATIONを管理者アカウント作成後にtrueに設定し、不正ユーザーの登録を防ぐ",
  "gitea_dataボリュームを定期的にバックアップする（リポジトリデータが含まれる）",
  "リバースプロキシ（Caddy / Nginx）でHTTPS化し、ポート3000を直接公開しない",
  "SSH鍵でのgit push/pullを設定するとパスワード認証より安全かつ便利",
  "Gitea本体を定期的にアップデートする（docker pull → docker compose up -d）",
  "大容量リポジトリはGit LFSを活用してストレージを節約する",
];

const FAQ = [
  { q: "GiteaとForgejoの違いは何ですか？", a: "ForgejoはGiteaのコミュニティフォークです。GiteaがVenture Backed企業の運営に移行したことを受け、コミュニティ主導のガバナンスを維持するために分岐しました。技術的な違いはほぼなく、Forgejo公式はGiteaからの移行も公式にサポートしています。どちらを選んでも機能はほぼ同じです。" },
  { q: "GitHubのリポジトリをGiteaに移行できますか？", a: "はい。Gitea管理画面の「リポジトリのマイグレーション」機能を使うとGitHub・GitLab・Bitbucketからリポジトリ・Issues・PRをまとめてインポートできます。" },
  { q: "GitHub Actionsのworkflow.ymlをそのまま使えますか？", a: "Gitea ActionsはGitHub Actions互換です。多くのworkflow.ymlはそのまま、または軽微な変更で動作します。ただしすべてのサードパーティActions（GitHub Marketplace）が動作するわけではないため確認が必要です。" },
  { q: "SSH経由でgit pushできますか？", a: "はい。docker-compose.ymlでポート2222をマッピングしてSSHポートを公開することでgit push/pull時のSSH鍵認証が使えます。~/.ssh/configでカスタムポートを設定することで違和感なく使えます。" },
  { q: "GitLabと比較してどうですか？", a: "GitLabはCI/CD・セキュリティスキャン・DevOpsプラットフォームとして非常に高機能ですが、メモリを2GB以上消費します。GiteaはGitのコア機能に特化しており、512MB〜1GBで軽快に動作します。個人・小規模チームにはGiteaが適しています。" },
];

export default function GiteaSelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "GiteaをVPSでセルフホストする方法", item: URL },
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
        name: "GiteaをVPSでセルフホストする",
        description: "Docker ComposeでGiteaを起動し、GitHub代替のセルフホストGitサーバーを構築する手順。",
        step: [
          { "@type": "HowToStep", name: "VPSを用意する", text: "Ubuntu 22.04 LTS・1GB RAM以上のVPSを契約する。" },
          { "@type": "HowToStep", name: "Dockerをインストール", text: "公式手順でDocker EngineとComposeをインストール。" },
          { "@type": "HowToStep", name: "docker-compose.ymlを配置して起動", text: "本記事の構成例をベースにドメインを設定してdocker compose upで起動。" },
          { "@type": "HowToStep", name: "リバースプロキシとSSLを設定", text: "CaddyまたはNginxでHTTPS化。ポート3000を直接公開しない。" },
          { "@type": "HowToStep", name: "初期設定ウィザードを完了", text: "ブラウザでアクセスして管理者アカウントを作成し、DISABLE_REGISTRATIONをtrueに設定。" },
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
          <span className="text-foreground">GiteaをVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Server className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            GiteaをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            GitHub代替のOSS「Gitea」を自分のVPSで動かす方法を解説します。
            <strong className="text-foreground">512MBの軽量サーバー</strong>でGitHub同様のIssues・PR・CI/CDが使え、
            プライベートリポジトリが無制限・無料になります。
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

      <Section title="Gitea（およびForgejo）とは">
        <ul className="space-y-2 list-disc pl-5">
          <li>GitHub / GitLab / Bitbucket 代替のセルフホストGitサービス。GoでビルドされたOSS。</li>
          <li>GitHubと同様のUIでリポジトリ管理・Issues・Pull Request・Wikiが使える。</li>
          <li>Gitea ActionsはGitHub Actionsと互換性があり、既存のCIワークフローを移行しやすい。</li>
          <li><strong className="text-foreground">Forgejo</strong>はGiteaのコミュニティフォーク。ほぼ同じ機能でよりオープンなガバナンスを重視する場合はForgejoも選択肢になる。</li>
          <li>MIT ライセンス（Gitea）。商用・個人問わず無料で利用可能。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>GitHubのプライベートリポジトリ課金なしに、社内・チームの全コードを管理できる。</li>
          <li>コードが自分のサーバーに保存されるため、機密コードを外部サービスに置かなくて済む。</li>
          <li>Dockerレジストリ・パッケージレジストリも内蔵しており、1サービスで開発インフラが完結する。</li>
          <li>GitHubが障害時でも自前サーバーが動いていれば影響を受けない。</li>
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
        description="Giteaは軽量なので既存のVPSにも追加しやすいです。VaultwardenやNextcloudとの同居も可能。OSSセルフホスト向けの運用環境ガイドで比較できます。"
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
          SQLiteを使った最もシンプルな構成です。本番運用ではPostgreSQLへの変更も検討してください。
        </p>
        <div className="card-unified overflow-hidden max-w-3xl">
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground bg-secondary/30">
            <code>{COMPOSE}</code>
          </pre>
        </div>
        <div className="mt-4 max-w-3xl rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            初回セットアップ後は必ず DISABLE_REGISTRATION を true に設定してください。
            また、gitea_dataボリュームのバックアップを必ず設定してください。リポジトリデータが失われると復元できません。
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
        description="Giteaはリポジトリ数が増えるとストレージが増えます。スケールアップしやすいVPS選びをOSSセルフホスト向けガイドで確認できます。"
        ctaLabel="VPS運用ガイドを見る"
      />

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {[
            { slug: "coolify-selfhost-vps", name: "CoolifyをVPSでセルフホストする方法", desc: "CoolifyからGiteaをMarketplace経由でデプロイする" },
            { slug: "nextcloud-selfhost-vps", name: "NextcloudをVPSでセルフホストする方法", desc: "コード以外のファイルもNextcloudでセルフホスト" },
            { slug: "vaultwarden-selfhost-vps", name: "VaultwardenをVPSでセルフホストする方法", desc: "パスワードマネージャーもセルフホストして完全自前化" },
            { slug: "n8n-selfhost-vps", name: "n8nをVPSでセルフホストする方法", desc: "Gitea Webhookをn8nで受け取り自動化処理に連携" },
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

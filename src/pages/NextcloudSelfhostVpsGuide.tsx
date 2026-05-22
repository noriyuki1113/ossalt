import { Link } from "react-router-dom";
import {
  ArrowRight, ChevronRight, Cpu, HardDrive, Server,
  TerminalSquare, ShieldAlert, FolderOpen, Calendar, Users, Video,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AffiliateVpsCTA } from "@/components/affiliate/AffiliateVpsCTA";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

const TITLE = "NextcloudをVPSでセルフホストする方法｜Google Drive代替OSSを自分のサーバーで構築";
const DESC = "Google Drive・Google Workspace代替のOSS「Nextcloud」をVPSでセルフホストする方法を初心者向けに解説。All-in-Oneイメージで手軽に構築し、ファイル共有・カレンダー・ビデオ通話まで自分のサーバーで完結させます。";
const URL = "https://ossalt.jp/guides/nextcloud-selfhost-vps";

const SPECS = [
  { icon: Cpu, title: "CPU", desc: "2 vCPU以上。Nextcloud Office（Collabora）も使うなら4 vCPU推奨。" },
  { icon: Server, title: "メモリ", desc: "最低 2GB。Office機能やTalkを使うなら 4GB以上。" },
  { icon: HardDrive, title: "ストレージ", desc: "システム用20GB + データ保存分。チームで使うなら100GB以上を見込む。" },
  { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu 22.04 LTS + Docker。All-in-One(AIO)イメージが最も簡単。" },
];

const FEATURES = [
  { icon: FolderOpen, title: "ファイル管理・共有", desc: "Google Driveのような操作感でファイルをアップロード・共有・同期。デスクトップ・モバイルアプリも無料。" },
  { icon: Calendar, title: "カレンダー・連絡先", desc: "CalDAV/CardDAV対応。Google Calendar・iCloudの代替として既存アプリからそのまま使える。" },
  { icon: Users, title: "Nextcloud Office", desc: "Collabora連携でWord/Excel/PowerPointのオンライン編集。Google Docs代替として機能する。" },
  { icon: Video, title: "Nextcloud Talk", desc: "ビデオ通話・チャット機能を内蔵。ZoomやGoogle Meet代替としてチーム内コミュニケーションに使える。" },
];

const STEPS = [
  { step: "1", title: "VPSを用意する", desc: "Ubuntu 22.04 LTS・2GB RAM・2vCPU以上のVPSを契約する。独自ドメインを取得してDNS（Aレコード）をVPSのIPに向けておく。" },
  { step: "2", title: "Dockerをインストール", desc: "公式手順でDocker EngineとDocker Composeプラグインをインストールする。" },
  { step: "3", title: "All-in-Oneコンテナを起動", desc: "Nextcloud AIOイメージを起動する。ワンコマンドで管理コンテナが立ち上がる。", code: `docker run \\\n  --sig-proxy=false \\\n  --name nextcloud-aio-mastercontainer \\\n  --restart always \\\n  --publish 8080:8080 \\\n  --env APACHE_PORT=11000 \\\n  --env APACHE_IP_BINDING=0.0.0.0 \\\n  --volume nextcloud_aio_mastercontainer:/mnt/docker-aio-config \\\n  --volume /var/run/docker.sock:/var/run/docker.sock:ro \\\n  nextcloud/all-in-one:latest` },
  { step: "4", title: "AIO管理画面にアクセス", desc: "https://<VPSのIP>:8080 にアクセスし、表示されるパスフレーズを控えておく。次の画面でドメインを入力する。" },
  { step: "5", title: "ドメインとSSLを設定", desc: "AIO画面でドメイン（nextcloud.example.com など）を入力するとLet's EncryptのSSL証明書が自動取得される。ドメインのDNS設定が正しいことを確認する。" },
  { step: "6", title: "Nextcloudを起動", desc: "AIO画面の「Start containers」ボタンをクリック。数分後にNextcloudが起動し、設定したドメインでアクセスできるようになる。" },
];

const OPS = [
  "外部ストレージ（Wasabi・Backblaze B2等のS3互換）を設定してデータを別途バックアップする",
  "AIO管理画面のバックアップ機能を定期実行（毎日推奨）",
  "Nextcloud本体とAIOイメージのアップデートを管理画面から定期的に適用する",
  "管理者パスワードを強固にし、2FA（TOTP）を有効化する",
  "不特定多数のサインアップを防ぐためにユーザー招待制に設定する",
  "メール送信設定（SMTP）を行い、パスワードリセットが機能するようにする",
];

const FAQ = [
  { q: "NextcloudはGoogle Driveを完全に置き換えられますか？", a: "ファイル共有・同期・カレンダー・連絡先は十分に代替できます。Nextcloud OfficeはGoogle Docsに近い機能を提供しますが、細かいUIや連携面では差異があります。用途に応じて使い分けを検討してください。" },
  { q: "デスクトップ・スマートフォンアプリはありますか？", a: "Windows・Mac・Linux向けデスクトップクライアントと、iOS・Android向けモバイルアプリが無料で提供されています。Google Driveと同様にファイルの自動同期が可能です。" },
  { q: "外部からアクセスするにはどうすればよいですか？", a: "VPSに独自ドメインを設定してHTTPS化（AIOが自動対応）することで、インターネット経由でどこからでもアクセスできます。" },
  { q: "ストレージが足りなくなったらどうする？", a: "VPSのブロックストレージを追加してマウントするか、Nextcloudの外部ストレージ機能でS3互換ストレージを繋ぐことができます。" },
  { q: "1GB VPSでも動きますか？", a: "軽量構成なら起動できる場合がありますが、Nextcloudはメモリを比較的多く使用します。実運用では2GB以上を強く推奨します。" },
];

export default function NextcloudSelfhostVpsGuide() {
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
          { "@type": "ListItem", position: 3, name: "NextcloudをVPSでセルフホストする方法", item: URL },
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
        name: "NextcloudをVPSでセルフホストする",
        description: "Nextcloud All-in-OneをVPS上のDockerで起動しGoogle Drive代替環境を構築する手順。",
        step: STEPS.map((s) => ({ "@type": "HowToStep", name: s.title, text: s.desc })),
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
          <span className="text-foreground">NextcloudをVPSでセルフホストする方法</span>
        </nav>
      </div>

      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Server className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            NextcloudをVPSでセルフホストする方法
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Google Drive・Google Docsの代替として国内外で最も普及しているOSS「Nextcloud」を
            自分のVPSで動かす方法を解説します。All-in-Oneイメージで
            <strong className="text-foreground">SSL・バックアップ・アップデートまで自動化</strong>できます。
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

      <Section title="Nextcloudとは">
        <ul className="space-y-2 list-disc pl-5">
          <li>Google Drive / Dropbox / OneDrive 代替のOSSファイル共有・同期プラットフォーム。</li>
          <li>ファイル管理だけでなく、カレンダー・連絡先・オフィスアプリ・ビデオ通話まで拡張できる。</li>
          <li>App Store（プラグイン市場）で300以上のアプリを追加してできることを増やせる。</li>
          <li>AGPL-3.0ライセンス。コミュニティ版は完全無料。企業向けサポートプランも提供。</li>
        </ul>
      </Section>

      <Section title="VPSでセルフホストするメリット">
        <ul className="space-y-2 list-disc pl-5">
          <li>Google Driveの月額課金なしで、VPSのストレージ分だけ使える。</li>
          <li>ファイルがすべて自分のサーバーに保存されるため、プライバシーを完全に管理できる。</li>
          <li>チームメンバーを招待し、共有フォルダ・共同編集環境を社内に持てる。</li>
          <li>CalDAVでiPhone・AndroidのカレンダーアプリをGoogle Calendar代わりに接続できる。</li>
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
        description="Nextcloudはストレージ拡張を見込んで余裕のあるプランを選ぶのがポイント。OSSセルフホスト向けに整理した運用環境ガイドで料金・スペックを比較できます。"
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
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">インストール手順（All-in-One方式）</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Nextcloud All-in-One（AIO）は公式推奨のDocker構成です。
            SSL取得・バックアップ・アップデートを1つの管理画面から操作できます。
          </p>
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
                      <pre className="overflow-x-auto p-4 text-sm text-foreground bg-secondary/30 whitespace-pre-wrap">
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
              AIO管理画面はポート8080でHTTPS公開されます。初回アクセス時に表示されるパスフレーズは必ず安全な場所に保管してください。
            </p>
          </div>
        </div>
      </section>

      <Section title="運用時の注意点">
        <ul className="space-y-2 list-disc pl-5">
          {OPS.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </Section>

      <AffiliateVpsCTA
        heading="VPS運用ガイドで環境を確認する"
        description="Nextcloudはストレージの増加に合わせてVPSプランを見直す必要があります。OSSセルフホスト向けに整理した環境ガイドから探せます。"
        ctaLabel="VPS運用ガイドを見る"
      />

      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {[
            { slug: "coolify-selfhost-vps", name: "CoolifyをVPSでセルフホストする方法", desc: "NextcloudをCoolify経由でさらに簡単にデプロイ・管理する" },
            { slug: "vaultwarden-selfhost-vps", name: "VaultwardenをVPSでセルフホストする方法", desc: "パスワード管理もセルフホストして完全プライベート化" },
            { slug: "n8n-selfhost-vps", name: "n8nをVPSでセルフホストする方法", desc: "Nextcloudと連携してファイル操作を自動化" },
            { slug: "gitea-selfhost-vps", name: "GiteaをVPSでセルフホストする方法", desc: "GitHub代替でコードもセルフホストでまとめる" },
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

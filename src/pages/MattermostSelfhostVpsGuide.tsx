import { SelfHostGuideTemplate, Cpu, HardDrive, Server, TerminalSquare, type SelfHostGuideConfig } from "@/components/guides/SelfHostGuideTemplate";

const COMPOSE = `services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: mmuser
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: mattermost
    volumes:
      - pg_data:/var/lib/postgresql/data

  mattermost:
    image: mattermost/mattermost-team-edition:latest
    restart: always
    depends_on:
      - postgres
    environment:
      MM_SQLSETTINGS_DRIVERNAME: postgres
      MM_SQLSETTINGS_DATASOURCE: "postgres://mmuser:\${DB_PASSWORD}@postgres:5432/mattermost?sslmode=disable"
      MM_SERVICESETTINGS_SITEURL: https://chat.example.com
    volumes:
      - mm_data:/mattermost/data
      - mm_logs:/mattermost/logs
      - mm_config:/mattermost/config
      - mm_plugins:/mattermost/plugins
    expose:
      - "8065"

volumes:
  pg_data:
  mm_data:
  mm_logs:
  mm_config:
  mm_plugins:`;

const config: SelfHostGuideConfig = {
  toolName: "Mattermost",
  replaces: "Slack",
  slug: "mattermost-selfhost-vps",
  titleSuffix: "Slack代替OSSを自分のサーバーで動かす",
  metaDescription: "Slack代替のOSSチャットプラットフォーム Mattermost をVPSでセルフホストする手順を解説。Docker Compose構成、PostgreSQL、HTTPS化、運用注意点まで網羅します。",
  heroDescription: "Slackの代替として人気のOSSチャット Mattermost を、自分のVPSで動かすための基本構成とHTTPS化までを解説します。",
  publishedAt: "2026-05-28",
  about: [
    "Slack に最も近いUXを持つOSSのチームチャット。",
    "チャンネル・スレッド・DM・絵文字・Slash コマンド・Webhookに対応。",
    "公式の Slack インポートツールがあり、過去メッセージを移行できる。",
    "Team Edition (MIT) は無料でセルフホスト可能。",
  ],
  whyVps: [
    "Slack のフリープラン制限（メッセージ保持・履歴）から解放される。",
    "全てのメッセージとファイルを自分の管理下に置ける。",
    "ユーザー数課金がなく、チームが拡大してもコストが一定。",
    "PostgreSQL + Mattermost の2層構成でシンプルに運用できる。",
  ],
  specs: [
    { icon: Cpu, title: "CPU", desc: "1〜2 vCPU。10〜50人規模なら2 vCPUが目安。" },
    { icon: Server, title: "メモリ", desc: "最低2GB、実運用は4GB以上を推奨。" },
    { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。添付ファイルが多ければ拡張前提で。" },
    { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose + PostgreSQL 13以降。" },
  ],
  stack: [
    "VPS（Ubuntu LTS）",
    "Docker / Docker Compose",
    "PostgreSQL（コンテナで同居可）",
    "Mattermost Server（Dockerコンテナ）",
    "リバースプロキシ（Caddy / Nginx）",
    "独自ドメイン + SSL（Let's Encrypt）",
  ],
  composeYaml: COMPOSE,
  composeNote: "本番運用ではDB_PASSWORDを.envで管理し、PostgreSQLのバックアップ・mm_data ボリュームの定期スナップショットを設定してください。Calls プラグインを使う場合は追加のポート開放が必要です。",
  https: {
    domain: "chat.example.com",
    upstream: "mattermost:8065",
    note: "WebSocketを使うため、Caddyのデフォルト reverse_proxy で問題なく動作します。Nginxを使う場合はUpgrade/Connectionヘッダーの設定が必要です。",
  },
  ops: [
    "初回起動後すぐに System Console から最初の管理者アカウントを作成する",
    "PostgreSQLのダンプ（pg_dump）と data/ ボリュームを定期バックアップする",
    "Mattermost本体・Dockerイメージ・ホストOSを定期的にアップデートする",
    "メール通知を使う場合はSMTP設定を System Console で行う",
    "Slackからの移行は公式 mmctl import を使い、テスト環境で検証してから本番投入する",
  ],
  faq: [
    { q: "Mattermost は無料で使えますか？", a: "Team Edition は MIT ライセンスで無料です。Enterprise 機能（LDAP・コンプライアンス等）が必要な場合のみ有料版を検討してください。" },
    { q: "Slack からメッセージを移行できますか？", a: "公式の Slack Importer があり、チャンネル・メッセージ・ユーザーを移行できます。DMの移行には制限があります。" },
    { q: "メモリ2GBで動きますか？", a: "10人程度のチームなら動きますが、添付ファイルや検索インデックスのために4GB以上を推奨します。" },
    { q: "音声通話はできますか？", a: "Calls プラグインで音声・画面共有が可能ですが、別途TURNサーバーの設定が必要です。" },
  ],
  related: [
    { name: "Mattermost", desc: "Slack代替の本記事ツール", href: "/alternatives/slack" },
    { name: "Rocket.Chat", desc: "もう一つの主要なSlack代替OSS", href: "/alternatives/slack" },
    { name: "Zulip", desc: "スレッド中心のSlack代替", href: "/alternatives/slack" },
    { name: "Slack の代替を比較", desc: "Slack代替OSSをまとめて見る", href: "/alternatives/slack" },
  ],
  relatedGuides: [
    { slug: "n8n-selfhost-vps", title: "n8nをVPSでセルフホストする方法", desc: "Mattermostと連携してWebhook自動化" },
    { slug: "outline-selfhost-vps", title: "OutlineをVPSでセルフホストする方法", desc: "チームのナレッジ共有を内製化" },
    { slug: "gitea-selfhost-vps", title: "GiteaをVPSでセルフホストする方法", desc: "Git通知をMattermostチャンネルに飛ばす" },
  ],
  howToSteps: [
    { name: "VPSを用意する", text: "4GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
    { name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
    { name: "docker-compose.ymlを配置", text: "本記事のPostgreSQL + Mattermostの最小構成例をベースに環境変数を設定する。" },
    { name: "Caddyでリバースプロキシを設定", text: "Caddyfileを作成しドメインに紐付け、Let's EncryptでHTTPS化する。" },
    { name: "起動と管理者登録", text: "docker compose up -dで起動し、ブラウザで最初の管理者アカウントを作成する。" },
  ],
};

export default function MattermostSelfhostVpsGuide() {
  return <SelfHostGuideTemplate config={config} />;
}

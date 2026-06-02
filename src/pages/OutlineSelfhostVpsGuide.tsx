import { SelfHostGuideTemplate, Cpu, HardDrive, Server, TerminalSquare, type SelfHostGuideConfig } from "@/components/guides/SelfHostGuideTemplate";

const COMPOSE = `services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: outline
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: outline
    volumes:
      - pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always

  outline:
    image: outlinewiki/outline:latest
    restart: always
    depends_on: [postgres, redis]
    environment:
      SECRET_KEY: \${SECRET_KEY}
      UTILS_SECRET: \${UTILS_SECRET}
      DATABASE_URL: postgres://outline:\${DB_PASSWORD}@postgres:5432/outline
      REDIS_URL: redis://redis:6379
      URL: https://docs.example.com
      PORT: 3000
      AWS_ACCESS_KEY_ID: \${S3_ACCESS_KEY}
      AWS_SECRET_ACCESS_KEY: \${S3_SECRET_KEY}
      AWS_REGION: auto
      AWS_S3_UPLOAD_BUCKET_URL: \${S3_ENDPOINT}
      AWS_S3_UPLOAD_BUCKET_NAME: outline-uploads
      AWS_S3_FORCE_PATH_STYLE: "true"
      # 認証プロバイダ（最低1つは必須）
      SLACK_CLIENT_ID: \${SLACK_CLIENT_ID}
      SLACK_CLIENT_SECRET: \${SLACK_CLIENT_SECRET}
    expose:
      - "3000"

volumes:
  pg_data:`;

const config: SelfHostGuideConfig = {
  toolName: "Outline",
  replaces: "Confluence",
  slug: "outline-selfhost-vps",
  titleSuffix: "Confluence / Notion代替OSSのナレッジベースを自分のサーバーで動かす",
  metaDescription: "Confluence・Notion代替のOSSナレッジベース Outline をVPSでセルフホストする手順を解説。PostgreSQL + Redis + S3互換ストレージの構成、認証設定、HTTPS化まで網羅します。",
  heroDescription: "Confluence の代替として人気のOSSナレッジベース Outline を、自分のVPSで動かすための構成と認証設定を解説します。",
  publishedAt: "2026-05-28",
  about: [
    "OSSのチームナレッジベース。Markdownエディタとリアルタイム共同編集に対応。",
    "コレクション・ドキュメント・サブドキュメントの階層構造でWiki的に整理。",
    "Slack / Google / OIDC など複数の認証プロバイダに対応（最低1つは必須）。",
    "BSL（Business Source License）。商用利用条件を必ず確認。",
  ],
  whyVps: [
    "Confluence や Notion の月額課金から解放される。",
    "ナレッジデータを自分の管理下に置ける（コンプライアンス対応）。",
    "Markdownベースなので将来の移行も容易。",
    "Slack / Google認証と組み合わせて、SaaSライクな体験を内製化できる。",
  ],
  specs: [
    { icon: Cpu, title: "CPU", desc: "1〜2 vCPU。" },
    { icon: Server, title: "メモリ", desc: "最低2GB、推奨4GB。" },
    { icon: HardDrive, title: "ストレージ", desc: "20GB以上のSSD。添付ファイルはS3互換に逃がす設計。" },
    { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose + PostgreSQL + Redis + S3互換ストレージ。" },
  ],
  stack: [
    "VPS（Ubuntu LTS）",
    "Docker / Docker Compose",
    "PostgreSQL（メインDB）",
    "Redis（セッション・リアルタイム同期）",
    "S3互換ストレージ（MinIO / Cloudflare R2 / AWS S3）",
    "Outline Server（Dockerコンテナ）",
    "認証プロバイダ（Slack / Google / OIDC など）",
    "リバースプロキシ（Caddy / Nginx）",
    "独自ドメイン + SSL（Let's Encrypt）",
  ],
  composeYaml: COMPOSE,
  composeNote: "SECRET_KEY と UTILS_SECRET は openssl rand -hex 32 で生成。S3 は MinIO を同居させるか、Cloudflare R2（エグレス無料）が個人運用におすすめです。Slackアプリの設定で OAuth Redirect URL を https://docs.example.com/auth/slack.callback に登録してください。",
  https: {
    domain: "docs.example.com",
    upstream: "outline:3000",
    note: "リアルタイム共同編集にWebSocketを使うため、Caddyの reverse_proxy で問題なく動作します。",
  },
  ops: [
    "SECRET_KEY・UTILS_SECRET は強力なランダム値に必ず変更する",
    "PostgreSQL の定期バックアップ + S3バケットのバージョニング有効化を推奨",
    "認証プロバイダ（Slack/Google）のOAuth設定を本番ドメインで登録する",
    "BSLライセンスの条項を確認し、SaaSとして再販する用途には使わない",
    "アップデート時はDBマイグレーションが入るためバックアップ後に実施する",
  ],
  faq: [
    { q: "Outline は無料で使えますか？", a: "セルフホスト版はBSL（Business Source License）で社内利用に無料です。Outline自体を有料SaaSとして再販する用途は禁止されています。" },
    { q: "認証プロバイダなしで起動できますか？", a: "できません。Slack / Google / Microsoft / 任意のOIDC など最低1つの認証プロバイダ設定が必須です。" },
    { q: "S3互換ストレージは何がおすすめですか？", a: "個人ならエグレス無料のCloudflare R2、自己完結したいならMinIOをVPSに同居させる構成が一般的です。" },
    { q: "Notionからデータを移行できますか？", a: "Notion からのMarkdown ZIPエクスポートをインポートできますが、データベース構造などは完全には移行できません。" },
  ],
  related: [
    { name: "Outline", desc: "本記事の対象ツール", href: "/tools/303" },
    { name: "AppFlowy", desc: "Notion代替。ローカルファースト系", href: "/tools/185" },
    { name: "Notion の代替を比較", desc: "Notion代替OSSをまとめて見る", href: "/alternatives/notion" },
    { name: "n8n", desc: "Outline + Slack連携を自動化", href: "/tools/415" },
  ],
  relatedGuides: [
    { slug: "appflowy-selfhost-vps", title: "AppFlowyをVPSでセルフホストする方法", desc: "Notion代替のローカルファースト系" },
    { slug: "mattermost-selfhost-vps", title: "MattermostをVPSでセルフホストする方法", desc: "ナレッジ+チャットでチーム基盤を内製化" },
    { slug: "n8n-selfhost-vps", title: "n8nをVPSでセルフホストする方法", desc: "Outline と他サービスの自動連携" },
  ],
  howToSteps: [
    { name: "VPSと認証プロバイダを準備", text: "4GB以上のVPSを契約し、Slack/Google等でOAuthアプリを作成する。" },
    { name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
    { name: ".envとdocker-compose.ymlを配置", text: "SECRET_KEY、DB認証情報、S3、認証プロバイダ情報を.envに記述する。" },
    { name: "Caddyでリバースプロキシを設定", text: "Caddyfileを作成しドメインに紐付け、Let's EncryptでHTTPS化する。" },
    { name: "起動と初回ログイン", text: "docker compose up -dで起動し、認証プロバイダ経由でログインしてワークスペースを作る。" },
  ],
};

export default function OutlineSelfhostVpsGuide() {
  return <SelfHostGuideTemplate config={config} />;
}

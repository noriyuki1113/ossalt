import { SelfHostGuideTemplate, Cpu, HardDrive, Server, TerminalSquare, type SelfHostGuideConfig } from "@/components/guides/SelfHostGuideTemplate";

const COMPOSE = `# Plane公式の docker-compose.yml の主要サービス（簡略）。
# 実運用では公式リポジトリの setup.sh を使うのが確実です。
services:
  plane-db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: plane
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: plane
    volumes:
      - pgdata:/var/lib/postgresql/data

  plane-redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redisdata:/data

  plane-minio:
    image: minio/minio:latest
    restart: always
    command: server /data --console-address ":9090"
    environment:
      MINIO_ROOT_USER: \${MINIO_USER}
      MINIO_ROOT_PASSWORD: \${MINIO_PASSWORD}
    volumes:
      - miniodata:/data

  plane-api:
    image: makeplane/plane-backend:latest
    restart: always
    depends_on: [plane-db, plane-redis, plane-minio]
    env_file: .env
    expose:
      - "8000"

  plane-web:
    image: makeplane/plane-frontend:latest
    restart: always
    depends_on: [plane-api]
    env_file: .env
    expose:
      - "3000"

volumes:
  pgdata:
  redisdata:
  miniodata:`;

const config: SelfHostGuideConfig = {
  toolName: "Plane",
  replaces: "Jira",
  slug: "plane-selfhost-vps",
  titleSuffix: "Jira代替OSSのプロジェクト管理を自分のサーバーで動かす",
  metaDescription: "Jira代替の人気OSSプロジェクト管理ツール Plane をVPSでセルフホストする手順を解説。PostgreSQL + Redis + MinIOの構成、HTTPS化、運用注意点まで網羅します。",
  heroDescription: "Jira の代替として開発が活発な Plane を、自分のVPSで動かすための構成と運用注意点を解説します。",
  publishedAt: "2026-05-28",
  about: [
    "Jira直接代替を目指すOSSプロジェクト管理。サイクル（スプリント）・モジュール（エピック）・ロードマップに対応。",
    "Linearに近いクリーンなUIで、Jiraより習得しやすい。",
    "Jiraインポーターを内蔵し、既存データを移行できる。",
    "AGPL-3.0ライセンス。セルフホスト版は無料。",
  ],
  whyVps: [
    "Jira の課金から解放され、スプリント管理を内製化できる。",
    "Linear のシンプルさをセルフホストで実現できる。",
    "Issue データを自分の管理下に置ける。",
    "GitHub / GitLab 連携でコード側との行き来もスムーズ。",
  ],
  specs: [
    { icon: Cpu, title: "CPU", desc: "2 vCPU以上。複数サービスを同時に動かすため。" },
    { icon: Server, title: "メモリ", desc: "最低4GB、実運用は8GB以上を推奨。" },
    { icon: HardDrive, title: "ストレージ", desc: "40GB以上のSSD。MinIOの添付ファイル領域も含む。" },
    { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose + PostgreSQL + Redis。" },
  ],
  stack: [
    "VPS（Ubuntu LTS）",
    "Docker / Docker Compose",
    "PostgreSQL（メインDB）",
    "Redis（キャッシュ・キュー）",
    "MinIO（S3互換オブジェクトストレージ）",
    "Plane Backend (Django) + Frontend (Next.js)",
    "リバースプロキシ（Caddy / Nginx）",
    "独自ドメイン + SSL（Let's Encrypt）",
  ],
  composeYaml: COMPOSE,
  composeNote: "Plane は公式リポジトリ (github.com/makeplane/plane) の setup.sh を使うのが確実です。上記は構成イメージで、実際には .env に大量の設定が必要になります。",
  https: {
    domain: "plane.example.com",
    upstream: "plane-web:3000",
    note: "APIへのリクエストもフロントエンド経由でルーティングされるため、リバースプロキシは plane-web のみに向ければOK。MinIO の管理コンソールを公開する場合は別ドメインを推奨。",
  },
  ops: [
    "POSTGRES_PASSWORD・MINIO_PASSWORD・SECRET_KEYは必ず強力なランダム値に変更する",
    "PostgreSQLの定期バックアップ（pg_dump）+ MinIOデータのバックアップを設定する",
    "アップデート時は公式リリースノートを必ず確認（DBマイグレーションが入る）",
    "メール通知を使うならSMTP環境変数を設定する",
    "GitHub / GitLab 連携を使う場合はWebhookエンドポイントを公開する必要がある",
  ],
  faq: [
    { q: "Plane は本番運用に耐えますか？", a: "2026年時点で開発は活発で、中小規模のチームでの本番採用例も増えています。エンタープライズ用途では十分に検証してから導入してください。" },
    { q: "Jiraからデータを移行できますか？", a: "Plane公式のJiraインポーターがあり、Issue・コメント・添付などを移行できます。カスタムフィールド・複雑なワークフローは手動調整が必要です。" },
    { q: "メモリ2GBで動きますか？", a: "起動はできますが実用には厳しいです。最低4GB、推奨8GBを確保してください。" },
    { q: "MinIOの代わりにS3を使えますか？", a: "はい、環境変数でAWS S3やCloudflare R2などS3互換ストレージを指定できます。" },
  ],
  related: [
    { name: "Plane", desc: "本記事の対象ツール", href: "/tools/204" },
    { name: "Jira の代替を比較", desc: "Jira代替OSSをまとめて見る", href: "/alternatives/jira" },
    { name: "Vikunja", desc: "もっとシンプルなタスク管理がいいなら", href: "/tools/213" },
    { name: "Gitea", desc: "コード+Issueを統合したいなら", href: "/tools/453" },
  ],
  relatedGuides: [
    { slug: "vikunja-selfhost-vps", title: "VikunjaをVPSでセルフホストする方法", desc: "もっと軽量なタスク管理OSS" },
    { slug: "outline-selfhost-vps", title: "OutlineをVPSでセルフホストする方法", desc: "Confluence代替のドキュメント共有" },
    { slug: "gitea-selfhost-vps", title: "GiteaをVPSでセルフホストする方法", desc: "コードとIssueを同一プラットフォームで" },
  ],
  howToSteps: [
    { name: "VPSを用意する", text: "8GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
    { name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
    { name: "Plane公式のsetup.shを実行", text: "github.com/makeplane/plane をクローンし、setup.sh で .env を生成する。" },
    { name: "Caddyでリバースプロキシを設定", text: "Caddyfileを作成しドメインに紐付け、Let's EncryptでHTTPS化する。" },
    { name: "起動とワークスペース作成", text: "docker compose up -dで起動し、初回管理者を作成、ワークスペースをセットアップする。" },
  ],
};

export default function PlaneSelfhostVpsGuide() {
  return <SelfHostGuideTemplate config={config} />;
}

import { SelfHostGuideTemplate, Cpu, HardDrive, Server, TerminalSquare, type SelfHostGuideConfig } from "@/components/guides/SelfHostGuideTemplate";

const COMPOSE = `services:
  vikunja:
    image: vikunja/vikunja:latest
    restart: always
    environment:
      VIKUNJA_SERVICE_PUBLICURL: https://tasks.example.com
      VIKUNJA_SERVICE_JWTSECRET: \${JWT_SECRET}
      VIKUNJA_DATABASE_TYPE: sqlite
      VIKUNJA_DATABASE_PATH: /app/vikunja/files/vikunja.db
    volumes:
      - vikunja_files:/app/vikunja/files
    expose:
      - "3456"

volumes:
  vikunja_files:`;

const config: SelfHostGuideConfig = {
  toolName: "Vikunja",
  replaces: "Asana",
  slug: "vikunja-selfhost-vps",
  titleSuffix: "Asana / Todoist代替OSSを軽量に自分のサーバーで動かす",
  metaDescription: "Asana・Todoistの代替として人気のOSSタスク管理ツール Vikunja をVPSでセルフホストする手順を解説。SQLiteで気軽に始められる構成、HTTPS化、CalDAV連携まで紹介します。",
  heroDescription: "Asana や Todoist の代替として注目される軽量OSSタスク管理 Vikunja を、SQLite構成で気軽にセルフホストする方法を解説します。",
  publishedAt: "2026-05-28",
  about: [
    "Go製の軽量OSSタスク管理。リスト・カンバン・ガントなど複数ビューに対応。",
    "Asana / Todoist / Trello からのマイグレーション機能を内蔵。",
    "CalDAVに対応し、Apple Calendar や Thunderbird と同期できる。",
    "SQLiteをデフォルトDBとして使えるため、単一コンテナで起動できる。",
  ],
  whyVps: [
    "Asana や Todoist の有料プランから脱出し、月額コストをVPS代だけに抑えられる。",
    "個人のGTDタスクを自分のサーバーで管理し、データを外部に出さない。",
    "CalDAV経由でカレンダーアプリと連携できる。",
    "Go製で軽量。512MB RAMのVPSでも動く。",
  ],
  specs: [
    { icon: Cpu, title: "CPU", desc: "1 vCPUで十分。" },
    { icon: Server, title: "メモリ", desc: "最低512MB、推奨1GB。" },
    { icon: HardDrive, title: "ストレージ", desc: "10GB SSDで十分。添付ファイルが多ければ拡張。" },
    { icon: TerminalSquare, title: "OS / ランタイム", desc: "Ubuntu LTS + Docker / Docker Compose。" },
  ],
  stack: [
    "VPS（Ubuntu LTS）",
    "Docker / Docker Compose",
    "Vikunja（Dockerコンテナ・SQLite同梱）",
    "リバースプロキシ（Caddy / Nginx）",
    "独自ドメイン + SSL（Let's Encrypt）",
  ],
  composeYaml: COMPOSE,
  composeNote: "JWT_SECRETはランダムな長い文字列を生成して.envに設定してください（例: openssl rand -hex 32）。チームでガッツリ使う場合はSQLiteからPostgreSQLへの切り替えを検討してください。",
  https: {
    domain: "tasks.example.com",
    upstream: "vikunja:3456",
  },
  ops: [
    "VIKUNJA_SERVICE_JWTSECRET は必ず強力なランダム文字列にする",
    "vikunja_files ボリューム（DB + 添付ファイル）を定期バックアップする",
    "Vikunjaは破壊的変更が稀にあるため、アップデート前にCHANGELOGを確認する",
    "公開する場合はサインアップ設定（VIKUNJA_SERVICE_ENABLEREGISTRATION）を見直す",
    "CalDAV接続情報はユーザー設定画面から取得し、HTTPS必須",
  ],
  faq: [
    { q: "SQLiteのままで本番運用できますか？", a: "個人や5人程度までならSQLiteで十分です。それ以上の規模ならPostgreSQLへの切り替えを推奨します。" },
    { q: "Asanaからデータを移行できますか？", a: "Vikunjaには公式の Asana / Todoist / Trello インポート機能があります。プロジェクト設定からインポートできます。" },
    { q: "モバイルアプリはありますか？", a: "iOS / Android 公式アプリがあり、セルフホストインスタンスを設定して利用できます。" },
    { q: "Notion / AppFlowy のようにドキュメントも管理できますか？", a: "Vikunjaはタスク管理に特化しています。ドキュメントもまとめたい場合はAppFlowy、スプリント管理が必要ならPlaneを検討してください。" },
  ],
  related: [
    { name: "Vikunja", desc: "本記事の対象ツール", href: "/alternatives/asana" },
    { name: "Asana の代替を比較", desc: "Asana代替OSSをまとめて見る", href: "/alternatives/asana" },
    { name: "AppFlowy", desc: "Notion代替。ドキュメント+タスク統合", href: "/tools/185" },
    { name: "Plane", desc: "Jira代替。スプリント管理が必要なら", href: "/alternatives/jira" },
  ],
  relatedGuides: [
    { slug: "appflowy-selfhost-vps", title: "AppFlowyをVPSでセルフホストする方法", desc: "Notion代替。ドキュメント中心のワークスペース" },
    { slug: "plane-selfhost-vps", title: "PlaneをVPSでセルフホストする方法", desc: "Jira代替。スプリント管理向け" },
    { slug: "outline-selfhost-vps", title: "OutlineをVPSでセルフホストする方法", desc: "チームのナレッジ共有" },
  ],
  howToSteps: [
    { name: "VPSを用意する", text: "1GB以上のメモリ、Ubuntu LTSのVPSを契約する。" },
    { name: "Docker / Docker Composeをインストール", text: "公式手順に従いDocker EngineとComposeプラグインをインストールする。" },
    { name: "docker-compose.ymlを配置", text: "本記事のSQLite構成例をベースに JWT_SECRET を設定する。" },
    { name: "Caddyでリバースプロキシを設定", text: "Caddyfileでドメインに紐付け、Let's EncryptでHTTPS化する。" },
    { name: "アカウント作成とインポート", text: "ブラウザでアクセスしユーザー登録、Asana等からデータをインポートする。" },
  ],
};

export default function VikunjaSelfhostVpsGuide() {
  return <SelfHostGuideTemplate config={config} />;
}

---
type: decision-axis
slug: self-host-difficulty
name: セルフホスト難易度
last_reviewed: 2026-04-09
---

# セルフホスト難易度

## 一言定義

OSS ツールを自前サーバーで運用する際の導入・維持コストの総量。「できるか」ではなく「チームが継続して運用できるか」を問う軸。

## なぜ重要か

OSS 代替を選ぶ最大の動機の一つがセルフホストだが、導入できても運用が続かなければ意味がない。難易度を過小評価して移行したが運用負荷に耐えられず SaaS に戻るケースは多い。ossalt ではこの軸を正直に示すことで、ユーザーの意思決定ミスを減らす。

セルフホスト難易度を構成する要素：
- **依存コンポーネント数**（DB・キャッシュ・オブジェクトストレージ・メール等）
- **初期構成の複雑さ**（環境変数・証明書・認証設定）
- **バージョンアップの頻度と破壊的変更リスク**
- **障害時の調査難易度**
- **公式ドキュメントの充実度**

## この軸で差が出るツール群

| 難易度 | ツール | 理由 |
|---|---|---|
| 低 | Vikunja | SQLite バンドル、単一バイナリ、Docker 1コマンド |
| 低 | NocoDB | SQLite デフォルト、設定 UI から DB 接続 |
| 低〜中 | Mattermost | PostgreSQL + Mattermost のシンプル2層構成 |
| 中 | Penpot | PostgreSQL + Redis + MinIO が必要 |
| 中 | Outline | PostgreSQL + Redis + S3互換が必要 |
| 中 | Plane | PostgreSQL + Redis + MinIO + Celery が必要 |
| 中〜高 | AppFlowy Cloud | PostgreSQL + Redis + MinIO + Gotrue + 複数マイクロサービス |
| 高 | Rocket.Chat | MongoDB + 多数の設定項目・プラグイン管理 |

## ossaltでの使い方

各ツールページの「セルフホスト難易度」セクションで低・中・高を明示し、必要なコンポーネントを列挙する。「低」は月1時間以下の運用工数、「中」は月数時間、「高」は専任担当が必要な目安として使う。

ユーザーが「セルフホストしたい」と言っても、実際には以下を確認する必要がある：
1. Docker/Kubernetes の運用経験があるか
2. サーバー・ドメイン・証明書の管理ができるか
3. 障害時に自分で調査できるか、またはできる人がチームにいるか

この3つすべて YES なら難易度「中」まで現実的。1つでも NO なら「低」か SaaS のままを推奨する。

## 関連ページ

- `wiki/decision-axes/ops-burden.md` — 運用負荷の継続コスト
- `wiki/tools/vikunja.md` — 難易度「低」の代表例
- `wiki/tools/mattermost.md` — 難易度「低〜中」の代表例
- `wiki/tools/plane.md` — 難易度「中」の代表例

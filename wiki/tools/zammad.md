---
type: tool
slug: zammad
name: Zammad
category: customer-support
github: https://github.com/zammad/zammad
stars: 4500
language: Ruby / CoffeeScript
last_commit: 2026-03-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - zendesk
related_tools:
  - chatwoot
---

# Zammad

## 一言定義

メール中心の本格的なヘルプデスク OSS。SLA 管理・エスカレーション・カスタムチケットフォーム・ナレッジベースを持ち、Zendesk のチケット管理に最も近い機能セットを提供する。

## Positioning

Zammad は 2016 年にドイツで生まれた OSS ヘルプデスクツール。AGPL-3.0 ライセンス、GitHub スター 4,500 超。「Zendesk に最も近い機能を持つ OSS」として、チケット管理・SLA・エスカレーション・ナレッジベース・レポートを統合する。ドイツ生まれのため GDPR 対応・データ所有権への意識が高く、欧州での採用が多い。SaaS 版（zammad.com）とセルフホスト版の両方を提供。

## 強み

- **本格的なチケット管理**: SLA 定義・エスカレーション・カスタムワークフロー・優先度管理
- **マルチチャンネル**: メール・電話（VoIP）・チャット・Twitter・Facebook をチケット化
- **ナレッジベース**: FAQ・ドキュメントの公開ポータルを内蔵
- **詳細なレポート**: チケット数・解決時間・SLA 達成率のレポートダッシュボード
- **GDPR 対応**: データ居住地要件・個人情報の削除リクエスト対応
- **高いカスタマイズ性**: カスタムフィールド・カスタムビュー・カスタムトリガー

## 弱み・注意点

- **リアルタイムチャットは弱い**: Chatwoot のような Webサイトチャットウィジェットは限定的
- **UI がやや古め**: Chatwoot の方がモダンな UI
- **AGPL-3.0**: SaaS として外部提供する場合はソース公開義務
- **セットアップが複雑**: Rails + Elasticsearch + PostgreSQL + Redis の複雑なスタック
- **コミュニティが小さい**: GitHub スター 4,500 は Chatwoot の 1/5
- **日本語コミュニティが小さい**: 日本語ドキュメント・記事が少ない

## どんなユーザーに向くか

- **メールベースのヘルプデスクが中心**: カスタマーからのメールを効率よくチケット管理したい
- **SLA 管理が必要**: 応答時間・解決時間のSLA を設定して追跡したい
- **Zendesk の機能を OSS で再現したい**: Zendesk からの機能移行を重視するケース
- **GDPR / データ所有権への要件がある**: 欧州規制・国内サーバー要件がある組織
- **電話（VoIP）連携が必要**: コールセンター機能と連携したヘルプデスク

## セルフホスト難易度

**高め**。Ruby on Rails + Elasticsearch + PostgreSQL + Redis + Memcached のマルチコンポーネント構成。公式 Docker Compose が提供されているが、本番環境の構築は複雑。最低 4GB RAM（推奨 8GB+）。Elasticsearch の運用負荷が高く、専任の技術者が必要。

## 日本語圏での採用状況

日本語圏での認知度は低い。Qiita・Zenn の記事数も少なく、実際の採用事例の報告はほぼない。ドイツ・欧州での採用が中心で、日本市場への浸透は限定的。日本語 UI パックは存在するが、ドキュメントの日本語化は進んでいない。

## ossaltにおける推薦文脈

Zendesk 代替として「メールベースのチケット管理・SLA 管理が主目的」のユーザーへの第 2 候補として位置づける（第 1 候補は Chatwoot）。「Zendesk の SLA・エスカレーション機能を OSS で再現したい」「GDPR / データ所有権への対応が必要」という明確な要件がある場合に Zammad を推薦。セットアップの複雑さと日本語情報の少なさを必ず前置きする。

## Open questions

- Zammad の Elasticsearch 依存を取り除く方向の開発計画（運用負荷軽減）
- Zammad の LINE / ChatWork 等の日本向けチャンネル統合の有無
- 日本企業での Zammad 採用事例の収集
- Chatwoot vs Zammad の選択基準の整理（「チャット重視か、チケット管理重視か」が主因か）

## Evidence sources

- https://zammad.org/
- https://github.com/zammad/zammad

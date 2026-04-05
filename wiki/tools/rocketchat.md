---
type: tool
slug: rocketchat
name: Rocket.Chat
category: team-communication
github: https://github.com/RocketChat/Rocket.Chat
stars: 41000
language: TypeScript
last_commit: 2026-04-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - slack
related_tools:
  - mattermost
  - zulip
---

# Rocket.Chat

## 一言定義

チャット・ビデオ通話・ライブチャット・オムニチャンネル（カスタマーサポート）を統合した多機能オープンソースコミュニケーションプラットフォーム。Slack 代替にとどまらず、**カスタマーサポート基盤まで含めた統合コミュニケーションハブ**として使える点が独自の強み。

## Positioning

Rocket.Chat は Slack 的なチーム内チャットと、カスタマーサポート向けオムニチャンネル（メール・WhatsApp・Instagram・Web チャット等を統合）の両方を提供する。単純な Slack 代替というより、**「社内コミュニケーション + 顧客対応を一つの OSS で統合したい」** というニーズに応える候補として位置づけるのが正確。

MIT ライセンスで、GitHub スター 4.1 万超と 3 候補中最大規模のコミュニティを持つ。クラウド版（Rocket.Chat SaaS）とセルフホスト版の両方を提供している。[Source](https://www.rocket.chat/)

## 強み

- **オムニチャンネル機能**: メール・WhatsApp・Instagram・Facebook・Telegram・Web ライブチャットなどの顧客接点を一元管理できる。カスタマーサポートチームがいる組織では Slack + 問い合わせ管理ツールを一本化できる可能性がある。
- **豊富な機能セット**: チャット・DM・チャンネル・スレッド・ビデオ通話（Jitsi / BigBlueButton 連携）・ファイル共有・画面共有・ボット・Webhook が揃う。
- **MIT ライセンス**: 商用利用・フォーク・組み込みに制約なし。
- **高い認知度**: GitHub スター 4.1 万超で 3 候補中最大。コミュニティ・プラグイン・テーマが豊富。[Source](https://github.com/RocketChat/Rocket.Chat)
- **豊富なインテグレーション**: GitHub / GitLab / Jira / Google Drive / Zapier / Make 等の連携が整備されている。
- **E2E 暗号化**: ダイレクトメッセージの E2E 暗号化をサポート。

## 弱み・注意点

- **UI の複雑さ**: 機能が多い分、UI が Slack と比べて複雑で、非エンジニアへの展開時に学習コストが高い。
- **セルフホストのリソース要件**: Mattermost や Zulip と比べてサーバーリソースを多く消費する傾向があり、小規模チームには過剰になりやすい。
- **アップデートの複雑さ**: 機能追加が多い分、アップデート時の互換性確認・マイグレーション管理が必要。
- **Slack UX からの乖離**: Mattermost ほど Slack に近くはなく、「Slack 移行先」としての UX 学習コストは中程度。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| 社内チャット + カスタマーサポートを一元化したい | オムニチャンネル機能が標準搭載 |
| 機能の豊富さを重視するチーム | ビデオ通話・ライブチャット・豊富な連携が揃う |
| 大規模組織でのセルフホストを検討している | コミュニティ・実績が 3 候補中最大 |
| 顧客対応 + チーム内コミュニケーションをひとつに統合したい | 競合なしの機能領域 |

純粋な Slack 代替（社内チャットのみ）が目的なら、Mattermost の方がシンプルで移行しやすい。

## セルフホスト難易度

**中〜高程度**。

- Docker Compose でのセットアップが可能だが、設定項目が多くデフォルト設定の理解が必要。
- MongoDB を使用しており、PostgreSQL ベースの Mattermost と異なる運用知識が必要。
- オムニチャンネル機能を使う場合は追加の外部連携設定が必要。
- サーバーリソースは中規模以上（推奨 2GB RAM 以上）が必要。

## 日本語圏での採用状況

Zenn・Qiita に導入記事は存在するが、Mattermost と比べると少ない。カスタマーサポート用途での採用事例が目立つ傾向があり、純粋な Slack 代替としての採用よりも「チャット + サポート統合」のニーズでの採用が多い印象。

グローバルでは政府・医療・金融機関での採用実績があり、コンプライアンス要件のある大規模組織での利用が目立つ。

## ossaltにおける推奨文脈

Rocket.Chat を推薦すべき文脈：

1. **「社内チャットとカスタマーサポート（ライブチャット・問い合わせ対応）を一つのツールにしたい」** — 他の候補にはない独自の価値。
2. **「Slack + 問い合わせ管理ツールのコストをまとめて削減したい」** — オムニチャンネルで統合できる可能性。
3. **「機能の豊富さを最優先でセルフホストしたい」** — 3 候補中最多機能。

Rocket.Chat を推薦しにくい文脈：

- シンプルな Slack 代替が目的（Mattermost の方が適切）
- 小規模チームでリソース制約がある場合
- IT 非専門チームへの展開（UI 複雑さが障壁）

## Open questions

- Rocket.Chat のオムニチャンネル機能を実際に業務導入している日本語圏の事例
- MongoDB 運用コストと PostgreSQL（Mattermost）の運用コストの実際の差
- Rocket.Chat vs Mattermost の選択において決め手になっているファクターの分析

## Evidence sources

- https://www.rocket.chat/
- https://github.com/RocketChat/Rocket.Chat

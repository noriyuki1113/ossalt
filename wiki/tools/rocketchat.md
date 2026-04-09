---
type: tool
slug: rocketchat
name: Rocket.Chat
category: team-communication
github: https://github.com/RocketChat/Rocket.Chat
stars: "41k"
stars_num: 41000
language: TypeScript
last_commit: 2026-04-06
license: MIT (Community) / Commercial (Enterprise)
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 3
replaces:
  - slack
related_tools:
  - mattermost
  - zulip
---

# Rocket.Chat

## 一言定義

多機能 OSS チャットプラットフォーム。Slack 代替としてオムニチャンネル・カスタマーサポート用途に強い。

## 主な機能

- チャンネルメッセージング・DM・スレッド
- 音声/ビデオ通話（内蔵）
- オムニチャンネル（メール・SMS・WhatsApp・Instagram 等の統合）
- LiveChat（Webサイト埋め込みチャット）
- マーケットプレイス（アプリ・プラグイン）
- LDAP / SAML / OAuth 認証
- E2E 暗号化
- Federation（別サーバーとのメッセージ連携）

## Positioning

Mattermost・Zulip と並ぶ Slack 代替の代表格だが、「チーム内チャット」に特化した Mattermost とは異なり、「外部との通信チャネルの統合」が最大の特徴。カスタマーサポートチームや、顧客・パートナーとのコミュニケーションを一元管理したい組織に向く。機能が多い分、管理の複雑さもトレードオフ。 [Source](https://www.rocket.chat/)

## 強み

- オムニチャンネル機能（メール・SMS・各種 SNS を一元管理）は Mattermost にない強み
- LiveChat でウェブサイトへの埋め込みチャットが可能
- E2E 暗号化・Federation など高いセキュリティ・プライバシー機能
- stars 4万超の大きなコミュニティ

## 弱み・注意点

- MongoDB 依存のため、PostgreSQL 系ツールより運用が重い
- 機能が多い分、初期設定が複雑で管理画面の学習コストが高い
- Enterprise 機能の範囲が拡大しており、OSS 版の機能が絞られつつある懸念
- 大規模インスタンスではリソース消費が多い

## どんなユーザーに向くか

- **カスタマーサポートチーム：** 外部顧客との複数チャネル（メール・チャット・SNS）を一元管理したい場合
- **セキュリティ要件が高い組織：** E2E 暗号化・自社データ保持が必須の企業・官公庁
- **外部パートナーとのコラボレーション：** Federation で他組織とのメッセージ連携が必要な場合

## セルフホスト難易度

**難易度：** 中〜高

MongoDB が必要なため PostgreSQL 系ツールより構成が重い。メモリ消費が多く、最低 2GB RAM 推奨。

```bash
# Docker Compose での起動例
git clone https://github.com/RocketChat/Docker.Official.Image
cd Docker.Official.Image
docker compose up -d
```

詳細は [公式インストールガイド](https://docs.rocket.chat/deploy/deploy-rocket.chat) を参照。

## 日本語圏での採用状況

日本でのコミュニティは比較的活発で、Qiita・Zenn での導入記事が存在する。金融・医療・官公庁系での採用事例がある。Mattermost より設定の自由度が高いため、特殊な要件がある組織での採用が多い印象。

## ossaltにおける推奨文脈

`wiki/saas/slack.md` から「カスタマーサポート・オムニチャンネル用途」のユーザーへの候補として紹介する。純粋なチーム内チャットなら Mattermost の方がシンプルという分岐を明示する。

## Open questions

- OSS 版（Community）と Enterprise 版の機能差の最新状況（2026年時点）
- オムニチャンネル機能の実用性（日本の SNS・メールサービスとの連携実績）
- MongoDB から PostgreSQL への移行計画があるか

## Evidence sources

- https://www.rocket.chat/
- https://github.com/RocketChat/Rocket.Chat
- https://docs.rocket.chat/deploy/deploy-rocket.chat

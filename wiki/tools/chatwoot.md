---
type: tool
slug: chatwoot
name: Chatwoot
category: customer-support
github: https://github.com/chatwoot/chatwoot
stars: 22000
language: Ruby / Vue.js
last_commit: 2026-04-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - zendesk
  - intercom
related_tools:
  - zammad
---

# Chatwoot

## 一言定義

リアルタイムチャット・オムニチャンネル統合を重視した OSS カスタマーサポートツール。WhatsApp / Instagram / Twitter / メール / ライブチャットウィジェットを一つのインターフェースで管理できる。

## Positioning

Chatwoot は 2020 年にオープンソース化されたカスタマーサポート OSS。MIT ライセンス、GitHub スター 2.2 万超。Intercom に近い「リアルタイムチャット中心のサポートツール」として、チャットウィジェット・オムニチャンネル統合・チームコラボレーションが特徴。SaaS 版（chatwoot.com）とセルフホスト版の両方を提供。Zendesk よりシンプルだが、リアルタイムコミュニケーションに特化している。

## 強み

- **オムニチャンネル統合**: メール・ライブチャット・WhatsApp Business API・Twitter・Instagram・Facebook を一つの画面で管理
- **モダンな UI**: クリーンで使いやすいエージェントダッシュボード
- **チャットウィジェット**: Webサイトへのチャットウィジェット埋め込みが簡単
- **MIT ライセンス**: 商用利用・SaaS 組み込みに制限なし
- **チームコラボレーション**: 会話のアサイン・メモ・ラベル・チームインボックス
- **自動化ルール**: 基本的な自動返信・アサイン・ラベル付けの自動化

## 弱み・注意点

- **チケット管理の深さ**: Zendesk の SLA 管理・エスカレーション・複雑なワークフローには届かない
- **AI 機能が限定的**: Zendesk AI のようなチケット分類・自動返信の AI は基本的なものに限られる
- **エンタープライズ機能は有料**: 高度な権限管理・カスタムロール・レポートは Pro/Business プラン
- **電話サポートなし**: 電話チャンネルの統合は持たない（Zendesk の電話チャンネルに相当する機能がない）
- **WhatsApp 統合のコスト**: WhatsApp Business API は Meta のパートナープロバイダー経由で別途費用が発生

## どんなユーザーに向くか

- **ライブチャット+メール統合が中心**: Webサイトのチャットウィジェットとメールサポートを統合したい中小企業
- **SNS サポートを統合したい**: WhatsApp・Instagram・Twitter でのカスタマー対応を一元管理したい
- **Intercom 代替**: Intercom のリアルタイムチャット機能を OSS で代替したい
- **Zendesk を使いこなせていないチーム**: Zendesk の複雑さが不要で、シンプルなサポートツールが欲しい
- **スタートアップの最初のサポートツール**: 初めてカスタマーサポートツールを導入する小規模チーム

## セルフホスト難易度

**中程度**。Docker Compose でのセットアップが整備されており、PostgreSQL + Redis + Chatwoot のマルチコンテナ構成。最低 2GB RAM（推奨 4GB+）。公式ドキュメントが充実しており、1〜2 時間でセットアップ可能。WhatsApp Business API の設定は Meta パートナー経由で別途手続きが必要。

## 日本語圏での採用状況

日本語圏での認知度は上昇中。Qiita・Zenn に導入記事が存在する。カスタマーサポートツールとして Zendesk 代替を探している中小企業・スタートアップでの採用事例が報告されている。日本語 UI は部分的に対応している。SNS（LINE）対応がないことが日本市場での制約になっている。

## ossaltにおける推薦文脈

Zendesk / Intercom 代替として **リアルタイムチャット・オムニチャンネル統合を重視するユーザーへの第一候補**。「Webサイトのチャットウィジェット+メール+SNS を一元管理したい」スタートアップ・中小企業への推薦に最適。本格的なチケット管理（SLA・エスカレーション）が必要な場合は Zammad を第 2 候補として提示。

## Open questions

- Chatwoot の LINE チャンネル統合の対応状況（日本市場での重要性）
- WhatsApp Business API 統合の実際のセットアップコストと月額費用
- Chatwoot の AI 機能（GPT 統合・自動返信）の充実度
- Zendesk から Chatwoot への移行時の会話データ移行ツールの有無

## Evidence sources

- https://www.chatwoot.com/
- https://github.com/chatwoot/chatwoot

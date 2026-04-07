---
type: tool
slug: mautic
name: Mautic
category: email-marketing
github: https://github.com/mautic/mautic
stars: 7500
language: PHP (Symfony)
last_commit: 2026-03-01
license: GPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - mailchimp
  - hubspot
related_tools:
  - listmonk
---

# Mautic

## 一言定義

OSS マーケティングオートメーションプラットフォーム。メール配信に加え、セグメント・ドリップシーケンス・リードスコアリング・フォーム・ランディングページ・A/B テストを統合し、HubSpot Marketing Hub に最も近い OSS 代替。

## Positioning

Mautic は 2014 年に登場した OSS マーケティングオートメーションツール。Acquia が買収後（2019 年）、2021 年にオープンソースコミュニティに戻された。GPL-3.0 ライセンス、GitHub スター 7,500 超。「Mailchimp の代替」というより「HubSpot Marketing Hub の OSS 代替」としての性格が強く、マーケティングオートメーション全般をカバーする。

## 強み

- **マーケティングオートメーション**: ビジュアルなワークフロービルダーでドリップシーケンス・行動トリガーを設定できる
- **リードスコアリング**: フォーム送信・メール開封・Webサイト訪問等でリードをスコアリング
- **フォーム・ランディングページ**: 内蔵のフォームビルダーとランディングページエディタ
- **セグメント**: 複数条件でのリストセグメント・動的セグメント
- **A/B テスト**: メールのA/B テスト機能
- **CRM 統合**: Salesforce / HubSpot / SuiteCRM との統合
- **多チャンネル**: メール + SMS（設定による）+ ソーシャルメディア対応

## 弱み・注意点

- **セットアップが複雑**: PHP + MySQL + Cron ジョブの設定が必要。メール送信は非同期処理
- **UI が古め**: 2014 年設計の UI でモダン感に欠ける
- **パフォーマンス**: 大量の連絡先（10 万件以上）ではパフォーマンスチューニングが必要
- **メンテナンス負荷**: Cron ジョブのチューニング・キャッシュ管理が必要
- **GPL-3.0**: ライセンス上の注意が必要な場合がある
- **日本語コミュニティが小さい**: 日本語の情報・記事が少ない

## どんなユーザーに向くか

- **マーケティングオートメーションが必要**: Listmonk では不十分で、ドリップ・行動トリガー・スコアリングが必要
- **HubSpot Marketing Hub の代替**: HubSpot の月額を削減したいが、マーケティング機能を維持したい
- **フォーム・ランディングページ統合**: メール + フォーム + LP を一元管理したい
- **CRM との連携**: SuiteCRM / HubSpot との統合が必要
- **技術者がいる組織**: PHP・Cron 設定ができるエンジニアがいる

## セルフホスト難易度

**高め**。PHP + MySQL + Web サーバー（Apache/nginx）+ Cron ジョブの設定が必要。Docker Compose での構築も可能だが、本番運用には Cron ジョブのチューニング・キャッシュ設定・メール送信キューの管理が必要。最低 2GB RAM（推奨 4GB+）。

## 日本語圏での採用状況

日本語圏での認知度は低く、採用事例の報告も少ない。マーケティングオートメーション自体の普及が Mailchimp よりも低いため、「Mautic を試した」という事例は限られる。日本語 UI は部分対応。

## ossaltにおける推薦文脈

Mailchimp 代替として **マーケティングオートメーションが必要なユーザーへの第 2 候補**（第 1 候補は Listmonk）。「ドリップシーケンス・セグメント・行動トリガーが必要で、HubSpot は高すぎる」という場合に推薦。また HubSpot からの CRM 移行（Twenty/SuiteCRM）と組み合わせて「CRM + メール配信の OSS スタック」として提案できる。

## Open questions

- Mautic の大規模（10 万件以上）での安定運用のチューニング方法
- Listmonk vs Mautic の選択基準（「マーケティングオートメーション必要度」だけが主因か）
- Mautic のコミュニティ状況（Acquia 離脱後の開発ペース）
- Twenty + Mautic の組み合わせで HubSpot を代替した事例

## Evidence sources

- https://www.mautic.org/
- https://github.com/mautic/mautic

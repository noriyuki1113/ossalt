---
type: tool
slug: suitecrm
name: SuiteCRM
category: crm
github: https://github.com/salesagility/SuiteCRM
stars: 4500
language: PHP
last_commit: 2026-02-01
license: GPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - hubspot
  - salesforce
related_tools:
  - twenty
---

# SuiteCRM

## 一言定義

SugarCRM のコミュニティフォークとして誕生した高機能 OSS CRM。コンタクト・アカウント・商談・見積・メールキャンペーン・レポートを網羅した「フル機能 CRM」として、HubSpot の機能セットを最も広くカバーする。

## Positioning

SuiteCRM は 2013 年に SugarCRM Community Edition のフォークとして誕生した。SalesAgilty 社が開発・維持しており、GPL-3.0 ライセンスのオープンソース版と商用サポート版を提供。コンタクト管理・商談（Opportunities）・見積・請求書・ワークフロー・メールキャンペーン・レポートと HubSpot / Salesforce に近い機能の幅広さを持つ。一方で UI は 2010 年代設計で古く、Twenty のようなモダン感はない。

## 強み

- **フル機能 CRM**: コンタクト・リード・商談・見積・請求書・メールキャンペーン・ワークフロー・レポートを統合
- **Salesforce に近い機能セット**: カスタムモジュール・カスタムフィールド・ワークフロー自動化
- **GPL-3.0 で完全無料のセルフホスト**: ライセンス費用なしでフル機能を利用可能
- **長い実績**: 2013 年から 10 年以上の運用実績があり安定性が高い
- **メールキャンペーン機能**: ニュースレター・ドリップキャンペーンが標準装備
- **カスタムモジュール**: 業務に合わせてデータモデルを拡張できる

## 弱み・注意点

- **UI が古い**: 2010 年代の設計でモダン感がなく、Twenty のような快適な操作感はない
- **セットアップが複雑**: PHP + MySQL + Apache/Nginx の従来型 LAMP スタックで、Docker 対応は公式サポートが限定的
- **学習コストが高い**: 機能が多く、使いこなすまでに時間がかかる
- **モバイル対応が弱い**: モバイルアプリがなく、ブラウザ表示もモバイル最適化が不十分
- **コミュニティが小さい**: GitHub スター 4,500 は Twenty の 1/5 程度で、コミュニティ規模は小さい
- **日本語化は限定的**: 日本語パックが存在するが完全ではない

## どんなユーザーに向くか

- **フル機能 CRM が必要で OSS を選びたい**: メールキャンペーン・ワークフロー・レポートが必要で、Twenty ではカバーできない
- **Salesforce からの移行（機能維持優先）**: Salesforce の機能を OSS で再現したい場合の最も近い選択肢
- **PHP 環境がある組織**: 既存の LAMP スタックに追加できる
- **長期的な安定性を重視**: モダン感より実績・安定性を優先するケース

## セルフホスト難易度

**高め**。PHP + MySQL + Apache/Nginx の従来型スタック。公式 Docker イメージはあるが、設定が複雑で本番環境の構築に時間がかかる。最低 2GB RAM（推奨 4GB+）。初期設定・データインポート・カスタマイズに技術者が必要。

## 日本語圏での採用状況

日本語コミュニティは小さく、Qiita・Zenn の記事数も少ない。CRM 導入を検討する日本企業では Salesforce・HubSpot・Zoho CRM（有料）が選ばれることが多く、SuiteCRM の採用は限定的。日本語パックが存在するため、言語の障壁は Twenty より低い。

## ossaltにおける推薦文脈

HubSpot 代替として「フル機能 CRM が必要で、Twenty の機能では不足する」ケースへの第 2 候補として位置づける。メールキャンペーン・ワークフロー・請求書管理が必要な場合は SuiteCRM が Twenty より適している。UI の古さと設定の複雑さを必ず前置きし、「モダン感より機能を優先する」チームへの推薦に絞る。

## Open questions

- SuiteCRM の Docker 対応の改善状況（2026 年時点）
- SuiteCRM の日本語パックの完成度と日本語コミュニティの活発度
- Twenty が成熟した場合の SuiteCRM との棲み分け（機能差が埋まるか）
- SugarCRM と SuiteCRM の機能差の最新状況

## Evidence sources

- https://suitecrm.com/
- https://github.com/salesagility/SuiteCRM

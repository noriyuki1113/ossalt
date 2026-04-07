---
type: saas
slug: hubspot
name: HubSpot
category: crm
status: active
priority: high
pain_points:
  - monthly-cost
  - free-tier-limitations
  - vendor-lock-in
  - data-ownership
  - pricing-complexity
decision_axes:
  - crm-feature-depth
  - marketing-automation
  - self-host-difficulty
  - data-portability
  - ops-burden
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - twenty
  - suitecrm
related_category_pages:
  - wiki/categories/crm.md
related_comparison_pages:
  - wiki/comparisons/hubspot-vs-twenty.md
  - wiki/comparisons/hubspot-vs-suitecrm.md
---

# HubSpot

## Summary

HubSpot は CRM・マーケティングオートメーション・セールス・カスタマーサービスを統合した SaaS プラットフォーム。無料 CRM で広く普及しているが、実用的な機能を使うと有料プランへの移行が避けられず、コストが急上昇する「フリーミアムトラップ」で知られる。ossalt では **無料枠の制限・コスト爆増・データ所有権** を主な動機として、Twenty / SuiteCRM との比較起点として扱う。

## Why it matters for ossalt

HubSpot は「無料で始めて高額になる」代表的な SaaS。スタートアップが無料 CRM として使い始め、成長とともにコストが急増するパターンが多い。OSS 代替（特に Twenty）が「HubSpot の代替」として台頭しており、「コンタクト管理・パイプライン管理が必要だが HubSpot は高すぎる」という需要が明確に存在する。

## How HubSpot is positioned

HubSpot は「インバウンドマーケティングプラットフォーム」として、CRM・Marketing Hub・Sales Hub・Service Hub・CMS Hub を統合した包括的なビジネスプラットフォームへ進化。AI 機能（HubSpot AI）を追加し、CRM データを活用した AI セールス・マーケティング自動化を強化している。

## Why users look for alternatives

- **コストの急増**: 無料プランは機能制限が厳しく、Starter $20/人/月〜、Professional $890/月〜（2 ユーザー含む）と価格が急上昇
- **フリーミアムトラップ**: 無料版で顧客データを蓄積した後、有料機能が必要になった時点でコストが一気に上がる
- **データ所有権**: 顧客データが HubSpot のクラウドに保管されることへの懸念
- **機能の過剰**: 中小企業には必要のない機能が多く、「高いのに使い切れていない」状態になりやすい
- **連絡先数での課金**: 連絡先数が増えると課金が増加するモデルへの不満

## What ossalt should help users decide

1. コンタクト管理・セールスパイプライン管理だけなら Twenty のノーコード CRM で十分か
2. マーケティングオートメーションが必要かどうか（OSS 代替での再現は難しい）
3. セルフホストでデータを管理したいか
4. 既存の HubSpot データの移行・エクスポートの容易さ

## Core decision axes

### 1. CRM feature depth

Twenty は CRM の基本機能（コンタクト・会社・パイプライン・タスク・メモ）を提供。HubSpot のシーケンス・マーケティングオートメーション・レポーティングには届かない。SuiteCRM は HubSpot に近い機能セットを持つが、UI が古い。

### 2. Marketing automation

HubSpot のマーケティングオートメーション（メール配信・フォーム・ランディングページ・ワークフロー）は OSS 代替では完全再現が難しい。「CRM だけ」なら Twenty で代替できるが、「マーケティングオートメーションも」という場合は OSS の組み合わせ（Mautic 等）が必要。

### 3. Data portability

HubSpot はコンタクトの CSV エクスポートは可能。ただし、ワークフロー・シーケンス・メールテンプレートは移行できない。Twenty は GraphQL API でデータにフルアクセスできる。

## Candidate families

### Twenty
Salesforce / HubSpot 代替を目指す新世代 OSS CRM。Notion ライクなモダン UI・GraphQL API・カスタムオブジェクトが特徴。MIT ライセンス。GitHub スター 2.2 万超（急成長中）。

### SuiteCRM
SugarCRM のコミュニティフォーク。コンタクト・アカウント・商談・見積・メールキャンペーン・レポートを網羅した高機能 CRM。HubSpot の機能を最も広くカバーするが、UI が古い。GPL-3.0。

## Suggested related wiki pages

- `wiki/tools/twenty.md`
- `wiki/tools/suitecrm.md`
- `wiki/comparisons/hubspot-vs-twenty.md`
- `wiki/comparisons/hubspot-vs-suitecrm.md`
- `wiki/categories/crm.md`

## Open questions

- Twenty の成熟度が HubSpot の中小企業ユースケースを満たすレベルに達しているか
- HubSpot の日本語対応状況と日本市場でのシェア
- SuiteCRM の日本語化状況と日本語コミュニティの活発度
- マーケティングオートメーション（Mautic 等）との組み合わせで HubSpot を完全代替できるか

## Evidence sources

- https://www.hubspot.com/pricing
- https://twenty.com/
- https://suitecrm.com/

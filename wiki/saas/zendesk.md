---
type: saas
slug: zendesk
name: Zendesk
category: customer-support
status: active
priority: medium
pain_points:
  - monthly-cost
  - vendor-lock-in
  - pricing-complexity
  - data-ownership
  - feature-bloat
decision_axes:
  - ticket-management-depth
  - omnichannel-support
  - self-host-difficulty
  - ai-automation
  - ops-burden
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - chatwoot
  - zammad
related_category_pages:
  - wiki/categories/customer-support.md
related_comparison_pages:
  - wiki/comparisons/zendesk-vs-chatwoot.md
  - wiki/comparisons/zendesk-vs-zammad.md
---

# Zendesk

## Summary

Zendesk はカスタマーサポート・ヘルプデスクの事実標準 SaaS。チケット管理・メール・チャット・電話・SNS を統合したオムニチャンネルサポートプラットフォーム。ossalt では **高額なコスト・機能過剰・データ所有権** を主な動機として、Chatwoot / Zammad との比較起点として扱う。

## Why it matters for ossalt

Zendesk は「小規模では高すぎ、大規模では必要な機能の半分しか使わない」という声が多い。OSS 代替（Chatwoot / Zammad）がチケット管理の基本機能をカバーしており、「メール・チャット・ソーシャルを統合したヘルプデスクが欲しいが Zendesk は高い」という中小企業・スタートアップの需要に応えられる。

## How Zendesk is positioned

Zendesk は AI ファーストのカスタマーサービスプラットフォームとして進化しており、Zendesk AI（チケット分類・自動返信・エージェント支援）を全面に打ち出している。Sunshine Platform（カスタムオブジェクト・API 拡張）でエンタープライズカスタマイズにも対応。

## Why users look for alternatives

- **コスト**: Suite Team $55/エージェント/月〜、Suite Professional $115/エージェント/月〜。10 人チームで月 55〜115 万円
- **Agent ライセンス数による課金**: 問い合わせ量に関わらずエージェント数で課金されるため、スタッフが多いと高額になる
- **機能の複雑さ**: 使いこなせない機能が多く、「高いのに基本機能しか使っていない」ケースが多い
- **データ所有権**: 顧客とのやり取りデータが Zendesk のクラウドに保管されることへの懸念
- **価格改定リスク**: 過去に大幅な価格改定が行われており、ベンダー依存リスクがある

## What ossalt should help users decide

1. メール・チャット統合だけなら Chatwoot でカバーできるか
2. 既存のメールベースのサポートを Zammad に移行できるか
3. AI 自動返信・チケット分類が必要かどうか（OSS での再現難度）
4. セルフホストでサポートデータを管理したいか

## Core decision axes

### 1. Ticket management depth

Zendesk のチケット管理は SLA・エスカレーション・自動トリガー・マクロ・カスタムビューと非常に高機能。Chatwoot はリアルタイムチャット中心でシンプルなチケット管理。Zammad はメール中心の本格的なチケット管理（SLA・エスカレーション対応）を持ち、Zendesk に最も近い。

### 2. Omnichannel support

Zendesk はメール・チャット・電話・Twitter/X・Instagram・WhatsApp を統合。Chatwoot はメール・チャット・WhatsApp・Twitter・Facebook などのオムニチャンネルに対応（Rocket.Chat に近い思想）。Zammad はメール中心でチャット連携は限定的。

### 3. AI automation

Zendesk AI はチケット分類・優先度付け・自動返信・エージェント提案を提供。OSS 代替での AI 機能は限定的で、Chatwoot・Zammad は基本的な自動返信ルール程度。AI サポート自動化が必要な場合は Zendesk の優位性が大きい。

## Candidate families

### Chatwoot
リアルタイムチャット・オムニチャンネル統合を重視した OSS カスタマーサポートツール。WhatsApp / Instagram / Twitter / メール / チャットウィジェットを統合。モダンな UI と使いやすさが強み。MIT ライセンス。GitHub スター 2.2 万超。

### Zammad
メールベースのヘルプデスクに特化した OSS。SLA 管理・エスカレーション・カスタムチケットフォーム・ナレッジベースを持ち、Zendesk の機能セットに最も近い。AGPL-3.0。

## Suggested related wiki pages

- `wiki/tools/chatwoot.md`
- `wiki/tools/zammad.md`
- `wiki/comparisons/zendesk-vs-chatwoot.md`
- `wiki/comparisons/zendesk-vs-zammad.md`
- `wiki/categories/customer-support.md`

## Open questions

- Chatwoot の WhatsApp Business API 統合の安定性と設定コスト
- Zammad の日本語対応状況（UI・ドキュメント）
- 日本のカスタマーサポートチームにおける Zendesk 代替需要の実態
- AI チケット分類・自動返信なしで中小企業が Zendesk を離れられるか

## Evidence sources

- https://www.zendesk.com/pricing/
- https://www.chatwoot.com/
- https://zammad.org/

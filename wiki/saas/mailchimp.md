---
type: saas
slug: mailchimp
name: Mailchimp
category: email-marketing
status: active
priority: high
pain_points:
  - monthly-cost
  - contact-based-pricing
  - vendor-lock-in
  - data-ownership
  - free-tier-limitations
decision_axes:
  - list-size-cost
  - automation-depth
  - self-host-difficulty
  - deliverability
  - template-editor
  - analytics
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - listmonk
  - mautic
related_category_pages:
  - wiki/categories/email-marketing.md
related_comparison_pages:
  - wiki/comparisons/mailchimp-vs-listmonk.md
  - wiki/comparisons/mailchimp-vs-mautic.md
---

# Mailchimp

## Summary

Mailchimp はメールマーケティング・ニュースレター配信の最大手 SaaS。連絡先数に応じた価格設定でリスト増加とともにコストが急増する「連絡先課金トラップ」が知られており、Listmonk / Mautic などの OSS 代替への移行動機になっている。ossalt では **連絡先数課金の急増・データ所有権** を主な動機として扱う。

## Why it matters for ossalt

メール配信のセルフホストは「モニタリングや PaaS より簡単」なカテゴリ。Listmonk は Go 製の軽量メール配信 OSS で、シンプルなニュースレード配信には非常に適している。「Mailchimp 無料版の上限（500 連絡先）に引っかかった」または「連絡先が増えて課金が急増した」というユーザーへの推薦として最も成立しやすいカテゴリの一つ。

## How Mailchimp is positioned

Mailchimp は「メールマーケティング」から「マーケティングプラットフォーム」へ拡大しており、メール・SMS・SNS広告・ランディングページ・CRM を統合。Intuit 傘下となり、QuickBooks（会計）との統合も進んでいる。AI コンテンツ生成（Intuit Assist）を追加し、メール文面の自動生成を提供。

## Why users look for alternatives

- **連絡先数課金の急増**: 無料 500 連絡先 → Essentials $13/月（500〜50,000）→ Standard $20/月〜。連絡先が増えるほど段階的に高くなる
- **無料版の制限強化**: 以前は 2,000 連絡先が無料だったが 500 に縮小（2023 年）
- **データ所有権**: 購読者リスト・メール開封データが Mailchimp のサーバーに保管
- **ブランド制約**: 無料版はメールフッターに「Mailchimp」ブランドが強制挿入される
- **Intuit 買収後の不満**: Mailchimp が Intuit に買収（2021 年）後、UI 変更・機能削減への不満がある

## What ossalt should help users decide

1. シンプルなニュースレター配信だけなら Listmonk で十分か
2. マーケティングオートメーション（セグメント・ドリップ）が必要なら Mautic か
3. SMTP 配信サービス（Amazon SES / SendGrid）と組み合わせるか
4. セルフホストでの配信到達性を確保できるか

## Core decision axes

### 1. List size vs cost

Listmonk・Mautic はどちらも連絡先数に関わらず定額（サーバーコストのみ）。10 万件のリストを Mailchimp で運用すると月 $300〜400 になるが、Listmonk なら $10〜30/月（サーバーコストのみ）で運用できる。

### 2. Automation depth

Mailchimp の自動化（ワークフロービルダー・セグメント配信・A/B テスト）は使いやすい。Listmonk は基本的な自動化のみ。Mautic は HubSpot に近いマーケティングオートメーションを持つ。

### 3. Deliverability

メール配信の到達性はセルフホスト最大の課題。Mailchimp は独自の配信インフラで高い到達性を持つ。セルフホストでは Amazon SES / SendGrid を SMTP リレーとして使うことで Mailchimp に近い到達性を実現できる。

## Candidate families

### Listmonk
Go 製の軽量・高速なニュースレター配信 OSS。シンプルな配信・購読管理・テンプレートに特化。AGPL-3.0。

### Mautic
マーケティングオートメーション全般を OSS で実現。セグメント・ドリップ・A/B テスト・フォーム・ランディングページ対応。GPL-3.0。

## Suggested related wiki pages

- `wiki/tools/listmonk.md`
- `wiki/tools/mautic.md`
- `wiki/comparisons/mailchimp-vs-listmonk.md`
- `wiki/comparisons/mailchimp-vs-mautic.md`
- `wiki/categories/email-marketing.md`

## Open questions

- Listmonk + Amazon SES での実際の配信到達性の実態
- Mautic の日本語化状況と日本語コミュニティの活発度
- Mailchimp の連絡先課金モデル変更（2023 年の無料枠縮小）の日本ユーザーへの影響
- メール配信 OSS の長期コスト（Amazon SES 送信費用を含めた試算）

## Evidence sources

- https://mailchimp.com/pricing/
- https://listmonk.app/
- https://www.mautic.org/

---
type: saas
slug: google-workspace
name: Google Workspace (Gmail)
category: email-hosting
status: active
priority: high
pain_points:
  - monthly-cost
  - vendor-lock-in
  - data-ownership
  - privacy-concerns
  - google-dependency
decision_axes:
  - self-host-difficulty
  - spam-filtering-quality
  - ops-burden
  - deliverability
  - mobile-support
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - mailcow
  - mailu
related_category_pages:
  - wiki/categories/email-hosting.md
related_comparison_pages:
  - wiki/comparisons/google-workspace-vs-mailcow.md
  - wiki/comparisons/google-workspace-vs-mailu.md
---

# Google Workspace (Gmail)

## Summary

Google Workspace はメール（Gmail）・カレンダー・ドライブ・ドキュメントを統合したビジネス向け SaaS。メールホスティングとして世界シェア最大級だが、コスト・Google 依存・データ所有権を動機にセルフホストメールを検討する組織がある。ossalt では **メールサーバーのセルフホスト** という非常に難易度の高い代替を扱うカテゴリとして、現実的なリスクを正直に伝えることが重要。

## Why it matters for ossalt

メールのセルフホストは「OSS 代替の中で最も難しいカテゴリ」の一つ。スパムフィルター・配信到達性・セキュリティ（SPF/DKIM/DMARC）・継続的なメンテナンスが必要で、「安易にすすめるべきではない」代替カテゴリ。一方で、強い理由（GDPR・国内保管要件・コスト削減）がある組織には Mailcow / Mailu が現実的な選択肢になる。

## How Google Workspace is positioned

Google Workspace は「Gmail のビジネス版」から「AI ワークスペース（Gemini 統合）」へと進化。Gemini for Workspace（AI メール要約・下書き生成・会議ノート）を全プランに展開しており、Google は AI を使った生産性向上を主な差別化ポイントとして打ち出している。

## Why users look for alternatives

- **コスト**: Business Starter $6/人/月〜、Business Standard $12/人/月〜。100 人規模で月 $600〜$1,200
- **Google 依存の集中リスク**: Gmail・Drive・Meet・Docs をすべて Google に依存することへのリスク感
- **データ所有権**: メールデータが Google のサーバーに保管されることへの懸念（GDPR・国内保管要件）
- **プライバシー**: Google がメールデータを広告・AI 学習に利用することへの懸念
- **価格改定リスク**: 過去に大幅な値上げが行われており（2023 年）、ベンダー依存リスクがある

## What ossalt should help users decide

1. セルフホストメールの運用コスト（工数・リスク）と Google Workspace のコストを天秤にかけられるか
2. 技術力・運用体制があるか（メールサーバーは「壊れると業務停止」）
3. スパムフィルター・配信到達性の問題に対処できるか
4. Mailcow（高機能）と Mailu（シンプル）のどちらが組織に合うか

## Core decision axes

### 1. Self-host difficulty（最重要）

メールのセルフホストは **ossalt が扱うカテゴリの中で最も難しい**。SPF/DKIM/DMARC の設定・IP レピュテーション管理・スパムフィルター・TLS 証明書・継続的なセキュリティアップデートが必要。設定ミスはメールの不達・スパム判定に直結する。「ちょっとやってみる」には向かない。

### 2. Deliverability（配信到達性）

新規 IP からのメールは Gmail / Outlook / Yahoo に「スパム」と判定されやすい。IP レピュテーションを育てるには数週間〜数ヶ月かかる場合がある。「自社メールが相手の迷惑メールフォルダに届く」というリスクを受け入れられるか。

### 3. Ops burden

メールサーバーは「壊れると即座に業務停止」するインフラ。24 時間対応できる運用体制・バックアップ・冗長化が必要。個人や小規模チームには負荷が高い。

## Candidate families

### Mailcow
Docker ベースのフルスタックメールサーバー。Postfix + Dovecot + SOGo + Rspamd を Docker Compose で統合。Web 管理 UI が充実しており、技術者が運用しやすい。GPL-2.0。

### Mailu
よりシンプルな Docker ベースのメールサーバー。設定が Mailcow より少なく、小規模組織向け。MIT ライセンス。Rainloop / Roundcube ライクな Web メールを内蔵。

## Editorial policy for this SaaS page

**メールのセルフホストのリスクを正直に伝える**ことをこのページの最重要方針とする。「簡単に Mailcow で代替できる」という印象を与えてはいけない。「十分な技術力・運用体制がある組織への推薦」に絞り、「Google Workspace の方が多くの組織に適している」という結論も許容する。

## Suggested related wiki pages

- `wiki/tools/mailcow.md`
- `wiki/tools/mailu.md`
- `wiki/comparisons/google-workspace-vs-mailcow.md`
- `wiki/comparisons/google-workspace-vs-mailu.md`
- `wiki/categories/email-hosting.md`

## Open questions

- Mailcow / Mailu の IP レピュテーション問題の現実的な解決策（VPS 選定・ウォームアップ期間）
- 日本の中小企業でのセルフホストメール採用事例の収集
- Google Workspace の Gemini AI 機能が代替の意思決定に与える影響
- 「メールだけ Google Workspace・他は OSS」というハイブリッド運用の現実性

## Evidence sources

- https://workspace.google.com/pricing
- https://mailcow.email/
- https://mailu.io/

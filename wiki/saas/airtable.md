---
type: saas
slug: airtable
name: Airtable
category: no-code-database
status: active
priority: high
pain_points:
  - monthly-cost
  - vendor-lock-in
  - row-limits
  - data-ownership
  - self-hosting
decision_axes:
  - use-case-fit
  - self-host-difficulty
  - ops-burden
  - migration-friction
  - japanese-doc-availability
  - no-code-extensibility
  - api-completeness
last_reviewed: 2026-04-09
confidence: medium
source_count: 5
related_tools:
  - nocodb
  - baserow
  - teable
related_category_pages:
  - wiki/categories/no-code-database.md
related_comparison_pages:
  - wiki/comparisons/nocodb-vs-baserow.md
  - wiki/comparisons/nocodb-vs-teable.md
---

# Airtable

## Summary

Airtable は、スプレッドシート感覚で使えるノーコードデータベース SaaS であり、グリッド・ガレリー・カンバン・フォーム・カレンダーなど複数ビューと自動化・API 連携を統合している。ossalt においては、フリープランのレコード数上限（1,000件/テーブル）と Pro プランの月額コスト増が代替検討の主な動機になる。 [Source](https://airtable.com/) [Source](https://ossalt.jp/alternatives/airtable)

## Why it matters for ossalt

Airtable は「データベースをノーコードで扱いたい」という幅広いユーザー層に使われており、マーケティング・HR・プロジェクト管理・CRM など用途が多様。代替 OSS（NocoDB・Baserow・Teable）は既存 DB への接続や自己ホスト型というアプローチで差別化しており、ossalt がこの比較軸を整理することで高い検索意図に応えられる。

## How Airtable is positioned

Airtable 公式は「仕事の方法を変えるプラットフォーム」として、スプレッドシートよりも強力でありながら DB よりも使いやすい「コネクテッドアプリ開発基盤」を訴求している。AI 機能の統合・自動化・外部 API 連携を強化しており、単なるスプレッドシート代替から「業務アプリ開発プラットフォーム」へのシフトが進んでいる。 [Source](https://airtable.com/)

## Why users look for alternatives

- **レコード数上限**: フリープランは1,000件/テーブル。Plusプランでも10,000件
- **月額コスト**: Plusプランで1ユーザー/月 $10〜（年払い）。用途によっては割高感がある
- **データ所有権**: 業務データが Airtable のクラウドに蓄積され、エクスポートに手間がかかる
- **ベンダーロックイン**: Airtable 独自の自動化・スクリプト・インターフェース設定が蓄積
- **セルフホスト不可**: 既存 DB（PostgreSQL等）をそのままフロントにしたいニーズに応えられない

[Source](https://airtable.com/pricing) [Source](https://ossalt.jp/alternatives/airtable)

## What ossalt should help users decide

1. 既存のデータベース（PostgreSQL/MySQL等）を UI 付きで操作したいのか、ゼロから構築したいのか
2. レコード数・テーブル数の規模感（フリープランで収まるか）
3. 自動化・ワークフロー機能をどこまで必要とするか
4. 開発者が関与できるか（セルフホストの運用体制）
5. API 経由での連携・外部ツールとの統合の必要度

## Core decision axes

### 1. Use-case fit

Airtable の代替は「既存 DB にフロントを付けたい」か「ゼロからノーコード DB を構築したい」かで大きく分かれる。NocoDB は既存の MySQL/PostgreSQL/SQLite に接続してスプレッドシート UI を提供する点が最大の特徴で、データ移行なしに既存資産を活用できる。Baserow はゼロから構築するノーコード DB として Airtable に近い体験を提供する。Teable は PostgreSQL ネイティブで大量データに強い新興候補。 [Source](https://nocodb.com/) [Source](https://baserow.io/) [Source](https://teable.io/)

### 2. No-code extensibility

Airtable の強みは、自動化・スクリプト・インターフェースビルダーによるアプリ構築能力にある。NocoDB は基本的な自動化とギャラリー/フォームビューを持つが、Airtable のインターフェースビルダー相当の機能はまだ限定的。Baserow はプラグインシステムを持ち、カスタムフィールドタイプの拡張が可能。 [Source](https://nocodb.com/) [Source](https://baserow.io/)

### 3. Self-host difficulty

NocoDB は Docker 一発起動が可能で、既存 DB への接続も設定 UI から行える。セルフホストの敷居が最も低い候補の一つ。Baserow も Docker での展開が可能で、公式クラウド版と並行して OSS 版を提供している。Teable は PostgreSQL を内包した形で展開でき、スケール性が高い。 [Source](https://docs.nocodb.com/getting-started/self-hosted/installation/) [Source](https://baserow.io/docs/installation%2Finstall-with-docker)

### 4. API completeness

Airtable の API は充実しており、外部ツールとの連携が多い。NocoDB は REST・GraphQL API を自動生成する強みがあり、Airtable の API を代替できる可能性が高い。Baserow も REST API を提供しているが、Airtable API との互換性は限定的。 [Source](https://docs.nocodb.com/engineering/rest-apis/)

### 5. Migration friction

Airtable からの移行は CSV エクスポートが基本になる。NocoDB・Baserow ともに CSV インポートに対応しているが、Airtable のリンクフィールド・添付ファイル・自動化設定は再構築が必要。Airtable のビューや自動化が複雑に組まれている場合は移行コストが高い。 [Source](https://ossalt.jp/alternatives/airtable)

### 6. Japanese doc availability

NocoDB・Baserow・Teable の日本語情報はいずれも少なく、ossalt の編集価値が高いカテゴリ。特に「既存 PostgreSQL に NocoDB をつなげる」ユースケースは日本語情報がほぼ存在しない。

## Candidate families

### NocoDB
既存の MySQL・PostgreSQL・SQLite・MariaDB・SQL Server に接続してスプレッドシート UI を提供する OSS。TypeScript 製でセルフホスト容易。REST/GraphQL API を自動生成する。「すでにDBがある」チームには最もフィット感が高い Airtable 代替。 [Source](https://nocodb.com/)

### Baserow
ゼロから構築するノーコードデータベース OSS。Django + Vue 製でセルフホスト可能。プラグインシステムによるカスタムフィールドタイプの拡張が特徴。クラウド版と OSS 版の両方を提供しており、移行パスが柔軟。 [Source](https://baserow.io/)

### Teable
PostgreSQL ネイティブの大量データ対応ノーコード DB。TypeScript 製で、数百万レコードのスケールに対応できる点が NocoDB・Baserow との最大の差別化。2024年〜急速に成長しているが、まだ比較的新しいプロジェクト。 [Source](https://teable.io/)

## Editorial policy for this SaaS page

Airtable の代替ページでは「既存 DB の活用」と「ゼロ構築」という二方向の用途を明示する。NocoDB を既存 DB 連携の第一候補、Baserow をゼロ構築の候補として整理し、Teable を大量データ用途の注目株として位置づける。API 自動生成の有無を比較軸として強調し、開発者ユーザーへの訴求を意識する。

## Suggested related wiki pages

- `wiki/tools/nocodb.md`
- `wiki/tools/baserow.md`
- `wiki/tools/teable.md`
- `wiki/comparisons/nocodb-vs-baserow.md`
- `wiki/comparisons/nocodb-vs-teable.md`
- `wiki/decision-axes/api-completeness.md`
- `wiki/categories/no-code-database.md`

## Open questions

- Teable の本番利用実績・安定性の現状（2026年時点）
- NocoDB が「既存 DB 接続」に特化していることで、セキュリティ面での懸念はあるか
- Baserow の SaaS 版と OSS 版の機能差の実態
- 日本企業で Airtable → NocoDB 移行をした事例はあるか

## Evidence sources

- https://airtable.com/
- https://airtable.com/pricing
- https://ossalt.jp/alternatives/airtable
- https://nocodb.com/
- https://baserow.io/
- https://teable.io/

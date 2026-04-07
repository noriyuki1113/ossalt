---
type: saas
slug: tableau
name: Tableau
category: bi-analytics
status: active
priority: medium
pain_points:
  - monthly-cost
  - vendor-lock-in
  - salesforce-dependency
  - self-hosting
  - data-ownership
decision_axes:
  - visualization-richness
  - sql-proficiency-required
  - self-host-difficulty
  - data-source-connectivity
  - ops-burden
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - metabase
  - superset
  - redash
related_category_pages:
  - wiki/categories/bi-analytics.md
related_comparison_pages:
  - wiki/comparisons/tableau-vs-metabase.md
  - wiki/comparisons/tableau-vs-superset.md
---

# Tableau

## Summary

Tableau は Salesforce 傘下のエンタープライズ BI（Business Intelligence）・データ可視化ツール。非エンジニアでも高度なグラフ・ダッシュボードを作成できる直感的な UI と、多数のデータソースへの接続性が強み。ossalt では **高額なライセンスコスト・Salesforce 依存・データ所有権**を主な動機として、Metabase / Apache Superset / Redash との比較起点として扱う。

## Why it matters for ossalt

Tableau は「使いたいが高すぎる」「データ分析が業務に必要だが予算がない」という中小企業・スタートアップからの代替需要が大きい。OSS 代替（特に Metabase）が成熟しており、「Tableau でできることの 80% を無料で実現する」という訴求が成立するカテゴリ。日本語圏でも BI 導入コストへの関心が高い。

## How Tableau is positioned

Tableau は Salesforce CRM データとの深い統合・AI 分析（Tableau Pulse / Einstein）・大規模エンタープライズのガバナンスを強みとし、データドリブン経営を推進する組織向けに進化している。SQL を書かずにドラッグ＆ドロップで複雑なビジュアライゼーションを作れる点が非エンジニア向けの差別化になっている。

## Why users look for alternatives

- **高額なコスト**: Creator $75/人/月、Explorer $42/人/月、Viewer $15/人/月。10 人チームでも月数十万円になりやすい。
- **Salesforce 依存**: Salesforce 買収後、Salesforce CRM との連携前提が強まる方向へ進化している。
- **オンプレミス版（Tableau Server）のコスト**: Cloud 版に加えてオンプレ版も高額。
- **データ所有権**: 分析データを Tableau のクラウドに接続することへの懸念。
- **中小企業には過剰**: フル機能のエンタープライズ BI は中小企業には複雑すぎる場合がある。

## What ossalt should help users decide

1. Metabase のノーコード BI で業務要件を満たせるか
2. SQL が書けるチームなら Superset / Redash の方が柔軟か
3. セルフホストかクラウドマネージド版か
4. データソースへの接続要件（DB / SaaS 連携の種類）

## Core decision axes

### 1. SQL proficiency required

Metabase は SQL を書かずにクリック操作でダッシュボードを作れる（SQL も使える）。Superset / Redash は SQL 中心で、技術者向けの設計。Tableau も SQL なしで使えるが、より高度な可視化は式の知識が必要。**チームの技術力によって推薦候補が変わる**。

### 2. Visualization richness

Tableau はドラッグ＆ドロップでの高度な可視化（カスタムチャート・地図・複合グラフ）が最も充実。Superset も多様なチャートタイプをサポート。Metabase はシンプルで実用的なグラフに絞っており、複雑な可視化には向かない。Redash は可視化よりもクエリ・データ探索が主目的。

### 3. Data source connectivity

Tableau は 80+ のネイティブコネクタを持ち、最も幅広いデータソースに対応。Superset・Metabase も主要 DB・DWH（BigQuery / Snowflake / Redshift 等）に対応。Redash はクエリベースでほぼすべての SQL データソースに対応。

## Candidate families

### Metabase
「データベースに繋げば誰でも使える BI」として最も普及している OSS BI。ノーコード BI として Tableau の代替として最初に挙げるべき候補。AGPL-3.0。GitHub スター 4 万超。

### Apache Superset
技術者向けの高機能 OSS BI。多様なチャートタイプ・SQL Lab・Jinja テンプレートを持ち、Tableau の可視化の幅広さに最も近づける。Apache 2.0。GitHub スター 6.3 万超。

### Redash
SQL クエリをダッシュボードに変換することに特化した OSS。アドホッククエリ・データ探索に強い。BSD-2-Clause。

## Suggested related wiki pages

- `wiki/tools/metabase.md`
- `wiki/tools/superset.md`
- `wiki/tools/redash.md`
- `wiki/comparisons/tableau-vs-metabase.md`
- `wiki/comparisons/tableau-vs-superset.md`
- `wiki/categories/bi-analytics.md`

## Open questions

- 日本語圏での BI ツール選定における Tableau vs Metabase の実際の採用比率
- Metabase の無料版で日本の中小企業が必要な機能を満たせているか
- Superset のセルフホストの実際の運用負荷（中小企業視点）

## Evidence sources

- https://www.tableau.com/ja-jp/pricing
- https://www.metabase.com/
- https://superset.apache.org/

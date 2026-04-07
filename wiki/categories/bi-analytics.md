---
type: category
slug: bi-analytics
name: BI・データ分析・ダッシュボード
ossalt_category: bi-analytics
tool_count: 3
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# BI・データ分析・ダッシュボード

## 概要

データベース・DWH に接続してダッシュボード・グラフを作成・共有するプラットフォームのカテゴリ。Tableau（Salesforce）・Looker（Google）・Power BI（Microsoft）が高額な商用ツールとして定着する一方、コスト・データ所有権・Salesforce 依存を動機に、OSS 代替（Metabase / Apache Superset / Redash）への移行を検討するスタートアップ・中小企業が増えている。

## なぜ今注目されているか

**1. Tableau のコスト増・Salesforce 依存強化**
Salesforce による Tableau 買収（2019 年）後、価格が引き上げられ、Salesforce エコシステムとの連携が強化される方向へ進化している。非 Salesforce 企業にとっては「高すぎて使いにくい方向に進化している BI」という認識が広まっている。

**2. データスタック（dbt / BigQuery / Snowflake）の普及**
データエンジニアリングの民主化が進み、dbt + BigQuery/Snowflake の組み合わせで中小企業もデータウェアハウスを持てるようになった。データ基盤が整備された後に「可視化ツールを Tableau 以外に」という需要が生まれている。

**3. Metabase の成熟**
Metabase が「データベースに繋げば誰でも使える BI」として実用的なレベルに達し、GitHub スター 4 万超。スタートアップ・中小企業での標準的な BI ツールとしての地位を確立しつつある。

**4. Apache Superset の成長**
Apache Software Foundation トップレベルプロジェクトとして成熟し、Apache 2.0 ライセンスでの商用利用が広がっている。GitHub スター 6.3 万超はデータ分野 OSS の中でも特に大きい。

## 主要ツールの勢力図

```
  ノーコード・非エンジニア ←──────────────── SQL・技術者向け
          |                                          |
       Metabase          Superset               Redash
    (クリック操作BI)   (SQL Lab・高機能)      (SQL→グラフ変換)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Metabase | ノーコード BI。最も普及している OSS BI | 40,000 | AGPL-3.0 |
| Apache Superset | 高機能・SQL 中心。技術者向け | 63,000 | Apache-2.0 |
| Redash | SQL → ダッシュボード特化。軽量 | 25,000 | BSD-2-Clause |

## 注目の動き（直近）

- **Metabase の AI 機能**: 自然言語でのデータ質問（NLP → SQL）機能を開発中。非エンジニアの BI アクセスをさらに民主化する可能性がある
- **Superset の Preset**: Superset のマネージドクラウド版「Preset」が展開されており、セルフホストなしで Superset を使えるオプションが増えている
- **Redash のメンテナンス低下**: 開発ペースが落ちており、Metabase・Superset への移行が進んでいる印象がある
- **Embedded BI の需要**: SaaS プロダクトに BI ダッシュボードを組み込む「Embedded BI」の需要が増えており、AGPL-3.0（Metabase）vs Apache-2.0（Superset）のライセンス差が採用判断に影響

## 日本語圏での温度感

日本では Tableau は大企業・エンタープライズの BI ツールとして定着しており、代替を検討するのは主にコスト削減を迫られたスタートアップ・中小企業。

- **Metabase**: 日本語情報が豊富。Qiita・Zenn に多数の導入記事。スタートアップの BI 導入第一候補として認知
- **Superset**: データエンジニアリングコミュニティ（dbt / BigQuery ユーザー）でのみ本格的に議論される。日本語記事はメタベースより少ない
- **Redash**: 過去に広く使われており日本語記事が豊富だが、新規採用は減少傾向

「BI ツールを初めて導入するスタートアップ」は Metabase を最初に検討するケースが多い。「データ基盤が整備された中規模企業が Tableau コストを削減したい」場合は Metabase または Superset を比較検討する。

## ossaltにおける推薦方針

### ユーザーの技術力で推薦を分ける

```
「チームで SQL を書けるのは？」
├── エンジニア含め全員使う → Metabase（ノーコード+SQL両対応）
├── データアナリスト・エンジニアのみが使う → Superset（SQL Lab）
└── SQL クエリ結果を共有したいだけ → Redash（ただし将来性に注意）
```

### 「Tableau でできることの何%が必要か」を先に聞く

- KPI ダッシュボード・基本的なグラフ → Metabase で 80% カバー
- 複雑なビジュアライゼーション・カスタムチャート → Superset で 60% カバー
- ドラッグ&ドロップの高度な可視化 → Tableau の代替なし（割り切りが必要）

### ライセンスの違いを明示する

| ライセンス | 意味 |
|---|---|
| AGPL-3.0（Metabase） | SaaS として外部提供する場合はソース公開が必要 |
| Apache-2.0（Superset） | 商用利用・SaaS 組み込みに制限なし |
| BSD-2-Clause（Redash） | 商用利用に制限なし |

SaaS プロダクトに Embedded BI として組み込む場合は Superset の Apache-2.0 が最も自由。

## Open questions

- 日本の中小企業・スタートアップにおける BI ツール採用の実態（Tableau vs Metabase vs 未導入）
- Metabase の AI 機能（NLP → SQL）の完成度と採用への影響
- Redash の後継・フォークプロジェクトの動向
- dbt との連携（dbt メトリクスレイヤー）が OSS BI ツールの機能比較に与える影響

## Evidence sources

- https://www.tableau.com/ja-jp/pricing
- https://www.metabase.com/
- https://superset.apache.org/
- https://redash.io/

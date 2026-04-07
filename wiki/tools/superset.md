---
type: tool
slug: superset
name: Apache Superset
category: bi-analytics
github: https://github.com/apache/superset
stars: 63000
language: Python / TypeScript
last_commit: 2026-04-01
license: Apache-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - tableau
related_tools:
  - metabase
  - redash
---

# Apache Superset

## 一言定義

技術者向けの高機能 OSS BI ツール。多様なチャートタイプ・SQL Lab・Jinja テンプレートを持ち、Tableau の可視化の幅広さに最も近い。Apache Software Foundation がホストする Apache 2.0 ライセンス。

## Positioning

Apache Superset は Airbnb 発の OSS BI ツール。2015 年に内部ツールとして開発され、2021 年に Apache Software Foundation のトップレベルプロジェクトに昇格した。GitHub スター 6.3 万超で OSS BI カテゴリ最大規模。技術者向けに設計されており、SQL Lab（インタラクティブ SQL エディタ）・多様なチャートタイプ・Jinja テンプレートが特徴。Apache 2.0 ライセンスのため商用利用制限が少ない。

## 強み

- **豊富なチャートタイプ**: 40 種類以上のビジュアライゼーション（棒グラフ・地図・ヒートマップ・サンバーストなど）
- **SQL Lab**: ブラウザ上のインタラクティブ SQL エディタ。クエリ結果を直接グラフ化できる
- **Jinja テンプレート**: SQL にパラメータを埋め込んだ動的クエリが作成できる
- **Apache 2.0 ライセンス**: 商用利用・SaaS 組み込みに最も制約が少ない
- **幅広いデータソース**: SQLAlchemy 経由で 40 以上の DB・DWH に接続（BigQuery / Snowflake / Redshift 対応）
- **Row-level Security**: 行レベルのデータアクセス制御が可能

## 弱み・注意点

- **非エンジニアには難しい**: SQL の知識なしでは使いこなしにくい。ノーコード BI としては Metabase に劣る
- **セルフホストの運用負荷が高い**: Python + Redis + Celery + PostgreSQL の複雑なスタック。Kubernetes 推奨の大規模環境も多い
- **設定の複雑さ**: 初期セットアップ・認証設定・データソース設定に時間がかかる
- **ドキュメントが散在**: Apache プロジェクトのため、情報が分散していることがある
- **ドラッグ&ドロップ BI としては Tableau に劣る**: 高度なビジュアライゼーションには SQL の知識が必要

## どんなユーザーに向くか

- **SQL を書けるエンジニア・データアナリストチーム**: データエンジニアリング文化があり、SQL で分析できるチーム
- **多様なチャートタイプが必要**: Metabase ではカバーできない複雑なビジュアライゼーションが必要な場合
- **商用利用・SaaS 組み込み**: Apache 2.0 のため、サービスへの組み込みやホスティングサービス化が自由
- **大規模データ処理**: Druid / ClickHouse などの高速 OLAP エンジンとの統合が必要なチーム
- **Tableau の代替として最も近い機能セット**を求めるエンジニア組織

## セルフホスト難易度

**高め**。Docker Compose で起動できるが、本番環境では Redis（非同期処理）・Celery Worker・PostgreSQL（メタデータ）・Superset 本体の複数サービスを管理する必要がある。最低 4〜8GB RAM を推奨。設定ファイルが Python コードとして記述されるため、Python の知識が求められる場面がある。Kubernetes での運用が推奨される規模では専任の運用担当が必要。

## 日本語圏での採用状況

日本語の情報量は Metabase に比べて少ないが、データエンジニアリングコミュニティでは認知度が高い。Zenn・Qiita にセットアップ記事が存在する。日本の中規模〜大規模企業のデータ基盤チームでの採用事例がある。UI の日本語化は限定的で、英語ドキュメントの読解が必要。

## ossaltにおける推奨文脈

Tableau 代替として「エンジニア・データアナリスト主導のチーム」への第 2 候補として位置づける。Metabase（ノーコード BI）では物足りない高度な可視化・SQL 活用が必要なケースで推薦。Apache 2.0 ライセンスは商用利用・SaaS 組み込みを検討する企業にとって重要なメリット。セルフホストの運用負荷は高く、Kubernetes 運用経験のあるチームに限定して推薦するのが適切。

## Open questions

- Superset のセルフホスト運用負荷を中小企業が許容できるかの評価基準
- Metabase vs Superset の採用分岐点（チーム規模・技術者比率・可視化複雑度）の定量的目安
- Superset の日本語 UI 対応の進捗状況
- ClickHouse・Druid との組み合わせ事例の日本語圏での普及状況

## Evidence sources

- https://superset.apache.org/
- https://github.com/apache/superset

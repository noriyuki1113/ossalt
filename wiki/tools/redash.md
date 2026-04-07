---
type: tool
slug: redash
name: Redash
category: bi-analytics
github: https://github.com/getredash/redash
stars: 25000
language: Python / JavaScript
last_commit: 2024-06-01
license: BSD-2-Clause
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
  - superset
---

# Redash

## 一言定義

SQL クエリをダッシュボードに変換することに特化した OSS BI ツール。アドホッククエリ・データ探索が主目的で、「クエリ結果を共有・可視化する」ツールとして使われる。

## Positioning

Redash は 2013 年に登場した老舗の OSS BI ツール。「SQL を書いてグラフを作り、ダッシュボードにまとめて共有する」というシンプルなワークフローに特化している。複雑な BI 機能は持たず、「データアナリストが SQL で調べた結果を非エンジニアと共有するツール」として長く使われてきた。BSD-2-Clause ライセンスで商用利用制限なし。ただし、2024 年時点では開発ペースが低下しており、将来の活発なメンテナンスについては注意が必要。

## 強み

- **SQL 中心の設計**: SQL クエリを書いてグラフ・ダッシュボードを作るシンプルなワークフロー
- **幅広いデータソース**: 35+ のデータソースに対応（SQL DB / NoSQL / API / CSV 等）
- **クエリスニペット**: よく使う SQL を再利用可能なスニペットとして管理できる
- **軽量**: Superset と比べてセットアップがシンプルで、運用負荷が低い
- **BSD-2-Clause**: 商用利用・SaaS 組み込みに制約が少ない
- **アラート機能**: クエリ結果に基づくアラートを設定できる

## 弱み・注意点

- **開発ペースの低下**: 2023 年以降、メインリポジトリの更新頻度が低下している。長期サポートの不確実性がある
- **ノーコード BI ではない**: SQL を書けないユーザーには向かない
- **可視化の自由度が低い**: チャートタイプは基本的なものに限られ、Superset・Tableau には届かない
- **モダンな UI でない**: 2013 年設計の UI はモダン感に欠ける
- **Metabase・Superset に比べてコミュニティが縮小傾向**

## どんなユーザーに向くか

- **SQL を書けるデータアナリスト**: SQL でデータを調べて結果を共有したいデータチーム
- **軽量 BI が必要**: Superset の複雑なセットアップが不要で、シンプルな SQL → グラフ → 共有のフローだけが必要
- **アドホッククエリの可視化**: 定型ダッシュボードより、臨時のデータ探索・調査結果の共有が多い業務
- **レガシー環境との接続**: Superset が対応しない特殊なデータソース（REST API / CSV 等）への接続が必要なケース

## セルフホスト難易度

**中程度**。Docker Compose でのセットアップが公式に整備されている。PostgreSQL・Redis・Redash サーバー・Worker のマルチコンテナ構成。最小 2〜4GB RAM。Superset より設定は単純。ただしメンテナンスが低下していることを踏まえ、長期運用は慎重に検討すべき。

## 日本語圏での採用状況

日本語圏でのドキュメント・記事は比較的豊富で、Qiita に多数の導入記事がある。データ分析チームでの SQL クエリ共有ツールとして広く使われてきた実績がある。ただし、近年は Metabase への移行が進んでいる印象があり、新規採用は減少傾向にある可能性がある。

## ossaltにおける推奨文脈

Tableau 代替として Metabase・Superset の次に位置づける。「SQL が書けるチームで、軽量なクエリ共有・ダッシュボードツールが必要」という文脈での推薦。ただし開発ペースの低下を必ず言及し、「長期運用を前提とするなら Metabase か Superset を優先する」という注意書きを付けること。既に Redash を使っているチームへの代替提案としては不要（そのまま継続か Metabase 移行を検討）。

## Open questions

- Redash の開発ペース低下が長期的な採用リスクになるか（フォーク・後継の有無）
- Metabase vs Redash の選択基準（「ノーコード必要度」が主要因か）
- Redash を使い続けているチームが Metabase に移行する際の移行コスト評価

## Evidence sources

- https://redash.io/
- https://github.com/getredash/redash

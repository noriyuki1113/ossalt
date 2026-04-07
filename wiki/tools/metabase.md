---
type: tool
slug: metabase
name: Metabase
category: bi-analytics
github: https://github.com/metabase/metabase
stars: 40000
language: Clojure / TypeScript
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - tableau
related_tools:
  - superset
  - redash
---

# Metabase

## 一言定義

「データベースに繋げば誰でも使える BI」。SQL を書かずにクリック操作でダッシュボードを作れるノーコード OSS BI ツール。個人・中小企業から大企業まで幅広く使われている。

## Positioning

Metabase は「BI の民主化」を掲げた OSS BI ツールの代表格。2015 年創業、GitHub スター 4 万超。ノーコード（クリック操作でグラフ作成）と SQL モードの両方に対応しており、「エンジニアでも非エンジニアでも使える」が最大の強み。AGPL-3.0（無料の OSS 版）と商用版（Metabase Pro/Enterprise）の二段構え。Tableau 代替として最初に挙げるべき候補。

## 強み

- **ノーコード BI**: SQL を書かずにクリック操作でグラフ・ダッシュボードを作成できる
- **SQL も使える**: 高度なユーザーは SQL モードで自由なクエリが書ける
- **広範なデータソース対応**: PostgreSQL / MySQL / BigQuery / Snowflake / Redshift / MongoDB など主要 DB・DWH に対応
- **直感的な UI**: Tableau ほど複雑でなく、非エンジニアが 1 日で使い始められる
- **無料の OSS 版が充実**: 基本的な BI 機能はすべて無料版で利用可能
- **セルフホスト**: JAR ファイル 1 つ、または Docker で起動可能
- **Embedding 機能**: ダッシュボードを外部アプリに埋め込める（有料版でより充実）

## 弱み・注意点

- **高度な可視化は Tableau・Superset に劣る**: カスタムチャートや複合グラフの自由度は Tableau に届かない
- **AGPL-3.0**: SaaS として外部提供する場合はソース公開義務
- **大規模データの処理**: 大量データの集計・クエリは専用 DWH との組み合わせが必要
- **Enterprise 機能は有料**: SSO / 高度な権限管理 / 監査ログ は有料版
- **Jinja / カスタムテンプレートなし**: Superset のような SQL テンプレート機能は持たない

## どんなユーザーに向くか

- **SQL を書けない非エンジニアがいるチーム**: マーケター・営業・経営者がデータを見るダッシュボードを作りたい
- **「Tableau は高すぎる」中小企業**: Tableau の 20〜30% のコストで 80% の機能を実現したい
- **BI 初導入のチーム**: データ分析ツールを初めて導入するスタートアップや中小企業
- **データベースへの直接接続が必要**: MySQL / PostgreSQL に直接繋いでダッシュボードを作りたいエンジニア

## セルフホスト難易度

**低〜中程度**。Java（JAR）または Docker イメージ 1 つで起動できる。内部データは PostgreSQL または H2（組み込み）に保存。最小 2GB RAM で動作可能（推奨は 4GB+）。設定は環境変数で管理でき、小規模チームなら 15〜30 分で起動できる。本番環境では PostgreSQL を別途用意することが推奨される。

## 日本語圏での採用状況

Tableau 代替として日本国内でも多く採用されている。Qiita・Zenn に導入記事が豊富で、日本語ドキュメントも一部提供されている。スタートアップ・SaaS 企業での BI ツール選定で Metabase はほぼ必ず候補に挙がる。大企業での採用はより少なく、Tableau・Looker が選ばれることが多い。

## ossaltにおける推奨文脈

Tableau / Looker 代替として **最初に挙げるべき候補**。「SQL を書かずにダッシュボードを作りたい」「Tableau は高すぎる」という中小企業・スタートアップへの推薦として最適。エンジニアリングチームが BI を社内で運用したい場合も、Metabase は運用負荷が低く適している。SQL に強いエンジニア主導のチームには Superset / Redash を第 2 候補として提示する。

## Open questions

- Metabase の AGPL-3.0 が日本企業の SaaS 組み込み採用に与える影響
- Metabase 無料版で日本の中小企業が必要とする BI 機能を満たせているか
- Metabase vs Superset の選択基準（技術者比率・可視化の複雑さ）の定量的な目安
- Metabase のクラウドマネージド版（metabase.com）vs セルフホストの選択傾向

## Evidence sources

- https://www.metabase.com/
- https://github.com/metabase/metabase

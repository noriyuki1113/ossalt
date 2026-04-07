---
type: comparison
slug: tableau-vs-metabase
tool_a: metabase
tool_b: tableau
saas_context: tableau
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Tableau vs Metabase

## 比較の文脈

Tableau（Salesforce）は高額な BI ツールの代名詞。コスト・データ所有権・Salesforce 依存を動機に OSS 代替を検討するユーザーへの最優先推薦候補が Metabase。「Tableau でできることの 80% を無料で実現する」という訴求が成立するカテゴリ。

## TL;DR

| 条件 | 推薦 |
|---|---|
| 非エンジニアもダッシュボードを作れる BI が必要 | **Metabase** |
| コスト削減が主目的（月額を大幅に下げたい） | **Metabase** |
| セルフホストでデータを管理したい | **Metabase** |
| ドラッグ&ドロップの高度なビジュアライゼーションが必要 | Tableau |
| Salesforce CRM データとの深い統合が必要 | Tableau |
| 地図・複合グラフ等の複雑なチャートが必須 | Tableau |

## 比較表

| 項目 | Tableau | Metabase |
|---|---|---|
| 価格 | Creator $75 / Explorer $42 / Viewer $15（/人/月） | 無料（OSS）/ $500/月〜（クラウド版） |
| ライセンス | プロプライエタリ | AGPL-3.0 |
| セルフホスト | Tableau Server（高額） | ✅ Docker / JAR（無料） |
| ノーコード BI | ✅ ドラッグ&ドロップ | ✅ クリック操作 |
| SQL モード | ✅ | ✅ |
| 可視化の種類 | ✅ 豊富（30+）| ⚠️ 基本的なもの（20+） |
| データソース | 80+ コネクタ | 40+ コネクタ |
| Salesforce 連携 | ✅ ネイティブ深統合 | ❌ |
| AI 分析 | ✅ Tableau Pulse / Einstein | ⚠️ 基本的な要約のみ |
| Embedding | ✅（有料） | ✅（有料 Pro） |
| 日本語 UI | ✅ | ⚠️ 部分対応 |

## 各軸での詳細比較

### 非エンジニアの使いやすさ

Tableau はドラッグ＆ドロップの直感的なビジュアライゼーション作成が特徴で、非エンジニアでも複雑なグラフを作れる。Metabase もノーコード操作でグラフを作れるが、Tableau ほどの自由度はない。「シンプルなダッシュボードで十分」なら Metabase、「インタラクティブで複雑な分析」なら Tableau という構図。

### 可視化の品質・多様性

Tableau はカスタムチャート・地図・複合グラフ・フィルタの組み合わせなど、最も高度な可視化が可能。Metabase は棒グラフ・折れ線グラフ・円グラフ・散布図など基本的なチャートが揃っており、ビジネスダッシュボードとして十分な品質。「高度な可視化が必要か」がコスト差を正当化できるかの判断基準になる。

### コスト比較

10 人チームで比較：
- Tableau Creator 10 人: $750/月 = 年間 $9,000（約 135 万円）
- Metabase OSS セルフホスト: $0（サーバーコストのみ）
- Metabase クラウド版 Starter: $500/月（制限あり）

コスト差は圧倒的で、「機能の 20% を諦めてコストの 90% 以上を削減できるか」が判断の核心。

### データソース接続

Tableau は 80 以上のネイティブコネクタを持つ最も幅広い対応。Metabase も PostgreSQL / MySQL / BigQuery / Snowflake / Redshift / MongoDB などの主要データソースに対応。一般的な BI 用途では Metabase で十分カバーできる。特殊なデータソース（SAP / Oracle 等の高度なエンタープライズ DB）が必要な場合は Tableau の優位性が出る。

### Salesforce 依存

Tableau は Salesforce 買収後、Salesforce CRM との統合が強化されている。「Salesforce を使っていない組織」にとっては Salesforce 依存はデメリットでしかない。Metabase は Salesforce とは無関係で、データベースに直接接続するシンプルな設計。

## 移行摩擦

### Tableau → Metabase の主な作業

1. **ダッシュボードの再作成**: Tableau の `.twbx` ファイルは Metabase にインポートできない。すべてのダッシュボードを手動で再構築
2. **データソース接続の再設定**: 接続設定は再入力が必要だが、接続先が Metabase 対応 DB なら難しくない
3. **計算フィールドの SQL 変換**: Tableau の計算フィールドを Metabase の SQL モードで再現
4. **ユーザーへのトレーニング**: UI が変わるため 1〜2 週間の適応期間

### 移行が難しいケース

- **Tableau Server の高度なパーミッション管理**: プロジェクト・グループ・行レベルセキュリティの複雑な設定は Metabase では再現が難しい
- **Tableau Prep（データ前処理）**: Metabase はデータ前処理機能を持たない。別途 dbt 等を組み合わせる必要がある
- **Salesforce CRM ダッシュボード**: Salesforce データを中心にした Tableau ダッシュボードは Metabase では再現困難

## 日本語圏での選択傾向

日本では Tableau は大企業・エンタープライズ向けの BI として定着しており、代替を検討するのは主にコスト削減を迫られた中小企業・スタートアップ。Metabase は日本語の情報が豊富で、スタートアップ・SaaS 企業での BI 導入第一候補として認知されている。「Tableau から Metabase へ移行した」という事例は、Jira → Plane ほど多くはないが、コスト圧力を受けた企業での事例が報告されている。

## 結論

**コスト削減が主目的なら Metabase は強力な選択肢**。特に以下の条件が揃う場合は積極的に推薦：

- Salesforce CRM との深い統合は不要
- 基本的な KPI ダッシュボード・SQL 分析が主な用途
- 非エンジニアでも操作できる BI ツールが必要
- データをセルフホストで管理したい

Tableau の高度な可視化・Salesforce 統合・エンタープライズガバナンスが本当に必要な組織は Tableau を継続すべき。「使い切れていない Tableau を使っている」なら Metabase への移行コストに見合う価値がある。

## Open questions

- Tableau の Japan 市場でのシェアと Metabase 採用率の実態
- Metabase OSS で日本の中小企業の BI 要件が満たされているか
- Tableau Pulse（AI 分析）の対抗として Metabase がどこまで追いつけるか

## Evidence sources

- https://www.tableau.com/ja-jp/pricing
- https://www.metabase.com/
- https://github.com/metabase/metabase

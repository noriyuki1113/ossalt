---
type: tool
slug: outline
name: Outline
category: workspace
github: https://github.com/outline/outline
stars: 28000
language: TypeScript
last_commit: 2026-04-01
license: BSL 1.1
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - notion
related_tools:
  - appflowy
  - anytype
  - affine
---

# Outline

## 一言定義

チーム向け knowledge base / wiki に特化した OSS。リアルタイム共同編集・権限管理・公開共有・Slack 連携を揃え、「組織のドキュメント基盤」としての Notion 代替として最も完成度が高い候補のひとつ。

## Positioning

Outline は「Notion のすべてを置き換える」のではなく、**チーム内のドキュメント整備・知識共有に絞って完成度を高める**という方向性を取っている。公式サイトも "The fastest wiki and knowledge base for growing teams" と明示しており、個人 PKM よりも組織的な文書管理にターゲットを絞っている。

Notion が「ドキュメント + DB + プロジェクト管理 + AI」を統合するのに対し、Outline は「ドキュメント + wiki + 検索 + 共有」の軸で深掘りしており、目的が一致する組織にとってはよりシンプルで使いやすい選択肢になる。マークダウンベースのエディタ、階層構造のドキュメント管理、Slack / GitHub / Google Workspace 等の外部連携が整っている。[Source](https://www.getoutline.com/)

## 強み

- **チーム協調機能の成熟度**: リアルタイム共同編集、細かな権限管理（閲覧者 / 編集者 / 管理者）、ゲスト招待、チームごとのコレクション管理が揃っており、組織 wiki として即戦力になる。[Source](https://www.getoutline.com/)
- **豊富な外部連携**: Slack・GitHub・Google Drive・Figma・Loom など多数のインテグレーションを公式サポート。既存のチームワークフローへの組み込みが容易。
- **公開共有・検索**: ドキュメントの外部公開 URL 発行、全文検索（日本語対応あり）が標準搭載。社内 wiki と公開ドキュメントを同一環境で管理できる。
- **マークダウンネイティブ**: エディタがマークダウンベースで、エクスポート・インポートがしやすく、Git との相性もよい。
- **セルフホスト構成の整備**: Docker Compose + PostgreSQL + S3 でのセルフホスト手順が公式にドキュメント化されており、実績が多い。
- **GitHub スター 2.8 万超**: OSS wiki / knowledge base 系の中では高い認知度を持ち、長期的なメンテナンスの継続が期待できる。[Source](https://github.com/outline/outline)

## 弱み・注意点

- **BSL 1.1 ライセンス**: Business Source License 1.1 を採用しており、リリースから 4 年後に Apache 2.0 に転換するという構造。競合製品を作る用途には使えない制約があり、厳密な意味での「OSS」ではない点に注意が必要。
- **データベース機能なし**: Notion のインラインデータベース（テーブル・ボード・カレンダー）に相当する機能はない。ドキュメント・wiki に特化しており、タスク管理・DB 的な使い方には対応しない。
- **ローカルファーストではない**: サーバー（PostgreSQL）が必須で、オフライン動作には対応していない。
- **個人利用に向かない**: 個人の PKM や知識グラフ構築には設計が合わず、チーム利用を前提としたツール。
- **セルフホストの運用負荷**: PostgreSQL・Redis・S3 互換ストレージのスタック管理が必要。シンプルな構成ではあるが、ゼロメンテナンスではない。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| チーム / 組織の社内 wiki を整備したい | wiki 特化で完成度が高く、共同編集・権限管理が充実 |
| Notion を「チームドキュメントだけ」に使っている組織 | 機能を絞ったぶん運用がシンプルになる |
| Confluence の OSS 代替を探しているチーム | 構造・用途が近く、コスト削減になりやすい |
| Slack 連携・外部サービス統合が前提のワークフロー | インテグレーションが豊富で組み込みやすい |
| 公開ドキュメント（ヘルプ / 仕様書）と社内 wiki を一元管理したい | 外部公開 URL と内部権限管理を同一環境で扱える |

個人 PKM・AI 機能・タスク管理ボード・オフライン利用が必要な場合は AppFlowy または AFFiNE を先に検討すべき。

## セルフホスト難易度

**低〜中程度**。

- Docker Compose + PostgreSQL + S3 互換ストレージでの構成が公式ドキュメントに詳細に記載されており、他の workspace 系 OSS の中では構築実績が豊富。
- 必要な外部依存が明確（DB・S3・メール）で、サーバー運用の基礎知識があれば数時間で動かせる。
- 本番運用では PostgreSQL のバックアップ・アップデート管理が継続的に必要。
- マネージドホスト版（getoutline.com）もあり、セルフホストせずに使う選択もできる。

## 日本語圏での採用状況

グローバルでは技術系スタートアップ・エンジニアチームでの採用例が多く、Confluence 代替・社内 wiki の OSS 化という文脈での言及が多い。

日本語圏でも Zenn・Qiita・個人ブログにセルフホスト導入記事が存在し、workspace 系 OSS の中では比較的情報が充実している。英語ドキュメントが中心だが、基本的な操作の日本語情報は見つかりやすい。

ossalt での文脈では「Notion をチームドキュメントとして使っていたが、コストを下げてセルフホストに移したい」という SMB・スタートアップからの需要が主になると推定される。

## ossaltにおける推奨文脈

Outline を推薦すべき文脈：

1. **「チームの社内 wiki・ナレッジベースとして Notion を使っている」** — 最も素直な置き換え候補。チーム協調機能が充実している。
2. **「Confluence が高い・重い、OSS に移りたい」** — Confluence 代替としての訴求力が高い。
3. **「Notion のデータベース機能は使っておらず、ドキュメント管理が主な用途」** — 機能を絞ってシンプルに運用できる。
4. **「Slack 連携・外部ツール統合が重要なチーム」** — インテグレーションの豊富さが差別化になる。

Outline を推薦しにくい文脈：

- タスク管理・カンバンボード・カレンダーが必要な場合
- 個人の PKM 目的（チーム用途に特化している）
- オフライン動作が必要な場合
- BSL 1.1 ライセンスに抵触する用途（競合製品開発等）
- AI 機能を組み込みで使いたい場合

## Open questions

- BSL 1.1 ライセンスは日本の企業の法務チェックで問題になるケースがあるか
- Outline の全文検索における日本語精度（分かち書き対応状況）
- Notion から Outline への移行ツール・手順の実用性
- マネージドホスト版（getoutline.com）の料金体系は ossalt ユーザーのコスト削減動機を満たすか
- Confluence からの移行案件で Outline が選ばれているケースの日本語圏での実績
- Outline の AI 機能追加ロードマップの有無

## Evidence sources

- https://www.getoutline.com/
- https://github.com/outline/outline

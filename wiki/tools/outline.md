---
type: tool
slug: outline
name: Outline
category: knowledge-base
github: https://github.com/outline/outline
stars: "30k"
stars_num: 30000
language: TypeScript
last_commit: 2026-04-04
license: BSL 1.1 (Business Source License)
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - notion
  - confluence
related_tools:
  - appflowy
  - affine
---

# Outline

## 一言定義

チーム Wiki・ナレッジベース特化の OSS。Confluence / Notion のチームドキュメント用途の代替。

## 主な機能

- チームドキュメント・Wiki 管理
- リアルタイム共同編集（Multiplayer）
- 権限管理（チーム・コレクション単位）
- 全文検索
- Slack / GitHub / Google 連携
- API（RESTful）
- 公開共有（読み取り専用 URL）
- ダークモード対応

## Positioning

Notion や Confluence の「チームドキュメント基盤」用途に特化した OSS。AppFlowy や AFFiNE と比べると、データベース機能・タスク管理はなく「ドキュメント・Wiki」に集中している。シンプルさが強みで、チームの技術ドキュメントや社内 Wiki のホスティングに向いている。ライセンスが BSL 1.1 のため、商用利用には注意が必要。 [Source](https://www.getoutline.com/)

## 強み

- チーム Wiki 用途に特化したクリーンな UI
- リアルタイム共同編集が安定している
- Slack との連携が強く、Slack で検索すると Outline のドキュメントも見つかる
- stars 3万超の成熟したコミュニティ

## 弱み・注意点

- ライセンスが BSL 1.1（商用 SaaS 提供は制限あり。4年後 Apache-2.0 に移行）
- データベース・タスク管理機能がないため Notion の全機能代替ではない
- セルフホスト版は S3 互換ストレージ（ファイル添付用）が必要
- 個人用途より組織・チーム用途前提の設計

## どんなユーザーに向くか

- **チームの社内 Wiki を構築したい：** 技術ドキュメント・onboarding・ナレッジベースを整備したいチーム
- **Confluence からの脱出：** Confluence の重さと高コストから脱したいエンジニアチーム
- **Notion のドキュメント部分だけを代替したい：** Notion のデータベース機能は使っておらず、ドキュメントのみ移行したい場合

## セルフホスト難易度

**難易度：** 中

PostgreSQL・Redis・S3互換ストレージ（MinIO 等）が必要。Docker Compose での構成ガイドが整備されており、Mattermost と同程度の難易度。

```bash
git clone https://github.com/outline/outline
cd outline
cp .env.sample .env
# .env に DB・Redis・S3・認証情報を設定
docker compose up -d
```

詳細は [公式セルフホストガイド](https://docs.getoutline.com/s/hosting) を参照。

## 日本語圏での採用状況

日本での採用事例がちらほら見られる。技術系スタートアップ・エンジニアチームでの利用報告が Zenn・Qiita に存在する。Confluence からの移行事例も一部あり。ただし日本語公式ドキュメントはなく、設定の日本語情報は限られる。

## ossaltにおける推奨文脈

`wiki/saas/notion.md` から「チーム Wiki・ナレッジベース」用途のユーザーへの候補として紹介する。「オールインワンワークスペースが必要」なら AppFlowy、「Wiki 専用でシンプルに」なら Outline という分岐を示す。BSL ライセンスの制約について明記する。

## Open questions

- BSL 1.1 ライセンスの実際の制約（社内利用 / 外部向け利用での違い）
- Outline の Notion インポート機能の精度
- 日本の技術系スタートアップでの採用率と導入障壁

## Evidence sources

- https://www.getoutline.com/
- https://github.com/outline/outline
- https://docs.getoutline.com/s/hosting
- https://ossalt.jp/alternatives/notion

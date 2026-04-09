---
type: tool
slug: nocodb
name: NocoDB
category: no-code-database
github: https://github.com/nocodb/nocodb
stars: "51k"
stars_num: 51000
language: TypeScript
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - airtable
related_tools:
  - baserow
  - teable
---

# NocoDB

## 一言定義

既存 DB をスプレッドシート UI で操作する OSS。Airtable 代替の最有力候補。

## 主な機能

- 既存 DB への接続（MySQL / PostgreSQL / SQLite / MariaDB / SQL Server）
- グリッド・ガレリー・カンバン・フォーム・カレンダービュー
- REST API / GraphQL API の自動生成
- ロールベースアクセス制御
- ワークフロー自動化（Webhook・外部 API 連携）
- フォームビルダー（外部向けフォーム公開）
- CSV インポート / エクスポート

## Positioning

Airtable 代替のなかで「既存データベースへの接続」という独自ポジションを持つ。Baserow や Teable がゼロから構築するノーコード DB なのに対し、NocoDB は「すでに PostgreSQL や MySQL がある」チームが UI を追加する用途に特化している。REST / GraphQL API の自動生成はデベロッパー向けの強みになる。 [Source](https://nocodb.com/)

## 強み

- 既存 DB に接続するだけで即座に Airtable ライクな UI が使える（データ移行不要）
- REST / GraphQL API が自動生成され、外部ツールとの連携が容易
- TypeScript 製で stars 5万超の成熟したコミュニティ
- Docker 一発で起動できる低い導入障壁

## 弱み・注意点

- 既存 DB 前提の設計のため、ゼロからスプレッドシートとして使いたい場合は Baserow のほうが直感的
- Airtable のインターフェースビルダー・高度な自動化には届かない
- AGPL-3.0 のため、SaaS 提供する場合はソース公開義務あり
- UI の洗練度は Airtable や Baserow に比べてやや粗い部分がある

## どんなユーザーに向くか

- **既存 DB を非エンジニアに使わせたい：** PostgreSQL の中身を CSV ではなく UI で操作させたいエンジニアチーム
- **Airtable のコストを削減したい：** データはすでに自社 DB にあり、UI だけ欲しい場合
- **API ドリブンな開発：** バックエンドの CMS・管理画面を素早く作りたいデベロッパー

## セルフホスト難易度

**難易度：** 低

SQLite をバンドルしているため、外部 DB なしでも起動できる。既存 DB への接続も設定 UI から行える。

```bash
docker run -d \
  --name nocodb \
  -p 8080:8080 \
  -v nocodb_data:/usr/app/data/ \
  nocodb/nocodb:latest
```

詳細は [公式インストールガイド](https://docs.nocodb.com/getting-started/self-hosted/installation/) を参照。

## 日本語圏での採用状況

日本での認知度は上昇中。Zenn・Qiita に導入記事が散見されるが、Airtable 代替として本番利用している事例の情報は少ない。「PostgreSQL に管理画面を追加する」ユースケースでの紹介が多い。

## ossaltにおける推奨文脈

`wiki/saas/airtable.md` から「既存 DB 活用」ユーザーへの第一候補として紹介する。「ゼロからノーコード DB を構築したい」場合は Baserow、「大量データ対応が必要」なら Teable を並置して分岐を示す。API 自動生成の強みは開発者向けセクションで強調する。

## Open questions

- NocoDB の既存 DB 接続でのセキュリティリスク（DB 認証情報の管理方法）
- Airtable の自動化機能を NocoDB + n8n の組み合わせで代替できるか
- 2026 年時点での UI 改善状況（Airtable との差が縮まっているか）

## Evidence sources

- https://nocodb.com/
- https://github.com/nocodb/nocodb
- https://docs.nocodb.com/getting-started/self-hosted/installation/
- https://ossalt.jp/alternatives/airtable

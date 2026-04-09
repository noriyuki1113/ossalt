---
type: tool
slug: baserow
name: Baserow
category: no-code-database
github: https://github.com/bram2w/baserow
stars: "12k"
stars_num: 12000
language: Python / Vue.js
last_commit: 2026-04-03
license: MIT (Core) / Commercial (Premium/Enterprise)
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 3
replaces:
  - airtable
related_tools:
  - nocodb
  - teable
---

# Baserow

## 一言定義

ゼロから構築するノーコード DB の OSS。Airtable のクリーンな代替として既存 DB 依存なしに使える。

## 主な機能

- グリッド・ギャラリー・フォーム・カレンダービュー
- カスタムフィールドタイプ（テキスト・数値・リンク・添付ファイル等）
- プラグインシステム（カスタムフィールドタイプの拡張）
- テーブル間のリンクフィールド
- REST API（自動生成）
- チームコラボレーション・権限管理
- Webhook・外部連携

## Positioning

NocoDB が「既存 DB へのフロント追加」を得意とするのに対し、Baserow は「ゼロからノーコード DB を構築する」用途に特化している。Airtable に最も近い体験を提供しつつ、セルフホスト可能なことが差別化ポイント。プラグインシステムによるカスタムフィールドタイプの拡張は開発者向けの強み。 [Source](https://baserow.io/)

## 強み

- Airtable に近いゼロから構築する UX で、既存 DB がなくても始められる
- MIT ライセンスのコアは永久無料でセルフホスト可能
- プラグインシステムでカスタムフィールドタイプを追加できる
- クラウド版と OSS 版の両方を提供しており、移行パスが柔軟

## 弱み・注意点

- NocoDB のような「既存 DB への接続」機能がない（Baserow 独自の DB を使う）
- stars 約 1.2 万と NocoDB より少なく、コミュニティが小さい
- Premium 機能（高度な権限・監査ログ等）は有料版のみ
- Airtable のインターフェースビルダー相当の機能はまだない

## どんなユーザーに向くか

- **Airtable をゼロから置き換えたい：** 既存 DB はなく、スプレッドシートのように使えるノーコード DB が欲しいチーム
- **プラグインでカスタマイズしたい開発者：** 独自フィールドタイプが必要な場合
- **クラウド → セルフホストの段階移行：** Baserow クラウドで評価してからセルフホストに移行したい場合

## セルフホスト難易度

**難易度：** 低〜中

PostgreSQL が必要だが、Docker Compose での展開が整備されており、比較的容易。

```bash
# Docker Compose での起動例
curl -o docker-compose.yml https://baserow.io/docker-compose.yml
docker compose up -d
```

詳細は [公式インストールガイド](https://baserow.io/docs/installation/install-with-docker) を参照。

## 日本語圏での採用状況

日本での認知度は NocoDB より低い。Airtable 代替として Baserow を紹介する日本語記事はわずか。「ゼロから構築するノーコード DB」という用途での日本語情報の空白地帯で、ossalt の編集価値が高い。

## ossaltにおける推奨文脈

`wiki/saas/airtable.md` から「既存 DB がなく、ゼロからノーコード DB を構築したい」ユーザーへの候補として紹介する。「既存 DB 接続」なら NocoDB、「大量データ対応」なら Teable、「ゼロ構築」なら Baserow という三択の分岐を示す。

## Open questions

- Baserow のプラグインエコシステムの現状（サードパーティプラグインの数・質）
- MIT コアと Premium の機能差の最新状況
- Airtable からのデータ移行（CSV 以外の方法）の実用度

## Evidence sources

- https://baserow.io/
- https://github.com/bram2w/baserow
- https://baserow.io/docs/installation/install-with-docker

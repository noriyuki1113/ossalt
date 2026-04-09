---
type: tool
slug: teable
name: Teable
category: no-code-database
github: https://github.com/teableio/teable
stars: "16k"
stars_num: 16000
language: TypeScript
last_commit: 2026-04-05
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: low
source_count: 2
replaces:
  - airtable
related_tools:
  - nocodb
  - baserow
---

# Teable

## 一言定義

PostgreSQL ネイティブの大量データ対応ノーコード DB。Airtable 代替の新興株で NocoDB・Baserow より高いスケール性が特徴。

## 主な機能

- グリッド・ギャラリー・カンバン・フォームビュー
- PostgreSQL を直接バックエンドとして使用
- 数百万レコードへの対応
- REST API（自動生成）
- フォームビルダー
- チームコラボレーション・権限管理
- Airtable からのインポート

## Positioning

NocoDB・Baserow と同じ Airtable 代替カテゴリだが、「PostgreSQL ネイティブ」で大量データを扱えることが最大の差別化。NocoDB が「既存 DB への接続フロント」、Baserow が「ゼロ構築ノーコード DB」とすれば、Teable は「PostgreSQL を直接使う高速ノーコード DB」という位置づけ。まだ比較的新しいプロジェクトで confidence: low に設定する。 [Source](https://teable.io/)

## 強み

- PostgreSQL ネイティブのため、既存 PG インフラとの親和性が高い
- 数百万レコード規模でのパフォーマンスが NocoDB・Baserow より優れる
- Airtable インポート機能あり
- TypeScript 製でフロントエンドの拡張がしやすい

## 弱み・注意点

- 2024〜2025 年に急成長したが、まだ比較的新しいプロジェクトで本番実績が少ない
- プラグイン・連携エコシステムは NocoDB・Baserow より小さい
- confidence: low — 情報源が少なく、長期的な開発継続性が未確認
- AGPL-3.0 のため SaaS 提供時はソース公開義務あり

## どんなユーザーに向くか

- **大量データを扱うノーコード DB が必要：** 数十万〜数百万レコードの運用が見込まれる場合
- **PostgreSQL 環境がすでにある：** 既存の PG インフラに乗せたい場合（NocoDB の接続フロントとは異なり、Teable が直接 PG に書く）
- **Airtable の行数上限に悩んでいる：** 大量データで Airtable が遅くなっている場合の移行先

## セルフホスト難易度

**難易度：** 中

PostgreSQL と Teable サーバーの Docker Compose 構成。PostgreSQL 管理の知識が必要。

```bash
git clone https://github.com/teableio/teable
cd teable
docker compose up -d
```

詳細は [公式ドキュメント](https://help.teable.io/deployment/docker-compose) を参照。

## 日本語圏での採用状況

日本での認知度は非常に低く、日本語情報はほぼ存在しない。Airtable 代替として NocoDB・Baserow より後から注目されているため、情報の空白地帯。confidence: low を維持しつつ、次回レビュー時に更新する。

## ossaltにおける推奨文脈

`wiki/saas/airtable.md` から「大量データ対応が必要」なユーザーへの選択肢として紹介する。まだ新興プロジェクトであることを明記し、本番利用前に十分な評価を推奨する注記を入れる。

## Open questions

- Teable の本番環境での安定性・パフォーマンス実績（2026年時点）
- NocoDB・Baserow との具体的なベンチマーク比較
- 開発チームの持続性・資金状況

## Evidence sources

- https://teable.io/
- https://github.com/teableio/teable

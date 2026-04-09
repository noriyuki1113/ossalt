---
type: category
slug: no-code-database
name: ノーコードデータベース
ossalt_category: no-code-database
tool_count: 3
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
---

# ノーコードデータベース

## 概要

SQL を書かずにデータベースをスプレッドシート感覚で操作・構築できるノーコードツールカテゴリ。Airtable がこのカテゴリを確立し、OSS 代替は「セルフホスト」「既存 DB 接続」「大規模データ対応」という3つの軸で分化している。

## なぜ今注目されているか

Airtable のフリープラン行数制限（1,000行/テーブル）とプロプランのコスト増が移行動機の主軸。加えて「業務データを自社 DB に置きたい」というデータガバナンス需要が高まっており、既存の PostgreSQL・MySQL に UI を追加するアプローチが注目されている。ノーコードツールの普及で「DB があるが非エンジニアが操作できない」チームの課題解決ニーズも増加。

## 主要ツールの勢力図

| ツール | 位置づけ | 強み | stars |
|---|---|---|---|
| NocoDB | 既存 DB へのフロント追加 | REST/GraphQL API 自動生成・SQLite バンドル | 51k |
| Baserow | ゼロ構築ノーコード DB | Airtable 近似 UX・プラグイン拡張・MIT コア | 12k |
| Teable | PostgreSQL ネイティブ大規模向け | 数百万行対応・PG 直接利用 | 16k |

**用途別の使い分け：**
- 既存 DB（PostgreSQL/MySQL）に UI を追加したい → NocoDB
- ゼロから Airtable ライクに構築したい → Baserow
- 大量データ（100万行〜）を扱う → Teable

## 注目の動き（直近）

- NocoDB が v2 系で UI を大幅刷新し、Airtable との UX 差を縮小
- Teable が 2024〜2025 年に急成長し、PostgreSQL ネイティブという独自ポジションを確立
- Baserow がプラグインマーケットプレイスを整備し、カスタムフィールドタイプの拡張性を強化

## 日本語圏での温度感

NocoDB は「PostgreSQL に管理画面を追加する」ユースケースで日本語記事が増えている。Baserow・Teable の日本語情報は少なく、ossalt の編集価値が高い。「Airtable の代替」という文脈での検索需要はあるが、具体的な移行事例は少ない。

## ossaltにおける推奨方針

「既存 DB があるか・ゼロ構築か・大量データか」の三択で候補を絞り込む構造にする。API 自動生成（REST/GraphQL）の有無は開発者ユーザーへの重要訴求点として強調する。Teable は confidence: low のため、本番利用前の十分な評価を推奨する注記を入れる。

## Open questions

- NocoDB の既存 DB 接続でのセキュリティ実態（接続情報の管理方法）
- Airtable の自動化機能を OSS ツール単体で代替できるか（n8n 等との組み合わせ必要）
- Teable の本番安定性の実績（2026年時点）

## Evidence sources

- https://nocodb.com/
- https://baserow.io/
- https://teable.io/
- https://ossalt.jp/alternatives/airtable

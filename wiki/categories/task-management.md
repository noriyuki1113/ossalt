---
type: category
slug: task-management
name: タスク管理
ossalt_category: task-management
tool_count: 2
last_reviewed: 2026-04-09
confidence: medium
source_count: 3
---

# タスク管理

## 概要

個人〜小規模チームのタスク・プロジェクトをリスト・カンバン・ガントで管理するカテゴリ。Asana・Todoist が主要 SaaS。プロジェクト管理（Jira/Plane）より軽量で、ドキュメント統合型ワークスペース（Notion/AppFlowy）よりタスクに特化している。

## なぜ今注目されているか

Asana・Todoist のフリープラン制限と月額コストへの不満。特に非エンジニア職種（マーケティング・HR・オペレーション）がシンプルなタスク管理を求めて代替を探すケースが多い。「スプリントは不要だがカンバンは欲しい」という中間的なニーズに対応する OSS が整ってきた。

## 主要ツールの勢力図

| ツール | 位置づけ | 強み | stars |
|---|---|---|---|
| Vikunja | シンプル軽量タスク管理 | CalDAV 対応・Go 製軽量・Asana/Todoist インポーター | 4.5k |
| AppFlowy | タスク＋ドキュメント統合 | カンバン・ドキュメントを一体管理 | 62k |

**用途別の使い分け：**
- タスク管理だけシンプルに → Vikunja
- タスクとドキュメントを統合したい → AppFlowy
- スプリント管理が必要 → Plane（プロジェクト管理カテゴリへ）

## 注目の動き（直近）

- Vikunja が v0.24 系でリアルタイム通知・繰り返しタスク改善を実装
- AppFlowy がタスク管理機能を強化し、Asana 代替としての利用事例が増加
- カレンダー・CalDAV 連携でスマホのカレンダーアプリとの同期需要が高まっている

## 日本語圏での温度感

日本では Asana より Trello（カンバン）や Notion（タスク DB）の利用が多く、「Asana 代替」という文脈での検索は限定的。Vikunja の日本語情報はほぼなく、自己ホスト志向の個人ユーザーへの訴求余地がある。「CalDAV 対応のセルフホスト型タスク管理」という切り口が日本の技術系個人に刺さる可能性。

## ossaltにおける推奨方針

「タスク管理だけか、ドキュメントも統合したいか」を先に確認する。前者なら Vikunja（軽量・セルフホスト容易）、後者なら AppFlowy を推奨。スプリント管理が必要になったら Plane へのアップグレードを示す。非エンジニアが多いチームには Vikunja の UI の習得しやすさを強調する。

## Open questions

- Vikunja のチームコラボレーション機能の成熟度（Asana のチーム管理に近づいているか）
- 日本の「個人 GTD ユーザー」が Todoist → Vikunja に移行するための障壁
- AppFlowy をタスク管理専用として使うユーザーの実態

## Evidence sources

- https://vikunja.io/
- https://appflowy.com/
- https://ossalt.jp/alternatives/asana

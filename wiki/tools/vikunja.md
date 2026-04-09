---
type: tool
slug: vikunja
name: Vikunja
category: task-management
github: https://github.com/go-vikunja/vikunja
stars: "4.5k"
stars_num: 4500
language: Go
last_commit: 2026-04-03
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 3
replaces:
  - asana
  - todoist
related_tools:
  - appflowy
  - plane
---

# Vikunja

## 一言定義

軽量・セルフホスト型タスク管理 OSS。Asana / Todoist の代替として個人〜小規模チームに向く。

## 主な機能

- タスク管理（リスト・カンバン・ガントビュー）
- チームコラボレーション・共有リスト
- 繰り返しタスク・期日・リマインダー
- CalDAV 連携（カレンダーアプリと同期）
- Asana / Todoist / Trello などからのマイグレーション機能
- REST API
- モバイルアプリ（iOS / Android）・デスクトップアプリ

## Positioning

Asana・Todoist の代替として最もシンプルな OSS。Plane（エンジニア向け PM ツール）と比べると「汎用タスク管理」に特化しており、スプリント管理やアナリティクスはない。AppFlowy と比べると「タスク管理のみ」に絞られており、ドキュメント管理は対象外。シンプルさが最大の強みで、Go 製の軽量バイナリは小さいサーバーでも動作する。 [Source](https://vikunja.io/)

## 強み

- Go 製で非常に軽量。512MB RAM のサーバーでも動作する
- Asana / Todoist / Trello からのマイグレーション機能あり
- CalDAV 対応でカレンダーアプリ（Apple Calendar・Thunderbird）との同期が可能
- シンプルな UI で非エンジニアにも使いやすい

## 弱み・注意点

- stars が約 4.5k と他の候補より少なく、コミュニティが小さい
- Asana のような「ポートフォリオ管理」「OKR 追跡」には非対応
- ファイル添付・コメント機能は基本的で、Asana の代替として機能差がある
- プラグイン・連携エコシステムが限定的

## どんなユーザーに向くか

- **Asana フリープランからの脱出：** タスクとリストの基本機能で十分で、セルフホストしたい個人・小規模チーム
- **TodoistをOSSで代替したい：** 個人の GTD / タスク管理を自前サーバーで運用したい場合
- **CalDAV 連携が必要：** 既存のカレンダーアプリとタスクを同期したい場合

## セルフホスト難易度

**難易度：** 低

最も導入が簡単なカテゴリ。SQLite をデフォルト DB として使えるため、外部 DB 不要で起動できる。

```bash
docker run -p 3456:3456 \
  -v vikunja_data:/app/vikunja/files \
  vikunja/vikunja
```

詳細は [公式インストールガイド](https://vikunja.io/docs/install/) を参照。

## 日本語圏での採用状況

日本での認知度は低く、Zenn・Qiita での言及はわずか。Asana / Todoist の代替を日本語で探しているユーザーに Vikunja の情報がほぼ届いていない状態。ossalt の編集価値は高い。

## ossaltにおける推奨文脈

`wiki/saas/asana.md` から「シンプルなタスク管理だけでいい・セルフホストしたい」ユーザーへの第一 OSS 候補として紹介する。「ドキュメントもまとめたい」なら AppFlowy、「スプリント管理が必要」なら Plane に誘導する三択の分岐を示す。

## Open questions

- Vikunja の開発ペース・メンテナの持続性（コアコントリビューター数の状況）
- CalDAV 連携の安定性（Google Calendar・Apple Calendar との実用度）
- Asana のチーム管理機能をどこまで代替できるか（権限・承認フロー等）

## Evidence sources

- https://vikunja.io/
- https://github.com/go-vikunja/vikunja
- https://vikunja.io/docs/install/
- https://ossalt.jp/alternatives/asana

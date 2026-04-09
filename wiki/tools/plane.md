---
type: tool
slug: plane
name: Plane
category: project-management
github: https://github.com/makeplane/plane
stars: "32k"
stars_num: 32000
language: Python / TypeScript
last_commit: 2026-04-05
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - jira
related_tools:
  - gitlab
  - vikunja
---

# Plane

## 一言定義

Jira の OSS 代替。スプリント・バックログ・ロードマップを備えたエンジニアリング向けプロジェクト管理ツール。

## 主な機能

- イシュートラッキング（優先度・ステータス・担当者・ラベル）
- サイクル（スプリント相当）・バックログ管理
- モジュール（エピック相当）
- ロードマップビュー
- アナリティクス（バーンダウン等）
- Jira インポーター
- カンバン・リスト・スプレッドシート・カレンダービュー
- GitHub / GitLab 連携

## Positioning

Jira の直接代替を目指す OSS。Linear のシンプルな UX と Jira の機能の豊富さの中間を狙った設計。GitLab Issues と比べると「プロジェクト管理専用ツール」として設計されており、コードリポジトリへの依存がない。 [Source](https://plane.so/)

## 強み

- Jira のスプリント・エピック・ロードマップを OSS で再現
- Jira インポーターがあり、既存データを移行できる
- Linear に近いクリーンな UI で、Jira より習得しやすい
- セルフホスト版は AGPL-3.0 で無料

## 弱み・注意点

- まだ比較的新しいプロジェクトで、機能の安定性・完成度に波がある
- Jira の複雑なカスタムワークフロー・権限スキームは再現できない
- コミュニティ・プラグインエコシステムは Jira に大きく劣る
- AGPL-3.0 のため、SaaS として提供する場合はソース公開義務あり

## どんなユーザーに向くか

- **Jira が重すぎると感じているエンジニアチーム：** スプリント管理は必要だが Jira の設定地獄から脱出したい場合
- **Linear のシンプルさを求めつつセルフホストしたい：** SaaS への依存を避けたいチーム
- **スタートアップ・中小開発チーム：** 10〜30人規模でアジャイル開発をしている場合

## セルフホスト難易度

**難易度：** 中

Docker Compose での展開が可能だが、Redis・PostgreSQL・Minio（オブジェクトストレージ）が必要で、Mattermost より構成がやや複雑。

```bash
git clone https://github.com/makeplane/plane
cd plane
cp .env.example .env
docker compose up -d
```

詳細は [公式セルフホストドキュメント](https://docs.plane.so/self-hosting) を参照。

## 日本語圏での採用状況

日本での認知度は低く、Jira 代替として Plane を検討している日本語情報はほぼない。Linear への移行事例は増えているが、Plane（OSS）の事例はまだ稀。ossalt の編集価値が高い。

## ossaltにおける推奨文脈

`wiki/saas/jira.md` からの第一 OSS 候補として紹介する。「Jira の複雑さから解放されつつスプリント管理は残したい」チームに推奨。コードと Issue を同一プラットフォームで管理したい場合は GitLab Issues を並置して選択肢を示す。

## Open questions

- Plane の本番安定性は 2026 年時点でプロダクション利用に耐えるか
- Jira インポーターの対応フィールド・精度の現状
- 日本での導入事例・コミュニティの状況

## Evidence sources

- https://plane.so/
- https://github.com/makeplane/plane
- https://docs.plane.so/self-hosting
- https://ossalt.jp/alternatives/jira

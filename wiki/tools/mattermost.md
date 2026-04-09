---
type: tool
slug: mattermost
name: Mattermost
category: team-communication
github: https://github.com/mattermost/mattermost
stars: "31k"
stars_num: 31000
language: Go / TypeScript
last_commit: 2026-04-07
license: MIT (Team Edition) / Commercial (Enterprise)
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - slack
related_tools:
  - rocketchat
  - zulip
---

# Mattermost

## 一言定義

Slack 最有力 OSS 代替。セルフホスト・Slack インポート対応のチャットプラットフォーム。

## 主な機能

- チャンネルベースのメッセージング（Slack に近い UI）
- スレッド・DM・絵文字リアクション
- ファイル共有・検索（全文検索）
- Slash コマンド・Webhook・Bot 連携
- 公式 Slack インポートツール
- 音声通話（Calls プラグイン）
- モバイルアプリ（iOS / Android）

## Positioning

Slack の代替候補のなかで「UI の近さ」と「移行のしやすさ」を最も重視した設計。Rocket.Chat より設定が少なくシンプル、Zulip よりチャット文化に近い。エンタープライズ向け機能（コンプライアンス・監査ログ・LDAP）は有料 Enterprise 版に分離されている。 [Source](https://mattermost.com/)

## 強み

- Slack に最も近い UX で移行時の習慣変容が少ない
- 公式 Slack インポートツールがあり、メッセージ履歴を移行できる
- Go 製で軽量。小さい VPS でも動作する
- MIT ライセンスのコア部分は永久無料でセルフホスト可能

## 弱み・注意点

- 音声/ビデオは Calls プラグインで後付けであり、Slack のハドル相当の体験にはやや劣る
- エンタープライズ機能（LDAP・コンプライアンス）は有料版のみ
- プラグインエコシステムは Slack の App Store と比べると規模が小さい

## どんなユーザーに向くか

- **Slack フリープランからの脱出：** メッセージ保持制限に不満があり、セルフホストで解決したいチーム
- **コスト削減が目的の中小チーム：** 10〜50人規模でインフラ管理ができるエンジニアがいる場合
- **Slack ライクな体験を維持したい：** UI の変化を最小限にしたい非エンジニアが多いチーム

## セルフホスト難易度

**難易度：** 低

PostgreSQL + Mattermost Server の Docker Compose 構成が基本。公式ドキュメントが充実しており、1〜2時間で立ち上げられる。

```bash
# Docker Compose での起動例
git clone https://github.com/mattermost/docker
cd docker
cp env.example .env
docker compose up -d
```

詳細は [公式インストールガイド](https://docs.mattermost.com/install/install-docker.html) を参照。

## 日本語圏での採用状況

日本での認知度は Slack に比べると低いが、セキュリティ要件の高い金融・公共系での採用事例がある。日本語の公式ドキュメントは限定的で、コミュニティフォーラムも英語中心。ossalt での日本語解説の価値は高い。

## ossaltにおける推奨文脈

`wiki/saas/slack.md` からの第一候補として紹介する。「Slack の見た目を維持したまま移行したい」「フリープランのメッセージ上限を解除したい」というニーズに最も直接的に応える。インフラ管理ができるエンジニアがいるチームを前提として推奨する。

## Open questions

- Mattermost の Calls プラグインは 2026 年時点で Slack ハドルの代替として実用レベルか
- 日本での導入支援ベンダー・パートナーの状況
- Team Edition（無料）と Enterprise Edition の機能差の最新状況

## Evidence sources

- https://mattermost.com/
- https://github.com/mattermost/mattermost
- https://docs.mattermost.com/install/install-docker.html
- https://ossalt.jp/alternatives/slack

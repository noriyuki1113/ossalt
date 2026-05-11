---
type: tool
slug: hermes
name: Hermes Agent
category: ai-agent
github: https://github.com/NousResearch/hermes-agent
stars: "140k"
stars_num: 140000
language: Python
last_commit: 2026-05-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: false
last_reviewed: 2026-05-11
confidence: medium
source_count: 1
replaces:
  - openai-assistants
  - zapier-ai
related_tools:
  - n8n
  - open-interpreter
---

# Hermes Agent

## 一言定義

VPS・Mac・スマホどこでも動く、スキル・記憶・スケジュール実行を備えたOSSエージェントフレームワーク。Telegram等のメッセージアプリから「ポケットのAI」として使える。

## 主な機能

- **Skills**：再利用可能な自動化プレイブック（標準91件・コミュニティ520件以上）
- **Memory**：`user.md` / `memory.md` でセッション跨ぎの文脈を保持
- **Soul**：`soul.md` でエージェントの個性・トーンをカスタマイズ
- **Crons**：自然言語でスケジュール実行（「毎朝6時にX」で設定完了）
- **Self-Improving Loop**：会話からスキルを自動抽出・更新
- Telegram / Discord / Slack / WhatsApp / iMessage 接続
- Docker コンテナ分離で複数エージェントを独立運用

## Positioning

Claude Code が「デスクで使うコーディングアシスタント」なら、Hermes は「外出先でTelegramから話しかけるオンゴーイングエージェント」。定期バッチ・コミュニティ投稿・サーバーヘルスチェック等の「スケジュール付き自動化」が最も差別化されている。OpenAI Assistants の代替としてはAPIコスト不要（ChatGPTサブスク経由のOAuth認証も可）。

## 強み

- Cron機能が強力。自然言語でスケジュール設定でき、GitHub Actionsより柔軟
- スキルがMarkdownファイルなのでバージョン管理しやすく、エージェント間で移植できる
- Docker分離により「マーケ担当Hermes」「財務担当Hermes」等を独立して運用可能
- 公式Anthropicスキル16件を含む520件以上のコミュニティスキルが既製品として使える
- ChatGPT OAuth経由でAPIトークンを消費せずに利用可能

## 弱み・注意点

- コンテキスト上限（約136K tokens）に達すると自動compactionが走り、挙動が変わる
- Telegram経由ではコンテキスト使用量が見えないため、コードの大規模編集には向かない
- 初回ダッシュボード起動はトンネル設定が必要でやや手間
- cronセッションは再帰的に新規cronを作れないため、ワークフローは自己完結の設計が必要

## どんなユーザーに向くか

- **外出中も自動化を動かしたい個人事業主・スタートアップ：** デスクを離れてもTelegramで監視・指示できる
- **定期バッチを自然言語で管理したい：** GitHubのcron式より直感的に「毎朝6時に〇〇」と設定できる
- **複数役割のAIを分離管理したい：** Dockerコンテナ分離でAPIキーと記憶を役割別に独立させられる

## セルフホスト難易度

**難易度：** 低〜中

HostingerのVPSマーケットプレイスにワンクリックインストールがあり、Dockerコンテナが自動展開される。Telegramボットのセットアップ（BotFather→トークン取得→ユーザーID設定）が最初の山だが、Hermes自身がガイドしてくれる。

```bash
# SSH後、Hermesに設定をガイドさせる
# （CLIでそのまま質問するだけでセットアップが進む）

# APIキーは会話に貼らず、コマンドで設定
hermes config set GITHUB_TOKEN your_token_here
# → /opt/data/.env に保存されモデルからは見えない
```

GitHubへの自動バックアップは最初に設定すべき最重要cron。VPSが壊れても`skills/`と`memory/`ファイルから即復元できる。

## 日本語圏での採用状況

2025〜2026年に英語圏で急成長中（140K stars）だが、日本語の導入事例・記事はまだ少ない。Zapier AI代替として自動化用途での紹介が増えつつある。

## ossaltにおける推奨文脈

OpenAI Assistants・Zapier AI・n8n の代替として紹介する。「サーバー側で動かす常駐AIエージェント」を探しているユーザーへ。n8n がノーコードワークフロー寄りなのに対し、Hermes は「会話で育てるエージェント」寄り。

## Open questions

- NousResearch の Hermes モデルシリーズ（LLM）と hermes-agent フレームワークの関係性の整理
- OpenClaw（350K stars）との機能差の最新状況（2026年時点）
- 日本語UIサポートの有無

## Evidence sources

- ユーザー提供の詳細レポート（2026-05-11）

---
type: tool
slug: zulip
name: Zulip
category: team-communication
github: https://github.com/zulip/zulip
stars: "22k"
stars_num: 22000
language: Python / TypeScript
last_commit: 2026-04-05
license: Apache-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 3
replaces:
  - slack
related_tools:
  - mattermost
  - rocketchat
---

# Zulip

## 一言定義

スレッドファーストの OSS チャット。非同期・大規模チームでの情報管理に特化した Slack 代替。

## 主な機能

- ストリーム（チャンネル）＋ トピック（スレッド）の二層構造
- 強力な全文検索
- キーボードショートカット中心の操作
- Markdown・数式（LaTeX）・コードブロック対応
- メール通知との統合（メールから返信可能）
- LDAP / SAML / OAuth 認証
- REST API・Webhook
- モバイルアプリ（iOS / Android）

## Positioning

Mattermost・Rocket.Chat が「Slack の代替」として Slack に近い UX を目指すのに対し、Zulip は「スレッドファースト」という独自のコミュニケーションモデルを持つ。チャンネル内にトピック（件名）がある構造はメールに近く、非同期コミュニケーションの多い大規模チームに向く。Dropbox・Wikimedia・Recurse Center などの事例がある。 [Source](https://zulip.com/)

## 強み

- トピック構造により、大量のメッセージが流れても文脈が追いやすい
- Apache-2.0 ライセンスで完全 OSS（Enterprise 機能も含む）
- 非同期コミュニケーションを前提とした設計で、「通知に追われない」文化を作りやすい
- メール通知からの返信など、非エンジニアにも使いやすい機能

## 弱み・注意点

- Slack や Mattermost とは UX が大きく異なるため、チームの習慣変容コストが高い
- 「トピック」の概念を全員が理解して使わないと機能しにくい
- 音声/ビデオ通話は内蔵されておらず、外部ツールが必要
- コミュニティは Mattermost・Rocket.Chat より小さい

## どんなユーザーに向くか

- **非同期コミュニケーション重視のチーム：** タイムゾーンが分散している分散チーム・リモートワーク中心の組織
- **大規模なオープンコミュニティ：** OSS プロジェクトや研究コミュニティなど、外部参加者が多い場合
- **「Slack 疲れ」から脱出したいチーム：** リアルタイム通知に追われる文化を変えたい場合

## セルフホスト難易度

**難易度：** 中

Python ベースの独自スタックで、PostgreSQL・Redis・RabbitMQ・Nginx が必要。Docker での展開は可能だが、Zulip 独自の構成を理解する必要がある。

```bash
# Docker での起動（開発・評価用）
docker run -d \
  -e SETTING_EXTERNAL_HOST=your.domain.com \
  -e SETTING_ZULIP_ADMINISTRATOR=admin@your.domain.com \
  -p 443:443 zulip/docker-zulip:latest
```

詳細は [公式セルフホストガイド](https://zulip.readthedocs.io/en/stable/production/install.html) を参照。

## 日本語圏での採用状況

日本での認知度は低く、Slack 代替として Zulip を選ぶ事例はほぼ見当たらない。学術・研究コミュニティでの利用が中心。日本語 UI は対応しているが、コミュニティ情報はほぼ英語。ossalt での日本語解説価値は高いが、需要は Mattermost・Rocket.Chat より限定的。

## ossaltにおける推奨文脈

`wiki/saas/slack.md` から「非同期コミュニケーション・大規模チーム」用途のユーザーへの選択肢として紹介する。「Slack に近い体験を維持したい」なら Mattermost、「コミュニケーションモデルを変えてでも非同期に最適化したい」なら Zulip、という分岐を明示する。

## Open questions

- Zulip のトピック構造に日本のチームが適応できるか（文化的な障壁の実態）
- 音声/ビデオ通話の対応計画（Jitsi Meet 等との統合状況）
- 日本語コミュニティ・導入支援の有無

## Evidence sources

- https://zulip.com/
- https://github.com/zulip/zulip
- https://zulip.readthedocs.io/en/stable/production/install.html

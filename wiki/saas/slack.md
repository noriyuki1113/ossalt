---
type: saas
slug: slack
name: Slack
category: team-communication
status: active
priority: high
pain_points:
  - monthly-cost
  - vendor-lock-in
  - data-ownership
  - message-retention-limits
  - self-hosting
decision_axes:
  - use-case-fit
  - self-host-difficulty
  - ops-burden
  - migration-friction
  - japanese-doc-availability
  - message-retention-policy
  - federation-support
last_reviewed: 2026-04-09
confidence: medium
source_count: 5
related_tools:
  - mattermost
  - rocketchat
  - zulip
related_category_pages:
  - wiki/categories/team-communication.md
related_comparison_pages:
  - wiki/comparisons/mattermost-vs-rocketchat.md
  - wiki/comparisons/mattermost-vs-zulip.md
---

# Slack

## Summary

Slack は、チームのリアルタイムコミュニケーションを中心に、ファイル共有・音声/ビデオ通話・ワークフロー自動化・外部サービス連携をまとめたクラウド SaaS である。ossalt においては、フリープランのメッセージ上限（90日）とプロプランの月額コスト増が代替検討の最大の起点になる。 [Source](https://slack.com/) [Source](https://ossalt.jp/alternatives/slack)

## Why it matters for ossalt

Slack は日本の中小チームにも広く普及しており、ossalt の検索意図で「Slack代替」は上位に入りやすい。一方、代替候補の Mattermost・Rocket.Chat・Zulip はいずれもセルフホスト前提で、インフラ管理コストの判断が必要になるため、比較の難度が高い。ossalt がこのギャップを埋めることで差別化できる。

## How Slack is positioned

Slack 公式は「ビジネスのための AI を活用したコラボレーションプラットフォーム」として訴求している。Salesforce 傘下に入って以降、AI 機能（Slack AI）・CRM 連携・エンタープライズ向け統合管理が強化されており、中小チーム向けから大企業向けへのシフトが進んでいる。 [Source](https://slack.com/)

## Why users look for alternatives

- **メッセージ保持制限**: フリープランでは直近90日分しか遡れず、知識蓄積に使いにくい
- **月額コスト**: プロプランは1ユーザー/月 $7.25〜（年払い）。人数が増えると急激に高くなる
- **ベンダーロックイン**: ワークフロー・連携設定がSlack専用で移行コストが高い
- **データ所有権**: メッセージデータがSlackのインフラに蓄積される
- **セルフホスト不可**: エンタープライズグリッドでも完全なオンプレ運用はできない

[Source](https://slack.com/intl/ja-jp/pricing) [Source](https://ossalt.jp/alternatives/slack)

## What ossalt should help users decide

1. メッセージ保持の完全性が必要か（フリープランの制約が致命的かどうか）
2. セルフホストによるデータ主権を取りたいか、管理コストを受け入れられるか
3. Slack の連携エコシステム（3000以上のアプリ）をどこまで依存しているか
4. チームの技術力：Docker/Kubernetes でのセルフホスト運用が可能か
5. 外部ゲスト・クライアントとの共有チャンネルをどう扱うか

## Core decision axes

### 1. Use-case fit

Slack の代替候補は「チャット中心」「スレッド中心」「メール代替」で異なる。Mattermost は Slack に最も近い UI/UX で移行摩擦が少ない。Zulip はスレッドファーストの独自モデルで、非同期コミュニケーションを重視するチームに向く。Rocket.Chat は機能が多い分、管理の複雑さも増す。 [Source](https://mattermost.com/) [Source](https://zulip.com/) [Source](https://www.rocket.chat/)

### 2. Self-host difficulty

Mattermost は Docker Compose 一発で起動でき、Slack 移行ガイドも充実している。Rocket.Chat は機能が豊富な分、設定項目が多く初期構成に時間がかかる。Zulip は Python ベースで、公式ドキュメントは充実しているが独自性が高い。 [Source](https://docs.mattermost.com/) [Source](https://docs.rocket.chat/) [Source](https://zulip.com/help/)

### 3. Ops burden

セルフホストに移行すると、障害対応・バックアップ・SSL更新・バージョンアップがチームの責務になる。小規模チームでは Mattermost Cloud（有料 SaaS 版）を使いつつ、将来的にセルフホストへ移行する段階的アプローチも現実的。 [Source](https://mattermost.com/pricing/)

### 4. Migration friction

Slack からの移行では、メッセージ履歴のエクスポート（Slack エクスポート形式）を各ツールがインポートできるかが重要。Mattermost は公式の Slack インポートツールを持つ。ワークフロー・Bot・連携アプリは個別再構築が必要になる。 [Source](https://docs.mattermost.com/onboard/migrating-to-mattermost.html)

### 5. Federation support

Zulip は XMPP/Matrix などのオープンプロトコルには非対応だが、Matrix プロトコルを使う Element（旧 Riot）は異なる組織間のフェデレーションが可能。Slack 代替を超えて「組織間通信」を視野に入れる場合は別の検討軸になる。

### 6. Japanese doc availability

Mattermost の日本語ドキュメントは一部存在するが、公式は英語中心。Rocket.Chat は日本語コミュニティが比較的活発。Zulip の日本語情報は少なく、導入障壁がやや高い。 [Source](https://ossalt.jp/alternatives/slack)

### 7. Message retention policy

フリーの Slack を使っているチームで「メッセージが消える」ことへの不満が最大の移行動機になりやすい。セルフホスト OSS に移行すれば、保持ポリシーは自分たちで設定できる。

## Candidate families

### Mattermost
Slack に最も近い UI を持つ OSS チャットプラットフォーム。Go + React 製。セルフホスト版は MIT ライセンス（一部機能はエンタープライズ版）。Slack インポートツールあり。チームが Slack の見た目を維持したまま移行したい場合の第一候補。 [Source](https://mattermost.com/)

### Rocket.Chat
機能の多さが特徴の OSS チャット。音声/ビデオ・オムニチャンネル（メール・SMS・ソーシャル統合）・マーケットプレイスを持つ。カスタマーサポート用途や多チャネル統合を必要とするチームに向く。セットアップの複雑さはトレードオフ。 [Source](https://www.rocket.chat/)

### Zulip
スレッドファーストの独自コミュニケーションモデルを持つ OSS。「topic」で会話を整理するため、非同期・大規模チームでの情報管理に強い。Dropbox・Wikimedia 等の事例あり。Slack とはモデルが異なるため、チームの習慣変容が必要。 [Source](https://zulip.com/)

## Editorial policy for this SaaS page

Slack の代替ページでは「移行の難易度」と「セルフホストの運用コスト」を正直に伝えることを優先する。各 OSS の機能比較だけでなく、「Slack をどの程度使い込んでいるか」によって適切な代替が変わることを明示する。Mattermost を第一候補として紹介しつつ、用途別の分岐を整理する。

## Suggested related wiki pages

- `wiki/tools/mattermost.md`
- `wiki/tools/rocketchat.md`
- `wiki/tools/zulip.md`
- `wiki/comparisons/mattermost-vs-rocketchat.md`
- `wiki/comparisons/mattermost-vs-zulip.md`
- `wiki/decision-axes/ops-burden.md`
- `wiki/decision-axes/migration-friction.md`
- `wiki/categories/team-communication.md`

## Open questions

- 日本の中小チームで Slack フリープランから移行を検討している割合はどの程度か
- Mattermost の日本語サポート・コミュニティの現状（2026年時点）
- Rocket.Chat の最近のライセンス変更（Enterprise ライン強化）が OSS 版に与える影響
- Matrix/Element は Slack 代替として ossalt の文脈で扱うべきか（別カテゴリの可能性）

## Evidence sources

- https://slack.com/
- https://slack.com/intl/ja-jp/pricing
- https://ossalt.jp/alternatives/slack
- https://mattermost.com/
- https://www.rocket.chat/
- https://zulip.com/

---
type: saas
slug: slack
name: Slack
category: team-communication
status: active
priority: high
pain_points:
  - monthly-cost
  - message-history-limit
  - vendor-lock-in
  - data-ownership
  - self-hosting
decision_axes:
  - slack-compatibility
  - self-host-difficulty
  - message-threading-model
  - notification-control
  - integration-ecosystem
  - japanese-doc-availability
  - ops-burden
last_reviewed: 2026-04-05
confidence: medium
source_count: 4
related_tools:
  - mattermost
  - rocketchat
  - zulip
related_category_pages:
  - wiki/categories/team-communication.md
related_comparison_pages:
  - wiki/comparisons/slack-vs-mattermost.md
  - wiki/comparisons/slack-vs-rocketchat.md
  - wiki/comparisons/slack-vs-zulip.md
---

# Slack

## Summary

Slack はチームコミュニケーションの事実標準として定着した SaaS。チャンネルベースのメッセージング・ファイル共有・外部サービス連携を中心に、多くの企業で業務基盤として使われている。ossalt では、**人数増加に伴うコスト増・フリープランの履歴制限・データ所有権**を主な代替検討動機として、Mattermost / Rocket.Chat / Zulip の 3 候補と比較する起点として扱う。

## Why it matters for ossalt

Slack は「使っていない企業を探す方が難しい」レベルで日本語圏のスタートアップ・IT 企業に普及しており、代替検討の検索ボリュームが大きい。比較の難しさは、**Slack の強みの大部分が「連携の豊富さ」と「チームへの浸透」にある**点で、機能だけで代替を選ぶと現場に受け入れられないリスクがある。

## How Slack is positioned

Slack は「AI-powered platform for work」として、単なるチャットツールを超えて Slack AI（要約・検索）や Slack Connect（社外コラボレーション）を前面に出している。エンタープライズ向けには Salesforce との統合も深まっており、CRM とチャットの境界を消す方向に進化している。

## Why users look for alternatives

- **フリープランの 90 日メッセージ履歴制限**: 小チームが無料で使い続けると過去の会話が消える
- **人数増加コスト**: Pro プランは $7.25/人/月〜で、100 人規模になると年間 100 万円超になりやすい
- **データ所有権**: メッセージ・ファイルが Slack 社のサーバーに保存される
- **ベンダーロックイン**: Slack 独自のワークフロー・App 連携への依存
- **エクスポート制限**: フリー・Pro プランではメッセージの完全エクスポートが制限される

## What ossalt should help users decide

1. Slack の「見た目・操作感」をどこまで維持したいか（Mattermost が最近似）
2. セルフホストするか、マネージドの OSS クラウドを使うか
3. 既存の Slack App / Webhook 連携をどこまで引き継げるか
4. チームの IT リテラシーに応じた移行難易度の許容範囲
5. Zulip のようにスレッドモデルが異なるツールへの乗り換えを許容するか

## Core decision axes

### 1. Slack compatibility

Slack に最も近い UX・操作感を提供するのは Mattermost。チャンネル構造・スラッシュコマンド・Webhook・Bot 連携が Slack ライクに設計されており、移行摩擦が最小。Rocket.Chat は機能が豊富だが UI が独自色強め。Zulip はスレッド中心のモデルが根本的に異なり、移行より「乗り換え」に近い体験になる。

### 2. Self-host difficulty

3 候補ともセルフホスト可能だが難易度が異なる。Mattermost は Docker Compose で比較的シンプルに構築できる。Rocket.Chat は機能が多い分、設定項目も多い。Zulip は Python ベースで構成が独特。いずれも PostgreSQL + ファイルストレージの管理が必要になる。

### 3. Message threading model

Slack・Mattermost・Rocket.Chat はチャンネル + スレッドの構造で、慣れたユーザーに馴染みやすい。Zulip は「ストリーム（チャンネル）+ トピック（スレッド）」という 2 階層構造が必須で、情報整理の考え方が根本的に異なる。Zulip の設計は非同期コミュニケーションに強いが、リアルタイムチャット文化のチームには違和感がある。

### 4. Notification control

通知疲れが Slack 批判の一因でもあり、OSS 代替での通知制御の細かさは比較ポイントになる。Mattermost・Zulip はチャンネル・キーワード・DM ごとの細かい通知設定が可能。

### 5. Integration ecosystem

Slack の App Directory は 2,600+ のインテグレーションを持ち、OSS 代替はここで大きく劣る。ただし Webhook・REST API ベースの連携（GitHub / GitLab / Jira 通知等）は各ツールで対応可能。Zapier / Make 経由の自動化は Mattermost・Rocket.Chat で対応。

### 6. Japanese doc availability

Mattermost は日本語の導入記事が比較的多い。Rocket.Chat・Zulip は英語中心で日本語情報が少なく、ossalt での editorial layer の価値が高い。

## Candidate families

### Mattermost
Slack に最も近い体験を提供するオープンソースチャット。Team Edition（MIT）で無料セルフホスト可能、Enterprise Edition で高度な権限管理・コンプライアンス機能を追加できる。「Slack から移行したい」という文脈で最初に挙げるべき候補。

### Rocket.Chat
メッセージング・ビデオ通話・ライブチャット・オムニチャンネルまで統合した多機能チャットプラットフォーム。Slack 代替よりも「カスタマーサポートも含めたコミュニケーション基盤」として有力。機能の豊富さが強みでもあり、設定・運用の複雑さでもある。

### Zulip
「ストリーム + トピック」の 2 階層スレッドモデルを持つ独自設計の OSS チャット。非同期コミュニケーションに特化しており、情報が流れにくい・過去の会話を探しやすいという特性を持つ。Slack の代替よりも「Slack の問題を根本から解決する別思想のツール」として検討するべき候補。

## Editorial policy for this SaaS page

Slack 代替の比較では「Slack っぽいか」だけでなく、チームの規模・IT リテラシー・主な用途（社内チャット / カスタマーサポート / 開発チャット）を先に分岐させる。「セルフホストで Slack を置き換えたい」という需要に対して、現実的な運用コストを必ず明示する。

## Suggested related wiki pages

- `wiki/tools/mattermost.md`
- `wiki/tools/rocketchat.md`
- `wiki/tools/zulip.md`
- `wiki/comparisons/slack-vs-mattermost.md`
- `wiki/comparisons/slack-vs-rocketchat.md`
- `wiki/comparisons/slack-vs-zulip.md`
- `wiki/categories/team-communication.md`
- `wiki/decision-axes/ops-burden.md`

## Open questions

- 日本語圏での Slack 代替検索の主な動機（コスト vs セキュリティ vs データ所有権）の比率
- Mattermost の有料プラン（Enterprise）なしで業務利用できる機能の実用範囲
- Slack Connect（社外コラボレーション）の代替手段として何が使われているか
- Rocket.Chat の UI 複雑さがチーム展開の障壁になっているかの実態
- Zulip のスレッドモデルが日本語圏のチームに受け入れられているか

## Evidence sources

- https://slack.com/intl/ja-jp/pricing
- https://mattermost.com/
- https://www.rocket.chat/
- https://zulip.com/

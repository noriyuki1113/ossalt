---
type: category
slug: team-communication
name: チームコミュニケーション・チャット
ossalt_category: team-communication
tool_count: 3
last_reviewed: 2026-04-05
confidence: medium
source_count: 4
---

# チームコミュニケーション・チャット

## 概要

チームの日常的なコミュニケーションを支えるチャット・メッセージングツールのカテゴリ。Slack が事実標準となって以来、チャンネルベースのメッセージング・ファイル共有・外部サービス連携が業務基盤として定着している。ossalt では **Slack 代替の検索需要が最も高いカテゴリのひとつ**として、Mattermost / Rocket.Chat / Zulip を中心に扱う。

## なぜ今注目されているか

**1. Slack のコスト問題**
Slack Pro は $7.25/人/月〜で、チームが大きくなるほど費用が増加する。100 人規模で年間 100 万円超になりやすく、スタートアップ・中小企業でのコスト最適化動機が強い。

**2. フリープランの 90 日制限廃止への不満**
2022 年に Slack がフリープランのメッセージ履歴を 90 日に制限したことで、無料ユーザーのデータ管理への不満が顕在化し、セルフホスト移行の動機になった。

**3. データ所有権・セキュリティ意識の高まり**
業務上の機密情報が Slack のクラウドに保存されることへの懸念。規制業種（金融・医療・公共）では自社サーバー管理の要件が出やすい。

**4. AI 機能との組み合わせ**
Slack AI の登場以降、チャットデータを AI で処理することへのプライバシー懸念が一部で高まっており、セルフホスト型 OSS への関心を後押ししている。

## 主要ツールの勢力図

```
      Slack互換性 ←───────────────────→ 独自設計
           |                                  |
高機能    Mattermost    Rocket.Chat        Zulip
           (Slack近似)  (オムニチャンネル)  (非同期特化)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Mattermost | Slack最近似・セルフホスト | 31,000 | MIT / Commercial |
| Rocket.Chat | 多機能・オムニチャンネル統合 | 41,000 | MIT |
| Zulip | 非同期特化・トピック構造 | 22,000 | Apache 2.0 |

## 注目の動き（直近）

- **Mattermost** が AI 機能（Mattermost AI）の統合を進めており、LLM との接続・チャット内 AI アシスト機能を強化している。
- **Rocket.Chat** がオムニチャンネル機能を強化し、WhatsApp Business API・Instagram DM 等の顧客接点統合をより容易にしている。
- **Zulip** が大規模組織向けの機能（SCIM プロビジョニング・高度な管理機能）を追加し、エンタープライズ対応を強化している。

## 日本語圏での温度感

日本語圏では Slack の浸透度が非常に高く、IT 企業・スタートアップではほぼ標準ツール化している。OSS 代替への関心は確実にあるが、以下の構造的な障壁がある：

- **Slack の慣性**: チーム全員が Slack に慣れており、移行のコンセンサスを取るのが難しい
- **連携の豊富さ**: GitHub / Jira / Google Workspace 等との連携を再構築するコスト
- **日本語情報の差**: Slack の日本語情報は充実しているが、Mattermost 以外は限られる

Mattermost はエンジニアチーム・スタートアップでの採用が増えており、「Slack から Mattermost に移行した」という記事が Zenn・Qiita に複数存在する。Rocket.Chat・Zulip の日本語情報はまだ少ない。

## ossaltにおける推奨方針

### 動機別の分岐

```
「Slack の何を変えたい？」
├── コスト削減・セルフホスト → Mattermost（最も現実的）
├── 社内チャット + 顧客サポート統合 → Rocket.Chat
└── 情報整理・非同期コミュニケーション改善 → Zulip
```

### セルフホストの運用コストを必ず明示する

Slack → OSS 移行は「無料になる」ではなく「ライセンスコストが下がる代わりに運用コストが発生する」。VPS 費用・管理工数・アップデート・バックアップを含めた総コスト比較を ossalt の記事に組み込む。

### Slack Connect の代替がないことを明示する

3 候補ともに Slack Connect（社外組織との共有チャンネル）に相当する機能がなく、社外コラボレーションが重要なチームへの推薦には注意が必要。

## Open questions

- 日本語圏での Slack 代替移行の主な動機分布（コスト vs セキュリティ vs データ所有権）
- Mattermost Team Edition のみで業務運用している組織の規模感（上限の目安）
- Slack Connect の代替として何が使われているか（メール / Matrix / 別 SaaS）
- チームコミュニケーション + AI 機能の統合において OSS 側が Slack に追いつく時期

## Evidence sources

- https://slack.com/intl/ja-jp/pricing
- https://mattermost.com/
- https://www.rocket.chat/
- https://zulip.com/

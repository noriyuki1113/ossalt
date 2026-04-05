---
type: tool
slug: mattermost
name: Mattermost
category: team-communication
github: https://github.com/mattermost/mattermost
stars: 31000
language: Go, TypeScript
last_commit: 2026-04-01
license: MIT (Team Edition) / Commercial (Enterprise Edition)
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - slack
related_tools:
  - rocketchat
  - zulip
---

# Mattermost

## 一言定義

Slack に最も近い UX・機能セットを提供するオープンソースのチームチャット。Team Edition は MIT ライセンスで無料セルフホスト可能。「Slack からの移行先 OSS」として最初に検討すべき候補。

## Positioning

Mattermost は「セキュリティ・コンプライアンスを重視する組織向けの Slack 代替」として位置づけられる。UI はチャンネルリスト・メッセージ・スレッドという Slack ライクな構成を採用しており、Slack ユーザーが最も違和感なく移行できる候補。

Team Edition（OSS・MIT）と Enterprise Edition（有償・追加機能）の 2 段構成で、小チームのセルフホストから大規模組織のコンプライアンス要件まで対応できる設計になっている。Webhook・スラッシュコマンド・Bot 連携は Slack 互換の API 設計を採用しており、既存の Slack 連携を比較的容易に移行できる。[Source](https://mattermost.com/)

## 強み

- **Slack に最も近い UX**: チャンネル・DM・スレッド・絵文字リアクション・検索の構造が Slack ライクで、移行摩擦が 3 候補中最小。
- **MIT ライセンス（Team Edition）**: 商用セルフホストが無料で可能。ライセンスリスクが最小。
- **Slack 互換 API**: Incoming/Outgoing Webhook・スラッシュコマンドが Slack 互換設計。既存 Bot・連携の移行がしやすい。
- **セルフホスト実績が豊富**: Docker Compose でのセットアップが整備されており、日本語の導入記事も比較的多い。
- **高いセキュリティ・コンプライアンス機能**: Enterprise Edition では E2E 暗号化・監査ログ・LDAP/SSO・データ保持ポリシーを提供。金融・医療・防衛などの規制業種での採用実績あり。
- **GitHub Stars 3.1 万超**: 長期的な開発継続性が期待できる。[Source](https://github.com/mattermost/mattermost)

## 弱み・注意点

- **高度な機能は Enterprise Edition が必要**: SSO（SAML / LDAP）・高度な権限管理・コンプライアンス機能・ゲストアカウント管理などは有償の Enterprise Edition でのみ利用可能。
- **Slack App Directory の代替なし**: Slack の 2,600+ App に相当するエコシステムはなく、連携は Webhook・API 実装が中心。
- **サーバー管理が必要**: オフライン動作非対応。PostgreSQL + ファイルストレージ（S3 互換）の運用が必要。
- **モバイルアプリの完成度**: Slack のモバイルアプリと比較するとプッシュ通知・UX に差がある場合がある。
- **Slack Connect 相当機能なし**: 社外組織とのチャンネル共有（Slack Connect）に相当する機能は標準ではない。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| Slack から移行したい小〜中規模チーム | UX が最も近く移行摩擦が少ない |
| セルフホストで Slack コストを削減したいエンジニアチーム | MIT・Docker Compose・豊富な導入事例 |
| セキュリティ・コンプライアンス要件のある組織 | Enterprise Edition で監査ログ・SSO・暗号化に対応 |
| 既存 Slack Bot / Webhook 連携を維持したいチーム | Slack 互換 API で移行しやすい |

## セルフホスト難易度

**低〜中程度**。

- Docker Compose での構成が公式にドキュメント化されており、workspace 系 OSS の中では構築しやすい部類。
- PostgreSQL + S3 互換ストレージが必要。基本構成は 1〜2 時間で動かせる。
- プッシュ通知は Mattermost の HPNS（有償）または自前の通知サーバーが必要。
- 本番運用ではバックアップ・アップデート・証明書管理が継続コストになる。

## 日本語圏での採用状況

Slack 代替 OSS の中では最も日本語情報が充実しており、Zenn・Qiita・個人ブログに導入記事が多数存在する。「Slack から Mattermost に移行した」という事例報告も散見され、特にエンジニアチーム・スタートアップでの採用が中心。

大企業・公共機関でのセルフホスト採用例もあり、セキュリティ重視の組織でのリファレンスが蓄積しつつある。

## ossaltにおける推奨文脈

Mattermost を推薦すべき文脈：

1. **「Slack を使っているが、セルフホストに移したい」** — 最もシンプルで確実な推薦文脈。
2. **「Slack のコストを削減したい」** — Team Edition は無料。
3. **「Slack Bot / Webhook 連携を維持したい」** — Slack 互換 API が移行を容易にする。
4. **「セキュリティ・コンプライアンス要件がある」** — Enterprise Edition で対応できる。

Mattermost を推薦しにくい文脈：

- Slack App Directory の豊富な連携を多用しているチーム
- Slack Connect（社外コラボレーション）が業務の中心のチーム
- IT 管理者不在の非エンジニア組織（サーバー管理が必要）

## Open questions

- Team Edition（MIT）と Enterprise Edition の機能差で業務利用に支障が出るケースの具体例
- Mattermost のモバイル通知の信頼性（Slack 比）の実態
- 日本語圏での Mattermost 採用組織の規模感（スタートアップ vs 大企業）
- Slack Connect 代替として Mattermost でできることの限界

## Evidence sources

- https://mattermost.com/
- https://github.com/mattermost/mattermost

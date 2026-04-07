---
type: tool
slug: plane
name: Plane
category: project-management
github: https://github.com/makeplane/plane
stars: 32000
language: TypeScript / Python (Next.js + Django)
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - jira
related_tools:
  - taiga
---

# Plane

## 一言定義

Jira の主要機能をモダンな UI でセルフホスト可能にした OSS プロジェクト管理ツール。Issue・Cycles（スプリント）・Modules（エピック）・Pages（ドキュメント）・Dashboard を統合する。

## Positioning

Plane は「Jira の複雑さを排除したモダン代替」として急成長している OSS。2022 年にオープンソース化され、GitHub スター 3.2 万超。Notion ライクな UI でプロジェクト管理ができる点が差別化。SaaS 版（plane.so）とセルフホスト版の両方を提供しており、SaaS → セルフホストの移行パスが整備されている。AGPL-3.0 のため、商用利用時はライセンスに注意が必要。

## 強み

- **モダンな UI**: Notion ライクな操作感。非エンジニアにも受け入れられやすい
- **Jira の主要概念を網羅**: Issue / Cycles（スプリント）/ Modules（エピック）/ Pages / Roadmap
- **セルフホスト対応**: Docker Compose での構築が整備されており、公式ドキュメントが充実
- **複数のビュー**: ボード / リスト / スプレッドシート / ガントチャート / カレンダーに対応
- **Slack / GitHub / GitLab 連携**: 主要インテグレーションを標準装備
- **急速な開発**: 活発なコミュニティと高頻度リリース

## 弱み・注意点

- **Jira の高度なカスタマイズには届かない**: カスタムワークフロー・JQL・高度なカスタムフィールドは Jira ほど柔軟ではない
- **エンタープライズ機能は有料版**: SSO・監査ログ・高度な権限管理は Pro/Business プラン
- **AGPL-3.0 ライセンス**: SaaS として提供する場合はソース公開義務が発生する
- **まだ成熟途上**: 大規模チーム（100人超）での長期運用実績はまだ少ない
- **Atlassian エコシステム連携なし**: Confluence / Jira Service Management との深い連携は不可

## どんなユーザーに向くか

- **Jira の複雑さに疲れたチーム**: 機能を絞ったシンプルなプロジェクト管理を求める中小規模チーム
- **コスト削減が目的**: 月額数万円〜数十万円の Jira コストを削減したいスタートアップ
- **セルフホストでデータを管理したい**: ソースコードと Issue を同じインフラで管理したい開発チーム
- **モダン UI を好むチーム**: Jira の古い UI に不満を持つエンジニアチーム
- Jira のスプリント・エピック管理に相当する機能が必要だが、JQL のような高度なクエリは不要なチーム

## セルフホスト難易度

**中程度**。Docker Compose でのセットアップが公式に整備されており、サービスは複数コンテナ（API サーバー・Worker・フロントエンド・PostgreSQL・Redis）で構成される。最低 4GB RAM 推奨。設定ファイルは `.env` で管理し、小規模チームであれば 30 分〜1 時間で起動できる。

## 日本語圏での採用状況

日本語コミュニティでの認知は高まっているが、実際の採用事例の報告はまだ少数。Zenn・Qiita に導入記事が散見されるが、Jira 代替として選ばれた事例よりも「Jira をまだ使っていない小規模チームが最初から Plane を選ぶ」ケースが多い印象。日本語 UI は部分的に対応しているが、完全日本語化はされていない。

## ossaltにおける推奨文脈

Jira 代替として **最初に挙げるべき候補**。特に「スプリント管理・Issue トラッキングが必要だが Jira は高すぎる・複雑すぎる」という中小規模チームへの推薦として最適。セルフホスト版は Docker Compose で構築できるため、「データを自社で管理したい」需要にも対応できる。ただし、Jira の高度なカスタムワークフローや JQL を使いこなしているチームへの移行は慎重に評価すべき。

## Open questions

- Plane のセルフホスト版での日本語対応状況（UI の日本語化進捗）
- 大規模チーム（50〜100 人）での Plane 長期運用の実績・課題
- Plane の AGPL-3.0 が日本企業の採用判断に与える影響
- GitHub Issues などと比較したときの Plane の優位性の境界線（何人以上のチームで Plane が有効か）

## Evidence sources

- https://plane.so/
- https://github.com/makeplane/plane

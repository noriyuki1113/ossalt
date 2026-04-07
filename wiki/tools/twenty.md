---
type: tool
slug: twenty
name: Twenty
category: crm
github: https://github.com/twentyhq/twenty
stars: 22000
language: TypeScript (NestJS + React)
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - hubspot
  - salesforce
related_tools:
  - suitecrm
---

# Twenty

## 一言定義

Salesforce / HubSpot の代替を目指す新世代 OSS CRM。Notion ライクなモダン UI・カスタムオブジェクト・GraphQL API が特徴で、「シンプルだが拡張性のある CRM」として急成長中。

## Positioning

Twenty は 2023 年にオープンソース化された新興 CRM OSS。「Salesforce を倒す OSS CRM」を標榜し、Notion ライクな UI でコンタクト・会社・商談・タスクを管理できる。MIT ライセンス。GitHub スター 2.2 万超と急成長中（2024〜2025 年に急増）。カスタムオブジェクト（データモデルの自由な拡張）・GraphQL API・セルフホスト対応が差別化ポイント。

## 強み

- **モダンな UI**: Notion ライクな操作感でキーボードショートカット・インラインエディットが快適
- **カスタムオブジェクト**: データモデルを自由に拡張できる（CRM を超えた用途にも使える）
- **GraphQL API**: 強力な API でデータへのフルアクセス・外部統合が容易
- **MIT ライセンス**: 商用利用・SaaS 組み込みに制限なし
- **セルフホスト対応**: Docker Compose での構築が整備されている
- **急成長**: コミュニティが活発で機能が急速に追加されている
- **Zapier / Make 連携**: ノーコード自動化ツールとの連携が可能

## 弱み・注意点

- **まだ成熟途上**: 2023〜2024 年オープンソース化でまだ若いプロダクト。エンタープライズ機能は未成熟
- **マーケティングオートメーションなし**: HubSpot のメール配信・シーケンス・ランディングページは持たない
- **レポーティングが限定的**: HubSpot / Salesforce の高度なレポート・ダッシュボードには届かない
- **日本語 UI なし**: 現時点では英語のみ
- **AGPL-3.0**: （MIT と表記されているが、実際のライセンスを要確認）
- **モバイルアプリなし**: ブラウザのみで、ネイティブモバイルアプリはまだない

## どんなユーザーに向くか

- **スタートアップ・小規模チームの最初の CRM**: Salesforce / HubSpot を使ったことがなく、シンプルな CRM から始めたいチーム
- **HubSpot の無料版からの脱出**: コンタクト管理・パイプライン管理だけが必要で HubSpot の有料化を避けたい
- **カスタムデータモデルが必要**: 標準的な CRM フィールドでは足りず、独自のデータ構造が必要なチーム
- **API ファーストの開発チーム**: CRM をプログラムで操作・統合したいエンジニア組織

## セルフホスト難易度

**中程度**。Docker Compose でのセットアップが整備されており、PostgreSQL + Redis + Twenty バックエンド/フロントエンドのマルチコンテナ構成。最低 2〜4GB RAM。環境変数での設定が主。公式ドキュメントが英語で充実しており、1〜2 時間でセットアップ可能。

## 日本語圏での採用状況

日本語圏での認知度はまだ低い。Zenn・Qiita に紹介記事が散見されるが、実際の採用事例の報告はほぼない。「Salesforce / HubSpot 代替の OSS」として海外では注目されているが、日本語 UI がないことが障壁になっている。

## ossaltにおける推奨文脈

HubSpot / Salesforce 代替として **新規採用に最も推薦すべき OSS CRM**。特に「スタートアップで最初の CRM を探している」「HubSpot 無料版の制限に引っかかった」「コンタクト・パイプライン管理だけが必要」という文脈で推薦。マーケティングオートメーション（メール配信・シーケンス）が必要な場合は Twenty だけでは不足し、Mautic 等との組み合わせが必要であることを明示する。

## Open questions

- Twenty の成熟度（2026 年時点）が中小企業の本番 CRM として使えるレベルかの検証
- Twenty のライセンス（MIT vs AGPL-3.0）の実際の状況
- Twenty のモバイルアプリ対応の計画・進捗
- Twenty + Mautic（メール）の組み合わせで HubSpot を代替できるかの評価

## Evidence sources

- https://twenty.com/
- https://github.com/twentyhq/twenty

---
type: tool
slug: coolify
name: Coolify
category: paas-deployment
github: https://github.com/coollabsio/coolify
stars: 36000
language: PHP (Laravel) / Alpine.js
last_commit: 2026-04-01
license: Apache-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - heroku
  - netlify
  - vercel
related_tools:
  - dokku
---

# Coolify

## 一言定義

VPS 上に Heroku / Netlify / Vercel ライクなデプロイ環境を構築できる OSS PaaS。Web UI からアプリ・データベース・サービスをワンクリックでデプロイでき、「セルフホストの Heroku」として急成長中。

## Positioning

Coolify は 2021 年に登場した新世代 OSS PaaS。Apache-2.0 ライセンス、GitHub スター 3.6 万超。「Heroku / Netlify / Vercel の代替をセルフホストで」というコンセプトで、モダンな Web UI・Docker / Docker Compose / Nixpacks 対応・PostgreSQL / Redis などのサービス起動をワンクリックで提供する。v4 で大幅なリニューアルが行われ、マルチサーバー・チーム管理・GitHub 連携が強化された。

## 強み

- **モダンな Web UI**: ブラウザからアプリのデプロイ・DB 管理・ドメイン設定・SSL 設定を行える
- **幅広いランタイム対応**: Docker / Docker Compose / Nixpacks（Heroku ビルドパック互換） に対応
- **ワンクリックサービス**: PostgreSQL・Redis・MySQL・MongoDB・MinIO・WordPress など主要サービスをワンクリックで起動
- **GitHub / GitLab 連携**: リポジトリ push 時の自動デプロイ（CI/CD ライクな体験）
- **マルチサーバー対応**: 複数の VPS を一つの Coolify から管理できる
- **Apache-2.0**: 商用利用・SaaS 組み込みに制限なし
- **急成長中**: v4 以降コミュニティが活発で機能が急速に追加されている

## 弱み・注意点

- **まだ成熟途上**: v4 は大幅なリニューアルで不安定な部分が残っていたが、改善が進んでいる
- **Heroku のビルドパック完全互換ではない**: Nixpacks での対応だが、一部のビルドパックは手動設定が必要
- **PHP (Laravel) 製**: バックエンドが PHP のため、他の言語に慣れたエンジニアには親しみにくい面もある
- **ログ・監視が限定的**: Datadog・Grafana のような高度な監視は内蔵していない
- **Apache-2.0 vs Heroku のサポート**: セルフホストのため Heroku のようなサポートはない

## どんなユーザーに向くか

- **Heroku 無料プラン廃止後の代替を探している**: $5〜$20/月の VPS で Heroku ライクな体験を実現したい
- **複数アプリを一つのサーバーで管理したい**: 複数のプロジェクトを同一 VPS にデプロイして管理したい
- **UI 重視**: CLI（Dokku）より Web UI で操作したい
- **スタートアップ・個人開発者**: 本格的な Kubernetes は不要で、シンプルなデプロイ環境が欲しい
- **マルチサービス展開**: アプリ + DB + キャッシュ + S3 互換ストレージを一括管理したい

## セルフホスト難易度

**低〜中程度**。インストールは以下の 1 コマンドで完了：
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
以降は Web UI から操作。最低 2GB RAM（推奨 4GB+）の VPS が必要。

## 日本語圏での採用状況

Heroku 無料プラン廃止後に日本でも注目が高まった。Zenn・Qiita に「Heroku から Coolify に移行した」記事が存在し、個人開発者・スタートアップでの採用事例がある。日本語 UI はないが、Web UI が直感的なため操作のハードルは低い。

## ossaltにおける推薦文脈

Heroku 代替として **最初に推薦すべき OSS PaaS**。特に「Web UI で管理したい」「複数アプリ + DB を同一サーバーで管理したい」「Heroku 無料プラン廃止後の代替を急いで探している」という文脈で推薦。CLI 操作を好むエンジニアには Dokku を第 2 候補として提示。

## Open questions

- Coolify v4 の安定性・本番利用の実態（大規模トラフィックでの実績）
- Coolify のマルチサーバー管理の成熟度
- Dokku vs Coolify の選択基準（チームの技術レベル・UI 必要性以外の軸）
- Kamal（Basecamp 製）との比較・使い分け

## Evidence sources

- https://coolify.io/
- https://github.com/coollabsio/coolify

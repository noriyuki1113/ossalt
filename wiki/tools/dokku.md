---
type: tool
slug: dokku
name: Dokku
category: paas-deployment
github: https://github.com/dokku/dokku
stars: 26000
language: Shell / Go
last_commit: 2026-03-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - heroku
related_tools:
  - coolify
---

# Dokku

## 一言定義

単一 VPS に Heroku の PaaS 体験を再現する最小構成の OSS PaaS。`git push dokku main` でデプロイ完了という Heroku ライクな開発者体験を、最小のフットプリントで VPS 上に実現する。

## Positioning

Dokku は 2013 年に登場した老舗の OSS ミニ PaaS。「1 人で管理できる Heroku」として設計されており、Heroku のビルドパック互換・`Procfile` 対応・`git push` デプロイという体験を VPS で再現する。MIT ライセンス、GitHub スター 2.6 万超。Coolify が「Web UI 重視のモダン PaaS」とすると、Dokku は「CLI 重視のシンプル PaaS」という位置づけ。

## 強み

- **Heroku 体験の忠実な再現**: `git push dokku main` でデプロイ、`Procfile` 対応、Heroku ビルドパック互換
- **シンプル・軽量**: 最小構成で動作し、単一 VPS（512MB RAM から動作可能）に収まる
- **長い実績**: 2013 年から 10 年以上の運用実績。安定性が高い
- **MIT ライセンス**: 商用利用に制限なし
- **プラグインエコシステム**: PostgreSQL・Redis・MySQL・Let's Encrypt・nginx など豊富なプラグイン
- **Heroku から簡単に移行**: `Procfile`・ビルドパック互換のため移行コストが低い

## 弱み・注意点

- **CLI 中心**: Web UI がない（サードパーティ UI はある）。CLI に慣れていないと管理が難しい
- **シングルサーバー前提**: Coolify のようなマルチサーバー管理は標準機能にない
- **Coolify より機能が少ない**: ワンクリックサービス起動・GitHub 連携の UI・ダッシュボードは Coolify が優れる
- **大規模スケールには向かない**: Kubernetes が必要な規模になると Dokku は限界を迎える
- **開発ペースが Coolify より遅い**: 機能追加の頻度は Coolify の方が高い

## どんなユーザーに向くか

- **CLI を使いこなすエンジニア**: `git push` デプロイという Heroku の核心体験を CLI で再現したい
- **最小構成で十分**: 複雑な Web UI・ダッシュボードは不要で、シンプルなデプロイだけが目的
- **Heroku からの高速移行**: `Procfile`・ビルドパック互換のため、移行コストが最も低い
- **リソース制約がある**: 512MB〜1GB RAM の低スペック VPS でも動作する
- **安定性重視**: 10 年以上の実績があり、Coolify より成熟した安定性が欲しい

## セルフホスト難易度

**低い**。Ubuntu / Debian への自動インストールスクリプト 1 コマンドで完了：
```bash
wget -NP . https://dokku.com/install/v0.35.x/bootstrap.sh
sudo DOKKU_TAG=v0.35.x bash bootstrap.sh
```
以降は `dokku` CLI でアプリ・DB・ドメイン・SSL を管理。最低 512MB RAM から動作。

## 日本語圏での採用状況

Heroku 代替として日本でも認知されており、Qiita に導入記事が多数存在する。個人開発者・小規模スタートアップでの採用事例があり、日本語情報は Coolify より豊富。「Heroku の代替 OSS」として長年定番の選択肢として認知されている。

## ossaltにおける推薦文脈

Heroku 代替として **CLI を使いこなすエンジニアへの推薦**。「Heroku からできるだけ低コスト・低摩擦で移行したい」「`git push` デプロイを VPS で再現したい」という文脈での推薦。Web UI を好む場合・複数サーバーを管理したい場合は Coolify を先に推薦し、Dokku はシンプルさ・軽量さ・実績を重視するエンジニアへの代替として提示。

## Open questions

- Dokku の長期的な開発継続性（メンテナ状況・コミュニティ規模）
- Dokku と Coolify の実際の選択事例における決め手の調査
- Kamal（Rails / Basecamp 推薦）との比較・使い分け（`git push` vs `kamal deploy`）
- Dokku の Kubernetes への移行パス（規模が大きくなった場合）

## Evidence sources

- https://dokku.com/
- https://github.com/dokku/dokku

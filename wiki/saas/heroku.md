---
type: saas
slug: heroku
name: Heroku
category: paas-deployment
status: active
priority: medium
pain_points:
  - free-tier-removed
  - monthly-cost
  - salesforce-dependency
  - vendor-lock-in
  - cold-start-latency
decision_axes:
  - git-push-deploy-support
  - buildpack-compatibility
  - self-host-difficulty
  - ops-burden
  - database-addon-support
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - coolify
  - dokku
related_category_pages:
  - wiki/categories/paas-deployment.md
related_comparison_pages:
  - wiki/comparisons/heroku-vs-coolify.md
  - wiki/comparisons/heroku-vs-dokku.md
---

# Heroku

## Summary

Heroku は「git push で即デプロイ」を実現した PaaS（Platform as a Service）の元祖。2022 年の無料プラン廃止と Salesforce 買収後の方向性への不満を動機に、Coolify / Dokku などのセルフホスト PaaS 代替への移行が増えている。ossalt では **セルフホスト PaaS** という「クラウドの使い勝手を VPS で実現する」カテゴリとして扱う。

## Why it matters for ossalt

Heroku は「開発者体験（DX）の標準を作った PaaS」。2022 年の無料プラン廃止は多くのスタートアップ・個人開発者に影響を与え、「Heroku ライクな体験を VPS で」という需要が Coolify / Dokku / Render などの台頭を促した。コスト削減・Salesforce 依存回避・データ所有権の 3 つが主な代替動機。

## How Heroku is positioned

Heroku は Salesforce 傘下で、エンタープライズ向けの信頼性・コンプライアンス（SOC 2・HIPAA 対応）を強みとして打ち出している。2022 年の無料プラン廃止後は「低コスト個人プロジェクト向け」から「エンタープライズ向け PaaS」へのポジション転換が明確になった。

## Why users look for alternatives

- **無料プラン廃止（2022 年）**: 無料の Dyno・無料 PostgreSQL が廃止され、個人開発者・スタートアップが大量に離脱
- **コスト**: Eco Dyno $5/月〜、Basic Dyno $7/月〜。本格的なアプリで Standard-1X $25/月〜
- **Salesforce 買収後の停滞感**: Salesforce 買収（2010 年）後、Heroku の革新が止まったという認識がある
- **コールドスタート遅延**: スリープ状態からの起動に 10〜30 秒かかる（有料プランでも一部発生）
- **データ所有権**: アプリ・DB データが Heroku のクラウドに保管されることへの懸念

## What ossalt should help users decide

1. VPS（$5〜$20/月）+ Coolify でほぼ同じ DX が実現できるか
2. Heroku のビルドパック互換性を Dokku で再現できるか
3. セルフホスト PaaS の運用負荷を受け入れられるか（サーバー管理・SSL・バックアップ）
4. 本格的な本番環境か、個人プロジェクト・社内ツールかで選択肢が変わる

## Core decision axes

### 1. Git push deploy

Heroku の「`git push heroku main` でデプロイ完了」という DX は Dokku・Coolify・Kamal で再現できる。Dokku は最もシンプルで Heroku ライクな CLI を提供。Coolify はブラウザ UI での管理が中心。

### 2. Buildpack compatibility

Heroku のビルドパック（Node.js・Python・Ruby・Go・Docker 対応）を Dokku も再現しており、多くの場合 Heroku → Dokku の移行は `Procfile` のまま動く。

### 3. Managed addons

Heroku のアドオン（PostgreSQL・Redis・SendGrid 等）はセルフホストでは自分でセットアップする必要がある。Coolify は PostgreSQL・Redis・MySQL などのサービス起動を UI から行える。

## Candidate families

### Coolify
モダンな Web UI で VPS 上にアプリ・DB・サービスをデプロイできる OSS PaaS。Docker ベース、Apache-2.0。GitHub スター 3.6 万超。「Heroku / Netlify / Vercel の代替をセルフホストで」というポジション。

### Dokku
Heroku の PaaS 体験を単一 VPS で再現する OSS。Heroku ビルドパック互換、`git push` デプロイ、`dokku` CLI。MIT ライセンス。GitHub スター 2.6 万超。シンプルさが強み。

## Suggested related wiki pages

- `wiki/tools/coolify.md`
- `wiki/tools/dokku.md`
- `wiki/comparisons/heroku-vs-coolify.md`
- `wiki/comparisons/heroku-vs-dokku.md`
- `wiki/categories/paas-deployment.md`

## Open questions

- Coolify の本番環境での信頼性・安定性の実態
- Dokku と Coolify の選択基準（CLI 派 vs UI 派以外の軸）
- Kamal（Basecamp 製）との比較：Heroku 代替としての位置づけ
- 日本のスタートアップでの Heroku → Coolify/Dokku 移行事例の収集

## Evidence sources

- https://www.heroku.com/pricing
- https://coolify.io/
- https://dokku.com/

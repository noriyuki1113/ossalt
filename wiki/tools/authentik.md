---
type: tool
slug: authentik
name: Authentik
category: auth-sso
github: https://github.com/goauthentik/authentik
stars: 14000
language: Python (Django) / TypeScript
last_commit: 2026-04-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - okta
  - auth0
related_tools:
  - keycloak
---

# Authentik

## 一言定義

「使いやすさ」を重視したモダンな OSS 認証・SSO プラットフォーム。Keycloak より設定が直感的でモダンな UI を持ち、スタートアップ・中小企業向けの認証基盤として急成長している。MIT ライセンス。

## Positioning

Authentik は 2019 年に開発が始まったモダンな OSS ID プロバイダー。MIT ライセンス、GitHub スター 1.4 万超。「Keycloak は高機能だが設定が複雑」という課題を解決するために設計されており、モダンな Web UI・直感的なフロービルダー・シンプルな設定が特徴。Authentik GmbH（ドイツ）が開発しており、商用サポート版（Authentik Enterprise）も提供。

## 強み

- **モダンな UI**: Keycloak と比べて直感的で使いやすい管理コンソール
- **フロービルダー**: 認証フロー（ログイン・登録・パスワードリセット等）をビジュアルに設計できる
- **MIT ライセンス**: 商用利用・SaaS 組み込みに制限なし（Keycloak の Apache-2.0 と同様に自由）
- **Python / Django 製**: Java（Keycloak）より親しみやすい技術スタック
- **OIDC / SAML / LDAP / SCIM 対応**: 主要プロトコルをカバー
- **Forward auth**: nginx / Traefik との連携で既存アプリに認証を追加できる
- **アプリ統合の簡単さ**: Grafana・Nextcloud・Outline 等の主要 OSS との統合手順が充実

## 弱み・注意点

- **Keycloak より機能が少ない**: Fine-grained Authorization・Kerberos・一部エンタープライズ機能は Keycloak が優れる
- **AD/LDAP 統合は Keycloak に劣る**: Active Directory との深い統合は Keycloak が成熟している
- **比較的新しい**: Keycloak の 10 年以上の実績と比べると、大規模本番環境での信頼性は未知数
- **Python 製の運用**: Django + Celery の運用は一定の知識が必要

## どんなユーザーに向くか

- **スタートアップ・中小企業**: Keycloak の複雑さを避けたい、まず動かしたい
- **Auth0 の代替（B2C アプリ）**: Auth0 の MAU 課金を回避したい SaaS アプリの認証基盤
- **既存 OSS スタックへの認証追加**: Grafana・Nextcloud・Outline 等の社内ツールに SSO を追加したい
- **Forward auth のユースケース**: nginx / Traefik リバースプロキシで既存アプリに認証を追加したい
- **AD 不要の環境**: Active Directory を使わないスタートアップ・クラウドネイティブ組織

## セルフホスト難易度

**中程度**。Docker Compose での構築が整備されており、PostgreSQL + Redis + Authentik サーバー / Worker のマルチコンテナ構成。最低 2GB RAM（推奨 4GB+）。公式ドキュメントが充実しており、Keycloak より設定が直感的。1〜2 時間で基本セットアップ完了。

## 日本語圏での採用状況

日本語圏での認知度は Keycloak より低いが、急速に高まっている。Zenn・Qiita に「Authentik を使って社内ツールに SSO を追加した」記事が増えている。スタートアップでの Auth0 代替として選ばれるケースが報告されている。日本語 UI は部分的に対応している。

## ossaltにおける推薦文脈

Okta / Auth0 代替として **スタートアップ・中小企業・クラウドネイティブ組織への第一候補**。「Keycloak は複雑すぎる」「まず SSO を試したい」「社内ツール（Grafana/Nextcloud/Outline）に SSO を追加したい」という文脈での推薦。AD/LDAP 統合が必要な大企業には Keycloak を優先する。

## Open questions

- Authentik の大規模本番環境（10 万 MAU 以上）での安定性実績
- Authentik vs Keycloak の選択基準（AD 連携以外の軸）
- Authentik Enterprise の機能と価格の詳細
- Auth0 → Authentik のユーザーデータ移行ツール・手順の整備状況

## Evidence sources

- https://goauthentik.io/
- https://github.com/goauthentik/authentik

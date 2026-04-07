---
type: tool
slug: keycloak
name: Keycloak
category: auth-sso
github: https://github.com/keycloak/keycloak
stars: 23000
language: Java (Quarkus)
last_commit: 2026-04-01
license: Apache-2.0
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
  - authentik
---

# Keycloak

## 一言定義

Red Hat 発・CNCF ホストの本格 OSS ID 管理・SSO プラットフォーム。OIDC / SAML / LDAP / MFA を網羅し、大企業の Active Directory 連携から B2C アプリの認証 API まで対応する業界標準的な OSS 認証基盤。

## Positioning

Keycloak は 2014 年に Red Hat が開発を開始した OSS ID プロバイダー。Apache-2.0 ライセンス、GitHub スター 2.3 万超。CNCF（Cloud Native Computing Foundation）プロジェクトとして管理されており、エンタープライズ向けの信頼性・機能の幅広さが特徴。Okta / Auth0 の機能を最も広くカバーする OSS であり、大企業の本番 SSO 基盤として採用実績が豊富。

## 強み

- **最も網羅的な認証プロトコル対応**: OIDC / OAuth2 / SAML 2.0 / LDAP / Kerberos / WebAuthn（パスキー）
- **エンタープライズ向けの成熟度**: 大企業・政府機関での採用実績。Active Directory / LDAP 統合が成熟
- **Fine-grained Authorization**: リソースベースの細かいアクセス制御（UMA 2.0）
- **ソーシャルログイン**: Google / GitHub / Apple / Facebook 等の Identity Provider 統合
- **MFA**: TOTP・WebAuthn・SMS（設定による）
- **Admin Console**: 高機能な管理 UI でレルム・クライアント・ユーザーを管理
- **Theme システム**: ログイン・登録画面のカスタマイズが可能
- **Quarkus ベース**: Java 製だが Quarkus への移行で起動速度・メモリ効率が改善

## 弱み・注意点

- **設定の複雑さ**: 機能が多すぎて「レルム・クライアント・フロー」等の概念の学習コストが高い
- **Java 製のリソース消費**: 最低 512MB RAM（推奨 1〜2GB+）。小規模環境では重い
- **管理 UI の直感性**: Authentik と比べて管理画面が古め・複雑
- **ドキュメントの質**: 公式ドキュメントは充実しているが、複雑な設定例の解説が散在している
- **高可用性構成の複雑さ**: HA 構成（クラスター）は複雑で、専任の運用担当が必要

## どんなユーザーに向くか

- **エンタープライズ・大企業**: Active Directory / LDAP との統合が必要な組織
- **Okta の本格代替**: Okta のエンタープライズ機能（SSO・MFA・プロビジョニング）を OSS で代替したい
- **B2B SaaS の認証基盤**: 組織単位の SSO・Fine-grained Authorization が必要な SaaS
- **Java / JVM 環境がある組織**: 既存の Java インフラに統合しやすい
- **セキュリティの成熟度重視**: 実績・監査ログ・FIPS 準拠が求められる組織

## セルフホスト難易度

**高め**。Docker での起動は比較的簡単だが、本番運用には：
- PostgreSQL 等の外部 DB 設定
- HTTPS / TLS 設定
- レルム・クライアント・フローの適切な設定
- HA 構成（本番は冗長化推奨）

最低 1GB RAM（推奨 2〜4GB+）。「認証基盤が止まると全サービスにログインできなくなる」という高可用性要件を必ず考慮する。

## 日本語圏での採用状況

日本語圏での認知度は高く、Qiita・Zenn に豊富な導入記事がある。エンタープライズ向け SSO として大企業での採用実績がある。「Auth0 の代替」として中規模 SaaS 企業での採用事例も報告されている。日本語 UI は管理コンソール・ログイン画面ともに対応している。

## ossaltにおける推薦文脈

Okta / Auth0 代替として **エンタープライズ・大企業・AD/LDAP 統合が必要な組織への第一候補**。セキュリティの成熟度と機能の幅広さが強み。スタートアップ・中小企業には設定の複雑さを前置きし、「まず Authentik を試す」ことを推薦する場合もある。

## Open questions

- Keycloak の最小本番構成（HA なし・シングルノード）での許容トラフィック規模
- Auth0 → Keycloak のユーザーデータ・クライアント設定の移行ツールの有無
- Keycloak の Quarkus 移行後のリソース消費改善の実態
- パスキー（WebAuthn）対応の完成度

## Evidence sources

- https://www.keycloak.org/
- https://github.com/keycloak/keycloak

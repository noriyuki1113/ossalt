---
type: saas
slug: okta
name: Okta / Auth0
category: auth-sso
status: active
priority: medium
pain_points:
  - monthly-cost
  - per-user-pricing
  - vendor-lock-in
  - data-ownership
  - complexity
decision_axes:
  - sso-protocol-support
  - self-host-difficulty
  - mfa-support
  - social-login
  - enterprise-directory
  - ops-burden
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - keycloak
  - authentik
related_category_pages:
  - wiki/categories/auth-sso.md
related_comparison_pages:
  - wiki/comparisons/okta-vs-keycloak.md
  - wiki/comparisons/okta-vs-authentik.md
---

# Okta / Auth0

## Summary

Okta は企業向け ID 管理・SSO（シングルサインオン）の最大手 SaaS。Auth0（2021 年に Okta が買収）は開発者向けの認証 API として広く使われている。ユーザー数課金・複雑な価格体系・ベンダーロックインを動機に、Keycloak / Authentik などのセルフホスト認証基盤への移行を検討する企業が増えている。

## Why it matters for ossalt

認証・SSO のセルフホストは **セキュリティリスクが高い**カテゴリだが、Keycloak（Red Hat/CNCF）が成熟しており、企業向けの本番利用実績が多い。「Auth0 の月額課金が MAU 増加とともに急増した」という動機が最も多い。ossalt では **コスト削減（特に MAU 課金の急増）** を主な動機として扱う。

## How Okta / Auth0 is positioned

Okta は「エンタープライズ ID セキュリティプラットフォーム」として、MFA・SSO・Zero Trust・ガバナンス・脅威検知を統合。Auth0 は「開発者向け認証 API」として B2C・B2B SaaS への組み込みに特化。2023 年のセキュリティインシデント（Okta の認証システム侵害）はブランドへの打撃となったが、市場シェアは維持している。

## Why users look for alternatives

- **MAU 課金の急増**: Auth0 は月間アクティブユーザー（MAU）数での課金。ユーザーが増えると月額が急増
- **コスト**: Auth0 Essential $23/月（1000 MAU）〜、Professional $240/月〜。大規模アプリでは数十万円/月
- **Okta の価格複雑性**: Okta はモジュール単位の課金で、必要な機能を揃えると高額になる
- **データ所有権**: 認証情報・ユーザー情報が外部 SaaS に保管されることへの懸念
- **2023 年のセキュリティインシデント**: Okta の侵害事件がセルフホスト検討のきっかけになるケースがある

## What ossalt should help users decide

1. Keycloak（エンタープライズ向け・高機能）vs Authentik（モダン UI・使いやすさ）の選択
2. セルフホスト認証基盤の運用リスク（セキュリティ・可用性）を受け入れられるか
3. 既存アプリの OIDC/SAML 対応状況と移行コスト

## Core decision axes

### 1. Protocol support

Keycloak・Authentik ともに OIDC / OAuth2 / SAML 2.0 / LDAP に対応しており、主要な認証プロトコルをカバーする。Auth0 との機能的な互換性は高い。

### 2. Self-host difficulty + security

認証基盤のセルフホストは「壊れると全サービスにログインできなくなる」リスクがある。可用性・バックアップ・アップデート管理が特に重要。「セキュリティの専門知識がないチームには推薦しない」判断も必要。

### 3. Enterprise directory (LDAP/AD)

Keycloak は Active Directory / LDAP との統合が成熟しており、大企業の既存インフラとの連携が得意。Authentik は AD/LDAP 対応はあるが Keycloak ほど深くない。

## Candidate families

### Keycloak
Red Hat 発の本格的な OSS ID 管理・SSO プラットフォーム。CNCF プロジェクト。OIDC・SAML・LDAP・MFA・ソーシャルログイン・Fine-grained Authorization を網羅。Apache-2.0。

### Authentik
「使いやすさ」を重視したモダンな OSS 認証プラットフォーム。Keycloak より設定が直感的でモダンな UI。MIT ライセンス。スタートアップ向け。

## Suggested related wiki pages

- `wiki/tools/keycloak.md`
- `wiki/tools/authentik.md`
- `wiki/comparisons/okta-vs-keycloak.md`
- `wiki/comparisons/okta-vs-authentik.md`
- `wiki/categories/auth-sso.md`

## Open questions

- Keycloak のセルフホスト本番運用の最小構成と推奨構成
- Auth0 → Keycloak / Authentik のユーザーデータ移行の難易度
- 日本企業でのセルフホスト SSO（Keycloak）採用事例の収集
- Authentik vs Keycloak の選択基準（チーム規模・AD 連携の有無以外の軸）

## Evidence sources

- https://www.okta.com/pricing/
- https://auth0.com/pricing
- https://www.keycloak.org/
- https://goauthentik.io/

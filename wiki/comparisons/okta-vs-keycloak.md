---
type: comparison
slug: okta-vs-keycloak
tool_a: keycloak
tool_b: okta
saas_context: okta
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Okta / Auth0 vs Keycloak

## 比較の文脈

Okta のエンタープライズ SSO 費用・Auth0 の MAU 課金急増を動機に OSS 認証基盤を検討するユーザーへの提案。Keycloak は最も成熟した OSS ID プロバイダーとして大企業の本番 SSO 基盤での採用実績が豊富。

## TL;DR

| 条件 | 推薦 |
|---|---|
| エンタープライズ・Active Directory 統合が必要 | **Keycloak** |
| Auth0 の MAU 課金を削減したい（大規模 B2C） | **Keycloak** |
| SAML 対応の本格 SSO 基盤が必要 | **Keycloak** |
| スタートアップ・設定のシンプルさ優先 | Authentik |
| 認証基盤のセルフホスト運用リスクを取れない | Okta / Auth0 継続 |
| AI セキュリティ・脅威検知が必要 | Okta |

## 比較表

| 項目 | Okta / Auth0 | Keycloak |
|---|---|---|
| 価格 | Auth0: $23/月〜（1000 MAU）/ Okta: $2〜8/人/月〜 | 無料（サーバーコストのみ） |
| ライセンス | プロプライエタリ | Apache-2.0 |
| セルフホスト | ❌ | ✅ |
| OIDC / OAuth2 | ✅ | ✅ |
| SAML 2.0 | ✅ | ✅ |
| LDAP / AD 統合 | ✅ | ✅ 成熟 |
| MFA / WebAuthn | ✅ | ✅ |
| ソーシャルログイン | ✅ | ✅ |
| Fine-grained Authorization | ✅ | ✅ UMA 2.0 |
| SCIM（プロビジョニング） | ✅ | ✅（設定が複雑） |
| AI 脅威検知 | ✅ Okta ThreatInsight | ❌ |
| 稼働率 SLA | ✅ 99.99% | ❌ 自己責任 |
| 管理 UI のモダン度 | ✅ | ⚠️ 高機能だが複雑 |
| 日本語 UI | ✅ | ⚠️ 部分対応 |

## 各軸での詳細比較

### Active Directory / LDAP 統合

Keycloak の AD/LDAP 統合は OSS の中で最も成熟しており、AD ユーザーの同期・AD グループのロールマッピング・Kerberos 認証まで対応。大企業の既存 AD 環境との統合に Keycloak は強い。Okta も AD 統合を持つが、Keycloak は「AD の OIDC/SAML ブリッジ」として機能できる点が強み。

### コスト比較

10,000 MAU の B2C アプリの場合：
- Auth0 Professional: $240/月 = 年間 $2,880（約 43 万円）
- Keycloak（VPS 2GB RAM）: $10〜20/月 = 年間 $120〜240（約 1.8〜3.6 万円）

MAU が増えるほど Auth0 のコストは増加するが、Keycloak はサーバーコストのみで固定。100 万 MAU クラスでは Auth0 が月数百万円になるケースもある。

### セルフホストのリスク

認証基盤が止まると「全サービスにログインできなくなる」というビジネスクリティカルなリスクがある。Okta の 99.99% SLA・専門チームのセキュリティ管理は Keycloak のセルフホストでは代替できない。「認証基盤のセルフホスト = セキュリティの責任を自分で持つ」という覚悟が必要。

### 設定の複雑さ

Keycloak はレルム・クライアント・アイデンティティプロバイダー・認証フロー・ロール・グループという多層の概念があり、適切に設定するには相応の学習コストがかかる。Okta / Auth0 の管理画面と比べてシンプルさでは劣る。「まず動かしたい」という場合は Authentik の方が入りやすい。

## 移行摩擦

### Auth0 → Keycloak の主な作業

1. **ユーザーデータのエクスポート**: Auth0 の Management API でユーザーリストをエクスポート
2. **Keycloak のセットアップ**: Docker または Kubernetes での構築
3. **レルム・クライアントの設定**: Auth0 のアプリケーション設定を Keycloak のクライアントに再現
4. **ユーザーインポート**: Auth0 からエクスポートしたユーザーを Keycloak にインポート（パスワードハッシュの互換性に注意）
5. **アプリの OIDC 設定変更**: クライアント ID・シークレット・エンドポイント URL の変更
6. **ソーシャルログインの再設定**: Google / GitHub 等の Identity Provider を再設定

パスワードハッシュの互換性問題：Auth0 の bcrypt ハッシュは Keycloak でそのまま使えないため、ユーザーに次回ログイン時のパスワードリセットを求める必要がある場合がある。

## 日本語圏での選択傾向

日本でも大企業の SSO 基盤として Keycloak の採用事例が増えている。「Okta が高い」「AD との統合が必要」という動機での採用が多い。Auth0 代替としても中規模 SaaS 企業での採用が報告されている。Keycloak の日本語コミュニティは比較的活発で、日本語記事が豊富。

## 結論

**AD/LDAP 統合が必要な大企業・Okta のエンタープライズ SSO コストを削減したい組織**には Keycloak を推薦。Auth0 の MAU 課金削減が主目的で、AD 不要のスタートアップには Authentik を先に提案する。認証基盤のセルフホスト運用リスクを受け入れられない組織には Okta / Auth0 の継続を推薦。

## Open questions

- Auth0 のパスワードハッシュを Keycloak で引き継ぐ方法の検証
- Keycloak の HA 構成の最小コスト構成
- 日本の大企業での Keycloak 採用事例の収集（AD 統合のユースケース）

## Evidence sources

- https://auth0.com/pricing
- https://www.okta.com/pricing/
- https://www.keycloak.org/

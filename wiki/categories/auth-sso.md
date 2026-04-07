---
type: category
slug: auth-sso
name: 認証・SSO・ID管理
ossalt_category: auth-sso
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# 認証・SSO・ID管理

## 概要

ユーザー認証・シングルサインオン（SSO）・多要素認証（MFA）・ID ライフサイクル管理を提供するプラットフォームのカテゴリ。Okta・Auth0・Azure AD が主流だが、MAU 課金の急増・データ所有権を動機に Keycloak / Authentik などのセルフホスト認証基盤への移行を検討する組織がある。**セキュリティ上の責任が大きいカテゴリで、推薦には運用体制の確認が必要。**

## なぜ今注目されているか

**1. Auth0 の MAU 課金急増**
Auth0 は月間アクティブユーザー（MAU）数での課金モデルで、B2C アプリのユーザーが増えると課金が急増する。「ユーザーが 10 万人になったら Auth0 が月数十万円になった」という経験が OSS 代替検討のきっかけになる。

**2. Authentik の急成長**
モダンな UI と使いやすさを重視した Authentik が急成長し、GitHub スター 1.4 万超。「Keycloak は複雑すぎる、でも Auth0 は高い」という層に刺さっている。

**3. Okta のセキュリティインシデント（2023 年）**
Okta 自身の認証システムが侵害された事件が発生し、「SaaS 認証プロバイダーへの依存リスク」が顕在化した。セルフホスト認証基盤への関心が高まった。

## 主要ツールの勢力図

```
  エンタープライズ・AD統合 ←──────── スタートアップ・モダン
           |                                    |
        Keycloak                           Authentik
    (Red Hat製・CNCF・実績豊富)          (モダンUI・使いやすさ)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Keycloak | 本格エンタープライズ SSO OSS。AD/LDAP 統合成熟 | 23,000 | Apache-2.0 |
| Authentik | モダン・使いやすい OSS 認証基盤。スタートアップ向け | 14,000 | MIT |

## ⚠️ このカテゴリの特別な注意事項

認証基盤のセルフホストには固有のリスクがある：

1. **認証基盤が止まると全サービスにログインできなくなる** → 高可用性が必須
2. **セキュリティの責任を自分で持つ** → 定期的なアップデート・監査が必要
3. **ゼロデイ脆弱性への対応** → SaaS なら自動修正されるが、セルフホストは自分で対応

**「認証基盤の運用リスクを受け入れられない組織には Okta / Auth0 の継続を推薦する。」**

## ossaltにおける推薦方針

```
「なぜセルフホスト認証を検討しているか？」
├── Auth0 の MAU 課金が急増した
│   ├── AD/LDAP 統合が必要 → Keycloak
│   └── AD 不要・スタートアップ → Authentik
├── Okta のエンタープライズコスト削減
│   └── 大企業・AD 統合 → Keycloak（運用体制確認必須）
└── 社内ツール（Grafana/Nextcloud 等）に SSO を追加したい
    └── → Authentik（Forward auth が使いやすい）
```

## Open questions

- Keycloak / Authentik の高可用性構成の最小コスト
- Auth0 → Keycloak / Authentik のパスワードハッシュ移行問題の解決策
- 日本の SaaS 企業での Auth0 代替採用事例の収集
- パスキー（WebAuthn）の Keycloak / Authentik での対応状況

## Evidence sources

- https://auth0.com/pricing
- https://www.keycloak.org/
- https://goauthentik.io/

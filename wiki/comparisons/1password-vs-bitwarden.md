---
type: comparison
slug: 1password-vs-bitwarden
tool_a: 1password
tool_b: bitwarden
saas_context: 1password
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# 1Password vs Bitwarden

## 比較の文脈

「1Password / LastPass のコストを下げたい」「パスワードを OSS のツールで管理したい」「データ所有権を確保したい」という動機での比較。Bitwarden は **1Password に最も近い UX で乗り換えコストが低いパスワードマネージャー OSS** として、代替候補の筆頭に位置する。[Source](https://bitwarden.com/)

## TL;DR（どちらを選ぶべきか・条件付きで）

| 選ぶべき状況 | 推奨 |
|---|---|
| 個人でコストをゼロにしたい | **Bitwarden**（無料クラウド版） |
| データを自分のサーバーで管理したい | **Bitwarden + Vaultwarden**（セルフホスト） |
| OSS であることを重視する | **Bitwarden** |
| 1Password の洗練された UX を優先する | **1Password** |
| チームでの高度な管理機能が必要 | **1Password Teams / Enterprise** |
| 公式サポートが必要 | **1Password** |

## 比較表

| 軸 | 1Password | Bitwarden |
|---|---|---|
| 個人コスト | $2.99/月 | 無料（クラウド版基本機能） |
| チームコスト | $7.99/人/月 | $4/人/月（Teams） |
| OSS | なし | AGPL-3.0（完全公開） |
| セルフホスト | 不可 | 可能（公式 / Vaultwarden） |
| UI の洗練度 | 高い | 中程度 |
| ブラウザ拡張 | 全主要ブラウザ | 全主要ブラウザ |
| モバイルアプリ | iOS / Android（成熟） | iOS / Android（対応） |
| TOTP（2FA コード生成） | あり（有償） | あり（無料） |
| 緊急アクセス | あり | あり（無料） |
| セキュリティモデル | ゼロ知識（Secret Key + MP） | ゼロ知識（MP のみ） |
| データ保管場所 | 1Password 社クラウド | bitwarden.com / 自社サーバー |
| 公式サポート | あり | 限定的（コミュニティ中心） |

## 各軸での詳細比較

### コスト

最も明確な差。個人利用で 1Password は年間約 4,000 円（$2.99/月 × 12）かかるのに対し、Bitwarden の基本機能は無料。TOTP 生成・緊急アクセスを含む Premium でも年間約 1,300 円（$10/年）。**チーム利用でも Bitwarden の方が約半額になる**。

### セキュリティモデル

両者ともゼロ知識暗号化を採用。1Password は「Secret Key（デバイス生成）+ Master Password」の 2 要素暗号化で、Secret Key なしでは復号不可能。Bitwarden は Master Password のみで復号できる構成（PBKDF2 / Argon2）。どちらも会社側でパスワードを読めない設計だが、1Password の Secret Key モデルはより強固という評価がある。

### UX・使い勝手

1Password の UI は業界でも特に洗練されており、ブラウザ拡張の自動入力精度・デザインの一貫性が高い。Bitwarden は機能的には同等だが、UI の細かい磨きでは差がある。ただしこの差は「使えない」レベルではなく「慣れれば気にならない」レベル。

### セルフホスト

1Password はセルフホスト不可。Bitwarden はクラウド版・公式セルフホスト版・Vaultwarden（軽量互換版）の 3 択がある。「データを絶対にクラウドに置きたくない」という要件には Bitwarden + Vaultwarden が唯一の現実的な選択肢。

## 移行摩擦

1Password → Bitwarden の移行は、パスワードマネージャーの中で最も手順が整備されているカテゴリ：

1. **エクスポート**: 1Password から 1PUX または CSV でエクスポート
2. **インポート**: Bitwarden の Web Vault からインポート
3. **確認**: カスタムフィールド・添付ファイル・パスワード履歴の再現を確認
4. **ブラウザ拡張の切り替え**: 1Password 拡張を無効化し Bitwarden 拡張を有効化
5. **モバイルの切り替え**: アプリを変更し、サーバーを bitwarden.com または自前に設定

最大の摩擦は**習慣の変化**（ブラウザ拡張の操作感の違い）であり、データ移行自体は 1 時間以内で完了できることが多い。

## 日本語圏での選択傾向

LastPass の大規模漏洩（2022 年）以降、「パスワードマネージャーを乗り換えたい」という流入で Bitwarden への移行報告が急増した。1Password → Bitwarden の移行記事も Zenn・Qiita に複数存在する。

個人ユーザーは「無料で使える」という決め手で Bitwarden を選ぶ傾向が強い。チームでの検討では UX の差（1Password の方が非エンジニアに説明しやすい）が選択に影響することがある。

## 結論

Bitwarden は **「1Password の機能を無料または低コストで実現したい」** という最も典型的なユースケースに最適。セキュリティモデルも十分で、移行手順も整備されている。唯一 1Password が優位なのは UI の洗練度と公式サポートの手厚さ。

**移行判断の最重要チェック**: TOTP（2FA コード生成）を 1Password で使っているか。Bitwarden では無料で使えるが、移行時に TOTP 設定を各サービスで再設定する手間がかかる点を事前に把握しておく。

## Open questions

- Bitwarden の 1PUX インポート精度（カスタムフィールド・添付ファイルの再現率の実態）
- 1Password の Secret Key モデルと Bitwarden の MP のみモデルのセキュリティ差の実際のリスク評価
- 日本語圏でのチーム導入時に非エンジニアへの説明コスト差（1Password vs Bitwarden）

## Evidence sources

- https://1password.com/jp/
- https://bitwarden.com/
- https://github.com/bitwarden/server

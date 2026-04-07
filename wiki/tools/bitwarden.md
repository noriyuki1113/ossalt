---
type: tool
slug: bitwarden
name: Bitwarden
category: password-management
github: https://github.com/bitwarden/server
stars: 16000
language: C#, TypeScript
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - 1password
related_tools:
  - vaultwarden
---

# Bitwarden

## 一言定義

1Password に最も近い UX を持つオープンソースのパスワードマネージャー。クラウド版は個人無料・チーム有償で使え、セルフホスト版も提供。**パスワードマネージャーの OSS 代替として最初に検討すべき候補**。

## Positioning

Bitwarden は「使いやすさ・セキュリティ・オープンソース」の三つを同時に満たす稀有なポジションにいる。ブラウザ拡張（Chrome / Firefox / Safari / Edge）・iOS / Android アプリ・デスクトップアプリ・Web Vault が揃っており、1Password と同等のクライアント環境を提供する。

クラウド版（bitwarden.com）では個人・家族・チーム・エンタープライズのプランを提供し、個人基本機能は**完全無料**。セルフホスト版も公式に提供されているが、軽量版には Vaultwarden が使われることが多い。AGPL-3.0 ライセンスで、コードが完全に公開されている。[Source](https://bitwarden.com/)

## 強み

- **個人利用が完全無料**: クラウド版の個人プランは基本機能が無料。デバイス数無制限で使える（かつて制限があったが撤廃された）。
- **1Password に近い UX**: ブラウザ拡張・自動入力・フォルダ管理・セキュアノート・カード情報保管など、主要機能が揃う。移行摩擦が最小。
- **AGPL-3.0 でコード完全公開**: サーバー・クライアントのコードがすべて公開されており、セキュリティ監査が可能。
- **クロスプラットフォーム**: ブラウザ拡張・iOS・Android・Windows・macOS・Linux・Web に対応。
- **組織機能（チーム利用）**: コレクション・グループ・権限管理でチームでのパスワード共有が可能。
- **セルフホスト対応**: 公式の Docker ベースセルフホストに加え、Vaultwarden（軽量互換サーバー）が利用可能。
- **2FA / パスキー対応**: TOTP・FIDO2・ハードウェアキーに対応。[Source](https://github.com/bitwarden/server)

## 弱み・注意点

- **公式セルフホストが重い**: 公式のセルフホスト版は複数の Docker コンテナ構成でリソース要件が高い。軽量運用には Vaultwarden を使うのが一般的。
- **UI の洗練度**: 1Password と比べると UI デザインがやや地味。ただし機能面での差は小さい。
- **高度なチーム機能は有償**: Teams（$4/人/月）・Enterprise（$6/人/月）でないと使えない機能がある（高度なレポート・SSO など）。
- **オフラインアクセス**: キャッシュによるオフライン閲覧は可能だが、新規エントリの追加はオンライン必須。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| 1Password / LastPass からコストを下げて乗り換えたい個人 | 無料で同等機能。移行手順が整備されている |
| OSS であることを重視する個人・組織 | AGPL-3.0 でコード完全公開 |
| チームでパスワードを共有・管理したい | 組織機能でグループ・権限管理が可能 |
| セルフホストを検討しているが運用コストを抑えたい | Vaultwarden と組み合わせで軽量セルフホスト |

## セルフホスト難易度

**公式版：高程度 / Vaultwarden 経由：低〜中程度**

- 公式セルフホストは複数コンテナ（mssql / web / api / identity 等）の Docker Compose 構成で、サーバーリソース要件が高い（4GB RAM 以上推奨）。
- Vaultwarden（Rust 製軽量互換サーバー）を使えば、シングルコンテナで動き Raspberry Pi でも運用可能。Bitwarden の公式クライアントがそのまま使える。
- 実運用ではほぼ Vaultwarden + Nginx + Let's Encrypt の構成が一般的。

## 日本語圏での採用状況

1Password / LastPass からの乗り換え先として日本語圏での認知度が高く、Zenn・Qiita に豊富な導入記事がある。「パスワードマネージャー 無料」「1Password 代替」での検索でヒットしやすい。LastPass の漏洩事件（2022 年）以降、乗り換え需要が急増した経緯がある。

個人ユーザーでの採用が中心で、チーム・企業での導入はエンジニアチームが先行している。

## ossaltにおける推奨文脈

Bitwarden を推薦すべき文脈：

1. **「1Password / LastPass のコストを下げたい」** — 個人は無料。移行が最も楽な選択肢。
2. **「OSS のパスワードマネージャーが使いたい」** — コード完全公開・監査可能。
3. **「チームでパスワードを安全に共有したい」** — 組織機能で管理可能。
4. **「セルフホストしたいが Vaultwarden は不安」** — 公式サポートがある分の安心感。

## Open questions

- Bitwarden の無料クラウド版で個人利用に実際に足りない機能（TOTP 保管の有料化撤回後の現状）
- 1Password → Bitwarden 移行のインポート精度（カスタムフィールド・添付ファイルの再現率）
- 日本語圏での Bitwarden チーム利用事例（個人 vs 組織の比率）

## Evidence sources

- https://bitwarden.com/
- https://github.com/bitwarden/server

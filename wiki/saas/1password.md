---
type: saas
slug: 1password
name: 1Password
category: password-management
status: active
priority: high
pain_points:
  - monthly-cost
  - vendor-lock-in
  - data-ownership
  - self-hosting
  - cloud-trust
decision_axes:
  - self-host-difficulty
  - client-compatibility
  - security-model
  - ops-burden
  - migration-friction
  - japanese-doc-availability
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
related_tools:
  - bitwarden
  - vaultwarden
related_category_pages:
  - wiki/categories/password-management.md
related_comparison_pages:
  - wiki/comparisons/1password-vs-bitwarden.md
---

# 1Password

## Summary

1Password はパスワード管理・機密情報の安全な保管・チーム共有に使われる SaaS。個人・家族・チーム・エンタープライズ向けに展開されており、使い勝手の良さと強固なセキュリティで高い評価を得ている。ossalt では **月額コスト・クラウドへのパスワード保管への不安・データ所有権**を主な代替動機として、Bitwarden / Vaultwarden との比較起点として扱う。

## Why it matters for ossalt

パスワード管理は「乗り換えコストが最も低いカテゴリのひとつ」でありながら、「最も移行を後回しにしやすいカテゴリ」でもある。Bitwarden という明確な OSS 代替が存在し、かつ無料で使い始められるため、ossalt での意思決定支援がシンプルに設計できる。セキュリティ意識の高まりとともに「自分のパスワードをクラウドに預けたくない」という需要も増えており、Vaultwarden のセルフホスト需要がある。

## How 1Password is positioned

1Password は「ゼロ知識暗号化（Zero-Knowledge）」を掲げ、1Password 社でさえユーザーのパスワードを読めない設計を訴求している。Secret Key（ローカル生成）と Master Password の組み合わせで暗号化されており、セキュリティモデル自体は評価が高い。個人から大企業まで対応する幅広いプランと、優れた UX・ブラウザ拡張・デバイス同期が強み。

## Why users look for alternatives

- **月額コスト**: 個人 $2.99/月、ファミリー $4.99/月、Teams $7.99/人/月。小規模チームでも年間コストが積み上がる。
- **クラウドへの不信**: ゼロ知識設計とはいえ、暗号化されたデータが 1Password 社のサーバーに保管される事実への心理的不安。
- **データ所有権**: パスワードという最機密データを自社インフラで管理したいという組織的要求。
- **ベンダーロックイン**: 独自フォーマット（1PUX）へのデータ依存と移行の手間。
- **LastPass への不信の波及**: LastPass の大規模漏洩（2022 年）以降、パスワードマネージャー全体への不信が高まり、セルフホスト型 OSS への関心が増えた。

## What ossalt should help users decide

1. クラウド型 OSS（Bitwarden）で十分か、セルフホスト（Vaultwarden）が必要か
2. 1Password からのデータエクスポート・移行の手順
3. チーム利用の場合、Bitwarden の組織機能で代替できるか
4. セルフホストの運用負荷を受け入れられるか

## Core decision axes

### 1. Security model

1Password・Bitwarden ともにゼロ知識暗号化を採用しており、セキュリティモデルの本質的な差は小さい。Vaultwarden（セルフホスト）はデータが自社サーバーにのみ存在するため、クラウドプロバイダーへのリスクがゼロになる。ただし自社サーバーのセキュリティ管理責任はユーザー側に移る。

### 2. Self-host difficulty

Bitwarden はクラウド版（bitwarden.com）とセルフホスト版の両方を提供するが、公式セルフホストは Docker 構成がやや重い。Vaultwarden は Rust 製の軽量 Bitwarden 互換サーバーで、Raspberry Pi でも動くほど軽量。セルフホスト目的なら Vaultwarden が現実的。

### 3. Client compatibility

Vaultwarden は Bitwarden の公式クライアント（ブラウザ拡張・iOS・Android・デスクトップ）をそのまま使える。移行後もクライアントの学習コストがかからない点が大きな強み。

### 4. Migration friction

1Password → Bitwarden の移行は 1Password のエクスポート（1PUX または CSV）→ Bitwarden のインポートで対応できる。パスワードマネージャーの移行はカテゴリ全体の中で最も手順が整備されており、摩擦は比較的小さい。

## Candidate families

### Bitwarden
オープンソースのパスワードマネージャー。クラウド版は個人無料・チーム有償、セルフホスト版も提供。1Password に最も近い UX で移行摩擦が少ない。AGPL-3.0。

### Vaultwarden
Bitwarden 互換の軽量セルフホストサーバー（Rust 製）。公式 Bitwarden クライアントがそのまま使える。個人・小チームのセルフホストに最適。AGPL-3.0。

## Editorial policy for this SaaS page

パスワード管理は「セキュリティの比較」になりがちだが、ossalt では「どこにデータを置くか」という所有権の軸と「運用コスト」の軸を中心に整理する。セキュリティモデルの詳細よりも、移行の現実的な手順と運用負荷を明示することを優先する。

## Suggested related wiki pages

- `wiki/tools/bitwarden.md`
- `wiki/tools/vaultwarden.md`
- `wiki/comparisons/1password-vs-bitwarden.md`
- `wiki/categories/password-management.md`
- `wiki/decision-axes/self-host-difficulty.md`

## Open questions

- LastPass 漏洩以降、日本語圏でのパスワードマネージャー乗り換え動向
- Bitwarden の無料クラウド版で個人利用に足りない機能は何か
- Vaultwarden のセルフホスト安定性と長期運用事例
- 1Password Teams → Bitwarden Organizations の移行で失われる機能

## Evidence sources

- https://1password.com/jp/
- https://bitwarden.com/
- https://github.com/dani-garcia/vaultwarden

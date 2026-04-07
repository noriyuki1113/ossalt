---
type: saas
slug: github
name: GitHub
category: code-hosting
status: active
priority: high
pain_points:
  - vendor-lock-in
  - microsoft-ownership
  - data-ownership
  - self-hosting
  - monthly-cost
  - feature-gating
decision_axes:
  - github-compatibility
  - self-host-difficulty
  - ci-cd-integration
  - ops-burden
  - migration-friction
  - japanese-doc-availability
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
related_tools:
  - gitea
  - forgejo
  - gitlab
related_category_pages:
  - wiki/categories/code-hosting.md
related_comparison_pages:
  - wiki/comparisons/github-vs-gitea.md
  - wiki/comparisons/github-vs-forgejo.md
  - wiki/comparisons/github-vs-gitlab.md
---

# GitHub

## Summary

GitHub は世界最大のコードホスティングプラットフォームであり、Git リポジトリ管理・Issue トラッキング・Pull Request・CI/CD（Actions）・Packages・Copilot を統合した開発基盤の事実標準。2018 年の Microsoft 買収以降、ベンダーロックインへの懸念とデータ所有権問題が顕在化し、セルフホスト OSS（Gitea / Forgejo / GitLab CE）への移行を検討する組織が増えている。

## Why it matters for ossalt

GitHub は開発者ツールカテゴリの中で検索需要が最も高い代替検索対象のひとつ。OSS 代替が複数あり（Gitea / Forgejo / GitLab CE）、それぞれ性格が異なるため比較の整理に価値がある。特に日本の中小開発会社・スタートアップが「GitHub のコストを下げたい」「データを自社管理したい」という動機で検索する流入が見込まれる。

## How GitHub is positioned

GitHub は「where the world builds software」を掲げ、コードホスティングにとどまらず GitHub Actions（CI/CD）・Copilot（AI コーディング支援）・Codespaces（クラウド IDE）・Packages（パッケージレジストリ）・Security（脆弱性スキャン）までを統合したプラットフォームとして進化している。Microsoft との統合（Azure・VS Code・Teams）も深まっており、エンタープライズ向けの粘着性が高い。

## Why users look for alternatives

- **Microsoft への不信**: 2018 年の Microsoft 買収以降の懸念。AI 学習へのコードデータ利用問題（Copilot 訴訟）も影響。
- **コスト**: Team プランは $4/人/月、Enterprise は $21/人/月。大規模組織では高額になる。
- **データ所有権・データ居住地**: ソースコードが GitHub（Microsoft Azure）のサーバーに保管されることへの懸念。規制業種や政府系では国内サーバー要件がある。
- **ベンダーロックイン**: GitHub Actions のワークフロー・Packages・Copilot への依存が深まるほど移行コストが増える。
- **プライベートリポジトリの制限**: 無料プランでの機能制限。
- **Copilot による学習懸念**: プライベートコードが AI 学習に使われることへの法的・倫理的不安。

## What ossalt should help users decide

1. 単純なコードホスティングの代替か、CI/CD・Issue・Wiki まで含めた完全移行か
2. Gitea（軽量）vs GitLab CE（フル機能）の選択
3. Forgejo（コミュニティ主導）vs Gitea（企業主導）の違い
4. 既存の GitHub Actions ワークフローをどう移行するか
5. GitHub との並行運用期間をどう設計するか

## Core decision axes

### 1. GitHub compatibility

Gitea・Forgejo は GitHub ライクな UI・API を持ち、慣れたユーザーに馴染みやすい。GitLab は独自の UI・概念モデルで学習コストが高いが、機能範囲が広い。GitHub Actions の代替として、Gitea Actions（GitHub Actions 互換）・GitLab CI/CD（独自構文）が選択肢になる。

### 2. Feature scope

Gitea / Forgejo は「Git ホスティング + Issue + PR + Wiki」に絞ったシンプルな構成。GitLab CE は CI/CD・Container Registry・Security scanning・Pages まで含む GitHub により近いフル機能。何を移行スコープに入れるかで候補が変わる。

### 3. Self-host difficulty

Gitea / Forgejo は Go 製シングルバイナリで非常に軽量。SQLite でも動くため、小規模チームには最も導入が容易。GitLab CE は Ruby + PostgreSQL + Redis + Sidekiq 等の複数コンポーネントが必要で、最低 4GB RAM が推奨される重厚な構成。

### 4. CI/CD integration

GitHub Actions からの移行先として、Gitea Actions（YAML 構文が GitHub Actions と高い互換性）が最も移行しやすい。GitLab CI/CD は強力だが構文・概念が異なり再設計が必要。

## Candidate families

### Gitea
Go 製の軽量 Git ホスティング。シングルバイナリで動き、SQLite でも運用可能。GitHub ライクな UI。MIT ライセンス。小〜中規模チームのセルフホストに最適。

### Forgejo
Gitea からのコミュニティフォーク。Gitea の商業化懸念を受けてガバナンスを優先した設計。Gitea と機能・UI はほぼ同等。GPL-3.0。Codeberg.org が Forgejo を採用。

### GitLab CE
GitHub に最も近い機能範囲を持つ OSS。CI/CD・Container Registry・Security・Pages を統合。ただし運用コストが重い。MIT ライセンス（CE）。

## Editorial policy for this SaaS page

GitHub の代替は「何を移行したいか」によって最適解が大きく変わる。「コードホスティングだけ」なら Gitea / Forgejo、「CI/CD まで含めたフル移行」なら GitLab CE という分岐を中心に整理する。GitHub Actions ワークフローの移行コストを必ず明示する。

## Suggested related wiki pages

- `wiki/tools/gitea.md`
- `wiki/tools/forgejo.md`
- `wiki/tools/gitlab.md`
- `wiki/comparisons/github-vs-gitea.md`
- `wiki/comparisons/github-vs-forgejo.md`
- `wiki/comparisons/github-vs-gitlab.md`
- `wiki/categories/code-hosting.md`
- `wiki/decision-axes/ops-burden.md`

## Open questions

- 日本の開発会社・スタートアップで GitHub セルフホスト移行を実施している事例の規模感
- GitHub Copilot 問題（コード学習懸念）が移行動機になっている割合
- GitLab.com（SaaS）vs GitLab CE（セルフホスト）の選択基準
- GitHub Actions から Gitea Actions への移行完成度（互換性の実態）

## Evidence sources

- https://github.com/pricing
- https://about.gitea.com/
- https://forgejo.org/
- https://about.gitlab.com/install/ce-or-ee/

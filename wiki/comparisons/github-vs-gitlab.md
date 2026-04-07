---
type: comparison
slug: github-vs-gitlab
tool_a: github
tool_b: gitlab
saas_context: github
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# GitHub vs GitLab CE

## 比較の文脈

「CI/CD・Container Registry まで含めて GitHub を完全にセルフホストで置き換えたい」という動機での比較。GitLab CE は **GitHub に最も近い機能範囲を持つ OSS** であり、フル機能の DevOps 環境を自社インフラで持ちたい中〜大規模組織の選択肢。[Source](https://about.gitlab.com/install/ce-or-ee/)

## TL;DR（どちらを選ぶべきか・条件付きで）

| 選ぶべき状況 | 推奨 |
|---|---|
| CI/CD・Container Registry まで含むフル移行 | **GitLab CE** |
| GitLab.com ユーザーでセルフホストに移行したい | **GitLab CE** |
| Security scanning を OSS で実現したい | **GitLab CE** |
| シンプルな Git ホスティングだけが目的 | **Gitea（他候補）** |
| GitHub Actions の YAML をそのまま使いたい | **Gitea / GitHub** |
| 低スペックサーバーで運用したい | **Gitea（他候補）** |

## 比較表

| 軸 | GitHub | GitLab CE |
|---|---|---|
| 提供形態 | SaaS | OSS（MIT）/ セルフホスト |
| コスト | $4/人/月（Team）〜 | 無料（セルフホスト） |
| サーバーリソース | — | 重い（4GB RAM 最低） |
| CI/CD | GitHub Actions | GitLab CI/CD（独自構文） |
| Container Registry | GitHub Packages | あり（内蔵） |
| Security scanning | Code Scanning（CodeQL） | SAST / Dependency scanning（CE） |
| Pages | GitHub Pages | GitLab Pages |
| Issue / PR | 成熟 | 成熟（MR と呼ぶ） |
| SSO / LDAP | Enterprise のみ | CE で一部対応 |
| UI 学習コスト | 基準 | 高い（独自の UI・用語） |
| GitHub Actions 互換 | 基準 | なし（GitLab CI 構文） |
| ライセンス | プロプライエタリ | MIT（CE） |

## 各軸での詳細比較

### 機能範囲の比較

GitLab CE は GitHub の機能範囲に最も近い OSS。CI/CD（GitLab CI）・Container Registry・SAST / Dependency Scanning・GitLab Pages・Issue Board・Merge Request・Wiki・スニペットが CE に含まれる。GitHub Enterprise の機能に迫る範囲を MIT ライセンスのセルフホストで実現できる点が最大の強み。

### CI/CD の違い

GitHub Actions は `.github/workflows/*.yml` に YAML でワークフローを定義し、マーケットプレイスの豊富な Action を使える。GitLab CI は `.gitlab-ci.yml` に独自の構文で定義する。**既存の GitHub Actions ワークフローは GitLab CI に書き直しが必要**（Gitea Actions のような互換性はない）。GitLab CI 自体は表現力が高く、より複雑なパイプラインを記述しやすい設計。

### 運用の重さ

GitLab CE の最低推奨構成は 4 コア CPU・4GB RAM（実用には 8GB 推奨）。Gitea のシングルバイナリ（256MB RAM）と比べて桁違いに重い。PostgreSQL・Redis・Puma・Sidekiq・Gitaly の複数コンポーネントを管理する必要があり、アップグレードも計画的に行う必要がある。

### セキュリティ機能

GitLab CE の SAST（Static Application Security Testing）・Dependency Scanning は GitHub の Code Scanning / Dependabot に相当する機能を OSS で提供する。セキュリティを内製化したい組織には GitLab CE が適している。

## 移行摩擦

GitHub → GitLab CE の主な摩擦：

1. **CI/CD の全面書き直し**: GitHub Actions から GitLab CI への移行は構文が異なるため、全ワークフローの再設計が必要。規模によっては数週間かかる。
2. **UI・用語の変化**: PR → Merge Request、Organization → Group、Checks → Pipelines など、慣れた概念が変わる。
3. **GitLab Runner の構築**: CI/CD を動かす Runner を自前で用意・管理する必要がある。
4. **リポジトリ移行**: Git push で移行できるが、Issue・PR の移行は GitLab のインポートツール経由（完全再現は難しい）。
5. **外部連携の再設定**: Slack・Jira・デプロイ Webhook 等を GitLab の連携に切り替える。

## 日本語圏での選択傾向

GitLab CE の日本語情報は Gitea と並んで比較的充実している。エンタープライズ・中規模開発チームでの採用実績が多く、「CI/CD まで含めて GitHub を置き換えたい」という文脈での選択が中心。

GitLab.com（SaaS）ユーザーがセルフホストに移行する際に自然に選ばれるほか、オンプレミス要件（社内サーバー・データ居住地）で GitHub の代替として採用される事例がある。

## 結論

GitLab CE は **「GitHub の機能範囲をセルフホストで再現したい、かつ運用負荷を受け入れられる中〜大規模チーム」** に最適。CI/CD・Container Registry・Security scanning まで含む包括的な移行を目指すなら GitLab CE 一択。ただし **CI/CD の書き直しコスト・重い運用負荷・高い学習コスト**を事前に把握することが移行成功の鍵。

**移行判断の最重要チェック**: GitHub Actions ワークフローの数と複雑さ。複雑なワークフローが多いほど GitLab CI への移行コストが増大する。まず「コードホスティングと Issue 管理だけ移行」→「CI/CD は段階的に」という分割移行を検討する価値がある。

## Open questions

- GitHub Actions から GitLab CI への移行工数（ワークフロー規模別の目安）
- GitLab CE の最小構成での安定運用可能な組織規模（リポジトリ数・ユーザー数）
- GitLab CE で不足する EE 機能（SAML SSO 等）の代替手段

## Evidence sources

- https://about.gitlab.com/install/ce-or-ee/
- https://github.com/pricing
- https://github.com/gitlabhq/gitlabhq

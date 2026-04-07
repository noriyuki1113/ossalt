---
type: comparison
slug: github-vs-gitea
tool_a: github
tool_b: gitea
saas_context: github
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# GitHub vs Gitea

## 比較の文脈

「GitHub をセルフホストで置き換えたい」「コードを GitHub（Microsoft）のサーバーに置きたくない」「GitHub のコストを削減したい」という動機での比較。Gitea は **GitHub のセルフホスト OSS 代替として最も導入しやすい候補**。[Source](https://about.gitea.com/)

## TL;DR（どちらを選ぶべきか・条件付きで）

| 選ぶべき状況 | 推奨 |
|---|---|
| 軽量・シンプルなセルフホスト Git が欲しい | **Gitea** |
| 低スペックサーバーで動かしたい | **Gitea** |
| GitHub Actions ワークフローをそのまま使いたい | **Gitea**（Gitea Actions） |
| MIT ライセンスを重視する | **Gitea** |
| GitHub のエコシステム（Copilot / Packages 等）が必要 | **GitHub** |
| CI/CD・Container Registry まで含めたフル移行 | **GitLab CE（他候補）** |
| 大規模組織の権限管理・SSO が必要 | **GitHub Enterprise / GitLab CE** |

## 比較表

| 軸 | GitHub | Gitea |
|---|---|---|
| 提供形態 | SaaS（+ Enterprise Server） | OSS（MIT）/ セルフホスト |
| コスト | $4/人/月（Team）〜 | 無料（セルフホスト） |
| サーバーリソース | — | 低い（256MB RAM でも動作） |
| UI の GitHub 近似度 | 基準 | 高い |
| CI/CD | GitHub Actions（成熟） | Gitea Actions（互換） |
| Container Registry | GitHub Packages | 対応あり |
| Issue / PR | 成熟 | 対応（基本機能） |
| Wiki | あり | あり |
| セキュリティスキャン | あり（Code Scanning） | なし |
| Pages | GitHub Pages | あり（Gitea Pages） |
| API 互換性 | 基準 | 部分的に互換 |
| Copilot / AI | GitHub Copilot | なし |
| ライセンス | プロプライエタリ | MIT |

## 各軸での詳細比較

### 導入・運用コスト

GitHub Team は $4/人/月。50 人チームで年間約 240 万円。Gitea のセルフホストはサーバー費用のみ（VPS 月 1,000〜3,000 円程度）。**中規模チームでは 1 年以内に ROI が出ることが多い**。ただしサーバー管理の人件費を忘れずに計上する必要がある。

### GitHub Actions 互換性（Gitea Actions）

Gitea Actions は GitHub Actions の YAML 構文と高い互換性を持ち、`uses: actions/checkout@v4` のような公式アクションもそのまま動くケースが多い。完全互換ではないが、**シンプルな CI/CD ワークフローの多くは修正なしで動く**。Gitea Actions の Runner（`act_runner`）を別途構築する必要がある。

### エコシステム・外部連携

GitHub の App Marketplace・Copilot・Code Scanning・Dependabot・GitHub Packages（npm / Docker / Maven 等）は Gitea に相当機能がない。既存の GitHub 連携（外部サービスの Webhook・CI/CD サービス等）は再構築が必要。

### セキュリティ機能

GitHub は Code Scanning（CodeQL）・Secret Scanning・Dependabot による脆弱性管理が統合されている。Gitea はこれらを持たず、セキュリティスキャンは別途 CI/CD パイプラインに組み込む必要がある。

## 移行摩擦

GitHub → Gitea の主な摩擦：

1. **リポジトリ移行**: Git の push/pull で移行可能。Gitea の GitHub インポート機能で Issue・PR・Wiki も移行できる（完全再現は難しい）。
2. **CI/CD 再構築**: GitHub Actions の Runner を Gitea Actions Runner に切り替え。ほとんどのワークフローは動くが一部修正が必要。
3. **連携サービスの再設定**: Slack 通知・デプロイ Webhook 等を Gitea の Webhook に再設定。
4. **エコシステムの欠落**: Dependabot・Code Scanning の代替を別途用意する必要がある。
5. **チームへの説明**: UI が GitHub に近いため学習コストは低いが、用語・設定画面の違いに慣れる時間が必要。

## 日本語圏での選択傾向

GitHub 代替 OSS の中で Gitea は日本語情報が最も充実しており、個人の private リポジトリ管理・小規模開発チームでの採用が多い。「GitHub に置けないコードをセルフホストで管理」という用途での導入報告が目立つ。

## 結論

Gitea は **「コードホスティングをシンプル・軽量・低コストでセルフホストしたい」** 用途に最適。GitHub の高度な機能（Copilot・Code Scanning・大規模エコシステム）を必要としない場合、Gitea は現実的かつ最も移行しやすい選択肢。

**移行判断の最重要チェック**: CI/CD は何を使っているか。GitHub Actions のワークフローが複雑なほど（外部マーケットプレイスの Action 依存が多いほど）、Gitea Actions への移行コストが増える。

## Open questions

- Gitea Actions の GitHub Actions 公式 Action（actions/\*）の互換カバレッジの実態
- GitHub の Secret Scanning / Dependabot の代替を Gitea 環境で実現する方法
- 日本語圏での Gitea チーム導入事例の規模感

## Evidence sources

- https://about.gitea.com/
- https://github.com/pricing
- https://github.com/go-gitea/gitea

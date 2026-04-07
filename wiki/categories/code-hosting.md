---
type: category
slug: code-hosting
name: コードホスティング・Git プラットフォーム
ossalt_category: code-hosting
tool_count: 3
last_reviewed: 2026-04-05
confidence: medium
source_count: 4
---

# コードホスティング・Git プラットフォーム

## 概要

Git リポジトリのホスティング・Issue 管理・Pull Request・CI/CD・コードレビューを提供するプラットフォームのカテゴリ。GitHub が事実標準として定着した 2018 年以降、Microsoft による買収・Copilot のコード学習問題・データ所有権・コストを動機に、セルフホスト OSS（Gitea / Forgejo / GitLab CE）への移行を検討する組織が増えている。

## なぜ今注目されているか

**1. Microsoft 買収後の不信と GitHub Copilot 問題**
2018 年の Microsoft 買収以降、オープンソースコミュニティの一部に不信感がある。2022 年には GitHub Copilot がプライベートリポジトリのコードを含む学習データを使った疑いで訴訟が起きており、コードの著作権・プライバシー問題が顕在化した。

**2. データ所有権・データ居住地要件**
ソースコードという最重要資産が GitHub（Microsoft Azure）のサーバーに保管されることへの懸念。金融・医療・政府系では国内サーバー要件が発生することがある。

**3. Gitea / Forgejo の成熟**
Gitea が GitHub ライクな UI・Gitea Actions（GitHub Actions 互換 CI/CD）を整備し、「GitHub の普通のセルフホスト代替」として使える水準に達した。

**4. GitLab の二段構え**
GitLab.com（SaaS）→ GitLab CE（セルフホスト）という同一ソフトの移行パスが整備されており、GitLab ユーザーにとってセルフホストの心理的ハードルが低い。

## 主要ツールの勢力図

```
      軽量・シンプル ←───────────────── 高機能・重厚
             |                                  |
           Gitea         Forgejo           GitLab CE
          (MIT・軽量)   (GPL・コミュニティ)  (MIT・フルDevOps)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Gitea | 軽量・GitHub近似・最も導入しやすい | 46,000 | MIT |
| Forgejo | Gitea フォーク・コミュニティガバナンス | 12,000（Codeberg） | GPL-3.0 |
| GitLab CE | フルDevOps・GitHub最近似機能 | 24,000 | MIT |

## 注目の動き（直近）

- **Gitea Actions** の安定化が進み、GitHub Actions との互換性が向上している。CI/CD ごとの移行が現実的になった。
- **Forgejo** が独自機能（federation・ActivityPub 対応）の開発を進めており、分散 Git ホスティングという新しい方向性を探っている。
- **GitLab** が AI 機能（GitLab Duo）を強化しており、Copilot 対抗の独自 AI コーディング支援を GitLab CE でも一部提供。
- **Codeberg.org** が Forgejo を採用した公開インスタンスとして成長しており、GitHub の OSS 代替プラットフォームとしての認知が広がっている。

## 日本語圏での温度感

GitHub 代替への移行は、日本の開発コミュニティでも一部で議論されているが、実際の移行事例はまだ少数。主な移行動機：

- **「GitHub に置けないコードがある」**: 規制業種・受託開発でのコンプライアンス
- **「個人の private リポジトリを自己管理したい」**: 個人エンジニアのインフラ趣味
- **「GitHub のコストを下げたい」**: 中小企業のコスト最適化

Gitea の日本語情報は充実しており、Zenn・Qiita に導入記事が多い。GitLab CE の日本語情報も比較的豊富。Forgejo は情報が少ない。

GitHub の代替を積極的に選ぶ文化は日本の開発コミュニティではまだ少数派で、欧州（特にドイツ・フランス）に比べて温度感が低い。

## ossaltにおける推奨方針

### 移行スコープを先に明確化する

```
「何を移行したい？」
├── コードホスティング + Issue + PR だけ → Gitea / Forgejo（軽量・簡単）
├── CI/CD も含めてフル移行 → Gitea Actions or GitLab CE
└── Container Registry・Security scanning も → GitLab CE
```

### CI/CD の移行コストを必ず明示する

GitHub Actions → Gitea Actions: 高い互換性（多くはそのまま動く）
GitHub Actions → GitLab CI: 全面書き直しが必要

この差が移行先選択の最重要ファクターになる。

### 「GitHub を完全に置き換える」という期待値を下げる

GitHub の Copilot・Code Scanning・Dependabot・Packages エコシステムは OSS 代替では完全に再現できない。「コードを自社インフラで管理する」という目的に絞ると、Gitea で十分に達成できる。

## Open questions

- 日本語圏での GitHub 移行動機の主な分布（コスト vs セキュリティ vs イデオロギー）
- Forgejo の ActivityPub / Federation 機能が実用化した場合の影響
- Gitea / GitLab CE の AI コーディング支援（Copilot 代替）の将来的な充実度
- 日本の政府・公共機関における GitHub 代替採用の動向

## Evidence sources

- https://about.gitea.com/
- https://forgejo.org/
- https://about.gitlab.com/install/ce-or-ee/
- https://github.com/pricing

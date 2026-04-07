---
type: tool
slug: forgejo
name: Forgejo
category: code-hosting
github: https://codeberg.org/forgejo/forgejo
stars: 12000
language: Go
last_commit: 2026-04-01
license: GPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - github
related_tools:
  - gitea
  - gitlab
---

# Forgejo

## 一言定義

Gitea のコミュニティフォーク。商業化懸念を受けてガバナンスを優先した設計で、Codeberg.org が採用している。**「完全にコミュニティ主導の Git ホスティング OSS が欲しい」用途の選択肢**。

## Positioning

Forgejo は 2022 年末、Gitea 社（Gitea の商業運営会社）の設立・ガバナンス変更への懸念から、コミュニティ主導を維持したいメンバーが Gitea をフォークして誕生した。「ソフトウェアフォージはコミュニティに属するべき」という思想を掲げ、意思決定がコミュニティによる合議制で行われる。

機能・UI は Gitea とほぼ同等で、Gitea からの移行も容易。Codeberg.org（欧州の非営利 Git ホスティングサービス）が Forgejo を採用しており、実績がある。Forgejo Actions（GitHub Actions 互換）も提供。[Source](https://forgejo.org/)

## 強み

- **コミュニティガバナンス**: 商業企業ではなく、コミュニティによる意思決定。OSS の持続可能性を重視するユーザーに向く。
- **Gitea 互換**: Gitea と機能・API・データ形式がほぼ同等で、Gitea からの移行が容易（逆も然り）。
- **軽量**: Gitea と同様にシングルバイナリ・低リソース動作。
- **Forgejo Actions**: GitHub Actions 互換の CI/CD。
- **Codeberg.org の実績**: 大規模な公開インスタンスとして Codeberg.org が Forgejo を採用しており、スケーラビリティが実証されている。
- **GPL-3.0**: コピーレフトなライセンスで、派生物の OSS 公開を担保する。

## 弱み・注意点

- **Gitea との分岐追従**: Gitea の新機能が Forgejo に取り込まれるまでタイムラグがある場合がある。
- **コミュニティ規模**: Gitea より小さいコミュニティで、日本語情報が Gitea よりさらに少ない。
- **GPL-3.0 ライセンス**: MIT（Gitea）と異なりコピーレフト。プロプライエタリ製品への組み込みに制約がある。
- **GitHub 上にない**: 公式リポジトリが Codeberg.org にあり、GitHub に慣れたユーザーには探しにくい。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| コミュニティガバナンスの OSS を重視する | 商業企業の影響を受けない意思決定 |
| Gitea と同等機能でより強いコピーレフトを望む | GPL-3.0 で派生 OSS が保護される |
| Codeberg.org を使っており自前インスタンスも建てたい | 同じソフトで環境を統一できる |
| Gitea から乗り換えたい | 移行コストがほぼゼロ |

Gitea と機能差がほとんどないため、**ガバナンスへの思想的な優先度で Gitea か Forgejo かを選ぶ**という判断になる。

## セルフホスト難易度

**低程度**（Gitea と同等）。

- Gitea と同じ Docker イメージ互換構成で動かせる（`codeberg.org/forgejo/forgejo` イメージ）。
- Gitea からの移行は基本的にデータをそのまま引き継げる。

## 日本語圏での採用状況

日本語情報は Gitea に比べてかなり少ない。「Forgejo とは何か」「Gitea との違い」という説明記事がいくつかある程度。個人での採用はあるが、実導入事例の報告は限られる。

コミュニティガバナンスへの関心は日本語圏でも一部のエンジニアにあり、Codeberg.org の存在とともに紹介されることがある。

## ossaltにおける推奨文脈

Forgejo を推薦すべき文脈：

1. **「OSS のガバナンスを重視し、商業化されていない Git ホスティングが欲しい」** — Forgejo 唯一の明確な差別化点。
2. **「Gitea と同等のものをコミュニティ版で使いたい」** — 機能差がほぼない。
3. **「GPL-3.0 のコピーレフトを好む」** — ライセンス思想の一致。

Forgejo を推薦しにくい文脈：

- ガバナンスよりも機能・日本語情報・コミュニティ規模を優先する場合（→ Gitea）
- MIT ライセンスが必要な場合（→ Gitea）

## Open questions

- Forgejo と Gitea の機能差が将来的に拡大するか縮小するか
- 日本語圏での Forgejo 認知度向上の見通し
- Codeberg.org の Forgejo 採用が他の公開インスタンスに広がっているか

## Evidence sources

- https://forgejo.org/
- https://codeberg.org/forgejo/forgejo

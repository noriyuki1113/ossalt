---
type: tool
slug: gitea
name: Gitea
category: code-hosting
github: https://github.com/go-gitea/gitea
stars: 46000
language: Go
last_commit: 2026-04-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - github
related_tools:
  - forgejo
  - gitlab
---

# Gitea

## 一言定義

Go 製・MIT ライセンスの軽量 Git ホスティング。シングルバイナリで動き、GitHub ライクな UI を持つ。**「GitHub をセルフホストで置き換えたい」用途の最も導入しやすい候補**。

## Positioning

Gitea は「Painless self-hosted Git」を掲げ、軽量・シンプル・セルフホストしやすいことを設計の核に置く。GitHub ライクな UI（リポジトリ・Issue・PR・Wiki・Release）を持ちつつ、Go 製シングルバイナリで SQLite から MySQL / PostgreSQL まで対応する柔軟性を持つ。

2022 年に Gitea 社が設立され商業化が進む中、コミュニティ主導を優先したいユーザーが Forgejo にフォークした経緯がある。Gitea 自体は MIT ライセンスを維持しており、現在も活発に開発されている。Gitea Actions（GitHub Actions 互換）の追加で CI/CD もカバーできるようになった。[Source](https://about.gitea.com/)

## 強み

- **軽量・シングルバイナリ**: 10MB 程度のバイナリ 1 本で動く。Raspberry Pi・低スペック VPS でも問題なく動作。
- **MIT ライセンス**: 商用利用・フォーク・組み込みに制約なし。
- **GitHub ライクな UI**: Issue・PR・Wiki・Release・Milestone の構成が GitHub に近く、移行ユーザーが馴染みやすい。
- **Gitea Actions**: GitHub Actions 互換の CI/CD ランナーが統合されており、`.github/workflows/*.yml` がほぼそのまま動く。
- **多様なデータベース対応**: SQLite・MySQL・PostgreSQL・MSSQL に対応。小規模個人は SQLite で開始できる。
- **活発な開発**: GitHub スター 4.6 万超。リリース頻度が高く、機能追加が続いている。[Source](https://github.com/go-gitea/gitea)
- **パッケージレジストリ**: npm / PyPI / Docker / Helm 等のパッケージホスティングにも対応。

## 弱み・注意点

- **商業化への懸念（Forgejo との分岐点）**: 2022 年の Gitea 社設立以降、ガバナンスへの懸念からコミュニティの一部が Forgejo にフォーク。完全 OSS コミュニティを重視するなら Forgejo を選ぶべきという意見がある。
- **GitLab 比での機能不足**: GitLab CE にある高度な CI/CD・Container Registry・Security scanning・Pages は Gitea では部分的にしか対応していない。
- **エンタープライズ機能**: SSO（SAML）・高度な監査ログ・大規模組織管理は GitLab CE の方が充実している。
- **サーバー管理が必要**: オフライン動作非対応。アップデート・バックアップはユーザー責任。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| 低スペックサーバーで GitHub を置き換えたい | シングルバイナリ・軽量・SQLite対応 |
| シンプルな Git ホスティングが欲しい小〜中規模チーム | 機能がシンプルで運用しやすい |
| MIT ライセンスの完全 OSS を重視する | ライセンスリスクゼロ |
| GitHub Actions ワークフローを使い回したい | Gitea Actions で互換性が高い |
| 個人の private リポジトリを自己管理したい | 最も導入コストが低い |

## セルフホスト難易度

**低程度**。コードホスティングの OSS の中で最も簡単な部類。

```yaml
# docker-compose.yml 最小構成
services:
  gitea:
    image: gitea/gitea:latest
    ports:
      - 3000:3000
      - 22:22
    volumes:
      - ./gitea-data:/data
```

- Docker Compose で数分で起動可能。
- SQLite をデフォルトで使えるため、外部 DB が不要。
- SSH / HTTPS でのリポジトリ操作が設定後すぐに使える。
- Gitea Actions ランナーは別途 act_runner コンテナが必要。

## 日本語圏での採用状況

GitHub 代替 OSS の中で最も日本語情報が充実している。「Gitea セルフホスト」での検索で豊富な導入記事がヒットする。個人の private リポジトリ管理・小規模開発チームでの採用が中心。

企業での採用はエンジニアチームが主導する形で増えており、特に「GitHub に置けないコードを管理する」という用途での導入が目立つ。

## ossaltにおける推奨文脈

Gitea を推薦すべき文脈：

1. **「GitHub を最も簡単にセルフホストで置き換えたい」** — 導入コストが最小。
2. **「低スペックサーバー・Raspberry Pi で運用したい」** — シングルバイナリの軽量さが際立つ。
3. **「GitHub Actions ワークフローをそのまま使いたい」** — Gitea Actions で高い互換性。
4. **「MIT ライセンスの完全 OSS が必要」** — ライセンスが最もシンプル。

Gitea を推薦しにくい文脈：

- CI/CD・Container Registry・Security scanning まで含むフル GitLab 的な環境が必要（→ GitLab CE）
- コミュニティガバナンスを重視する（→ Forgejo）
- 大規模エンタープライズの権限管理・SSO が必要

## Open questions

- Gitea 社の商業化が OSS としての Gitea に与える長期的な影響
- Gitea Actions の GitHub Actions 互換性の実際の網羅率（未対応の構文・Action）
- Gitea vs Forgejo の選択基準をどう ossalt で整理するか

## Evidence sources

- https://about.gitea.com/
- https://github.com/go-gitea/gitea

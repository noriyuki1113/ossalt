# CLAUDE.md — find-my-alt wiki schema

このファイルはfind-my-alt wikiの操作ルールを定義する。
セッション開始時に必ずこのファイルを読み、一貫した動作を維持すること。

-----

## このwikiの目的

find-my-alt（ossalt.jp）は日本語圏向けのOSSオルタナティブディレクトリ。
このwikiはその「知識エンジン」として機能する。

- SaaS → OSS代替の判断文脈を蓄積・深化させる
- ツール・カテゴリ・比較軸の知識を複利的に積み上げる
- ossalt.jpのコンテンツ・SEO素材の生成源になる
- 使うたびwikiが賢くなる（explorationをfilingで返す）

-----

## ディレクトリ構造

```
find-my-alt/
├── CLAUDE.md                      ← このファイル（変更時はlog.mdに記録）
├── index.md                       ← wiki全体の目次
├── log.md                         ← 操作ログ（append-only）
├── raw/                           ← ソース（不変。LLMは読むだけ）
│   ├── articles/                  ← Obsidian Web Clipperで保存した記事
│   ├── github/                    ← README・スター推移・リリースノート
│   ├── hn/                        ← HN・Redditスレッド
│   └── assets/                    ← 画像
└── wiki/
    ├── saas/                      ← SaaS親ページ（比較の起点）
    ├── tools/                     ← OSSツールエンティティページ
    ├── categories/                ← カテゴリ別トレンド分析
    ├── comparisons/               ← ツール間詳細比較
    ├── decision-axes/             ← 判断軸の概念記事
    └── synthesis/                 ← Q&A回答・分析結果（filing back）
```

-----

## ページタイプとフォーマット

### saas（wiki/saas/）

SaaS親ページ。「Notionの代替を探す」のような検索意図の起点になるページ。
比較の分岐点を整理することが目的。おすすめを一つに絞るページではない。

```markdown
---
type: saas
slug: [slug]
name: [SaaS名]
category: [カテゴリ]
status: active | deprecated
priority: high | medium | low
pain_points:
  - monthly-cost
  - vendor-lock-in
  - data-ownership
  - offline-local-first
  - self-hosting
  - [その他]
decision_axes:
  - use-case-fit
  - collaboration-model
  - local-first-offline
  - self-host-difficulty
  - ops-burden
  - migration-friction
  - japanese-doc-availability
  - [その他]
last_reviewed: YYYY-MM-DD
confidence: high | medium | low
source_count: [N]
related_tools:
  - [tool-slug]
related_category_pages:
  - wiki/categories/[slug].md
related_comparison_pages:
  - wiki/comparisons/[slug-vs-slug].md
---

# [SaaS名]

## Summary
[ossaltにおけるこのSaaSの立ち位置。なぜ代替検討の起点になるか。2-4文]

## Why it matters for ossalt
[なぜこのSaaSがossaltで重要か。比較難度・用途の広さ・日本語圏での普及度]

## How [SaaS名] is positioned
[公式サイト・実態から読み取れるポジショニング]

## Why users look for alternatives
[代替検討が起きる理由の構造化。pain_pointsに対応]

## What ossalt should help users decide
[このページが支援すべき意思決定の一覧]

## Core decision axes
[decision_axesの各項目を展開。候補ツールの差が出るポイントを説明]

## Candidate families
[代替候補のグルーピングと用途別の位置づけ]

## Editorial policy for this SaaS page
[このページの編集方針。LLMが次回更新時に参照する]

## Suggested related wiki pages
[未作成も含めて提案。lintの種になる]

## Open questions
[未解決の比較・調査課題。次のingestやlintのヒントになる]

## Evidence sources
[参照したURL一覧]
```

-----

### tool（wiki/tools/）

OSSツールのエンティティページ。saasページから参照される。

```markdown
---
type: tool
slug: [slug]
name: [ツール名]
category: [カテゴリ]
github: [GitHub URL]
stars: [N]
language: [主要言語]
last_commit: YYYY-MM-DD
license: [ライセンス]
self_hostable: true | false
local_first: true | false
ossalt_listed: true | false
last_reviewed: YYYY-MM-DD
confidence: high | medium | low
source_count: [N]
replaces:
  - [saas-slug]
related_tools:
  - [tool-slug]
---

# [ツール名]

## 一言定義
## Positioning
## 強み
## 弱み・注意点
## どんなユーザーに向くか
## セルフホスト難易度
## 日本語圏での採用状況
## ossaltにおける推奨文脈
## Open questions
## Evidence sources
```

-----

### comparison（wiki/comparisons/）

2ツール間の詳細比較。saasページから参照される。

```markdown
---
type: comparison
slug: [tool-a]-vs-[tool-b]
tool_a: [slug]
tool_b: [slug]
saas_context: [どのSaaS代替文脈か]
last_reviewed: YYYY-MM-DD
confidence: high | medium | low
source_count: [N]
---

# [Tool A] vs [Tool B]

## 比較の文脈
## TL;DR（どちらを選ぶべきか・条件付きで）
## 比較表
## 各軸での詳細比較
## 移行摩擦
## 日本語圏での選択傾向
## 結論
## Open questions
## Evidence sources
```

-----

### category（wiki/categories/）

カテゴリ全体のトレンド分析。

```markdown
---
type: category
slug: [slug]
name: [カテゴリ名]
ossalt_category: [ossalt.jpのカテゴリスラッグ]
tool_count: [N]
last_reviewed: YYYY-MM-DD
confidence: high | medium | low
source_count: [N]
---

# [カテゴリ名]

## 概要
## なぜ今注目されているか
## 主要ツールの勢力図
## 注目の動き（直近）
## 日本語圏での温度感
## ossaltにおける推奨方針
## Open questions
## Evidence sources
```

-----

### decision-axis（wiki/decision-axes/）

比較軸の概念記事。複数のsaasページから参照される横断的な知識。

```markdown
---
type: decision-axis
slug: [slug]
name: [軸の名前]
last_reviewed: YYYY-MM-DD
---

# [軸の名前]

## 一言定義
## なぜ重要か
## この軸で差が出るツール群
## ossaltでの使い方
## 関連ページ
```

-----

## 操作ルール

### Ingest

1. `raw/`にソースを置く（LLMは編集しない）
1. ソースを読み、要点をユーザーと確認する
1. 影響するwikiページを特定して更新・新規作成する
1. `index.md`を更新する
1. `log.md`に記録する

ログフォーマット：

```
## [YYYY-MM-DD] ingest | [ソースタイトル]
- 追加ソース: raw/[path]
- 更新ページ: wiki/[path], wiki/[path]
- 新規ページ: wiki/[path]
- 所感: [気づき・次に調べたいこと]
```

### Query

1. `index.md`を読み、関連ページを特定する
1. 関連ページを読んで回答を合成する
1. 価値ある分析は`wiki/synthesis/`に保存する（explorationをfilingで返す）
1. `log.md`に記録する

ログフォーマット：

```
## [YYYY-MM-DD] query | [質問の要約]
- 参照ページ: wiki/[path]
- synthesis保存: wiki/synthesis/[slug].md（保存した場合のみ）
```

### Lint

以下をチェックする：

- ページ間の矛盾（古い情報 vs 新しいソース）
- `open questions`に残ったまま未調査の項目
- `suggested related wiki pages`に挙がっているが未作成のページ
- インバウンドリンクのない孤立ページ
- `confidence: low`のまま更新されていないページ
- GitHubスター数など数値データの陳腐化（90日以上未更新）
- 新しい比較・decision-axis記事の候補提案

ログフォーマット：

```
## [YYYY-MM-DD] lint | [主な発見]
- 問題: [発見した課題]
- 対応: [修正・新規作成したページ]
- 提案: [次に作るべき記事]
```

-----

## ossalt固有のルール

- **日本語で書く**。固有名詞・技術用語は英語のまま
- **`confidence`を正直に書く**。ソースが少ない・古い場合はlowに下げる
- **`open questions`を空にしない**。未解決課題を残すことがlintの種になる
- **`evidence sources`を必ず記録する**。数値・主張には出典を付ける
- **GitHubスター数は成長率で評価する**。絶対数よりmomentum重視
- **日本語圏の温度感を必ず書く**。グローバルトレンドと日本の差を記録する
- **saasページは「一番を決める」ページではない**。比較の分岐点を整理するページ

-----

## index.mdフォーマット

```markdown
# find-my-alt wiki index

最終更新: YYYY-MM-DD | ページ数: N | ソース数: N

## SaaS親ページ（wiki/saas/）
- [[notion]] — 統合ワークスペース。代替検討の最多起点 (confidence: medium, 更新: YYYY-MM-DD)

## OSSツール（wiki/tools/）
- [[appflowy]] — Notion代替の主要候補。self-host・ローカルファースト (更新: YYYY-MM-DD)

## 比較記事（wiki/comparisons/）
- [[notion-vs-appflowy]] — workspace文脈での比較 (更新: YYYY-MM-DD)

## カテゴリ分析（wiki/categories/）
- [[knowledge-management]] — PKM・Wiki系カテゴリのトレンド (更新: YYYY-MM-DD)

## 判断軸（wiki/decision-axes/）
- [[local-first-offline]] — ローカルファースト性の比較軸 (更新: YYYY-MM-DD)

## Synthesis（wiki/synthesis/）
- [[oss-workspace-landscape-2026]] — workspace系OSSの全体俯瞰 (更新: YYYY-MM-DD)
```

-----

## セッション開始時の必須手順

1. このファイル（CLAUDE.md）を読む
1. `index.md`を読み、wikiの現状を把握する
1. `log.md`の末尾5件を読み、直近の作業を把握する
1. ユーザーの指示を待つ

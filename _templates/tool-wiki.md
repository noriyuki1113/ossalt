---
# wiki/tools/ 統合テンプレート
# - frontmatter: CLAUDE.md スキーマ（LLM比較用メタデータ）
# - 本文: ユーザー向けコンテンツ + 知識エンジン層の統合
type: tool
slug: [slug]
name: [ツール名]
category: [カテゴリ（英語）]
github: [GitHub URL]
stars: [表示用文字列 例: 42k]
stars_num: [数値 例: 42000]
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

<!-- 10〜20字で。「〇〇のOSS代替。△△が特徴。」の形式 -->

## 主な機能

- 機能1
- 機能2
- 機能3
- 機能4
- 機能5

## Positioning

<!-- 競合・類似ツールとの位置づけ。「〇〇よりも△△寄り」の軸で書く -->

## 強み

- 強み1
- 強み2
- 強み3

## 弱み・注意点

- 弱み1
- 弱み2

## どんなユーザーに向くか

- **ユースケース1：** 説明
- **ユースケース2：** 説明
- **ユースケース3：** 説明

## セルフホスト難易度

**難易度：** 低 | 中 | 高

<!-- 構成の複雑さ・必要スペック・メンテ頻度を簡潔に -->

```bash
# 最小起動例
docker run ...
```

詳細は [公式ドキュメント]([URL]) を参照。

## 日本語圏での採用状況

<!-- グローバルトレンドと日本の温度感の差を記録。情報源が少ない場合は正直に書く -->

## ossaltにおける推奨文脈

<!-- どのSaaS代替ページからリンクすべきか。どんな用途・規模のユーザーに推奨するか -->

## Open questions

- 未解決の比較・調査課題1
- 未解決の比較・調査課題2
- 未解決の比較・調査課題3

## Evidence sources

- [URL]
- [URL]

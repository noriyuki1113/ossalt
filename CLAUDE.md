# ossalt.jp — Wiki Layer Instructions

## プロジェクト概要

ossalt.jp は日本語向けの OSS・オープンソース代替ツールディレクトリ。
このvaultは `/wiki` レイヤーのコンテンツ管理に使う。

**ターゲットユーザー：** 日本の開発者、スタートアップ、個人事業主  
**言語ルール：** 本文は日本語。frontmatter の key は英語、value は日本語。  
**トーン：** 技術的に正確、かつ読みやすく。過度な敬語不要。

-----

## ディレクトリ構成

```
wiki/
├── saas/        # SaaS・商用ツールの代替紹介
├── devtools/    # 開発ツール
├── infra/       # インフラ・クラウド
├── ai/          # AI・LLM関連
└── index.md     # wikiトップ（自動生成禁止、手動管理）
```

-----

## テンプレートの使い分け

|ページ種別         |使うテンプレ                     |例                            |
|--------------|---------------------------|-----------------------------|
|個別ツール紹介       |`_templates/tool-wiki.md`  |appflowy.md, anytype.md      |
|SaaS親ページ（比較起点）|`_templates/saas-parent.md`|notion.md, slack.md, figma.md|

**SaaS親ページの判断基準：**

- 代替候補が3件以上ある主要SaaSか
- 用途分解が必要な「何でもできる系」ツールか
- ossaltで比較の起点になるページか

上記に当てはまる場合は `saas-parent.md` を使う。それ以外は `tool-wiki.md`。

-----

## ファイル生成ルール

### 必須 frontmatter（YAMLブロック）

```yaml
---
title: "ツール名"
slug: "tool-slug"
category: "saas | devtools | infra | ai"
description: "1〜2文の日本語説明"
website: "https://..."
github: "https://github.com/..."   # なければ省略
license: "MIT | Apache-2.0 | ..."  # なければ省略
alternatives:
  - name: "代替ツール名1"
    url: "https://..."
    type: "oss"   # oss | saas
  - name: "代替ツール名2"
    url: "https://..."
    type: "saas"
tags:
  - "タグ1"
  - "タグ2"
lastUpdated: "YYYY-MM-DD"
---
```

### 本文構成（必ずこの順番）

1. `## 概要` — 何をするツールか（3〜5文）
1. `## 主な機能` — 箇条書き5件以内
1. `## OSSとしての特徴` — なぜオープンソースが良いか
1. `## こんな人におすすめ` — ユースケース2〜3件
1. `## 導入方法` — インストール/セットアップの概要（コードブロック可）
1. `## 関連ツール` — alternatives から自動展開

-----

## 生成時の注意事項

- ページ種別に応じて正しいテンプレートを使う（上記「テンプレートの使い分け」参照）
- `_notes/` 以下は**読まない・編集しない**
- `index.md` は**編集しない**（手動管理）
- 既存ページを上書きする前に必ず確認を求める
- GitHub URLは `github.com/org/repo` 形式で統一
- alternatives は最低3件。なければ「調査中」と明記
- lastUpdated は実行日の日付を入れる

-----

## 一括生成コマンド例

```bash
# 個別ツール（tool-wiki.md を使用）
"appflowy.md を _templates/tool-wiki.md に従って生成して"

# SaaS親ページ（saas-parent.md を使用）
"slack.md を _templates/saas-parent.md に従って生成して"

# カテゴリ一括
"saas/ 配下に linear, height, basecamp の3ファイルを生成して"

# レビュー
"wiki/saas/ 以下の全ファイルのfrontmatterが正しいか確認して"
```

-----

## ossalt.jp との連携

- このvaultは `ossalt.jp` リポジトリの `content/wiki/` に対応
- `git push` 後、Vercel が自動デプロイ
- Supabase の tools テーブルとの整合性は別途確認が必要

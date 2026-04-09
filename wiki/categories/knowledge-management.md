---
type: category
slug: knowledge-management
name: 知識管理・PKM
ossalt_category: knowledge-management
tool_count: 3
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
---

# 知識管理・PKM

## 概要

個人・チームの知識を蓄積・整理・検索・活用するためのツールカテゴリ。PKM（Personal Knowledge Management）とチームナレッジベースの2層に分かれる。ワークスペースカテゴリとオーバーラップするが、「知識の構造化と長期的な蓄積」を主目的とする点で区別する。

## なぜ今注目されているか

Notion の「すべてをまとめる」アプローチへの反省から、「ツールに依存しない知識資産」を求める動きが強まっている。ローカルファースト・プレーンテキスト・オープンフォーマットを重視する PKM ユーザーが OSS ツールへ移行する傾向が顕著。LLM との組み合わせ（RAG・セマンティック検索）でナレッジベースを強化する需要も高まっている。

## 主要ツールの勢力図

| ツール | 位置づけ | 強み | stars |
|---|---|---|---|
| Outline | チームナレッジベース | リアルタイム共同編集・Slack 連携・成熟 | 30k |
| AppFlowy | ワークスペース型 PKM | ローカルファースト・AI 統合・クロスプラットフォーム | 62k |
| Anytype | 個人 PKM・データ主権重視 | P2P 同期・E2E 暗号化・オブジェクト型データモデル | 5k |

**参考（OSS 隣接）：**
- Obsidian: プレーンテキスト（Markdown）ローカルファーストの PKM。ソース非公開だが無料・人気 PKM の代名詞

## 注目の動き（直近）

- Outline が AI 機能（ドキュメント要約・検索強化）を追加し、ナレッジベースとしての価値を高める
- AppFlowy が AI ブロック・ローカル LLM との統合を進め、知識管理の文脈でも注目
- 「第二の脳（Second Brain）」方法論の普及で、個人 PKM ツールへの需要が高まっている

## 日本語圏での温度感

日本でも「第二の脳」「デジタル庭園（Digital Garden）」の概念が浸透しつつあり、Obsidian・Notion を使う PKM ユーザーが多い。Anytype は日本語 PKM コミュニティで注目されているが、実際の移行事例は少ない。Outline は技術系スタートアップで社内 Wiki として採用される事例が増えている。

## ossaltにおける推奨方針

「チームの知識共有か、個人の PKM か」で候補を分けて提示する。チーム用には Outline（成熟・安定）、個人 PKM にはデータ主権重視なら Anytype、オールインワンで AI 統合も欲しいなら AppFlowy。Obsidian は OSS ではないが PKM 文脈での言及は許容し、「OSS 対象外」と明記する。

## Open questions

- Anytype のライセンス（Any Source Available）が完全 OSS に移行する計画はあるか
- Outline に AI 機能が追加されたことでナレッジ検索の実用性はどう変わったか
- 日本語コンテンツの多い PKM での Anytype の検索精度

## Evidence sources

- https://www.getoutline.com/
- https://appflowy.com/
- https://anytype.io/
- https://ossalt.jp/alternatives/notion

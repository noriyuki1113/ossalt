---
type: tool
slug: appflowy
name: AppFlowy
category: workspace
github: https://github.com/AppFlowy-IO/AppFlowy
stars: "62k"
stars_num: 62000
language: Rust / Dart
last_commit: 2026-04-05
license: AGPL-3.0
self_hostable: true
local_first: true
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - notion
  - asana
related_tools:
  - affine
  - anytype
  - outline
---

# AppFlowy

## 一言定義

Notion の OSS 代替筆頭。Rust + Flutter 製でオフラインファースト・セルフホスト対応のワークスペース。

## 主な機能

- ドキュメント編集（ブロックエディタ）
- データベースビュー（グリッド・カンバン・カレンダー・ギャラリー）
- AI 機能（ローカル LLM / クラウド AI 統合）
- タスク管理・プロジェクト管理
- チームコラボレーション（コメント・メンション）
- オフライン動作
- クロスプラットフォーム（macOS / Windows / Linux / iOS / Android）

## Positioning

Notion の代替候補のなかで「オフラインファースト」と「セルフホスト」を最も前面に出したツール。AFFiNE と比べるとホワイトボード機能はないが、データベース機能が充実しており、Notion のワークフローにより近い。Anytype と比べると共同編集・チームユースに向いている。 [Source](https://appflowy.com/)

## 強み

- Rust 製のコアで高速・軽量。オフラインで完全動作する
- Notion に近いブロックエディタ + データベースの組み合わせ
- クロスプラットフォームのネイティブアプリ（Web のみでない）
- stars 6万超の活発なコミュニティ

## 弱み・注意点

- AppFlowy Cloud（セルフホスト版）の構成はまだ発展途上で複雑
- Notion のデータベース間のリレーション機能は限定的
- プラグイン・テンプレートエコシステムは Notion に比べて小さい
- 日本語 UI の完成度にやや課題がある（2026年時点）

## どんなユーザーに向くか

- **Notion からの脱出を検討中のチーム：** セルフホストとオフライン動作を重視する場合
- **オールインワンワークスペースが必要：** ドキュメント + タスク管理 + データベースを一つにまとめたい場合
- **Asana 代替としてドキュメントも統合したい：** タスク管理だけでなく知識管理も同時に移行したい場合

## セルフホスト難易度

**難易度：** 中〜高

デスクトップアプリとして使う場合はインストールするだけで簡単。チーム同期・共同編集のためのサーバー（AppFlowy Cloud）をセルフホストする場合は PostgreSQL・Redis・MinIO・S3互換ストレージが必要で構成が複雑。

```bash
# デスクトップアプリのインストール（最小構成）
# https://appflowy.com/download から各プラットフォーム向けをDL

# サーバー（AppFlowy Cloud）のセルフホスト
git clone https://github.com/AppFlowy-IO/AppFlowy-Cloud
cd AppFlowy-Cloud
cp deploy.env .env
docker compose up -d
```

詳細は [AppFlowy Cloud セルフホストガイド](https://appflowy.com/docs/self-hosting) を参照。

## 日本語圏での採用状況

Notion 代替として日本語の記事・Zenn投稿が増えてきている。個人の PKM（個人知識管理）用途での紹介が多く、チーム導入事例はまだ少ない。デスクトップアプリのシンプルな利用法は日本語情報が揃いつつある。

## ossaltにおける推奨文脈

`wiki/saas/notion.md` と `wiki/saas/asana.md` の両方から参照する。Notion 代替としては「オフライン・プライバシー重視」ユーザーへ、Asana 代替としては「タスク + ドキュメントを統合したい」ユーザーへ推奨する。

## Open questions

- AppFlowy Cloud のセルフホスト版の安定性は 2026 年時点でプロダクション利用に耐えるか
- Notion のデータベースリレーション機能との機能差の現状
- 日本語 UI の完成度・翻訳状況の最新情報

## Evidence sources

- https://appflowy.com/
- https://github.com/AppFlowy-IO/AppFlowy
- https://appflowy.com/compare/notion-vs-appflowy
- https://ossalt.jp/alternatives/notion

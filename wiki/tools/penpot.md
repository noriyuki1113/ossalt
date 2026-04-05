---
type: tool
slug: penpot
name: Penpot
category: design-tools
github: https://github.com/penpot/penpot
stars: 35000
language: Clojure, ClojureScript
last_commit: 2026-04-01
license: MPL-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - figma
related_tools: []
---

# Penpot

## 一言定義

Figma に最も近い機能セットを持つオープンソースのデザインツール。SVG ベースのオープンフォーマット・ブラウザベース・リアルタイム共同編集を備え、**Figma 代替 OSS では実質唯一の本格選択肢**。

## Positioning

Penpot は「Web 標準技術によるオープンなデザインツール」を掲げ、SVG + CSS をネイティブのファイル形式として採用している。これにより、ファイルがプロプライエタリなバイナリではなく標準仕様で保存され、Figma のようなベンダーロックインがない。

UI は Figma に近いレイアウトを採用しており、デザイン・プロトタイプ・コード表示（CSS/SVG 出力）の 3 ビューが基本構成。リアルタイム共同編集・コンポーネント・アセットライブラリ・プロトタイピングが揃い、基本的な UI デザイン業務は Penpot でほぼカバーできる水準に達している。[Source](https://penpot.app/)

スペインの Kaleidos 社が開発・資金提供しており、GitHub スター 3.5 万超と Figma 代替 OSS の中では圧倒的な存在感を持つ。

## 強み

- **SVG ベースのオープンフォーマット**: デザインファイルが SVG + XML で保存され、ベンダーロックインがない。将来ツールを変えてもデータを持ち出せる。
- **Figma に近い UX**: デザイン・プロトタイプ・コード表示の構成が Figma に近く、Figma 経験者の学習コストが低い。
- **MPL-2.0 ライセンス**: 比較的自由な OSS ライセンスで商用利用可能。
- **セルフホスト対応**: Docker Compose でのセルフホストが公式にサポートされており、データを自社インフラに置ける。
- **CSS / SVG のネイティブ出力**: Web 標準技術が出力される設計のため、エンジニアへのハンドオフに Web 標準の知識がそのまま使える。
- **開発が活発**: GitHub スター 3.5 万超・Kaleidos 社の継続的な開発・EU の資金援助（Horizon Europe 等）で持続可能な開発体制がある。[Source](https://github.com/penpot/penpot)
- **無料クラウド版（Penpot Cloud）**: セルフホスト不要で使い始められるクラウド版が提供されており、個人・小チームは無料で利用可能。

## 弱み・注意点

- **Auto Layout の完成度**: Figma の Auto Layout（Flexbox 的な自動レイアウト）と比較すると、Penpot の Grid / Flex レイアウト機能はまだ成熟途上の部分がある。
- **Variables（デザイントークン）**: Figma 4.0 で強化された Variables（デザイントークン・カラースキーム切り替え）に相当する機能の実装が発展途上。
- **プラグインエコシステム**: Figma の豊富なプラグイン（Unsplash・Iconify・Charts 等）に比べ、Penpot のプラグイン数はまだ少ない。
- **デザインシステム管理**: 大規模デザインシステムの管理・バージョニング・配布においては Figma に比べてツールが少ない。
- **パフォーマンス**: 大規模ファイル・多数オブジェクトでの動作パフォーマンスは Figma に劣る場合がある。
- **日本語ドキュメント・コミュニティ**: 公式ドキュメントは英語中心。日本語情報は少ない。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| Figma のベンダーロックインを避けたい個人・チーム | SVG オープンフォーマットでデータが自由 |
| セルフホストでデザインデータを自社管理したい | Docker Compose 対応・公式サポート |
| Web 標準ベースのデザイン → 開発ハンドオフを重視 | CSS/SVG 出力がネイティブ |
| スタートアップ・フリーランスでコストを抑えたい | Penpot Cloud が無料で使える |
| Adobe XD から移行先を探している | 機能水準が近く移行しやすい |

Figma の高度なデザインシステム・Variables・豊富なプラグインに依存している大規模チームは、現時点では移行の前に PoC が必須。

## セルフホスト難易度

**低〜中程度**。

- Docker Compose でのセットアップが公式にドキュメント化されており、構築は比較的容易。
- PostgreSQL + Redis + ファイルストレージが必要。
- Penpot Cloud（マネージド版）を使えばインフラ管理が不要で、無料から始められる。
- セルフホスト版のアップデートは Docker イメージ更新で対応できる。

## 日本語圏での採用状況

グローバルでは Figma 代替 OSS として最も認知されており、デザインコミュニティ（Dribbble・Designer News 等）での言及が多い。特に Adobe XD 廃止（2023 年）を機に乗り換え先として評価される機会が増えた。

日本語圏では Zenn・Qiita・個人ブログに紹介記事が存在するが、実業務での採用報告はまだ少ない。フリーランスデザイナー・小規模スタートアップでの「試してみた」段階が中心。日本語ドキュメントの薄さが導入障壁になっている。

## ossaltにおける推奨文脈

Penpot を推薦すべき文脈：

1. **「Figma を使っているが OSS に移りたい」** — Figma 代替 OSS では実質唯一の選択肢。
2. **「デザインデータを自社インフラで管理したい」** — セルフホスト対応で、SVG オープンフォーマット。
3. **「Adobe XD 廃止で移行先を探している」** — Figma よりコストを抑えつつ同等機能に近い。
4. **「個人・小チームでコストゼロのデザインツールが欲しい」** — Penpot Cloud 無料枠が使える。

Penpot を推薦しにくい文脈：

- Figma の Variables・高度な Auto Layout・豊富なプラグインに強く依存している場合
- 大規模デザインシステムをチーム全体で管理している場合
- デザインパフォーマンスが業務のボトルネックになりやすい大型ファイルを扱う場合

## Open questions

- Penpot の Variables / Design Tokens 機能の Figma 同等水準への到達時期
- Figma → Penpot インポートの実用性（.fig ファイルの変換ツール）
- 日本語圏での Penpot 実業務導入事例の収集
- Penpot のプラグイン機構の現状と成長速度
- Figma の Auto Layout と Penpot の Flex / Grid の具体的な機能差

## Evidence sources

- https://penpot.app/
- https://github.com/penpot/penpot

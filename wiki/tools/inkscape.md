---
type: tool
slug: inkscape
name: Inkscape
category: ui-design
github: https://gitlab.com/inkscape/inkscape
stars: "4k"
stars_num: 4000
language: C++
last_commit: 2026-03-20
license: GPL-2.0
self_hostable: false
local_first: true
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 3
replaces:
  - figma
  - illustrator
related_tools:
  - penpot
---

# Inkscape

## 一言定義

長年実績のある OSS SVG エディタ。印刷・イラスト用途の Figma / Illustrator 代替。

## 主な機能

- ベクターイラスト編集（ペン・シェイプ・テキスト）
- SVG 完全対応（W3C 標準準拠）
- PDF / PNG / EPS エクスポート
- パスのブーリアン演算・ノード編集
- グラデーション・パターン・クリッピングマスク
- 拡張機能システム（Python スクリプト）
- クロスプラットフォーム（macOS / Windows / Linux）

## Positioning

Figma 代替の文脈では「UI プロトタイプ・共同編集」ではなく「ベクターイラスト・SVG 加工」の用途に特化した候補として位置づける。20年以上の歴史を持つ成熟した OSS で、印刷業界や web グラフィック制作での実績がある。共同編集機能はなく、プロトタイプ機能もないため、Figma の全機能代替ではなく「SVG/イラスト用途の代替」として整理する必要がある。 [Source](https://inkscape.org/)

## 強み

- SVG の標準準拠度が高く、印刷・web グラフィック制作の本番利用実績が豊富
- 完全オフライン動作・ローカルファースト
- GPL ライセンスで完全無料、商用利用可能
- 拡張機能（Python）で自動化・カスタマイズが可能
- 20年以上の歴史による安定性・ドキュメントの充実

## 弱み・注意点

- UI が旧式で、Figma や Penpot に比べて学習曲線が急
- 共同編集機能がない（1人作業前提）
- UI プロトタイプ・コンポーネント管理機能はない
- GitHub ではなく GitLab でホストされており、stars 数が少なく見える（実態より）

## どんなユーザーに向くか

- **印刷物・ポスター・ロゴ制作：** SVG / PDF の品質を重視するデザイナー
- **web 用 SVG アイコン・グラフィック制作：** コード埋め込み用の最適化 SVG を生成したい開発者
- **Illustrator の代替：** Adobe 依存を脱したいが共同編集は不要な場合

## セルフホスト難易度

**難易度：** 該当なし（ローカルアプリ）

インストーラーまたはパッケージマネージャーでインストールするだけ。サーバーは不要。

```bash
# Linux (apt)
sudo apt install inkscape

# macOS (Homebrew)
brew install --cask inkscape
```

詳細は [公式ダウンロードページ](https://inkscape.org/release/) を参照。

## 日本語圏での採用状況

日本語情報は比較的豊富で、DTP・印刷業界での利用事例がある。Figma が普及する前から使われており、フリーランスデザイナーや趣味の制作者に一定の認知度がある。Figma 代替として探している人には「用途が違う」と説明が必要なケースが多い。

## ossaltにおける推奨文脈

`wiki/saas/figma.md` から「印刷・イラスト・SVG 制作」用途のユーザーへの選択肢として紹介する。「UI デザイン・プロトタイプ・共同編集」が目的なら Penpot を推奨し、「ベクターグラフィック・SVG」が目的なら Inkscape、という分岐を明示する。

## Open questions

- Inkscape 1.x 以降の UI 改善の進捗と、Figma ユーザーが移行した場合の学習コスト
- Inkscape の web 用 SVG 最適化機能（SVGO と比較して）の実用度
- 日本の印刷業界での実際の採用率

## Evidence sources

- https://inkscape.org/
- https://gitlab.com/inkscape/inkscape
- https://inkscape.org/release/
- https://ossalt.jp/alternatives/figma

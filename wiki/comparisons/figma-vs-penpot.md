---
type: comparison
slug: figma-vs-penpot
tool_a: penpot
tool_b: inkscape
saas_context: figma
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
---

# Figma 代替比較：Penpot vs Inkscape

## 比較の文脈

Figma の代替を探しているユーザーが最初に直面する分岐：「UI デザイン・プロトタイプの代替が欲しい（Penpot）」か「ベクターグラフィック・SVG 編集の代替が欲しい（Inkscape）」か。この比較はその分岐を明確にすることを目的とする。

## TL;DR

**チームでの UI デザイン・プロトタイプ → Penpot**
**個人のベクターイラスト・SVG 制作・印刷物 → Inkscape**

この2つは用途が重なる部分が少ない。「Figma の代替」という括りで比べるより、「自分が Figma を何に使っていたか」を先に整理するほうが有益。

## 比較表

| 項目 | Penpot | Inkscape |
|---|---|---|
| **主な用途** | UI デザイン・プロトタイプ | ベクターイラスト・印刷・SVG 加工 |
| **共同編集** | ◎ リアルタイム対応 | ✗ 非対応 |
| **プロトタイプ** | ◎ 画面遷移・インタラクション | ✗ 非対応 |
| **オフライン動作** | △ デスクトップ版で可 | ◎ 完全ローカルアプリ |
| **セルフホスト** | ◎ Docker Compose | ✗ 該当なし（ローカルアプリ） |
| **ライセンス** | MPL-2.0 | GPL-2.0 |
| **Figma インポート** | △ 部分対応（.fig） | ✗ 非対応 |
| **SVG 標準準拠** | ◎ SVG ネイティブ | ◎ W3C 完全準拠 |
| **学習コスト** | 中（Figma ユーザーは低め） | 高（独自 UI） |
| **GitHub Stars** | 35k | 4k（GitLab ホスト） |

## 各軸での詳細比較

### 共同編集・チームワーク

Penpot はリアルタイム共同編集・コメント・コンポーネント共有に対応しており、デザインチームでの利用を前提とした設計になっている。Inkscape は完全にシングルユーザー向けで、共同編集の概念がない。チームで使うなら Penpot 一択。

### プロトタイプ機能

Penpot は画面遷移・インタラクション・スクロール設定など、Figma のプロトタイプ機能を代替できる。Inkscape にはプロトタイプ機能は存在しない。

### ベクター編集の深度

Inkscape はノード編集・パス演算・グラデーション・パターン・クリッピングマスクなど、複雑なベクター編集において Figma より高機能な場面がある。印刷品質の SVG・EPS 出力には Inkscape が適している。Penpot は UI デザイン用途のシェイプ編集は充実しているが、Inkscape ほどのベクター加工の深度はない。

### Figma からの移行のしやすさ

Penpot は `.fig` ファイルのインポートに対応しており（精度は部分的）、Figma からの移行パスが存在する。Inkscape に `.fig` インポート機能はない。Figma のデータを持ち込むなら Penpot 経由が現実的。

## 移行摩擦

**Figma → Penpot**
- `.fig` インポートはフレーム・テキスト・シェイプの基本要素に対応、デザインシステム・Auto layout は手作業が必要
- プラグインエコシステムの差が大きく、Figma 依存のプラグインは代替を探す必要がある

**Figma → Inkscape**
- 用途が異なるため「移行」というより「使い分け」の発想が必要
- SVG エクスポートした素材を Inkscape で加工する hybrid 運用も現実的

## 日本語圏での選択傾向

日本のデザイナーコミュニティでの Penpot 認知度は上昇中だが、本番移行事例はまだ少ない。Inkscape は DTP・印刷業界での利用実績があり、フリーランスデザイナーの一部が使っている。

## 結論

- **UI デザイン・プロトタイプ・共同編集** → **Penpot** が唯一現実的な Figma 代替
- **ベクターイラスト・SVG・印刷物** → **Inkscape** が Figma より適した場面もある
- **両方使う** → Penpot でデザイン・Inkscape で SVG 加工の分業も有効

## Open questions

- Penpot の Auto layout 相当機能の実装状況（2026年時点）
- Figma → Penpot のデザインシステム移行を実践した事例の詳細
- 日本のデザイン会社での Penpot 採用状況

## Evidence sources

- https://penpot.app/
- https://inkscape.org/
- https://help.penpot.app/technical-guide/getting-started/
- https://ossalt.jp/alternatives/figma

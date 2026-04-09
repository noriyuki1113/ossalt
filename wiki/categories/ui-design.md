---
type: category
slug: ui-design
name: UIデザイン
ossalt_category: ui-design
tool_count: 2
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
---

# UIデザイン

## 概要

UI プロトタイプ・ベクターデザイン・デザインシステム管理を扱うカテゴリ。Figma がクラウドベースの共同編集で市場を席巻しており、OSS 代替は「SVG ネイティブ」「セルフホスト可能」「オフライン動作」を軸に差別化している。

## なぜ今注目されているか

Figma の月額コスト（エディター数比例）と `.fig` プロプライエタリ形式へのロックインが移行動機の主軸。Adobe による買収計画が規制当局の反対で破談となった後も Figma は独立 SaaS として高価格を維持しており、コスト削減を目的とした代替検討が続いている。オープンな SVG 形式でデータを保持したいというデータポータビリティへの需要も高まっている。

## 主要ツールの勢力図

| ツール | 位置づけ | 強み | stars |
|---|---|---|---|
| Penpot | UI デザイン・プロトタイプ代替 | SVG ネイティブ・Figma インポート・セルフホスト | 35k |
| Inkscape | ベクターイラスト・SVG 加工 | GPL・完全ローカル・印刷品質の SVG/EPS | 4k |

**用途別の使い分け：**
- チームの UI デザイン・プロトタイプ → Penpot
- 個人のベクターイラスト・印刷物・SVG 素材 → Inkscape

## 注目の動き（直近）

- Penpot が Figma ファイルインポートの精度を継続改善
- Inkscape 1.x 系で UI を刷新し、従来の「古い UI」という印象を改善
- デザインシステム管理（Tokens・Component Library）の OSS 化需要が高まっている

## 日本語圏での温度感

日本のデザイナーコミュニティでは Figma の圧倒的シェアが続いており、OSS 代替への移行は少数派。Penpot は Figma ユーザーの一部が評価しているが、本番移行事例はほぼない。Inkscape は DTP・印刷業界での利用実績があり、日本語情報が比較的豊富。「Figma 代替」という切り口での日本語解説の空白が大きく、ossalt の差別化余地がある。

## ossaltにおける推奨方針

「UI デザイン・プロトタイプ・共同編集」が目的なら Penpot、「ベクターイラスト・SVG・印刷物」が目的なら Inkscape という用途分岐を必ず先に示す。Penpot へのフル移行は現時点でリスクを伴うため、評価環境で試してから判断を推奨する注記を入れる。Figma からの `.fig` インポートの精度制限を正直に伝える。

## Open questions

- Penpot の Auto layout・変数（Variables）機能の実装状況（Figma 同等機能への進捗）
- 日本のデザイン会社での Penpot 採用事例
- Figma と Penpot の間の `.fig` インポート品質の定量評価

## Evidence sources

- https://penpot.app/
- https://inkscape.org/
- https://www.figma.com/
- https://ossalt.jp/alternatives/figma

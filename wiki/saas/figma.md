---
type: saas
slug: figma
name: Figma
category: design-tools
status: active
priority: high
pain_points:
  - monthly-cost
  - vendor-lock-in
  - data-ownership
  - adobe-acquisition-risk
  - offline-local-first
decision_axes:
  - design-fidelity
  - developer-handoff
  - component-system
  - collaboration-model
  - self-host-difficulty
  - file-format-openness
  - japanese-doc-availability
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
related_tools:
  - penpot
related_category_pages:
  - wiki/categories/design-tools.md
related_comparison_pages:
  - wiki/comparisons/figma-vs-penpot.md
---

# Figma

## Summary

Figma はブラウザベースのコラボレーティブデザインツールとして、UI/UX デザイン・プロトタイピング・デザインシステム管理の事実標準となった SaaS。Adobe による買収試みと独占規制による破談を経て、独立を維持しているが、**ベンダーロックインへの懸念・コスト・データ所有権**を動機に OSS 代替（特に Penpot）への関心が高まっている。ossalt では Figma 代替検索の起点として、Penpot との比較を中心に扱う。

## Why it matters for ossalt

デザイナーを抱えるスタートアップ・Web 制作会社・SaaS 企業にとって Figma は必須ツール化しており、代替検討のニーズが安定して存在する。Figma の代替は **Penpot がほぼ唯一の本格 OSS 選択肢**であり、「Figma か Penpot か」という比較構造がシンプルなため、ossalt での意思決定支援がしやすいカテゴリ。

## How Figma is positioned

Figma はデザインツール（Figma）・FigJam（ホワイトボード）・Figma Slides（プレゼン）・Figma Sites（Web 公開）を統合した「デザイン作業の全工程プラットフォーム」として進化している。Dev Mode（開発者向けハンドオフ）・Variables（デザイントークン）・Advanced Prototyping など、デザインシステムの整備から開発連携まで一貫して対応できる点を強みとしている。

## Why users look for alternatives

- **Adobe 買収騒動への不信**: Adobe による 200 億ドル買収提案→独占規制で破談（2023 年）。この一件でベンダーロックインへの懸念が顕在化した。
- **コスト**: Professional プランは $15/編集者/月。チームが大きくなると負担が増える。
- **データ所有権**: デザインファイルが Figma 社のサーバーに保存される。
- **オフライン動作なし**: ブラウザベースのため、ネット接続が必須。
- **独自ファイル形式**: .fig 形式はプロプライエタリで、ツール変更時のデータ持ち出しに制約がある。

## What ossalt should help users decide

1. Penpot への移行でデザインワークフローの何が変わるか（機能ギャップの把握）
2. セルフホストするか Penpot Cloud（マネージド版）を使うか
3. Figma の Dev Mode・デザインシステム・Variables をどこまで Penpot で代替できるか
4. チーム全体（デザイナー + エンジニア）の移行摩擦をどう最小化するか
5. Figma Plugin 資産をどう扱うか

## Core decision axes

### 1. Design fidelity

Penpot は SVG ベースのオープン形式を採用しており、Figma に近いベクターデザイン・コンポーネント・プロトタイピング機能を提供する。基本的な UI デザイン作業は Penpot でほぼカバーできるが、Auto Layout の挙動・Advanced Prototyping・Variables（デザイントークン）の成熟度では Figma が上回る部分がある。

### 2. Developer handoff

Figma の Dev Mode はデザイン仕様の開発者向け表示・CSS 出力・デザイントークン連携が整っており、デザイン→開発の橋渡しとして成熟している。Penpot は CSS・SVG の直接エクスポートが得意であり、Web 標準ベースのハンドオフという点では独自の強みを持つ。

### 3. Component system

Figma のコンポーネント・バリアント・デザインシステム管理は業界標準として成熟。Penpot もコンポーネントとアセットライブラリを提供しているが、大規模デザインシステムの管理においては Figma の完成度には及ばない部分がある。

### 4. Collaboration model

Figma はリアルタイム共同編集・コメント・バージョン管理が成熟。Penpot もリアルタイム共同編集に対応しているが、大人数での同時編集時の安定性・権限管理の細かさは差がある。

### 5. File format openness

Penpot 最大の強みのひとつ。SVG + XML ベースのオープン形式でファイルを保存するため、ベンダーロックインがなく、将来のツール変更時にデータを持ち出しやすい。Figma の .fig 形式はプロプライエタリ。

## Candidate families

### Penpot
Figma に最も近い OSS デザインツール。ブラウザベース・リアルタイム共同編集・コンポーネント・プロトタイピングを揃える。SVG ベースのオープンフォーマットを採用しており、Figma 代替としての OSS では実質的に唯一の本格選択肢。GitHub スター 3.5 万超で開発が活発。

## Editorial policy for this SaaS page

Figma → Penpot の比較では「機能が足りるか」と「移行コストはどれくらいか」の 2 軸を中心に整理する。デザイナー個人の移行とチーム全体の移行では摩擦が大きく異なる点を明示する。「Figma の完全代替」ではなく「デザインワークフローをOSSに移せる水準まで来ているか」という問いを起点にする。

## Suggested related wiki pages

- `wiki/tools/penpot.md`
- `wiki/comparisons/figma-vs-penpot.md`
- `wiki/categories/design-tools.md`
- `wiki/decision-axes/file-format-openness.md`
- `wiki/decision-axes/migration-friction.md`

## Open questions

- 日本語圏のデザイナーで Penpot を実業務に導入しているチームはあるか
- Figma の Variables（デザイントークン）に対応する Penpot の機能の現状
- Figma Plugin エコシステムの代替として Penpot のプラグイン機構はどこまで使えるか
- FigJam（ホワイトボード）の代替として AFFiNE や Excalidraw が使えるか
- Adobe XD 廃止ユーザーの移行先として Penpot が選ばれているか

## Evidence sources

- https://www.figma.com/pricing/
- https://penpot.app/
- https://github.com/penpot/penpot

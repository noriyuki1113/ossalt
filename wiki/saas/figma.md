---
type: saas
slug: figma
name: Figma
category: ui-design
status: active
priority: high
pain_points:
  - monthly-cost
  - vendor-lock-in
  - data-ownership
  - offline-local-first
  - self-hosting
decision_axes:
  - use-case-fit
  - collaboration-model
  - local-first-offline
  - self-host-difficulty
  - ops-burden
  - migration-friction
  - japanese-doc-availability
  - vector-feature-parity
last_reviewed: 2026-04-09
confidence: medium
source_count: 5
related_tools:
  - penpot
  - inkscape
  - lunacy
related_category_pages:
  - wiki/categories/ui-design.md
related_comparison_pages:
  - wiki/comparisons/figma-vs-penpot.md
---

# Figma

## Summary

Figma は、ブラウザベースのリアルタイム共同編集 UI デザインツールであり、ワイヤーフレーム・プロトタイプ・デザインシステム管理まで一体化した SaaS として定着している。Adobe による買収計画が規制当局の反対で破談となった後も独立 SaaS として成長を続けており、ossalt においては月額コストとベンダーロックインを軸に代替検討が起きやすい。 [Source](https://www.figma.com/) [Source](https://ossalt.jp/alternatives/figma)

## Why it matters for ossalt

Figma はデザイン職種を中心に日本でも広く普及しており、「Figma代替」の検索意図はデザイナー・フロントエンド・スタートアップに幅広く存在する。ただし Figma の代替検討は「リアルタイム共同編集の代替」と「ベクターデザインツールの代替」で候補が大きく分かれるため、ossalt が用途を先に絞り込む設計にする必要がある。

## How Figma is positioned

Figma 公式は「デザイン・プロトタイプ・開発の連携をひとつのプラットフォームで」として訴求している。FigJam（ホワイトボード）・Dev Mode（開発者向けコード参照）・スライド機能の追加など、デザインツールを超えたコラボレーション基盤への拡張が進んでいる。 [Source](https://www.figma.com/)

## Why users look for alternatives

- **月額コスト**: Professionalプランは1エディター/月 $12〜（年払い）。エディター数が増えると高くなる
- **ベンダーロックイン**: `.fig` ファイル形式はプロプライエタリで、他ツールへのエクスポートに制約がある
- **オフライン不可**: ブラウザベースのため、完全オフラインでは動作しない
- **データ所有権**: デザインアセットがFigmaのクラウドに保管される
- **セルフホスト不可**: エンタープライズでも完全なオンプレ版は提供されていない

[Source](https://www.figma.com/pricing/) [Source](https://ossalt.jp/alternatives/figma)

## What ossalt should help users decide

1. リアルタイム共同編集が必須か、それとも個人・少人数での作業が主か
2. デザインシステム管理・コンポーネント共有をどこまで必要とするか
3. プロトタイプ機能（インタラクション・遷移アニメーション）の必要度
4. SVGエクスポート品質や開発者向けの inspect 機能の優先度
5. セルフホストの可否、またはオープンファイル形式の重要度

## Core decision axes

### 1. Use-case fit

Penpot はブラウザ/デスクトップ両対応でチームデザイン・プロトタイプを Figma に近い形で代替できる。Inkscape はベクター編集専門で共同編集機能はないが、印刷・イラスト用途に強い。Lunacy は Windows 向けの無料デザインツールで、Figma/Sketch ファイルを開ける点が特徴。 [Source](https://penpot.app/) [Source](https://inkscape.org/) [Source](https://icons8.com/lunacy)

### 2. Collaboration model

Figma 最大の強みは「URLを共有するだけで全員がリアルタイム編集できる」体験にある。Penpot はセルフホスト版でもチームコラボレーション機能を持ち、この軸で最も Figma に近い代替になる。Inkscape や Lunacy は基本的にシングルユーザー向けで、共同編集のネイティブサポートがない。 [Source](https://penpot.app/)

### 3. Local-first / offline

Figma のブラウザ依存に不満があるユーザーには、デスクトップアプリとして動作する Penpot（Electron）や Lunacy が選択肢になる。Inkscape はネイティブアプリとして完全オフライン動作する。 [Source](https://penpot.app/downloads)

### 4. Self-host difficulty

Penpot はセルフホストに最も積極的な候補で、Docker Compose での構築ガイドが整備されている。チームでの利用を想定する場合、Penpot のセルフホストが事実上唯一の現実的な選択肢になる。 [Source](https://help.penpot.app/technical-guide/getting-started/)

### 5. Vector feature parity

Inkscape はベクター編集ツールとして機能が充実しており、複雑なイラスト・SVG加工には Figma より適している場面もある。ただし UI プロトタイプ設計やコンポーネント管理は得意ではなく、用途による使い分けが必要になる。 [Source](https://inkscape.org/)

### 6. Migration friction

Figma からの移行では `.fig` ファイルの変換が最大の障壁。Penpot は Figma ファイルのインポート機能を実装している（精度は完全ではない）。デザインシステムやコンポーネントライブラリの再構築は多くの場合手作業が必要になる。 [Source](https://penpot.app/)

### 7. Japanese doc availability

Penpot の日本語ドキュメントはほぼ存在せず、公式は英語・スペイン語が中心。Inkscape は古参ツールのため日本語情報が比較的豊富。Lunacy は日本語コミュニティが小さい。ossalt の編集価値が高いカテゴリ。 [Source](https://ossalt.jp/alternatives/figma)

## Candidate families

### Penpot
OSS のブラウザベース UI デザイン・プロトタイプツール。Clojure + ClojureScript 製でセルフホスト可能。SVGを第一フォーマットとして使うため、データのポータビリティが高い。Figma 移行の文脈では最も直接的な候補。リアルタイム共同編集にも対応。 [Source](https://penpot.app/)

### Inkscape
長年実績のあるオープンソース SVG エディタ。UI プロトタイプではなくベクターイラスト・グラフィック制作用途に強い。共同編集機能はなく、プロトタイプ機能もないが、SVG 標準への準拠度が高く印刷や web 素材制作で活躍する。 [Source](https://inkscape.org/)

### Lunacy
Icons8 が開発する無料デザインツール（Windows/macOS/Linux）。Figma・Sketch ファイルのインポートに対応し、オフライン動作可能。Icons8のアセットライブラリと統合されているが、コミュニティは小さくOSSではない点に注意。 [Source](https://icons8.com/lunacy)

## Editorial policy for this SaaS page

Figma の代替検討は「共同編集の代替」と「ベクターツールの代替」に二分されるため、用途によって推奨候補が変わることを明示する。Penpot をチームユースの第一候補、Inkscape を個人/印刷用途の候補として整理する。Lunacy は無料だが OSS でない点を明記し、ossalt のスタンス（OSS優先）を維持する。

## Suggested related wiki pages

- `wiki/tools/penpot.md`
- `wiki/tools/inkscape.md`
- `wiki/tools/lunacy.md`
- `wiki/comparisons/figma-vs-penpot.md`
- `wiki/decision-axes/collaboration-model.md`
- `wiki/decision-axes/local-first-offline.md`
- `wiki/categories/ui-design.md`

## Open questions

- Penpot のセルフホスト版でのパフォーマンス・安定性の実態（大規模ファイル時）
- Figma の `.fig` → Penpot インポートの精度は実用レベルに達しているか（2026年時点）
- 日本のデザイナーコミュニティで Penpot の認知度はどの程度か
- Lunacy は OSS でないため ossalt での扱いをどうするか（注記のみか、除外か）

## Evidence sources

- https://www.figma.com/
- https://www.figma.com/pricing/
- https://ossalt.jp/alternatives/figma
- https://penpot.app/
- https://inkscape.org/
- https://icons8.com/lunacy

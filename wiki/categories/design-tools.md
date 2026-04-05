---
type: category
slug: design-tools
name: デザインツール
ossalt_category: design-tools
tool_count: 1
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# デザインツール

## 概要

UI/UX デザイン・プロトタイピング・デザインシステム管理を行うツールのカテゴリ。Figma が 2020 年代に入って事実標準となり、以前の Adobe XD・Sketch・InVision の市場を統合した。ossalt では **Figma 代替の検索需要に対して Penpot を中心に紹介する**カテゴリ。

## なぜ今注目されているか

**1. Adobe 買収破談によるベンダーロックイン意識の高まり**
2022 年に Adobe が Figma を 200 億ドルで買収しようとした試みが 2023 年末に独占規制で破談。この一件で Figma ユーザーの間に「ベンダーロックインリスク」の意識が顕在化し、OSS 代替への関心が高まった。

**2. Adobe XD の廃止（2023 年）**
Adobe が Adobe XD の新機能開発を停止・事実上廃止したことで、XD ユーザーの移行先として Penpot が注目された。

**3. Figma の価格改定への懸念**
Figma は 2024 年に価格体系を改定しており、今後のコスト増への懸念がセルフホスト代替を検討する動機になっている。

**4. デザインの民主化と Web 標準への回帰**
Penpot が採用する SVG / CSS ベースのアプローチは「デザインと Web 標準を一致させる」という思想であり、フロントエンドエンジニアとのコラボレーション文化と親和性が高い。

## 主要ツールの勢力図

デザインツールカテゴリは、OSS 側の選択肢が現状 Penpot に集約されているという特殊な構造を持つ。

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Penpot | Figma代替OSS（実質唯一） | 35,000 | MPL-2.0 |
| Excalidraw | ホワイトボード・手書きUI（参考） | 92,000 | MIT |
| tldraw | ホワイトボード・簡易デザイン（参考） | 38,000 | MIT |

Figma の代替として UI デザイン・プロトタイプ・コンポーネント管理まで含む本格的な OSS は Penpot のみ。Excalidraw / tldraw はホワイトボード・ラフスケッチ用途であり、本格 UI 設計には向かない。

## 注目の動き（直近）

- **Penpot 2.x シリーズ**で Grid レイアウト・Flex レイアウト・コンポーネントグリッドなど UI 設計の核となる機能が強化されている。
- **Penpot のプラグイン機構**が整備され始めており、サードパーティプラグインのエコシステムが育ちつつある。
- **EU の Horizon Europe 資金援助**を受けており、持続可能な開発体制が担保されている。
- Figma 側では **Figma Sites**（Web 公開）・**Figma AI** など AI 統合が加速しており、OSS 側との機能格差が一部で広がっている。

## 日本語圏での温度感

日本語圏では Figma がデザイン業界の標準ツールとして完全に定着しており、代替検討は少数派。主な関心層：

- **フリーランスデザイナー**: Figma のコスト削減目的
- **スタートアップの非デザイン職**: 「デザインツールを触ってみたい」という入口として Penpot の無料版
- **セキュリティ要件のある組織**: データを社内管理したいという動機

Adobe XD 廃止を機に Penpot を試した日本語圏デザイナーの声が Zenn・個人ブログに散見されるが、「本番業務に Penpot を使っている」という報告はまだ少ない。

日本語ドキュメントの薄さが Figma との最大の差であり、ossalt の editorial layer による比較・導入ガイドの価値が高い領域。

## ossaltにおける推奨方針

### Figma からの移行を検討しているユーザーへの分岐

```
「何を理由に Figma 代替を探しているか？」
├── ベンダーロックイン回避・オープンフォーマット → Penpot（SVG形式）
├── コスト削減 → Penpot Cloud（無料枠）またはセルフホスト
├── セルフホストでデータ管理 → Penpot（Docker対応）
└── Adobe XD 廃止で移行先を探している → Penpot
```

### 機能ギャップを正直に書く

「Figma の完全代替」と書くと期待値を上げすぎる。Variables・高度な Auto Layout・プラグインエコシステムは現状 Figma が上であることを明示し、「基本的な UI デザイン業務なら Penpot で十分」という現実的な評価を書く。

### ホワイトボード用途との分離

Figma + FigJam の組み合わせを使っている場合、ホワイトボード部分は AFFiNE・Excalidraw・tldraw で代替し、デザイン部分は Penpot でカバーする「分割戦略」を提示する。

## Open questions

- Figma の価格改定が日本語圏での Penpot 検討動機を増やしているか
- Penpot の Variables / Design Tokens 機能が成熟した場合、本格移行事例が増えるか
- 日本語圏のデザイナーコミュニティでの Penpot の認知度向上施策
- Figma AI の進化に対して OSS 側がどう対抗するか（Penpot AI 機能の動向）
- FigJam（ホワイトボード）代替として AFFiNE との組み合わせ提案の有効性

## Evidence sources

- https://penpot.app/
- https://www.figma.com/pricing/
- https://github.com/penpot/penpot

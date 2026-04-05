---
type: comparison
slug: figma-vs-penpot
tool_a: figma
tool_b: penpot
saas_context: figma
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# Figma vs Penpot

## 比較の文脈

「Figma のベンダーロックインを避けたい・コストを削減したい・データを自社管理したい」という動機での比較。Penpot は Figma 代替の OSS として実質唯一の本格選択肢であり、**「Figma から移れるか」の判断材料を提供する**のがこの記事の目的。[Source](https://penpot.app/)

## TL;DR（どちらを選ぶべきか・条件付きで）

| 選ぶべき状況 | 推奨 |
|---|---|
| ベンダーロックインなしのオープンフォーマットが必要 | **Penpot** |
| デザインデータをセルフホストで管理したい | **Penpot** |
| 個人・小チームでコストゼロで始めたい | **Penpot** |
| Adobe XD から移行先を探している | **Penpot** |
| 大規模デザインシステムを管理している | **Figma** |
| Variables・高度な Auto Layout が必要 | **Figma** |
| 豊富なプラグインに依存している | **Figma** |
| デザイン→開発の成熟したハンドオフが必要 | **Figma** |

## 比較表

| 軸 | Figma | Penpot |
|---|---|---|
| 提供形態 | SaaS のみ | OSS（MPL-2.0）/ セルフホスト / クラウド版 |
| 月額コスト（チーム） | $15/編集者〜 | 無料（Penpot Cloud）/ セルフホスト無料 |
| ファイル形式 | .fig（プロプライエタリ） | SVG + XML（オープン） |
| リアルタイム共同編集 | 成熟 | 対応（大規模時に差あり） |
| コンポーネント | 成熟 | 対応（一部制限あり） |
| Auto Layout / Flex | 成熟（高度） | 対応（発展途上） |
| Variables / Design Tokens | あり（Figma 4.0〜） | 発展途上 |
| プロトタイピング | 成熟 | 基本対応 |
| プラグインエコシステム | 豊富 | 少ない |
| Dev Mode / ハンドオフ | 成熟 | CSS / SVG 直接出力 |
| オフライン動作 | 非対応 | 非対応 |
| セルフホスト | 不可 | 可能（Docker Compose） |
| ライセンス | プロプライエタリ | MPL-2.0 |

## 各軸での詳細比較

### ファイル形式・ベンダーロックイン

**Penpot の最大の強み**。Figma の .fig 形式はプロプライエタリなバイナリで、Figma を辞めた後にデータを他ツールで開く手段が限られる。Penpot は SVG + XML のオープン標準で保存するため、ファイルをテキストエディタで開ける・Git で差分管理できる・将来別のツールに移行しやすい。「データは自分のもの」という思想を設計レベルで実現している。

### Auto Layout・Flexbox レイアウト

Figma の Auto Layout（Flexbox + Grid をデザインツールとして扱う）は UI レイアウトの標準手法として成熟しており、多くのデザインシステムがこれに依存している。Penpot も Flex / Grid レイアウトを実装しているが、挙動の細かさ・操作性・安定性では Figma に劣る部分がある。**Auto Layout を多用している Figma ユーザーは移行前の動作確認が必須**。

### Variables とデザイントークン

Figma 4.0 で強化された Variables（カラーモード切り替え・デザイントークン・コンポーネントのバリアント管理）は、デザインシステムの管理において強力な機能。Penpot にはこれに相当する機能が発展途上。デザイントークン・カラースキーム切り替えを活用しているチームは移行が困難。

### Developer Handoff

Figma の Dev Mode はデザイン仕様の読み取り・CSS 値の表示・デザイントークンのエクスポートが統合されており、デザイン→開発の橋渡しとして成熟。Penpot は CSS・SVG の直接出力という**Web 標準ベースのハンドオフ**を提供しており、フロントエンドエンジニアにとって直感的な場合もある。ただし大規模プロジェクトでの仕様管理ではFigmaの優位が大きい。

### プラグインとエコシステム

Figma プラグイン（Iconify・Unsplash・Charts・アクセシビリティチェック等）への依存度が高いチームは、Penpot 移行後に代替プラグインを探す必要がある。Penpot のプラグイン機構は整備中で数は限られる。

## 移行摩擦

Figma → Penpot の主な摩擦：

1. **ファイルインポート**: .fig → Penpot の自動変換ツールは存在するが完全な再現は難しく、特にコンポーネント・プロトタイプは手直しが必要。
2. **Auto Layout の再設計**: Figma の Auto Layout を使ったコンポーネントは Penpot での再現に調整が必要。
3. **Variables の消失**: デザイントークン・カラーモード切り替えを使っていた場合は再設計が必要。
4. **プラグイン資産の喪失**: 使用中の Figma プラグインの代替を探す必要がある。
5. **チームへの説明コスト**: デザイナーが Penpot に慣れるまでの学習期間。

## 日本語圏での選択傾向

日本語圏では Figma が UI/UX デザインの事実標準として定着しており、代替検討はまだ少数派。Adobe XD 廃止（2023 年）を機に Penpot への関心が一部で高まったが、実業務での導入報告は限られる。

Penpot への関心が高まるシナリオは：Figma の価格改定・Adobe による再度の買収懸念・セルフホスト要件のある組織、の 3 つと推定される。

## 結論

Penpot は **「Figma 代替 OSS を探しているなら現状唯一の本格選択肢」**。基本的な UI デザイン業務はカバーできるが、Figma の高度な機能（Variables・成熟した Auto Layout・豊富なプラグイン）に依存しているチームは移行前の PoC が必須。

**移行判断の最重要チェック**：Variables / デザイントークンを使っているか、Auto Layout を多用しているか、Figma プラグインをどれだけ使っているか。これらへの依存度が低ければ Penpot への移行は現実的。

## Open questions

- Figma → Penpot インポートツールの実用性（コンポーネント・プロトタイプの再現率）
- Penpot の Variables / Design Tokens 実装の進捗とロードマップ
- 日本語圏での Penpot 実業務導入事例の収集
- Figma の Auto Layout と Penpot の Flex の具体的な操作性の差

## Evidence sources

- https://penpot.app/
- https://www.figma.com/pricing/
- https://github.com/penpot/penpot

---
type: category
slug: project-management
name: プロジェクト管理・Issue トラッキング
ossalt_category: project-management
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# プロジェクト管理・Issue トラッキング

## 概要

ソフトウェア開発チームを中心に、Issue 管理・スプリント計画・カンバン・ロードマップ・レポーティングを提供するプラットフォームのカテゴリ。Jira（Atlassian）が事実標準として定着する一方、コスト・複雑さ・Atlassian エコシステム依存・2024 年の Jira Server 廃止を動機に、OSS 代替（Plane / Taiga）への移行を検討する組織が増えている。

## なぜ今注目されているか

**1. Jira Server 廃止（2024 年）によるコスト増**
Jira のオンプレミス版（Jira Server）が 2024 年に廃止となり、セルフホストを継続するには高額な Jira Data Center（年間数百万円〜）へ移行するか、クラウド版（SaaS）に移るかの二択を迫られた。この強制的なコスト増が OSS 代替への移行動機になっている。

**2. Plane の急成長**
2022 年にオープンソース化された Plane が急速に成長し、GitHub スター 3.2 万超に達している。「Jira の複雑さを排除したモダン代替」として、スタートアップ・中小企業を中心に採用が広がっている。

**3. 「使いこなせていない Jira」問題**
Jira は機能が多すぎて「高いのに使い切れていない」という声が多い。スタートアップ・中小企業にとっては、Jira の機能の 30% だけを使って高い月額を払っているケースが多く、シンプルな代替への移行ニーズがある。

**4. GitHub Issues・Linear の影響**
GitHub Issues や Linear のようなシンプルで高速な Issue トラッカーが普及したことで、「Jira ほど複雑でなくてよい」という意識が広まっている。

## 主要ツールの勢力図

```
      シンプル・軽量 ←────────────────── 高機能・エンタープライズ
             |                                    |
           Taiga         Plane               Jira (SaaS)
       (スクラム特化)  (Jira代替OSS)         (事実標準)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Plane | Jira代替 OSS の主要候補。モダン UI | 32,000 | AGPL-3.0 |
| Taiga | スクラム / カンバン特化。シンプル重視 | 8,000 | AGPL-3.0 |

**参考（OSS 代替ではないが比較対象として）**:
- Linear: 高速・モダン UI の商用 SaaS。スタートアップで人気
- GitHub Issues: コードリポジトリ組み込みの軽量 Issue トラッカー

## 注目の動き（直近）

- **Plane の機能拡張**: Cycles（スプリント）・Modules（エピック）・Pages（ドキュメント）・Dashboard・Intake（要望管理）と機能が急速に追加されている
- **Plane の商業化**: SaaS 版（plane.so）が安定し、セルフホスト版と並行して提供。OSS でありながら持続可能なビジネスモデルを模索
- **Jira Server 廃止の影響**: 2024 年の Server 廃止後、コスト見直しを迫られた中小企業が代替を探す動きが続いている
- **AI 機能の競争**: Jira（Atlassian Intelligence）・Linear などが AI 機能を追加しており、OSS 代替がどこまで追いつくかが注目される

## 日本語圏での温度感

日本では Jira は「開発チームのデファクトスタンダード」として定着しており、代替を積極的に検討する動きはまだ限定的。主な移行動機：

- **コスト**: Jira Server 廃止で Data Center への移行コストに直面した企業
- **複雑さ**: Jira を使いこなせないまま高い月額を払い続けている中小企業
- **スタートアップの最初の選択**: Jira を使ったことのないスタートアップが Plane を最初から選ぶケース

Plane の日本語記事は Qiita・Zenn に増えてきており、「Jira 代替として Plane を試した」という記事が散見される。ただし、大規模移行の事例報告はまだ少ない。

Taiga の日本語情報はほぼ存在せず、日本語圏での認知度は低い。

## ossaltにおける推薦方針

### 移行スコープを先に明確化する

```
「Jira の何が問題か？」
├── コストが高い → Plane（無料セルフホスト）
├── 複雑すぎる → Plane（モダン UI）または Taiga（シンプル特化）
├── Server 廃止でセルフホストしたい → Plane
└── Atlassian 全体から離脱したい → Plane + Outline（ドキュメント）
```

### チームの技術力と規模で推薦を分ける

- **10〜50 人の開発チーム**: Plane を第一候補。セルフホストが現実的で、Jira の主要機能をカバー
- **スクラム特化・シンプル重視**: Taiga を検討（ただし長期的な開発継続性は要確認）
- **100 人以上の複雑な開発組織**: Jira Data Center の高コストを許容するか、Plane の限界を慎重に評価

### JQL・カスタムワークフロー依存を事前確認

「Jira の JQL でフィルタを大量に使っている」「カスタムワークフローが 10 種類以上ある」場合は、Plane での再現コストを明示して期待値を調整する。

## Open questions

- Plane の大規模チーム（100 人以上）での長期運用実績の収集
- Taiga の開発継続性リスクと代替フォークの動向
- 日本の開発チームにおける Jira 代替需要の主な動機分布（コスト vs 複雑さ vs Atlassian 依存）
- GitHub Issues・Linear と Plane の選択基準の整理

## Evidence sources

- https://www.atlassian.com/software/jira/pricing
- https://plane.so/
- https://taiga.io/

---
type: tool
slug: appflowy
name: AppFlowy
category: workspace
github: https://github.com/AppFlowy-IO/AppFlowy
stars: 62000
language: Flutter / Dart, Rust
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: true
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
replaces:
  - notion
related_tools:
  - anytype
  - affine
  - outline
---

# AppFlowy

## 一言定義

Notion の代替を正面から掲げるオープンソースワークスペース。Flutter + Rust 製のクロスプラットフォームアプリで、オフラインファーストとセルフホストを設計思想の中核に置く。

## Positioning

AppFlowy は「Notion の体験を OSS で実現する」という命題に最も直接的に答える候補として位置づけられる。公式の比較ページ（appflowy.com/compare/notion-vs-appflowy）でも、Notion との差分を "offline mode, self-hosting, customization, native apps" の 4 軸で訴求している。

ドキュメント、データベース（グリッド・ボード・カレンダー）、AI 機能、タスク管理を統合するオールインワン型であり、UI / UX の設計思想も Notion に近い。「Notion を使っていたが OSS に移りたい」というユーザーが最初に試す候補として評価されやすい。

AppFlowy Cloud という自社ホスト版クラウドサービスも提供しており、セルフホスト・ローカル・マネージドクラウドの 3 形態を選べる柔軟性が強みになっている。[Source](https://appflowy.com/compare/notion-vs-appflowy)

## 強み

- **オフラインモード**: Notion が弱いオフライン利用に正面から対応。ネット接続不要でドキュメント・DB を操作できる。[Source](https://appflowy.com/compare/notion-vs-appflowy)
- **セルフホスト対応**: AppFlowy Cloud をセルフホストする構成が公式に整備されており、データを自社インフラに置ける。
- **ネイティブアプリ**: Flutter 製の iOS / Android / macOS / Windows / Linux アプリが揃っており、Web のみではなくネイティブ体験を提供する。
- **Notion ライクな UI**: ドキュメント、インラインデータベース、ボード、カレンダーなど、Notion に慣れたユーザーにとって学習コストが低い。
- **AI 機能**: ドキュメント内 AI アシスト機能を搭載しており、OpenAI / Anthropic / ローカル LLM（Ollama 等）に接続可能。
- **高い開発速度**: GitHub スター数は 6 万超（2026 年 4 月時点）で、コミュニティが活発。リリース頻度も高い。[Source](https://github.com/AppFlowy-IO/AppFlowy)
- **カスタマイズ性**: プラグイン・テーマ・レイアウトのカスタマイズが Notion より広く設計されている。

## 弱み・注意点

- **機能完成度**: Notion と比較すると、一部の DB 機能（リレーション、ロールアップ、高度なフィルタ等）が未実装または不完全な場合がある。
- **セルフホストの運用負荷**: AppFlowy Cloud のセルフホストは Docker Compose ベースで構成可能だが、アップデート・バックアップ・S3 接続など運用責任はユーザー側に移る。
- **Web ブラウザ利用**: Web アプリも提供されているが、成熟度はネイティブアプリに比べると低い印象がある。
- **エンタープライズ機能**: SSO、監査ログ、高度な権限管理などは Notion Enterprise に比べて発展途上。
- **日本語ドキュメント**: 公式ドキュメントは英語中心。日本語の導入記事はコミュニティ依存になる。
- **AGPL-3.0 ライセンス**: 商用利用・組み込みに際してライセンス条件の確認が必要。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| Notion を使っているが SaaS 依存を減らしたい個人・チーム | 学習コストが低く、機能範囲が近い |
| データをオンプレ / 自社 VPS に置きたい組織 | セルフホスト構成が公式に整備されている |
| オフラインや不安定なネット環境で使いたいユーザー | ローカルファースト設計で機能する |
| OSS への貢献・カスタマイズを前提にしたい開発チーム | AGPL-3.0 でコードが公開、プラグイン機構あり |
| コスト削減が主目的の SMB | セルフホストでライセンスコストをゼロにできる |

Notion の DB / テンプレート文化を組織全体でフルに使っている場合は、機能ギャップが出る可能性があるため、移行前の PoC が推奨される。

## セルフホスト難易度

**中程度**。

- Docker Compose でのセットアップ手順が公式ドキュメントに整備されており、コマンドラインに慣れた開発者であれば数時間での構築は可能。
- ファイルストレージ（S3 互換）、認証、メール通知の設定が必要で、シンプルな Wiki ツールに比べると設定項目は多い。
- アップデート時のデータマイグレーションに注意が必要。Notion のようにアップデートを意識しない SaaS と比較すると、運用コストは明確に発生する。
- クラウド管理版（appflowy.com のホスト版）を使えばインフラ管理を回避できるが、それは SaaS 利用と同義になる。

## 日本語圏での採用状況

グローバルでは GitHub スター 6 万超・HackerNews や Reddit での言及多数と、OSS workspace 系の中でも最有力候補の一つとして認知されている。

日本語圏では Zenn・Qiita に AppFlowy の紹介・導入記事がいくつか存在し、「Notion 代替 OSS」文脈での検索でたどり着くユーザーが増えつつある。ただし Obsidian や Notion に比べると日本語の実用記事・コミュニティは少なく、導入障壁が残る。

ossalt.jp でのトラフィック的には、Notion 代替検索からの流入が主であり、個人ユーザーよりも自社運用を検討している小規模チーム・エンジニアからの関心が高いと推定される。

## ossaltにおける推奨文脈

AppFlowy を推薦すべき文脈：

1. **「Notion を使っているが、セルフホストしたい」** — 最も素直な推薦文脈。学習コストを抑えながら移行できる最有力候補。
2. **「Notion を使っているが、オフラインでも使いたい」** — オフラインファーストの設計が刺さる。
3. **「OSS でオールインワン型のワークスペースを探している」** — AFFiNE と並んで最初に挙げるべき候補。
4. **「AI 機能も使いつつデータを自分で管理したい」** — ローカル LLM 接続を含む AI 機能が差別化になる。

AppFlowy を推薦しにくい文脈：

- Notion の高度な DB 機能（多段リレーション、複雑な formula 等）に強く依存している場合
- エンタープライズ向け権限管理・コンプライアンスが必須の組織
- IT リテラシーが低いチームへの全社展開（セルフホストの保守体制が必要）
- Web ブラウザのみでの利用を前提とする場合

## Open questions

- AppFlowy の DB 機能（リレーション・ロールアップ・formula）はいつ Notion 同等水準になるか
- AppFlowy Cloud セルフホストの実際の運用負荷（バックアップ・アップグレード）の具体的なコスト感
- 日本語圏での AppFlowy 実導入事例（個人 vs チーム の比率）
- Anytype・AFFiNE との棲み分けとして ossalt がどのユーザーに AppFlowy を first recommendation にすべきか
- AGPL-3.0 ライセンスが日本の中小企業の導入障壁になっているかどうか
- AI 機能（ローカル LLM 接続）の実用水準と、日本語モデルとの相性

## Evidence sources

- https://appflowy.com/compare/notion-vs-appflowy
- https://github.com/AppFlowy-IO/AppFlowy
- https://wiki/saas/notion.md（AppFlowy の言及箇所）

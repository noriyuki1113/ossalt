---
type: comparison
slug: datadog-vs-grafana
tool_a: grafana
tool_b: datadog
saas_context: datadog
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Datadog vs Grafana + Prometheus

## 比較の文脈

Datadog の「請求書ショック」（ホスト数・APM・ログ管理の重複課金）を動機に Grafana + Prometheus スタックへの移行を検討するエンジニアチームへの提案。「Datadog でできることの 80% を OSS スタックで無料実現する」という訴求が成立するカテゴリ。

## TL;DR

| 条件 | 推薦 |
|---|---|
| メトリクス監視・ダッシュボードだけが主目的 | **Grafana + Prometheus** |
| Datadog のコストを削減したい | **Grafana + Prometheus** |
| Kubernetes 環境の監視 | **Grafana + Prometheus**（kube-prometheus-stack）|
| フルスタック APM・ログ・トレースを統合管理 | Datadog（移行コストを評価） |
| AI 異常検知・根本原因分析が必要 | Datadog |
| 非エンジニアが監視ダッシュボードを管理 | Datadog（Grafana は学習コストが高い） |

## 比較表

| 項目 | Datadog | Grafana + Prometheus |
|---|---|---|
| 価格 | $15〜$23/ホスト/月（Pro）+ APM・ログで追加 | 無料（セルフホスト）/ Grafana Cloud 無料枠あり |
| ライセンス | プロプライエタリ | AGPL-3.0（Grafana）/ Apache-2.0（Prometheus） |
| セルフホスト | ❌ | ✅ |
| メトリクス収集 | ✅ Agent | ✅ Prometheus Exporters |
| 可視化 | ✅ | ✅ Grafana |
| アラート | ✅ 高機能 | ✅ Alertmanager + Grafana Alerting |
| ログ管理 | ✅ | ✅ Grafana Loki（別途構築） |
| APM / トレース | ✅ 統合済み | ✅ Grafana Tempo / Jaeger（別途） |
| AI 異常検知 | ✅ Watchdog / Bits AI | ❌ |
| 統合セットアップ | ✅ エージェント 1 本 | ⚠️ 複数コンポーネント |
| Kubernetes 対応 | ✅ | ✅ kube-prometheus-stack |
| Community Dashboards | ⚠️ 限定的 | ✅ 大量のコミュニティテンプレート |
| 日本語 UI | ✅ | ⚠️ 英語中心 |

## 各軸での詳細比較

### メトリクス監視・ダッシュボード

Prometheus + Grafana は Datadog のメトリクス監視・ダッシュボード機能を完全に代替できる。PromQL は Datadog のクエリ言語より学習コストが高いが、表現力が高く、コミュニティのダッシュボードテンプレート（grafana.com/dashboards）が豊富。Node Exporter + Grafana で CPU/メモリ/ディスク/ネットワークの基本監視を 30 分以内に構築できる。

### APM / 分散トレーシング

Datadog APM は最も統合された APM 体験を提供しており、メトリクス・ログ・トレースが 1 つの画面で相関して見られる。OSS での代替は Grafana Tempo（または Jaeger）+ OpenTelemetry だが、統合体験は Datadog に劣る。OpenTelemetry の標準化が進んでいるため、「今 OTel でインスツルメントしておけば後で Datadog / Tempo / Jaeger を切り替えられる」という状況になっている。

### ログ管理

Datadog のログ管理は検索・フィルタリング・パターン検出が高機能。Grafana Loki は「ラベルベースのログ」という異なるアーキテクチャで、Elasticsearch の全文検索とは異なる設計。小〜中規模のログであれば Loki で十分だが、大量の非構造化ログの高速検索は Datadog が優位。

### コスト比較

50 ホスト + APM 30 サービス + ログ 100GB/月：
- Datadog: ホスト $15 × 50 + APM $31 × 30 + ログ処理 = 約 $2,700〜$3,500/月（≈ 40〜52 万円/月）
- Grafana + Prometheus（セルフホスト）: サーバーコスト $50〜200/月のみ

コスト差は 10〜70 倍になる場合がある。これが「Datadog からの移行」の最大の動機。

### セットアップの複雑さ

Datadog はエージェント 1 本インストールで全機能が有効になる。Grafana + Prometheus + Loki + Tempo は各コンポーネントを別々にセットアップ・設定する必要があり、初期構築に時間がかかる。ただし Kubernetes 環境では kube-prometheus-stack Helm チャートで全体を 1 コマンドで構築できる。

## 移行摩擦

### Datadog → Grafana スタックの段階的移行

**推薦する移行順序**（一度に全部移行しない）：

1. **フェーズ 1**: Prometheus + Grafana でメトリクス監視を並行稼働（Datadog も継続）
2. **フェーズ 2**: コミュニティダッシュボードで Datadog のダッシュボードを再現
3. **フェーズ 3**: Loki でログ管理を移行
4. **フェーズ 4**: Grafana Tempo または Jaeger で APM を移行
5. **フェーズ 5**: Datadog を停止

### 移行が難しいケース

- **Datadog のダッシュボードが多い**: DQL クエリを PromQL に書き直す工数が発生
- **Datadog のモニターが多い**: アラートルールの移行に工数がかかる
- **APM が Datadog に深く統合**: トレーシングライブラリの置き換えが必要
- **Datadog の Synthetics（合成監視）**: Grafana + Prometheus の標準機能に相当するものがなく、Checkly・UptimeRobot 等の別ツールが必要

## 日本語圏での選択傾向

日本のエンジニアコミュニティでは Prometheus + Grafana の採用率が高く、多くのチームが Kubernetes 監視に使っている。「Datadog から Grafana に移行した」という事例も Zenn・Qiita で報告されており、主な動機はコスト削減。Grafana Cloud の無料枠を使った「セルフホストなしの OSS モニタリング」も人気で、「Grafana を使うが、サーバー管理はしたくない」というニーズに対応している。

## 結論

**メトリクス監視・ダッシュボードが主目的なら Grafana + Prometheus への移行を強く推薦**。コスト削減効果が大きく、Kubernetes 環境では kube-prometheus-stack で構築も容易。段階的移行（まずメトリクスだけ移行）を推薦し、APM・ログ・AI 機能は Datadog が必要かどうかを個別に評価する。

## Open questions

- Datadog の DQL → PromQL の変換ツール・自動化の有無
- Grafana Cloud の無料枠の実用的な上限（ホスト数・メトリクス数）
- OpenTelemetry の普及が「Datadog から OSS への移行コスト」をどれだけ下げているか
- Grafana AI（Sift）の Datadog Watchdog への今後の追いつき状況

## Evidence sources

- https://www.datadoghq.com/pricing/
- https://grafana.com/
- https://prometheus.io/

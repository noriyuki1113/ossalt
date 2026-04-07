---
type: saas
slug: datadog
name: Datadog
category: monitoring
status: active
priority: high
pain_points:
  - monthly-cost
  - per-host-pricing
  - vendor-lock-in
  - data-ownership
  - pricing-complexity
decision_axes:
  - metrics-retention
  - alerting-flexibility
  - self-host-difficulty
  - ops-burden
  - apm-tracing
  - log-management
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - grafana
  - prometheus
related_category_pages:
  - wiki/categories/monitoring.md
related_comparison_pages:
  - wiki/comparisons/datadog-vs-grafana.md
---

# Datadog

## Summary

Datadog はインフラ・アプリケーション・ログ・APM（分散トレーシング）を統合した SaaS モニタリングプラットフォーム。ホスト数・機能モジュール数に応じた複雑な従量課金が「Datadog 請求書ショック」として知られており、コスト削減を動機に Grafana + Prometheus スタックへの移行を検討するエンジニアチームが多い。

## Why it matters for ossalt

Datadog は「使えば使うほど高くなる」モニタリング SaaS の代表格。スタートアップが無料枠で使い始め、成長とともにホスト数・APM・ログ管理が加わり月額が急増するパターンが多い。Grafana + Prometheus + Loki のスタックは Datadog の主要機能を OSS で代替できる組み合わせとして広く認知されている。

## How Datadog is positioned

Datadog は「Observability プラットフォーム」として、メトリクス・ログ・トレース・セキュリティ・合成監視・コスト管理を統合。2024 年以降は AI（Bits AI・Watchdog）を前面に出し、異常検知・根本原因分析の自動化を強化している。

## Why users look for alternatives

- **コスト爆増**: ホスト 1 台あたり $15〜$23/月（Pro）。100 台で月 $1,500〜$2,300。APM・ログ管理を追加すると数倍になる
- **従量課金の複雑さ**: ホスト数・カスタムメトリクス数・ログ ingestion 量・スパン数など複数軸での課金で請求額の予測が難しい
- **「Datadog 請求書ショック」**: 予期せず高額の請求が届くケースが多く、エンジニアコミュニティでよく話題になる
- **ベンダーロックイン**: Datadog 独自のクエリ言語（DQL）・ダッシュボード設定の移行コストが高い
- **データ所有権**: メトリクス・ログデータが Datadog のクラウドに保管されることへの懸念

## What ossalt should help users decide

1. Grafana + Prometheus で Datadog の「メトリクス監視」部分を代替できるか
2. APM（分散トレーシング）は Jaeger / Tempo で代替できるか
3. ログ管理は Loki で代替できるか
4. セルフホストのモニタリングスタックの運用負荷を受け入れられるか

## Core decision axes

### 1. Metrics + Alerting

Prometheus はメトリクス収集・ストレージ・PromQL（クエリ言語）を提供し、Grafana で可視化する組み合わせが「Datadog のメトリクス部分の OSS 代替」として最も成熟している。Datadog の長期メトリクス保持（15 ヶ月）には Victoria Metrics などの長期ストレージが別途必要。

### 2. APM / Distributed Tracing

Datadog APM の代替として Jaeger（CNCF）・Grafana Tempo が使われる。OpenTelemetry（OTel）への対応が標準化しており、「エージェントを OTel に変えれば Datadog から Jaeger/Tempo に切り替えられる」という流れが加速している。

### 3. Log Management

Datadog のログ管理の OSS 代替として Grafana Loki が広く使われる。Elasticsearch + Kibana（ELK スタック）より軽量で、Grafana との統合がシームレス。ただし Datadog のログ解析・フィルタリングの高度さには届かない部分もある。

## Candidate families

### Grafana + Prometheus スタック
メトリクス（Prometheus）・可視化（Grafana）・ログ（Loki）・トレース（Tempo）を組み合わせた「OSS Observability スタック」。各コンポーネントが独立していて組み合わせられる。Grafana Labs が OSS と商用マネージド版の両方を提供。

## Suggested related wiki pages

- `wiki/tools/grafana.md`
- `wiki/tools/prometheus.md`
- `wiki/comparisons/datadog-vs-grafana.md`
- `wiki/categories/monitoring.md`

## Open questions

- Grafana Cloud（マネージド版）と Datadog のコスト比較
- OpenTelemetry への移行が Datadog → OSS スタック移行を容易にしているか
- 日本のエンジニアチームでの「Datadog から Grafana への移行」事例の収集
- Datadog の AI 機能（Watchdog・Bits AI）の対抗として OSS スタックがどこまで追いつけるか

## Evidence sources

- https://www.datadoghq.com/pricing/
- https://grafana.com/
- https://prometheus.io/

---
type: tool
slug: grafana
name: Grafana
category: monitoring
github: https://github.com/grafana/grafana
stars: 66000
language: Go / TypeScript
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - datadog
related_tools:
  - prometheus
---

# Grafana

## 一言定義

あらゆるデータソースを可視化できる OSS ダッシュボードツール。Prometheus・Loki・Tempo・InfluxDB・Elasticsearch・Datadog など 150 以上のデータソースに対応し、「モニタリングの可視化レイヤー」として業界標準になっている。

## Positioning

Grafana は 2014 年に生まれたダッシュボード・可視化 OSS。Grafana Labs が AGPL-3.0 の OSS 版と商用マネージドクラウド版（Grafana Cloud）を提供。GitHub スター 6.6 万超で OSS モニタリング分野最大クラス。単体では「可視化のみ」を担い、メトリクス収集は Prometheus、ログは Loki、トレースは Tempo と組み合わせて「OSS Observability スタック」を構成する。

## 強み

- **圧倒的なデータソース対応**: 150 以上のデータソースプラグインで Datadog・CloudWatch・Elasticsearch・Prometheus など何でも繋がる
- **高品質なダッシュボード**: インタラクティブで見やすいダッシュボードを SQL/PromQL/Flux で構築できる
- **Prometheus との統合**: Prometheus + Grafana は「OSS モニタリングの標準スタック」として業界に定着
- **Loki・Tempo との統合**: ログ（Loki）・トレース（Tempo）と同一 UI で横断分析できる
- **Alerting**: メトリクス・ログベースのアラートを Slack・PagerDuty・メールに送信
- **Grafana Cloud**: セルフホスト不要のマネージド版。無料枠あり
- **Community Dashboards**: ダッシュボードテンプレートをコミュニティが公開・共有（grafana.com/dashboards）

## 弱み・注意点

- **単体では何もモニタリングしない**: Grafana は「可視化ツール」であり、メトリクス収集には Prometheus・InfluxDB 等が別途必要
- **AGPL-3.0**: OSS 版の商用利用・埋め込みにはライセンス注意が必要。Grafana Enterprise は商用版
- **Datadog のような統合 APM には届かない**: APM（分散トレーシング）は Tempo で代替できるが、Datadog の統合体験には及ばない
- **セットアップの複雑さ**: Prometheus + Grafana + Loki + Tempo の全スタック構築は学習コストが高い
- **アラート管理**: Datadog のような AI 異常検知・根本原因分析は持たない

## どんなユーザーに向くか

- **Datadog コストを削減したいエンジニアチーム**: Prometheus + Grafana への移行が最も一般的なパターン
- **Kubernetes・コンテナ環境の監視**: kube-prometheus-stack（Helm チャート）で Kubernetes 全体の監視が即座に構築できる
- **複数データソースを一画面で見たい**: AWS CloudWatch + Prometheus + PostgreSQL を同一ダッシュボードに統合
- **OSS Observability スタックを構築したい**: メトリクス・ログ・トレースを Grafana ファミリーで統一したい

## セルフホスト難易度

**中程度**（Grafana 単体は低い。スタック全体は高い）。

- **Grafana 単体**: Docker 1 コマンドで起動可能。設定は管理 UI から行える
- **Prometheus + Grafana**: `docker compose up` レベルで構築可能。主要な学習コストはスクレイプ設定と PromQL
- **フルスタック（+ Loki + Tempo）**: コンポーネントが増えるにつれ運用負荷が増加。Kubernetes 環境では kube-prometheus-stack Helm チャートが広く使われる

## 日本語圏での採用状況

日本語圏での認知度・採用率は非常に高い。Qiita・Zenn に豊富な導入記事があり、多くのエンジニアチームがインフラ監視に Prometheus + Grafana を採用している。Datadog からの移行事例も複数報告されている。Grafana Cloud の無料枠を使った「セルフホストなしの OSS モニタリング」も人気。

## ossaltにおける推薦文脈

Datadog 代替の **メトリクス可視化・ダッシュボードとして最初に推薦すべき OSS**。「Prometheus + Grafana」のセットで推薦し、ログが必要なら「+ Loki」、トレースが必要なら「+ Tempo」と段階的に提案する。Datadog の全機能を一度に代替しようとせず、「まずメトリクスだけ Prometheus + Grafana に移行する」という段階的移行を推薦。

## Open questions

- Grafana LGTM スタック（Loki + Grafana + Tempo + Mimir）のセルフホスト運用コストの実態
- Datadog から Grafana への段階的移行の実際の工数・期間
- Grafana Cloud（無料枠）と Datadog のコスト比較
- Grafana の AI 機能（Sift・ML 異常検知）の Datadog Watchdog との機能差

## Evidence sources

- https://grafana.com/
- https://github.com/grafana/grafana

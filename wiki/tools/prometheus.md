---
type: tool
slug: prometheus
name: Prometheus
category: monitoring
github: https://github.com/prometheus/prometheus
stars: 57000
language: Go
last_commit: 2026-04-01
license: Apache-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - datadog
related_tools:
  - grafana
---

# Prometheus

## 一言定義

CNCF ホストのメトリクス収集・ストレージ・アラート OSS。Pull 型のスクレイピング・PromQL（クエリ言語）・Alertmanager を持ち、Grafana との組み合わせで「Datadog のメトリクス監視部分の OSS 代替スタック」を構成する。

## Positioning

Prometheus は 2012 年に SoundCloud 社で開発され、2016 年に CNCF（Cloud Native Computing Foundation）のトップレベルプロジェクトに昇格した。Kubernetes エコシステムのデファクトスタンダードなメトリクス収集ツールとして定着しており、GitHub スター 5.7 万超。Apache-2.0 ライセンス。Grafana との組み合わせが「OSS モニタリングの標準スタック」として業界に広く採用されている。

## 強み

- **Pull 型スクレイピング**: エージェントをサーバーに入れるのではなく、Prometheus がターゲットをスクレイプする設計。シンプルで管理が容易
- **PromQL**: 強力なクエリ言語。集計・フィルタリング・関数が充実し、複雑なメトリクス分析が可能
- **Kubernetes ネイティブ**: kube-prometheus-stack Helm チャートで Kubernetes 全体の監視が即座に構築できる
- **Exporters エコシステム**: Node Exporter・MySQL Exporter・Redis Exporter・Blackbox Exporter など 500 以上の公式・コミュニティ Exporter が存在
- **Alertmanager**: アラートのルーティング・グループ化・サイレンス管理。Slack・PagerDuty・メールへの通知
- **Apache-2.0**: 商用利用・SaaS 組み込みに制限なし
- **CNCF 標準**: Kubernetes・OpenTelemetry との統合が公式にサポートされている

## 弱み・注意点

- **長期メトリクス保持に不向き**: デフォルトの保持期間は 15 日。長期保存（数ヶ月〜年単位）には Victoria Metrics / Thanos / Cortex などの外部ストレージが必要
- **高可用性・水平スケーリングが複雑**: 単一 Prometheus インスタンスは高可用性を持たない。HA 構成には Thanos / Cortex / Mimir が必要
- **Push 型ユースケースへの対応**: Pull 型設計のため、バッチジョブなどの短命プロセスには Pushgateway が必要（設計上のトレードオフ）
- **カーディナリティの管理**: ラベルの組み合わせが増えるとメモリ使用量が急増する（高カーディナリティ問題）

## どんなユーザーに向くか

- **Datadog のメトリクス監視を OSS で代替したい**: Prometheus + Grafana への移行が最も現実的なパス
- **Kubernetes・コンテナ環境の監視**: Kubernetes との統合が最も成熟している OSS モニタリングツール
- **エンジニアリングチーム主導のモニタリング**: PromQL でカスタムクエリ・アラートを書けるエンジニアがいるチーム
- **インフラ監視から始めたい**: Node Exporter + Prometheus + Grafana で CPU/メモリ/ディスク監視を無料で構築

## セルフホスト難易度

**中程度**。Docker での起動は簡単だが、本番運用では設定ファイル（`prometheus.yml`）の作成・Exporter の設定・Alertmanager のルーティング設定が必要。Kubernetes 環境では kube-prometheus-stack Helm チャートが広く使われ、1〜2 時間で完全な監視スタックが構築できる。長期ストレージ・HA 構成は別途 Thanos/Mimir 等が必要で難易度が上がる。

## 日本語圏での採用状況

日本では Prometheus + Grafana の組み合わせがインフラ監視の標準として定着している。Qiita・Zenn に豊富な記事があり、Kubernetes 環境での採用率は特に高い。「Datadog から移行した」事例も報告されており、日本語コミュニティも活発。

## ossaltにおける推薦文脈

Datadog 代替の **メトリクス収集・アラートとして Grafana とセットで推薦**。「Prometheus（収集）+ Grafana（可視化）= Datadog のメトリクス部分の代替」という構図で説明する。APM・ログ管理は別途 Jaeger/Tempo・Loki が必要であることを明示し、「段階的な移行」を推薦する。

## Open questions

- Prometheus の高カーディナリティ問題の実際の発生頻度と対処法
- Victoria Metrics vs Thanos vs Mimir の長期ストレージ選択基準
- Datadog のカスタムメトリクス課金を Prometheus に置き換える際のコスト削減の実態
- OpenTelemetry Metrics の標準化が Prometheus の位置づけに与える長期的な影響

## Evidence sources

- https://prometheus.io/
- https://github.com/prometheus/prometheus

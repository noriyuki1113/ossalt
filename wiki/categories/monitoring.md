---
type: category
slug: monitoring
name: モニタリング・Observability
ossalt_category: monitoring
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# モニタリング・Observability

## 概要

インフラ・アプリケーション・ログ・トレースを監視・可視化するプラットフォームのカテゴリ。Datadog・New Relic・Dynatrace が高額 SaaS として定着しているが、「Datadog 請求書ショック」を経験したエンジニアチームが Grafana + Prometheus スタックへ移行するケースが増えている。OSS 代替が最も成熟しているカテゴリの一つ。

## なぜ今注目されているか

**1. Datadog の「請求書ショック」**
ホスト数・カスタムメトリクス数・APM スパン数・ログ ingestion 量の複数軸課金で、予期せず高額の請求が届くケースが多い。エンジニアコミュニティでは「Datadog 税」「Datadog の請求書に驚いた」という話題が頻繁に出る。

**2. Prometheus + Grafana の成熟**
CNCF エコシステムの中核として Prometheus + Grafana が成熟し、Kubernetes 環境での kube-prometheus-stack が「標準的なモニタリング設定」として定着。「コストを払わずに Datadog 相当の監視ができる」という認識が広まった。

**3. OpenTelemetry の標準化**
OpenTelemetry（OTel）の普及により、インスツルメントを 1 回書けば Datadog / Grafana Tempo / Jaeger など複数のバックエンドに送れる設計が可能になった。「Datadog に深く依存したベンダーロックイン」を避けやすくなっている。

## 主要ツールの勢力図

```
  可視化・ダッシュボード ←────── メトリクス収集 ──────── APM・トレース
         |                            |                       |
       Grafana                   Prometheus              Grafana Tempo
    (ダッシュボード)           (Pull 型メトリクス)          / Jaeger
         |
       Grafana Loki
      (ログ管理)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Grafana | 可視化・ダッシュボード。150+ データソース対応 | 66,000 | AGPL-3.0 |
| Prometheus | Pull 型メトリクス収集。CNCF 標準 | 57,000 | Apache-2.0 |

## 注目の動き（直近）

- **Grafana LGTM スタック**: Loki（ログ）+ Grafana（可視化）+ Tempo（トレース）+ Mimir（長期メトリクス）のフルスタックが Grafana Labs により整備され、「OSS で Datadog を代替する完全なスタック」として提案されている
- **Victoria Metrics の台頭**: Prometheus の長期ストレージ問題を解決する Victoria Metrics が注目を集めている。Prometheus 互換で高い圧縮率・クエリ性能
- **Grafana Cloud の無料枠拡充**: セルフホスト不要で Grafana スタックを利用できる無料枠が拡充されており、「OSS だがサーバー管理は不要」という選択肢が現実的に
- **OpenTelemetry の本格普及**: 2024〜2025 年にかけて OTel が主要言語・フレームワークでの実装が整い、ベンダーロックイン回避が容易になっている

## 日本語圏での温度感

日本のエンジニアコミュニティでは Prometheus + Grafana の採用率が高く、Kubernetes 環境での監視スタックとして業界標準に近い認識がある。Zenn・Qiita に豊富な記事が存在し、「Datadog から Grafana に移行した」事例も複数報告されている。

Datadog は日本法人もあり大企業での採用が多いが、「コスト対効果を見直す」という流れの中で中規模 SaaS 企業での Grafana 移行が増えている印象がある。

## ossaltにおける推薦方針

### 段階的移行を推薦する

```
「何を監視したいか？」
├── インフラ（CPU/メモリ/ディスク） → Prometheus + Node Exporter + Grafana（今日から始められる）
├── アプリケーションメトリクス → Prometheus クライアントライブラリ + Grafana
├── ログ管理 → Grafana Loki + Grafana（次のステップ）
└── APM / 分散トレーシング → OpenTelemetry + Grafana Tempo（最後のステップ）
```

「Datadog の全機能を一度に移行しない」という段階的アプローチを推薦。まずメトリクス監視だけ Prometheus + Grafana に移行し、コスト削減効果を確認してから次のフェーズへ。

### Grafana Cloud も選択肢として提示

「OSS スタックは使いたいが、サーバー管理はしたくない」という場合は Grafana Cloud の無料枠（14 日間のメトリクス保持・50GB のログ等）を提示。完全無料のセルフホストと、サーバー管理なしのマネージド版の中間オプションとして機能する。

## Open questions

- Datadog の DQL ダッシュボード・モニターの Grafana/PromQL への移行ツールの有無
- Victoria Metrics vs Thanos vs Mimir の長期ストレージ選択基準の整理
- OpenTelemetry の成熟が「Datadog → OSS 移行コスト」にどれだけ影響しているか
- 日本の中規模 SaaS 企業での Datadog → Grafana 移行事例の収集

## Evidence sources

- https://www.datadoghq.com/pricing/
- https://grafana.com/
- https://prometheus.io/

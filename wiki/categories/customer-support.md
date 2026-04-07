---
type: category
slug: customer-support
name: カスタマーサポート・ヘルプデスク
ossalt_category: customer-support
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# カスタマーサポート・ヘルプデスク

## 概要

顧客からの問い合わせをチケット・チャット・メールで管理するプラットフォームのカテゴリ。Zendesk・Freshdesk・Intercom が市場を支配しているが、エージェントライセンスコスト・機能過剰・データ所有権を動機に、Chatwoot / Zammad などの OSS 代替への移行を検討する中小企業・スタートアップが増えている。

## なぜ今注目されているか

**1. Zendesk のコスト高騰**
Zendesk Suite Team は $55/エージェント/月〜。10 人のサポートチームで月 $550（年間 $6,600 ≈ 99 万円）。Freshdesk・Intercom も同様に高額で、「SaaS のサポートツールが高すぎる」という声が広まっている。

**2. Chatwoot の急成長**
2020 年オープンソース化の Chatwoot が GitHub スター 2.2 万超に成長。MIT ライセンス・モダン UI・オムニチャンネル対応で「Intercom / Zendesk 代替の OSS」として広く認知されるようになった。

**3. オムニチャンネル対応の標準化**
WhatsApp Business・Instagram・Facebook での顧客対応が標準化しつつあり、メールだけのサポートツールでは不足するケースが増えた。Chatwoot は WhatsApp・SNS 統合を OSS で提供しており、「オムニチャンネルを無料で実現」という訴求が刺さりやすい。

## 主要ツールの勢力図

```
  チャット・オムニチャンネル重視 ←─── チケット管理・SLA 重視
               |                                  |
           Chatwoot                           Zammad
       (Intercom 代替寄り)               (Zendesk 代替寄り)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Chatwoot | リアルタイムチャット + オムニチャンネル OSS | 22,000 | MIT |
| Zammad | メールベース本格ヘルプデスク OSS | 4,500 | AGPL-3.0 |

## 注目の動き（直近）

- **Chatwoot の AI 機能追加**: GPT 統合・自動返信・会話要約機能の開発が進んでいる。AI によるサポート自動化でも OSS 代替が追いつく可能性がある
- **Zendesk AI の強化**: AI によるチケット分類・自動返信・エージェント支援が標準化しており、SaaS と OSS の AI 機能差が拡大している
- **WhatsApp Business API の普及**: Meta が WhatsApp Business API パートナーを拡大しており、Chatwoot などの OSS ツールが WhatsApp を正規チャンネルとして統合しやすくなっている

## 日本語圏での温度感

日本のカスタマーサポートチームでは Zendesk・Freshdesk・Salesforce Service Cloud が主流。OSS 代替への移行は「コスト削減を強く迫られているスタートアップ」に限られる印象。

**日本固有の課題**: 日本のカスタマーサポートでは LINE 対応が重要な場合が多いが、Chatwoot・Zammad ともに LINE チャンネルへの公式対応がない。これが日本市場での最大の障壁になっている。

Chatwoot の日本語記事は Qiita・Zenn に存在し、「Zendesk 代替として試してみた」という報告がある。Zammad の日本語情報はほぼなく、採用事例の報告も見当たらない。

## ossaltにおける推薦方針

### 主なサポートチャンネルで分岐させる

```
「主なサポートチャンネルは？」
├── ライブチャット + メール + SNS → Chatwoot（オムニチャンネル）
├── メール中心 + SLA 管理 → Zammad（本格ヘルプデスク）
├── LINE が必要 → Zendesk 継続（OSS 代替での LINE 対応なし）
└── AI 自動返信が中心 → Zendesk 継続
```

### コスト比較を数字で見せる

エージェント 10 人・月額比較：
- Zendesk Suite Team: $550/月（年間 $6,600 ≈ 99 万円）
- Chatwoot セルフホスト: サーバー $10〜50/月のみ
- 削減額: 年間最大 $6,480（≈ 97 万円）

この数字を提示することで「セルフホストの運用工数」を払う価値があるかを判断させる。

### LINE 対応の欠如を必ず言及する

日本のユーザーには「LINE 対応は？」という質問が必ず来る。Chatwoot・Zammad ともに LINE 公式対応はなく、カスタム API 実装が必要（難度高）。LINE が必要な組織には Zendesk 継続を推薦する。

## Open questions

- Chatwoot の LINE チャンネル対応の可能性（公式対応計画の有無）
- Zammad の Elasticsearch 依存を解消する開発計画
- 日本のカスタマーサポートチームにおける OSS 採用の実態調査
- Chatwoot の AI 機能（GPT 統合・自動返信）の完成度と採用への影響

## Evidence sources

- https://www.zendesk.com/pricing/
- https://www.chatwoot.com/
- https://zammad.org/

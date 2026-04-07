---
type: category
slug: email-marketing
name: メールマーケティング・ニュースレター配信
ossalt_category: email-marketing
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# メールマーケティング・ニュースレター配信

## 概要

ニュースレター配信・メールキャンペーン・マーケティングオートメーションを提供するプラットフォームのカテゴリ。Mailchimp・ConvertKit・Klaviyo が主流だが、連絡先数課金の急増・データ所有権を動機に Listmonk / Mautic などの OSS 代替への移行を検討するユーザーが多い。「Amazon SES と組み合わせることで非常に低コストで運用できる」というコスト優位性が明確なカテゴリ。

## なぜ今注目されているか

**1. Mailchimp の無料枠縮小（2023 年）**
以前は 2,000 連絡先まで無料だったが 500 に縮小。「無料で使えていたのに急に有料化された」という体験が OSS 代替への移行動機になっている。

**2. 連絡先課金モデルへの不満**
Mailchimp をはじめとする多くのメール配信 SaaS が「連絡先数」で課金する。リストが大きくなるほど課金が増え、「削除したくないがお金がかかる」というジレンマが生まれる。

**3. Listmonk の成熟**
Go 製のシングルバイナリ Listmonk が GitHub スター 1.5 万超に成長。「シンプルで軽量なニュースレター配信 OSS」として実用的な完成度に達した。

## 主要ツールの勢力図

```
  シンプル・配信特化 ←────────────── マーケティングオートメーション全般
         |                                          |
      Listmonk                                   Mautic
    (軽量・高速・低コスト)               (HubSpot Marketing Hub 近似)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Listmonk | ニュースレター配信特化。Go 製・軽量・API 充実 | 15,000 | AGPL-3.0 |
| Mautic | マーケティングオートメーション OSS。ドリップ・スコアリング対応 | 7,500 | GPL-3.0 |

## コスト優位性（このカテゴリの最大の強み）

| 構成 | 月額コスト（10 万件リスト・月 1 配信） |
|---|---|
| Mailchimp Standard | 約 $170/月 |
| Listmonk + Amazon SES | 約 $20/月（SES $10 + サーバー $10） |
| 削減額 | 約 $150/月（年間 $1,800） |

Amazon SES の送信コストは 1,000 通あたり $0.10。100 万通配信でも $100。これが「メール配信 OSS は最もコスト削減効果が見えやすいカテゴリ」である理由。

## ossaltにおける推薦方針

```
「どんなメール配信をしているか？」
├── 定期ニュースレター・一斉配信 → Listmonk（最初の推薦）
├── ドリップ・行動トリガー・スコアリングが必要 → Mautic
└── 技術者なし・デザインが重要 → Mailchimp 継続
```

**必ず Amazon SES との組み合わせを提示する。** 「セルフホスト SMTP サーバー」は配信到達性問題があり、Amazon SES / SendGrid のリレーを使うことで Mailchimp に近い到達性を実現できる。

## Open questions

- Listmonk + Amazon SES の実際の配信到達性（迷惑メール判定率）の実測
- Mautic のコミュニティ状況（Acquia 離脱後の開発ペース）
- Twenty（CRM）+ Mautic（メール）の組み合わせで HubSpot を代替した事例
- 日本語メールの文字化け問題（Listmonk / Mautic での UTF-8 対応状況）

## Evidence sources

- https://mailchimp.com/pricing/
- https://listmonk.app/
- https://www.mautic.org/

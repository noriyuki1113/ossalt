---
type: category
slug: crm
name: CRM・顧客関係管理
ossalt_category: crm
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# CRM・顧客関係管理

## 概要

顧客情報・商談・コミュニケーション履歴を一元管理するプラットフォームのカテゴリ。Salesforce（エンタープライズ）・HubSpot（中小企業）が市場を支配しているが、コスト爆増・フリーミアムトラップ・データ所有権を動機に、Twenty / SuiteCRM などの OSS 代替を検討するスタートアップ・中小企業が増えている。

## なぜ今注目されているか

**1. HubSpot の「フリーミアムトラップ」問題**
HubSpot は無料 CRM で広く普及しているが、実用的な機能（メール追跡・シーケンス・高度なレポート）には Starter（$20/人/月〜）以上が必要。成長とともに Professional（$890/月〜）への移行を求められ、年間コストが急増するパターンが多い。この「無料で始めて高額になる」構造への不満が OSS 代替需要を生んでいる。

**2. Twenty の急成長**
2023 年にオープンソース化された Twenty が急速に GitHub スターを獲得（2.2 万超）。「Notion ライクな UI の OSS CRM」として海外コミュニティで注目を集め、「Salesforce / HubSpot の代替を目指す OSS」として認知されつつある。

**3. データ所有権への意識**
GDPR・個人情報保護法の強化とともに「顧客データを自社サーバーで管理したい」というニーズが高まっている。HubSpot / Salesforce のクラウドに顧客データを預けることへの懸念が、セルフホスト CRM への関心を生んでいる。

## 主要ツールの勢力図

```
  モダン・軽量・新興 ←────────────── フル機能・実績・高機能
          |                                      |
        Twenty                             SuiteCRM
    (Notion ライク・急成長)            (HubSpot近似・OSS老舗)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Twenty | 新世代 OSS CRM。モダン UI・GraphQL API | 22,000 | AGPL-3.0 |
| SuiteCRM | フル機能 OSS CRM。HubSpot 近似 | 4,500 | GPL-3.0 |

## 注目の動き（直近）

- **Twenty の機能拡充**: カスタムオブジェクト・GraphQL API・セルフホスト対応が充実しつつあり、2025〜2026 年にかけて急速に機能が追加されている
- **AI CRM の台頭**: Salesforce Einstein・HubSpot AI が CRM に AI 分析・予測・自動化を統合しており、OSS 代替での AI 機能の差が今後の選択に影響する可能性がある
- **SuiteCRM 8**: SuiteCRM の次世代 UI（SuiteCRM 8）がリリースされ、旧来の 2010 年代 UI からの改善が進んでいる

## 日本語圏での温度感

日本の中小企業・スタートアップでは HubSpot の採用率が高く、日本語サポートと日本語 UI の充実が普及を後押ししている。OSS CRM への関心は「HubSpot のコスト増」を経験した後に生まれるケースが多く、Twenty・SuiteCRM を試すスタートアップは増えつつあるが実際の移行事例はまだ少数。

Salesforce は大企業・エンタープライズでのシェアが高く、「Salesforce から離脱」という動機は Twenty のようなスタートアップ向け OSS より、SuiteCRM のようなフル機能 OSS への需要を生む。

## ossaltにおける推薦方針

### 必要な機能の範囲で分岐させる

```
「HubSpot / Salesforce の何を代替したいか？」
├── コンタクト・パイプライン管理だけ → Twenty（モダン・簡単）
├── メールキャンペーン・ワークフローも必要 → SuiteCRM
└── マーケティングオートメーション全般 → HubSpot 継続 or Twenty + Mautic
```

### Twenty の成熟度を正直に伝える

Twenty は急成長中だが、2026 年時点ではまだ成熟途上のプロダクト。「HubSpot の本番代替として使う」には一部の機能が不足している可能性がある。「試してみる価値はあるが、本番移行は慎重に」というトーンで推薦する。

### ライセンスの違いを明示

| ツール | ライセンス | SaaS 組み込み |
|---|---|---|
| Twenty | AGPL-3.0（要確認） | ソース公開義務の可能性 |
| SuiteCRM | GPL-3.0 | 配布時はソース公開 |

CRM データを社内でのみ使う場合はライセンス制約はほぼない。外部 SaaS に組み込む場合は確認が必要。

## Open questions

- Twenty の実際のライセンス（MIT vs AGPL-3.0）の確認
- Twenty の日本語 UI 対応計画の有無
- SuiteCRM 8 の完成度と旧バージョンからの移行容易さ
- Twenty + Mautic（メール配信 OSS）の組み合わせで HubSpot Marketing Hub を代替できるかの評価
- 日本の中小企業における CRM 未導入率（HubSpot 代替需要のポテンシャル）

## Evidence sources

- https://www.hubspot.com/pricing
- https://twenty.com/
- https://suitecrm.com/

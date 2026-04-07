---
type: comparison
slug: mailchimp-vs-listmonk
tool_a: listmonk
tool_b: mailchimp
saas_context: mailchimp
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Mailchimp vs Listmonk

## 比較の文脈

Mailchimp の連絡先数課金急増（無料枠縮小・有料化タイミング）を動機に OSS 代替を検討するユーザーへの最初の推薦。Listmonk は「シンプルなニュースレター配信」に特化した最も導入しやすいメール配信 OSS。

## TL;DR

| 条件 | 推薦 |
|---|---|
| ニュースレター配信・連絡先数 1 万件以上 | **Listmonk** |
| Mailchimp 課金を月 $0 近くにしたい | **Listmonk** |
| API でメール配信を制御したい | **Listmonk** |
| ドラッグ&ドロップのメールデザインが必要 | Mailchimp |
| ドリップ・行動トリガーが必要 | Mautic |
| 技術者なしで運用したい | Mailchimp 継続 |

## 比較表

| 項目 | Mailchimp | Listmonk |
|---|---|---|
| 価格 | 無料（500 連絡先）→ $13/月〜（〜50,000） | 無料 + SES 送信費 $0.10/1000 通 |
| ライセンス | プロプライエタリ | AGPL-3.0 |
| セルフホスト | ❌ | ✅ |
| キャンペーン配信 | ✅ | ✅ |
| 購読管理 | ✅ | ✅ |
| テンプレートエディタ | ✅ WYSIWYG | ⚠️ HTML テンプレート |
| セグメント | ✅ 高機能 | ✅ 基本的 |
| ドリップシーケンス | ✅ | ❌ |
| A/B テスト | ✅ | ❌ |
| 開封・クリック追跡 | ✅ | ✅ |
| バウンス管理 | ✅ | ✅ |
| API | ✅ | ✅ REST API |
| 日本語 UI | ✅ | ⚠️ 部分対応 |

## 各軸での詳細比較

### コスト（最重要）

10 万件リストで月 1 回配信する場合：
- Mailchimp Standard: 約 $170/月 = 年間 $2,040（約 31 万円）
- Listmonk + Amazon SES（10 万通 × $0.10/1000 = $10）+ サーバー ($10) = 月 $20

年間 $1,800 以上の削減。100 万件リストでは Mailchimp の課金は数千ドル/月になるが、Listmonk は Amazon SES の送信料のみ。

### テンプレートエディタの差

Mailchimp のドラッグ&ドロップエディタはノーコードで美しいメールテンプレートを作れる。Listmonk は HTML ベースのテンプレートで、Go テンプレート変数でパーソナライゼーションが可能だが、デザインには HTML/CSS の知識が必要。「非エンジニアがメールデザインを担当している」場合は Mailchimp の方が適している。

### 自動化・セグメントの差

Mailchimp は条件ベースのセグメント・ドリップシーケンス・行動トリガー（開封・クリック・非アクティブ等）を標準機能として持つ。Listmonk はキャンペーン配信と基本的なセグメントに特化しており、自動化は API を通じた外部処理が必要。「自動化なしの定期ニュースレターだけ」なら Listmonk で十分。

### 配信到達性

Mailchimp は独自の送信インフラで高い到達性を維持。Listmonk は Amazon SES / SendGrid を SMTP リレーとして使い、リレーサービスの到達性に依存する。Amazon SES は到達性が高く（適切な設定下で）、Mailchimp に近い到達性を実現できる。

## 移行摩擦

### Mailchimp → Listmonk の主な作業

1. **連絡先のエクスポート**: Mailchimp から CSV でエクスポート
2. **Listmonk のセットアップ**: Docker + PostgreSQL + Amazon SES 設定（30 分〜1 時間）
3. **連絡先のインポート**: CSV を Listmonk にインポート
4. **テンプレートの再作成**: Mailchimp のメールデザインを HTML テンプレートに変換
5. **Amazon SES の設定**: SES の承認・DKIM・SPF 設定（30 分程度）

テンプレートの HTML 変換が最も手間のかかる作業。既存テンプレートが少なければ 1〜2 日で移行可能。

## 日本語圏での選択傾向

日本でも「Mailchimp の課金が増えて移行先を探している」という事例から Listmonk が選ばれるケースが増えている。技術者がいるスタートアップ・メディア・コミュニティでの採用が多い。Amazon SES の利用設定が英語なのが若干の障壁だが、ドキュメントは充実している。

## 結論

**定期ニュースレター・メールキャンペーンが主目的で、技術者がいる組織**には Listmonk + Amazon SES は非常に有力な Mailchimp 代替。年間 30〜100 万円のコスト削減が現実的。ドラッグ&ドロップエディタ・ドリップシーケンスが必要な場合は Mailchimp か Mautic を推薦。

## Open questions

- Listmonk + Amazon SES の実際の配信到達性（迷惑メールフォルダ率）
- Listmonk のテンプレートを WYSIWYG で編集する方法（Unlayer 等との統合）
- Amazon SES のサンドボックス解除手順と日本語での設定ガイドの作成

## Evidence sources

- https://mailchimp.com/pricing/
- https://listmonk.app/
- https://aws.amazon.com/ses/pricing/

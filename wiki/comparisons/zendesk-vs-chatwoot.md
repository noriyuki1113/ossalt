---
type: comparison
slug: zendesk-vs-chatwoot
tool_a: chatwoot
tool_b: zendesk
saas_context: zendesk
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Zendesk vs Chatwoot

## 比較の文脈

Zendesk の高額なエージェントライセンス（$55〜$115/人/月）を動機に OSS 代替を探すユーザーへの最初の提案。Chatwoot は「リアルタイムチャット + オムニチャンネル統合」に特化した Zendesk 代替 OSS。

## TL;DR

| 条件 | 推薦 |
|---|---|
| ライブチャット + メール + SNS を統合したい | **Chatwoot** |
| コスト削減（エージェントライセンス費用を削減） | **Chatwoot** |
| セルフホストでサポートデータを管理したい | **Chatwoot** |
| SLA 管理・エスカレーションが必要 | Zendesk または Zammad |
| AI チケット分類・自動返信が業務の中心 | Zendesk |
| 電話サポートチャンネルが必要 | Zendesk |

## 比較表

| 項目 | Zendesk | Chatwoot |
|---|---|---|
| 価格 | Suite Team $55 / Pro $115（/エージェント/月） | 無料（セルフホスト）/ $19/エージェント/月〜 |
| ライセンス | プロプライエタリ | MIT |
| セルフホスト | ❌ | ✅ Docker Compose |
| チケット管理 | ✅ 高機能 | ⚠️ 基本的 |
| SLA 管理 | ✅ | ❌ |
| ライブチャット | ✅ | ✅ |
| メール統合 | ✅ | ✅ |
| WhatsApp Business | ✅ | ✅（API 設定必要） |
| Instagram / Facebook | ✅ | ✅ |
| Twitter/X | ✅ | ✅ |
| AI チケット分類 | ✅ Zendesk AI | ❌ |
| ナレッジベース | ✅ | ⚠️ 基本的 |
| 自動化ルール | ✅ 高機能 | ✅ 基本的 |
| レポート | ✅ 詳細 | ⚠️ 基本的 |
| 日本語 UI | ✅ | ✅ 部分対応 |

## 各軸での詳細比較

### オムニチャンネル統合

Chatwoot は Zendesk と同様に、メール・ライブチャット・WhatsApp・Instagram・Facebook・Twitter を一つのインターフェースで管理できる。エージェントは複数チャンネルからの問い合わせを切り替えなしに対応でき、「統合受信トレイ」として機能する。Zendesk と比べてチャンネルの数は同程度だが、電話（VoIP）統合は Chatwoot にはない。

### チケット管理の深さ

Zendesk のチケット管理は SLA・エスカレーション・優先度・カスタムフィールド・自動トリガー・マクロ・カスタムビューと非常に高機能。Chatwoot は会話（Conversation）のアサイン・ラベル・ステータス管理が基本で、SLA 定義・エスカレーションは持たない。「応答時間の SLA を守る」という要件があれば Zendesk（または Zammad）が必要。

### AI・自動化

Zendesk AI はチケットの自動分類・優先度付け・エージェントへの返信提案・ナレッジベースからの自動回答を提供。Chatwoot の自動化は「条件に合う会話に自動ラベル付け・アサイン」程度の基本的なルールベースの自動化。AI による応答品質の向上を期待する場合は Zendesk が大きく優位。

### コスト比較

エージェント 10 人の場合：
- Zendesk Suite Team: $55 × 10 = $550/月 = 年間 $6,600（約 99 万円）
- Chatwoot セルフホスト: サーバー $10〜50/月 のみ

コスト差は圧倒的。「SLA 管理・AI 不要で基本的なオムニチャンネルサポートができれば十分」という場合は Chatwoot で大幅なコスト削減が可能。

## 移行摩擦

### Zendesk → Chatwoot の主な作業

1. **会話データのエクスポート**: Zendesk から過去チケットをエクスポート（CSV または Zendesk API）。Chatwoot への自動インポートツールは限定的
2. **エージェントアカウントの作成**: Chatwoot でエージェント・チームを設定
3. **チャンネルの再接続**: メール・WhatsApp・SNS チャンネルを Chatwoot で再設定
4. **自動化ルールの再設計**: Zendesk の複雑なトリガー・マクロを Chatwoot のシンプルなルールで再現（一部再現不可）
5. **ナレッジベースの移行**: FAQ 記事は手動で移行

### Chatwoot に向かないケース

- **複雑な SLA 管理**: 応答時間の SLA・エスカレーションが業務要件にある
- **AI 自動返信に依存**: Zendesk AI の自動返信・分類に業務が依存している
- **電話サポートが必要**: コールセンター機能は Chatwoot にない
- **複雑なカスタムワークフロー**: Zendesk の高度な自動化が必要なオペレーション

## 日本語圏での選択傾向

日本のカスタマーサポートチームでは Zendesk の認知度・採用率が高く、代替を積極的に探す動きはまだ限定的。コスト削減を迫られたスタートアップ・中小企業で Chatwoot の採用事例が報告されている。LINE チャンネルに対応していないことが日本市場での制約になっている（日本のカスタマーサポートでは LINE 対応が重要な場合が多い）。

## 結論

**ライブチャット + メール + SNS のオムニチャンネルが主なサポートチャンネルで、SLA 管理・AI 不要のチーム**には Chatwoot は強力な Zendesk 代替。コスト削減効果が大きく、MIT ライセンスで商用利用制限もない。LINE 対応・SLA 管理・AI が必要な場合は Zendesk の継続または Zammad との組み合わせを推薦。

## Open questions

- Chatwoot の LINE チャンネル対応の見通し
- Zendesk から Chatwoot への過去チケットデータ移行ツールの有無・完成度
- Chatwoot の AI 機能（GPT 統合）の開発状況
- 日本の中小企業での Chatwoot 採用事例の収集

## Evidence sources

- https://www.zendesk.com/pricing/
- https://www.chatwoot.com/
- https://github.com/chatwoot/chatwoot

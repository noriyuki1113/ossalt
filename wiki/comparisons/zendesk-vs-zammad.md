---
type: comparison
slug: zendesk-vs-zammad
tool_a: zammad
tool_b: zendesk
saas_context: zendesk
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Zendesk vs Zammad

## 比較の文脈

Zendesk のチケット管理・SLA 機能に最も近い OSS 代替として Zammad を位置づける比較。「Zendesk の機能を維持しながらコストを削減し、データをセルフホストしたい」という要件がある中規模以上のサポートチームへの提案。

## TL;DR

| 条件 | 推薦 |
|---|---|
| SLA・エスカレーション・本格的なチケット管理が必要 | **Zammad** |
| メールベースのヘルプデスクを OSS 化したい | **Zammad** |
| GDPR・データ所有権の要件がある（欧州・国内保管） | **Zammad** |
| ライブチャット・オムニチャンネルが中心 | Chatwoot（Zammadより適切） |
| 非エンジニアが管理・設定したい | Zendesk |
| AI チケット分類・自動返信が必要 | Zendesk |

## 比較表

| 項目 | Zendesk | Zammad |
|---|---|---|
| 価格 | Suite Team $55 / Pro $115（/エージェント/月） | 無料（セルフホスト）/ €6/エージェント/月〜 |
| ライセンス | プロプライエタリ | AGPL-3.0 |
| セルフホスト | ❌ | ✅ Docker Compose |
| チケット管理 | ✅ 高機能 | ✅ 高機能 |
| SLA 管理 | ✅ | ✅ |
| エスカレーション | ✅ | ✅ |
| メール統合 | ✅ | ✅ |
| ライブチャット | ✅ | ⚠️ 限定的 |
| 電話（VoIP） | ✅ | ✅ CTI 統合 |
| ナレッジベース | ✅ | ✅ |
| カスタムフィールド | ✅ | ✅ |
| AI チケット分類 | ✅ Zendesk AI | ❌ |
| 自動化ルール | ✅ 高機能 | ✅ 充実 |
| GDPR 対応 | ✅ | ✅（ドイツ製・重視） |
| 日本語 UI | ✅ | ⚠️ 日本語パックあり |

## 各軸での詳細比較

### チケット管理の品質

Zammad のチケット管理は Zendesk に最も近い OSS の一つ。SLA（応答時間・解決時間の定義）・エスカレーション（SLA 違反時の通知・担当変更）・カスタムワークフロー・マルチチャンネル（メール・電話・SNS）への対応が揃っている。Zendesk の「Trigger（自動トリガー）」「Automation（時間ベースの自動化）」に相当する機能を持ち、ルールベースの自動化が充実している。

### SLA 管理の比較

Zendesk の SLA 管理は優先度・ビジネス時間・カレンダー別の複雑な設定が可能。Zammad も SLA の定義・カレンダー・優先度設定に対応しており、標準的な SLA 要件はカバーできる。エンタープライズレベルの複雑な SLA ルールは Zendesk が優位だが、中規模のサポートチームであれば Zammad で十分な場合が多い。

### オムニチャンネルの差

Zendesk はメール・チャット・電話・SNS をシームレスに統合。Zammad はメール・電話（CTI 統合）・ソーシャル（Twitter/X・Facebook）に対応するが、リアルタイムチャットウィジェット（Webサイト埋め込み）は Chatwoot と比べると限定的。「メールベースのチケット管理が中心でライブチャットは補助的」というサポート体制には Zammad が適しているが、「リアルタイムチャットが主」の場合は Chatwoot の方が適している。

### GDPR・データ所有権

Zammad はドイツ発のツールで、GDPR 対応・データ所有権への意識が高い。個人データの削除リクエスト対応・データエクスポートが標準機能として整備されている。欧州企業・国内データ保管要件がある日本企業（医療・金融）にとって重要なメリット。Zendesk は GDPR 対応を謳っているが、データが Zendesk のクラウドに保管される点は変わらない。

### AI 機能の差

Zendesk AI（チケット自動分類・優先度付け・エージェント提案・自動返信）は Zammad にはない。ルールベースの自動化（条件に合うチケットへのアクション）は Zammad でも可能だが、機械学習による分類は持たない。AI による応答品質向上が業務要件であれば Zendesk の優位性は大きい。

## 移行摩擦

### Zendesk → Zammad の主な作業

1. **チケットデータのエクスポート**: Zendesk から過去チケットを JSON/CSV でエクスポート。Zammad への自動インポートは限定的（Zendesk インポーター が提供されているが完全ではない）
2. **Zammad のセットアップ**: Docker Compose または公式パッケージで構築。Elasticsearch のセットアップが必要（検索機能の中核）
3. **メール・電話チャンネルの再設定**: メールアカウント・電話システムの連携設定
4. **SLA の再定義**: Zendesk の SLA を Zammad の設定に手動で再入力
5. **自動化ルールの移行**: Zendesk の Trigger/Automation を Zammad のワークフローで再現
6. **エージェントのトレーニング**: UI が変わるため 1〜2 週間の適応期間

### Zammad の最大の障壁

Elasticsearch への依存が運用負荷の主な原因。Elasticsearch は Zammad の全文検索・チケット検索の中核であり、Elasticsearch なしには Zammad は機能しない。Elasticsearch は単独でも 2〜4GB RAM を消費し、Zammad 全体で最低 6〜8GB RAM が推奨される。中小規模のサーバーでは制約になる。

## 日本語圏での選択傾向

Zammad は日本語圏での認知度が低く、Qiita・Zenn の記事数も少ない。欧州（特にドイツ語圏）での採用が中心で、日本市場への浸透は限定的。日本語パックが存在するため言語の障壁は Chatwoot より低いが、日本語ドキュメント・コミュニティが薄い。

## 結論

**SLA 管理・エスカレーション・メールベースのヘルプデスクが主目的**のサポートチームへの Zendesk 代替として Zammad は有力。特に：

- GDPR・国内データ保管要件がある（欧州・金融・医療）
- 月額 $55〜$115/エージェントのコストを削減したい
- Elasticsearch を運用できる技術力がある

という条件が揃う場合に推薦できる。リアルタイムチャットが主目的の場合は Chatwoot を先に推薦し、Zammad は「チケット管理・SLA 重視」の文脈に絞る。

## Open questions

- Zammad の Elasticsearch 依存を解消する開発計画の有無
- Zendesk → Zammad の自動移行ツールの完成度
- 日本の規制業種（医療・金融）での Zammad 採用事例
- Zammad の AI 機能（機械学習チケット分類）の将来的な実装可能性

## Evidence sources

- https://www.zendesk.com/pricing/
- https://zammad.org/
- https://github.com/zammad/zammad

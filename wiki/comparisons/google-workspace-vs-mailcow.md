---
type: comparison
slug: google-workspace-vs-mailcow
tool_a: mailcow
tool_b: google-workspace
saas_context: google-workspace
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Google Workspace vs Mailcow

## 比較の文脈

Google Workspace のコスト・データ所有権・Google 依存リスクを動機にセルフホストメールを検討するユーザーへの提案。**メールのセルフホストは ossalt が扱う中で最も難しいカテゴリ**であり、推薦には常にリスク説明が必要。

## TL;DR

| 条件 | 推薦 |
|---|---|
| 技術力があり、データ所有権が最優先 | **Mailcow** |
| GDPR・国内サーバー保管要件がある | **Mailcow** |
| 50〜200 人規模でコスト削減が主目的 | **Mailcow**（運用体制があれば） |
| 10 人以下の小規模チーム | Google Workspace 継続（コスト対効果が合わない） |
| 非技術系スタッフが管理する | Google Workspace 継続 |
| 99.9% 以上の稼働率保証が必要 | Google Workspace 継続 |

## ⚠️ 重要な前置き

メールのセルフホストは「設定ミスが即座にメール不達につながる」高リスクなカテゴリ。以下のリスクを受け入れられる場合のみ推薦：
- **IP レピュテーション問題**: 新規 IP が Gmail / Outlook にスパム判定される期間がある
- **運用負荷**: セキュリティアップデート・スパムフィルター調整・ハードウェア障害対応
- **配信到達性**: Mailcow の設定ミスでメールが相手に届かない可能性

## 比較表

| 項目 | Google Workspace | Mailcow |
|---|---|---|
| 価格 | Business Starter $6/人/月〜 | 無料（サーバーコストのみ）|
| ライセンス | プロプライエタリ | GPL-2.0 |
| セルフホスト | ❌ | ✅ Docker Compose |
| 稼働率保証 | ✅ 99.9% SLA | ❌（自己責任） |
| メール | ✅ Gmail | ✅ Postfix + Dovecot |
| Web メール | ✅ Gmail UI | ✅ SOGo |
| カレンダー | ✅ Google Calendar | ✅ SOGo Calendar |
| 連絡先同期 | ✅ | ✅ SOGo |
| スパムフィルター | ✅ 業界最高水準 | ✅ Rspamd（要調整）|
| モバイル対応 | ✅ | ✅ IMAP/SMTP 経由 |
| AI 機能 | ✅ Gemini for Gmail | ❌ |
| Drive / Docs 統合 | ✅ | ❌ |
| 日本語 UI | ✅ | ❌（英語のみ） |

## 各軸での詳細比較

### コスト比較

50 人チームで比較：
- Google Workspace Business Starter: $6 × 50 = $300/月 = 年間 $3,600（約 54 万円）
- Mailcow（VPS 4GB RAM）: サーバー $20〜40/月 = 年間 $240〜480（約 3.6〜7.2 万円）

年間 46〜50 万円のコスト削減が可能。ただし「運用工数コスト」（月 2〜4 時間 × エンジニア時給）を加えると、実質コスト削減額は変わる。

### スパムフィルターの差

Google の Gmail スパムフィルターは業界最高水準で、ほぼ設定不要で高精度。Mailcow の Rspamd は高性能だが、初期設定と継続的な調整が必要。特に「会社のメールアドレスから送るメール」がスパム判定されないための IP ウォームアップが重要。

### Google Workspace の「メール以外」への依存

Google Workspace の価値はメールだけでなく、Google Drive・Docs・Sheets・Meet の統合にある。「メールだけ Mailcow に移行する」場合は、他の Google サービスはそのまま使い続けることになる。「Google への依存を減らしたい」という動機には部分的にしか応えられない。

### 配信到達性のリスク

新規 IP アドレスからのメール送信は、Gmail・Outlook・Yahoo に「新規・未知の送信元」として扱われる。SPF/DKIM/DMARC の設定に加え、IP レピュテーションを育てるウォームアップ期間（数週間〜数ヶ月）が必要な場合がある。「今日から Mailcow に移行して明日からメールが使える」とはならない。

## 移行摩擦

### Google Workspace → Mailcow の主な作業

1. **メールデータの移行**: Google Takeout または IMAP 経由で過去メールをエクスポート → Mailcow にインポート（時間がかかる）
2. **DNS 設定の変更**: MX レコードを新サーバーに変更。SPF・DKIM・DMARC・PTR レコードの設定
3. **VPS の選定**: IP レピュテーションが良いプロバイダーの選定。PTR レコードの設定可否確認
4. **Mailcow のセットアップ**: Docker Compose での構築（2〜4 時間）
5. **IP ウォームアップ期間**: 少量のメールから徐々に増やし、IP レピュテーションを育てる（2〜4 週間）
6. **モバイルデバイスの再設定**: 全スタッフのメールアプリを新サーバーの IMAP/SMTP に再設定

### SMTP リレーを使った配信到達性問題の回避

配信到達性を確保しつつセルフホストするハイブリッド戦略：
- 受信: Mailcow（自社サーバーでメール受信・管理）
- 送信: SendGrid / Amazon SES / Mailgun のリレー経由で送信

この戦略により「IP レピュテーション問題」を回避しながらデータ所有権を確保できる。

## 日本語圏での選択傾向

日本では Google Workspace の採用率が高く、中小企業・スタートアップの多くが Gmail を使っている。メールのセルフホストに移行した事例はごく限られており、「技術系企業のエンジニアが個人または小規模組織でやっている」ケースがほとんど。GDPR・個人情報保護法の文脈で「メールデータの国内保管」が求められる組織での採用事例がある。

## 結論

**以下の条件がすべて揃う場合のみ Mailcow を推薦**：

1. サーバー管理経験のあるエンジニアがいる
2. メールサーバーの障害対応ができる運用体制がある
3. GDPR・国内保管要件などの強い理由がある（コスト削減だけでは推薦しない）
4. 50 人以上の組織でコスト差が大きい

それ以外の多くの場合は「メールは Google Workspace のまま・他を OSS 化する」というハイブリッド戦略を推薦する。

## Open questions

- SMTP リレー（SendGrid 等）と Mailcow を組み合わせた運用の実際のコスト・手間
- 日本の VPS プロバイダーで PTR レコード設定が可能なサービスの調査
- Google Workspace の Gemini AI（Gmail 要約・下書き生成）が代替の意思決定に与える影響

## Evidence sources

- https://workspace.google.com/pricing
- https://mailcow.email/
- https://github.com/mailcow/mailcow-dockerized

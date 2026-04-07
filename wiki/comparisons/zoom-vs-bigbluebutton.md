---
type: comparison
slug: zoom-vs-bigbluebutton
tool_a: bigbluebutton
tool_b: zoom
saas_context: zoom
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# Zoom vs BigBlueButton

## 比較の文脈

教育・ウェビナー・企業研修用途での Zoom 代替として BigBlueButton を提案する比較。LMS 連携・ホワイトボード・投票・出席管理などの教育特化機能が必要な組織向け。

## TL;DR

| 条件 | 推薦 |
|---|---|
| オンライン授業・LMS（Moodle）と連携したい | **BigBlueButton** |
| ホワイトボード・投票・ブレイクアウトルームが必要な研修 | **BigBlueButton** |
| セルフホストで教育データを管理したい | **BigBlueButton** |
| 一般的な社内会議 | Jitsi Meet（BBBより軽量） |
| 外部クライアントとの会議（使いやすさ優先） | Zoom |
| 大規模ウェビナー（登録・Q&A管理） | Zoom |

## 比較表

| 項目 | Zoom | BigBlueButton |
|---|---|---|
| 価格 | Pro $15.99/人/月〜 / Webinar $149/月〜 | 無料（セルフホスト） |
| ライセンス | プロプライエタリ | LGPL-3.0 |
| セルフホスト | ❌ | ✅（Ubuntu 22.04 専用） |
| ホワイトボード | ✅ | ✅ 高機能（スライドへの書き込み） |
| 投票 | ✅ | ✅ |
| ブレイクアウトルーム | ✅ | ✅ |
| 出席管理 | ❌（サードパーティ） | ✅ 標準機能 |
| LMS 連携 | ⚠️ Zoom LTI（有料） | ✅ Moodle/Canvas/Sakai 公式対応 |
| 録画・再生配信 | ✅ クラウド録画（有料） | ✅ 標準装備 |
| AI 機能 | ✅ Zoom AI Companion | ❌ |
| 参加上限 | 1000 人〜 | 〜200 人（サーバー依存） |
| セットアップ難易度 | N/A（SaaS） | 高（専用サーバー必須） |

## 各軸での詳細比較

### 教育特化機能

BigBlueButton は教育用途に特化して設計されており、HTML5 ホワイトボード（スライドに書き込める）・投票（選択式・自由回答）・グループワーク（ブレイクアウトルーム）・出席確認・学習進捗追跡が標準装備。これらを Zoom で使うと有料プランが必要な機能もある。教育機関での本格的なオンライン授業環境として BigBlueButton は完成度が高い。

### LMS 連携

BigBlueButton は Moodle / Canvas / Sakai との公式 LTI プラグインが整備されており、学習管理システムから直接 BigBlueButton の会議室を起動できる。出席データ・録画も LMS に紐づけて管理できる。Zoom も LTI 対応があるが、機能の完成度は BigBlueButton の方が教育用途に特化している。

### セルフホストの要件とコスト

BigBlueButton は Ubuntu 22.04 LTS 専用の自動インストールスクリプト（bbb-install）が提供されているが、最低 8 コア CPU・16GB RAM の専用サーバーが必要。VPS では月 $50〜$200 程度のサーバーコストが発生する。Zoom のようなスケールアウトは Scalelite というロードバランサーが必要でさらに複雑。「無料の OSS」のコストはサーバー費用と運用工数で支払う。

### 録画と再生

Zoom はクラウド録画（有料プラン）またはローカル録画。BigBlueButton はサーバー上に録画し、Web ブラウザで再生可能な形式（HTML5 プレイヤー）で保存。録画データを LMS の受講者に公開する仕組みが整備されており、後からの復習・振り返り学習に対応。

## 移行摩擦

### Zoom（教育利用）→ BigBlueButton の主な作業

1. **サーバーの調達**: 8 コア CPU・16GB RAM 以上の VPS または物理サーバーの用意
2. **Ubuntu 22.04 LTS のセットアップ**: BBB は Ubuntu 22.04 に依存
3. **bbb-install.sh の実行**: 自動インストールスクリプトの実行（30〜60 分）
4. **LMS 連携設定**: Moodle 等への LTI プラグインのインストール
5. **講師・受講者へのトレーニング**: 操作方法の説明（基本操作は Zoom に近い）

### Zoom の「使いやすさ」への期待値調整

外部参加者（保護者・学生・社会人）が Zoom に慣れている場合、BigBlueButton への移行には参加方法の変更が必要。Zoom のアプリ起動と比べ、BigBlueButton のブラウザ参加はシンプルだが、Zoom ほどの知名度がなく「BigBlueButton って何？」という疑問が生じる可能性がある。

## 日本語圏での選択傾向

COVID-19 パンデミック時に日本の一部大学・自治体教育委員会で BigBlueButton が採用された。Moodle と組み合わせた利用が多い。ただし、Zoom の普及率が圧倒的で、「オンライン授業 = Zoom」という文化が定着している。BigBlueButton を積極的に採用するのは OSS に理解があり、データ所有権を重視する教育機関に限られる。

## 結論

**Moodle などの LMS を使っている教育機関**には BigBlueButton は有力な Zoom 代替。特に「オンライン授業のデータを自機関のサーバーで管理したい」という要件がある場合に推薦できる。一般的な社内会議・ウェビナーへの推薦は Jitsi Meet や Zoom を優先し、BigBlueButton は教育・研修用途に絞る。

## Open questions

- BigBlueButton の Docker 対応の進捗（Ubuntu 依存の解消見通し）
- Scalelite を使った大規模運用の実際のコスト・工数
- 日本の大学・高校での BigBlueButton 採用事例の継続状況
- BigBlueButton に AI 自動字幕・議事録生成機能が追加される可能性

## Evidence sources

- https://zoom.us/pricing
- https://bigbluebutton.org/
- https://github.com/bigbluebutton/bigbluebutton

---
type: tool
slug: bigbluebutton
name: BigBlueButton
category: video-conferencing
github: https://github.com/bigbluebutton/bigbluebutton
stars: 8500
language: Scala / JavaScript / Ruby
last_commit: 2026-03-01
license: LGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - zoom
related_tools:
  - jitsi
---

# BigBlueButton

## 一言定義

教育・ウェビナー用途に特化した OSS ビデオ会議ツール。ホワイトボード・投票・ブレイクアウトルーム・出席管理・LMS 連携が充実しており、オンライン授業・企業研修に向く。

## Positioning

BigBlueButton は 2007 年に教育用途で始まった OSS ビデオ会議ツール。Moodle / Canvas / Sakai などの LMS（学習管理システム）との深い統合が特徴で、世界中の教育機関に採用されている。LGPL-3.0 ライセンス。GitHub スター 8,500 超。Jitsi Meet が「一般的なビデオ会議」に特化するのに対し、BigBlueButton は「教育・インタラクティブウェビナー」に特化。

## 強み

- **教育特化機能**: ホワイトボード（スライドへの書き込み）・投票・ブレイクアウトルーム・出席確認・学習進捗追跡
- **LMS 連携**: Moodle / Canvas / Sakai との統合プラグインが公式に整備
- **スライド共有**: PowerPoint / PDF をアップロードしてインタラクティブに共有できる
- **録画・再生**: 会議の録画と後からの再生配信が標準機能として整備
- **100 人以上の安定した会議**: 教育用途で 100〜200 人規模の同時接続に対応

## 弱み・注意点

- **セルフホスト要件が厳しい**: Ubuntu 22.04 LTS 専用の自動インストールスクリプト（bbb-install）が公式。他の OS・コンテナ環境では設定が複雑
- **サーバースペック要件が高い**: 最低 8 コア CPU・16GB RAM・推奨 16 コア/32GB RAM
- **一般的な会議用途には過剰**: 教育機能が不要な社内会議に使うには重すぎる
- **管理 UI がモダンでない**: 管理インターフェースは機能的だが UI は古い
- **日本語ドキュメントが少ない**: 公式ドキュメントは英語中心

## どんなユーザーに向くか

- **教育機関・オンライン授業**: 大学・専門学校・塾・企業研修でのオンライン授業
- **Moodle / Canvas を使っている組織**: LMS と統合したビデオ会議が必要
- **インタラクティブなウェビナー**: 投票・Q&A・ブレイクアウトルームが必要なウェビナー
- **録画配信が必要**: 授業・研修の録画を受講者に後から提供したい
- **100 人以上の大規模会議**: Jitsi では不安定になる規模での安定した会議

## セルフホスト難易度

**高め**。公式の `bbb-install.sh` スクリプトで Ubuntu 22.04 LTS への自動インストールが可能だが、専用サーバー（VPS または物理サーバー）が必要で、コンテナ化された環境への対応は限定的。最低 8 コア CPU・16GB RAM を必要とし、サーバーコストが高め。HTTPS + 独自ドメインが必須。スケールアウトは複数サーバーの Scalelite ロードバランサーが必要でさらに複雑。

## 日本語圏での採用状況

COVID-19 パンデミック時に日本の大学・教育機関での採用が増えた。Moodle との連携用途での導入事例がある。ただし Zoom のシェアが圧倒的なため、BigBlueButton を選ぶ組織はデータ所有権・LMS 連携を重視する一部の教育機関に限られる。日本語 UI は部分的に対応しているが完全ではない。

## ossaltにおける推奨文脈

Zoom 代替として「教育・ウェビナー・研修用途」に特化した推薦で使う。一般的な社内会議への推薦は Jitsi Meet を優先し、BigBlueButton は「LMS 連携が必要」「投票・ホワイトボードが必要」「録画配信が必要」という教育ユースケースに絞って推薦。セルフホストのサーバー要件が高いことを必ず明示する。

## Open questions

- BigBlueButton の Docker コンテナ対応の進捗（公式サポートの見通し）
- 日本の教育機関での BigBlueButton 採用事例の収集
- Scalelite（ロードバランサー）を使った大規模運用の実態コスト
- BigBlueButton の AI 機能（自動字幕・議事録生成）の将来的な実装可能性

## Evidence sources

- https://bigbluebutton.org/
- https://github.com/bigbluebutton/bigbluebutton

---
type: saas
slug: zoom
name: Zoom
category: video-conferencing
status: active
priority: high
pain_points:
  - monthly-cost
  - privacy-concerns
  - data-ownership
  - vendor-lock-in
  - zoom-fatigue
decision_axes:
  - participant-capacity
  - self-host-difficulty
  - webinar-functionality
  - recording-storage
  - ops-burden
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - jitsi
  - bigbluebutton
related_category_pages:
  - wiki/categories/video-conferencing.md
related_comparison_pages:
  - wiki/comparisons/zoom-vs-jitsi.md
  - wiki/comparisons/zoom-vs-bigbluebutton.md
---

# Zoom

## Summary

Zoom は 2020 年のパンデミック以降に爆発的に普及したビデオ会議 SaaS。現在もビデオ会議の事実標準として定着しているが、プライバシー懸念・コスト増・AI 学習利用規約問題を動機に、Jitsi Meet / BigBlueButton などの OSS 代替を検討するユーザーが一定数いる。ossalt では **コスト・データ所有権・プライバシー** を主な動機として、Jitsi Meet / BigBlueButton との比較起点として扱う。

## Why it matters for ossalt

Zoom は「代替候補が最も絞りにくいカテゴリ」の一つ。ビデオ会議は参加者全員が同じツールを使う必要があるため、移行摩擦が特に高い。一方、社内限定の会議・教育用途・ウェビナーなど用途を絞ると OSS 代替が機能する場面がある。「セルフホストで社内会議を完全に管理したい」という需要に Jitsi Meet が応える。

## How Zoom is positioned

Zoom は「ビデオ会議のインフラ」から「AI コミュニケーションプラットフォーム」へ進化しようとしている。Zoom AI Companion（会議要約・議事録・チャット要約）を推進し、会議データの AI 活用を前提とした設計へ移行中。2023 年の利用規約変更（ユーザーコンテンツを AI 学習に使用）問題が一時批判を浴びた。

## Why users look for alternatives

- **コスト**: Pro $15.99/人/月〜、Business $19.99/人/月〜。100 人チームで月数十万円になりやすい
- **プライバシー・AI 学習問題**: 2023 年の利用規約変更で会議内容が AI 学習に使用される可能性が表面化
- **データ所有権**: 会議録画・文字起こしデータが Zoom のクラウドに保存されることへの懸念
- **規制業種での利用制限**: 医療・教育・政府系での Zoom 利用に制限がある国・組織
- **ベンダー依存**: Zoom Links が標準になることで離脱コストが高まる

## What ossalt should help users decide

1. 社内限定会議なら Jitsi Meet のセルフホストで要件を満たせるか
2. 教育・ウェビナー用途なら BigBlueButton が適切か
3. 参加者に「インストール不要」が必要かどうか
4. 録画・文字起こしのデータ管理をどこで行うか

## Core decision axes

### 1. Participant capacity

Jitsi Meet は小〜中規模会議（〜75 人程度を推薦）に向く。BigBlueButton は教室型（教師+受講者 100 人以上）に対応。Zoom は 100〜1000 人以上のウェビナーまでスケールする。

### 2. Self-host difficulty

Jitsi Meet は Docker Compose で比較的容易にセルフホストできる。BigBlueButton はシングルサーバーへの自動インストールスクリプトが整備されているが、Ubuntu 22.04 限定など要件が厳しい。どちらもサーバーの帯域・処理能力がビデオ品質に直結する。

### 3. Webinar / Education functionality

BigBlueButton は教育特化機能（ホワイトボード・投票・ブレイクアウトルーム・出席確認）が充実。Jitsi Meet は一般的なビデオ会議に特化。Zoom のウェビナー機能（登録・Q&A・パネリスト管理）は OSS 代替では完全再現が難しい。

## Candidate families

### Jitsi Meet
WebRTC ベースのオープンソース ビデオ会議。ブラウザのみで参加可能（インストール不要）。meet.jit.si でクラウド版を無料利用できる。セルフホスト版は Docker Compose で構築可能。Apache-2.0。

### BigBlueButton
教育・ウェビナー特化の OSS ビデオ会議。HTML5 ホワイトボード・投票・ブレイクアウトルーム・出席管理が充実。Moodle / Canvas との LMS 連携が強み。LGPL-3.0。

## Suggested related wiki pages

- `wiki/tools/jitsi.md`
- `wiki/tools/bigbluebutton.md`
- `wiki/comparisons/zoom-vs-jitsi.md`
- `wiki/comparisons/zoom-vs-bigbluebutton.md`
- `wiki/categories/video-conferencing.md`

## Open questions

- Jitsi Meet のセルフホストでの安定性・スケーラビリティの実態（50 人超の会議）
- BigBlueButton のセットアップ要件（Ubuntu 限定）が日本の採用に与える影響
- Zoom の AI 機能（Zoom AI Companion）への対抗として OSS 代替がどこまで追いつけるか
- 日本の教育機関での Zoom vs BigBlueButton 採用状況

## Evidence sources

- https://zoom.us/pricing
- https://jitsi.org/
- https://bigbluebutton.org/

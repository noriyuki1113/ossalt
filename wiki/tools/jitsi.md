---
type: tool
slug: jitsi
name: Jitsi Meet
category: video-conferencing
github: https://github.com/jitsi/jitsi-meet
stars: 23000
language: JavaScript / TypeScript
last_commit: 2026-04-01
license: Apache-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - zoom
related_tools:
  - bigbluebutton
---

# Jitsi Meet

## 一言定義

ブラウザだけで参加できる WebRTC ベースのオープンソースビデオ会議ツール。インストール不要・アカウント不要で会議を開始でき、meet.jit.si のクラウド版またはセルフホスト版を選べる。

## Positioning

Jitsi Meet は 8x8 が開発する Apache-2.0 ライセンスのビデオ会議 OSS。meet.jit.si で無料クラウド版を即時利用できる点が最大の特徴で、「URL を送るだけで参加できる」Zoom に近い UX を提供する。セルフホスト版は Docker Compose または自動インストールスクリプトで構築可能。GitHub スター 2.3 万超。WebRTC を使うため、ブラウザだけで動作しアプリインストールが不要。

## 強み

- **インストール不要**: ブラウザのみで参加可能。参加者にアカウント・アプリは不要
- **即時利用**: meet.jit.si でアカウントなし・設定なしでビデオ会議を開始できる
- **セルフホスト対応**: Docker Compose または自動インストールスクリプトでセルフホスト可能
- **Apache-2.0**: 商用利用・カスタマイズに制限なし
- **E2E 暗号化**: エンドツーエンド暗号化に対応（一部制限あり）
- **会議録画**: Jibri コンポーネントで会議録画が可能（別途設定が必要）
- **スマートフォン対応**: iOS / Android アプリも提供

## 弱み・注意点

- **大規模会議での不安定さ**: 75 人以上の会議は安定性に課題がある。Zoom の 1000 人ウェビナーには届かない
- **セルフホスト時のサーバー要件**: ビデオ会議は帯域・CPU を多く使うため、十分なサーバースペックが必要
- **録画機能の設定複雑さ**: 録画には Jibri という別コンポーネントの設定が必要で、サーバー要件も高い
- **エンタープライズ機能は限定的**: ウェビナー登録・分析・ブランディングは meet.jit.si のクラウド版（有料）が必要
- **meet.jit.si の利用制限**: 無料クラウド版は参加者 75 人・通話 60 分の制限あり

## どんなユーザーに向くか

- **社内会議のセルフホスト**: 社外参加者が少なく、サーバーを管理できる IT チームがいる組織
- **プライバシー重視の会議**: 会議内容をクラウドに送りたくない、データを自社サーバーで管理したい
- **教育・医療・行政**: GDPR・国内データ保管要件がある規制業種でのビデオ会議
- **Zoom コストを削減したい中小企業**: 月額数万円の Zoom コストを排除したい小規模チーム
- **開発者・技術チーム**: セルフホストで自社インフラに統合したい

## セルフホスト難易度

**中程度**。Docker Compose での構築が整備されており、基本的な会議機能は 1〜2 時間で起動できる。ただし会議品質はサーバーのネットワーク帯域・CPU・RAM に大きく依存する（最低 4GB RAM、推奨 8GB+）。録画機能（Jibri）の追加は別途サーバーと複雑な設定が必要。HTTPS 設定（Let's Encrypt）も必須。

## 日本語圏での採用状況

日本語圏での認知度は Zoom と比べて低いが、プライバシー重視の用途（医療・行政・教育）での採用事例がある。Qiita にセルフホストの導入記事が存在する。「Zoom の代替 OSS」として名前が挙がることが多いが、実際の移行事例はまだ少数。meet.jit.si は無料かつ即時利用できるため、個人・小規模チームが試用するケースがある。

## ossaltにおける推奨文脈

Zoom 代替として **最初に紹介すべき OSS 候補**。「社内 15〜50 人規模の会議をセルフホストで管理したい」「Zoom コストを削減したい」という文脈での推薦。参加者の技術リテラシーを問わず「ブラウザだけで参加できる」UX が大きな強み。ウェビナー・大規模配信が主目的の場合は BigBlueButton または Zoom 継続を推薦。

## Open questions

- Jitsi Meet のセルフホストでの実際の安定参加人数（50 人以上の実績）
- 日本の医療・教育機関での Jitsi Meet 採用状況
- Jitsi の E2E 暗号化の現状（全機能での対応状況）
- meet.jit.si の制限強化の動向（無料版の継続性）

## Evidence sources

- https://jitsi.org/
- https://github.com/jitsi/jitsi-meet

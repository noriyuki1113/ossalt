---
type: tool
slug: nextcloud
name: Nextcloud
category: file-storage
github: https://github.com/nextcloud/server
stars: 26000
language: PHP / JavaScript
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - dropbox
  - google-workspace
related_tools:
  - seafile
---

# Nextcloud

## 一言定義

ファイル同期・共有にカレンダー・連絡先・ビデオ通話・ドキュメント編集を統合した「OSS コラボレーションプラットフォーム」。Dropbox 代替としてだけでなく、Google Workspace の一部代替としても使われる。

## Positioning

Nextcloud は 2016 年に ownCloud からフォークして誕生した。AGPL-3.0 ライセンス、GitHub スター 2.6 万超。ファイル同期・共有の枠を超え、「Nextcloud Hub」として Office（ONLYOFFICE / Collabora Online 統合）・Talk（ビデオ会議）・Groupware（カレンダー・連絡先）・Mail を統合するオールインワンのコラボレーションプラットフォームに進化。欧州企業・政府機関での採用が多く、GDPR 対応を強みとしている。

## 強み

- **フル機能プラットフォーム**: ファイル・カレンダー・連絡先・メール・ビデオ通話・ドキュメント編集を統合
- **豊富なアプリエコシステム**: 400 以上のアプリ（プラグイン）で機能拡張が可能
- **デスクトップ・モバイル同期**: Windows / macOS / Linux / iOS / Android 対応クライアント
- **ONLYOFFICE / Collabora Online 統合**: MS Office 互換のオンラインドキュメント編集
- **AGPL-3.0 + 商用版あり**: コミュニティ版は無料、エンタープライズ版（Nextcloud Enterprise）は商用サポート付き
- **欧州・GDPR 対応の実績**: 独政府機関・欧州企業での採用実績が豊富
- **Talk（ビデオ通話）**: セルフホストのビデオ会議（Jitsi 統合可）

## 弱み・注意点

- **PHP 製のパフォーマンス**: 大規模ファイル数・大人数環境では Seafile と比べてパフォーマンスが落ちる
- **セットアップと管理の複雑さ**: Docker で起動は簡単だが、本番運用（パフォーマンス最適化・アップデート・バックアップ）は複雑
- **アップデート管理**: メジャーバージョンアップが大きく、アップデート失敗リスクがある
- **AGPL-3.0**: SaaS 組み込みにはライセンス注意
- **Talk の品質**: Nextcloud Talk のビデオ品質は Jitsi Meet に劣る場合がある

## どんなユーザーに向くか

- **Google Workspace の一部代替**: ファイル + カレンダー + 連絡先を Google から離脱させたい
- **Dropbox + Google Drive の代替**: ファイル共有・同期のセルフホスト
- **GDPR・国内保管要件**: ファイルデータを自社サーバーで管理することが必要
- **中規模組織（10〜100 人）**: 個人から中規模までカバーできる汎用プラットフォーム
- **欧州・官公庁系**: GDPR 対応実績が重要な組織

## セルフホスト難易度

**中程度**。公式 Docker イメージ（nextcloud/all-in-one）で起動は比較的容易。最低 2GB RAM（推奨 4GB+）。ただし本番運用では PostgreSQL（推奨）・Redis（キャッシュ）・逆プロキシ（nginx）の設定が必要。アップデートはメジャーバージョン間に段階的な手順が必要で、スキップ不可。

## 日本語圏での採用状況

日本でも認知度が高く、Qiita・Zenn に豊富な導入記事がある。個人・中小企業・教育機関での採用事例が多い。日本語 UI は完全対応している。「Dropbox / Google Drive の代替として社内ファイルサーバーをセルフホストする」という用途での採用が中心。

## ossaltにおける推薦文脈

Dropbox / Google Drive 代替として **ファイル同期 + コラボレーション機能まで必要なユーザーへの第一候補**。「ファイル同期だけで十分」「高速・軽量が最優先」という場合は Seafile を第 2 候補として提示。

## Open questions

- Nextcloud の大規模環境（1TB 以上・100 人以上）でのパフォーマンス実態
- Nextcloud Hub（ONLYOFFICE 統合）の Google Docs 代替としての実用性評価
- Nextcloud Talk のビデオ品質改善状況（Jitsi 統合との比較）
- 日本の中小企業での Nextcloud 採用における最大の障壁（UI? 運用? パフォーマンス?）

## Evidence sources

- https://nextcloud.com/
- https://github.com/nextcloud/server

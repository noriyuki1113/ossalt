---
type: saas
slug: dropbox
name: Dropbox
category: file-storage
status: active
priority: high
pain_points:
  - monthly-cost
  - storage-limits
  - vendor-lock-in
  - data-ownership
  - privacy-concerns
decision_axes:
  - storage-capacity
  - sync-performance
  - self-host-difficulty
  - collaboration-features
  - mobile-support
  - ops-burden
  - japanese-doc-availability
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
related_tools:
  - nextcloud
  - seafile
related_category_pages:
  - wiki/categories/file-storage.md
related_comparison_pages:
  - wiki/comparisons/dropbox-vs-nextcloud.md
  - wiki/comparisons/dropbox-vs-seafile.md
---

# Dropbox

## Summary

Dropbox はファイル同期・共有の元祖 SaaS。2TB 制限・高い月額・データ所有権の懸念を動機に、Nextcloud / Seafile などのセルフホストファイルストレージへの移行を検討するユーザーが多い。ossalt では **コスト削減・データ所有権** を主な動機として、Nextcloud / Seafile との比較起点として扱う。

## Why it matters for ossalt

ファイルストレージのセルフホストは「メール」に比べてリスクが低く、多くの中小企業に現実的な選択肢として提示できる。Nextcloud は「ファイル同期以上」のプラットフォームとして進化しており、ファイル・カレンダー・連絡先・ビデオ通話まで統合する。「Google Workspace からの一部代替」として Nextcloud を提示できる。

## How Dropbox is positioned

Dropbox は「ファイル同期 + チームコラボレーション」へとポジションを拡大しており、Dropbox Paper（ドキュメント編集）・Dropbox Dash（AI ファイル検索）・Dropbox Sign（電子署名）を統合。AI ファイル管理プラットフォームとしての差別化を進めている。

## Why users look for alternatives

- **コスト**: Plus $11.99/人/月〜、Business $18/人/月〜。3 人チームで月 $54〜
- **ストレージ制限**: 無料 2GB は実用的でなく、有料プランも容量単価が高い
- **データ所有権**: ファイルデータが Dropbox のクラウドに保管されることへの懸念
- **プライバシー**: 米国クラウドサービスへのデータ保管に対する懸念（GDPR）
- **競合の無料提供**: Google Drive（15GB 無料）・OneDrive（Microsoft 365 付属）との比較で割高感がある

## What ossalt should help users decide

1. Nextcloud のフル機能（ファイル + カレンダー + ビデオ通話）が必要か、ファイル同期だけなら Seafile か
2. セルフホストのストレージコスト（VPS + ディスク）が Dropbox より安くなるか
3. モバイルアプリの使いやすさがセルフホストで維持できるか

## Core decision axes

### 1. Storage capacity vs cost

Nextcloud / Seafile はサーバーのディスク容量がそのままストレージ容量になる。1TB の VPS + ストレージで月 $10〜30 という構成が多く、Dropbox Plus（$11.99/月・2TB）と同程度かそれ以下のコストで大容量を実現できる。

### 2. Collaboration features

Nextcloud はファイル共有・コメント・バージョン管理・共同編集（ONLYOFFICE / Collabora Online 統合）まで対応。Dropbox のコラボ機能に近い。Seafile はファイル同期・共有に特化しており、コラボ機能は限定的。

### 3. Self-host difficulty

Nextcloud はオールインワンの Docker イメージが提供されており、セットアップ自体は難しくない。ただしファイルサーバーはディスク管理・バックアップ戦略が重要で、「データが消えたら終わり」というリスク管理が必要。

## Candidate families

### Nextcloud
ファイル同期に加え、カレンダー・連絡先・ビデオ通話・ドキュメント編集まで統合した「OSS コラボレーションプラットフォーム」。AGPL-3.0。GitHub スター 2.6 万超。

### Seafile
ファイル同期の速度・信頼性に特化した OSS。クライアントライブラリと delta sync（差分同期）が高速。GPL-2.0（コミュニティ版）。

## Suggested related wiki pages

- `wiki/tools/nextcloud.md`
- `wiki/tools/seafile.md`
- `wiki/comparisons/dropbox-vs-nextcloud.md`
- `wiki/comparisons/dropbox-vs-seafile.md`
- `wiki/categories/file-storage.md`

## Open questions

- Nextcloud のパフォーマンス（ファイル同期速度）が Dropbox と比較してどれだけ差があるか
- Nextcloud Hub（オフィス統合）と Google Workspace の比較
- 日本企業での Nextcloud 採用事例の収集
- Seafile の日本語コミュニティの活発度

## Evidence sources

- https://www.dropbox.com/plans
- https://nextcloud.com/
- https://www.seafile.com/

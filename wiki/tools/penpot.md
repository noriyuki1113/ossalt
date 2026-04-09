---
type: tool
slug: penpot
name: Penpot
category: ui-design
github: https://github.com/penpot/penpot
stars: "35k"
stars_num: 35000
language: Clojure / ClojureScript
last_commit: 2026-04-06
license: MPL-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - figma
related_tools:
  - inkscape
---

# Penpot

## 一言定義

Figma の OSS 代替。ブラウザベースの UI デザイン・プロトタイプツール。SVG ネイティブでセルフホスト可能。

## 主な機能

- ベクターデザイン編集（ペンツール・ブーリアン演算）
- コンポーネント・デザインシステム管理
- プロトタイプ（画面遷移・インタラクション）
- リアルタイム共同編集・コメント
- Figma ファイルインポート（.fig）
- 開発者向けコード参照（CSS / SVG）
- デスクトップアプリ（Electron）

## Positioning

Figma の直接代替を目指す OSS プロジェクト。Taiga.io を開発した Kaleidos 社がスペインで開発。SVG を第一フォーマットとして採用しており、データのポータビリティが高い。Inkscape と比べると「チームデザイン・プロトタイプ」に特化しており、共同編集が前提の設計になっている。 [Source](https://penpot.app/)

## 強み

- SVG ネイティブのため、デザインデータを開かれた形式で保持できる
- Figma ファイルのインポートに対応（精度は部分的）
- セルフホスト版でも共同編集・プロトタイプ機能が使える
- MPL-2.0 ライセンスで商用利用可能

## 弱み・注意点

- Figma に比べてプラグインエコシステムがまだ小さい
- Auto-layout（Figma）相当の機能は実装途上
- Clojure 製のため、トラブル時のデバッグが難しい
- 大きなファイルでのパフォーマンスが Figma より劣る場合がある

## どんなユーザーに向くか

- **Figma からの脱出を検討しているデザインチーム：** セルフホストでデータを手元に置きたい場合
- **スタートアップ・小規模チーム：** Figma のコストを抑えつつ共同編集が必要な場合
- **OSS プロダクト開発チーム：** ツールスタックをすべてオープンにしたい場合

## セルフホスト難易度

**難易度：** 低〜中

Docker Compose での構成が公式に提供されており、比較的容易に立ち上げられる。ただし SMTP・ストレージ（S3互換）の設定が必要で、完全な本番運用には若干の手間がかかる。

```bash
git clone https://github.com/penpot/penpot
cd penpot/docker/images
cp config.env.example config.env
docker compose -p penpot -f docker-compose.yaml up -d
```

詳細は [公式セルフホストガイド](https://help.penpot.app/technical-guide/getting-started/) を参照。

## 日本語圏での採用状況

日本での認知度はまだ低く、Figma 代替として Penpot を選んでいるチームの情報は少ない。デザイナーコミュニティ（Figma Japan 等）では話題になることがあるが、実導入事例はほぼ見当たらない。日本語ドキュメントはほぼ存在せず、ossalt の編集価値が高い。

## ossaltにおける推奨文脈

`wiki/saas/figma.md` から「チームでの共同デザインをセルフホストで行いたい」ユーザーへの第一候補として紹介する。個人・印刷用途なら Inkscape、チームのプロトタイプ・デザインシステムが必要なら Penpot という分岐を明示する。

## Open questions

- Figma → Penpot インポートの精度は 2026 年時点で実用レベルか（デザインシステム含む）
- Auto-layout 相当機能の実装状況
- 日本のデザイン会社・フリーランスデザイナーでの採用率

## Evidence sources

- https://penpot.app/
- https://github.com/penpot/penpot
- https://help.penpot.app/technical-guide/getting-started/
- https://ossalt.jp/alternatives/figma

---
type: tool
slug: affine
name: AFFiNE
category: workspace
github: https://github.com/toeverything/AFFiNE
stars: "49k"
stars_num: 49000
language: TypeScript
last_commit: 2026-04-06
license: MIT
self_hostable: true
local_first: true
ossalt_listed: true
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
replaces:
  - notion
related_tools:
  - appflowy
  - anytype
  - outline
---

# AFFiNE

## 一言定義

ドキュメント・ホワイトボード・データベースを統合した OSS「KnowledgeOS」。Notion ＋ Miro の代替を目指す。

## 主な機能

- ブロックエディタ（ドキュメントモード）
- Edgeless キャンバス（ホワイトボード・マインドマップモード）
- データベースビュー（グリッド・カンバン）
- リアルタイム共同編集
- ローカルファースト（オフライン動作）
- セルフホスト（AFFiNE Cloud）
- クロスプラットフォーム（Web・デスクトップ）

## Positioning

AppFlowy が「Notion に近いワークスペース」を目指すのに対し、AFFiNE は「ドキュメントとホワイトボードを同一空間で使う」という独自のコンセプトを持つ。Edgeless キャンバスで同じページをドキュメントモードとホワイトボードモードで切り替えられる点が差別化ポイント。Notion + Miro の用途を一つのツールで代替したいユーザーに向く。 [Source](https://affine.pro/)

## 強み

- ドキュメントとホワイトボードを同一ページで切り替えられる独自機能
- MIT ライセンスで商用利用制限なし
- ローカルファースト設計でオフライン動作可能
- TypeScript 製で stars 4.9 万の活発なコミュニティ

## 弱み・注意点

- まだ開発途上で、機能の完成度にばらつきがある（2026年時点）
- データベース機能は Notion・AppFlowy より機能が限定的
- セルフホスト（AFFiNE Cloud）の構成は AppFlowy Cloud 同様に複雑
- Edgeless キャンバスのパフォーマンスが大規模になると不安定になる場合がある

## どんなユーザーに向くか

- **Notion ＋ Miro を使っているチーム：** 2ツールを1つにまとめてコストを削減したい場合
- **視覚的な思考整理が多いチーム：** マインドマップ・ホワイトボードとドキュメントを行き来する作業が多い場合
- **OSS ワークスペースの最前線を試したい：** 機能の完成度より革新性を重視する早期採用者

## セルフホスト難易度

**難易度：** 中

デスクトップアプリはローカルファーストで簡単に使い始められる。チーム同期のためのサーバー（AFFiNE Cloud）のセルフホストは PostgreSQL・Redis が必要。

```bash
# デスクトップアプリ（最小構成）
# https://affine.pro/download からDL

# AFFiNE Cloud のセルフホスト（Docker Compose）
docker compose up -d
```

詳細は [公式セルフホストガイド](https://affine.pro/blog/self-host-affine) を参照。

## 日本語圏での採用状況

日本での認知度は上昇中。Notion 代替として Zenn・Qiita で AFFiNE を取り上げる記事が増えている。ホワイトボード機能に注目した紹介が多いが、本番利用の事例はまだ少ない。日本語 UI は対応しており、英語情報の壁は低め。

## ossaltにおける推奨文脈

`wiki/saas/notion.md` から「ホワイトボード・視覚的整理が必要」なユーザーへの候補として紹介する。「Notion に近い体験」なら AppFlowy、「ホワイトボードも統合したい」なら AFFiNE という分岐を示す。開発途上であることを明記し、本番利用には注意を促す。

## Open questions

- AFFiNE の機能完成度は 2026 年時点でプロダクション利用に耐えるか
- Edgeless キャンバスの大規模コンテンツでのパフォーマンス
- データベース機能（グリッド・カンバン）の Notion との機能差の縮まり具合

## Evidence sources

- https://affine.pro/
- https://github.com/toeverything/AFFiNE
- https://affine.pro/blog/self-host-affine
- https://ossalt.jp/alternatives/notion

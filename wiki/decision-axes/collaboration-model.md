---
type: decision-axis
slug: collaboration-model
name: コラボレーションモデル
last_reviewed: 2026-04-09
confidence: medium
source_count: 4
related_tools:
  - penpot
  - mattermost
  - appflowy
  - affine
related_saas_pages:
  - wiki/saas/figma.md
  - wiki/saas/notion.md
  - wiki/saas/slack.md
---

# コラボレーションモデル

## 一言定義

「複数人が同時・非同期でどう協働するか」を規定する設計思想の軸。リアルタイム共同編集・非同期コメント・ロール管理・スレッド構造などが含まれ、チームの働き方に直結する最重要軸のひとつ。

## なぜ重要か

SaaS からの移行で最も失われやすいのが「当たり前に使っていた共同編集体験」である。Figma の URL 共有リアルタイム編集、Notion のコメント・メンション、Slack のスレッドなど、各 SaaS はコラボレーション体験を中心に設計されており、OSS 代替ではこの軸での差が最も大きくなりやすい。

OSS ツールを選ぶ際に「セルフホストできるか」だけを見て後から「共同編集ができなかった」と気づくケースは多い。移行前にコラボレーションモデルの差異を把握しておくことで、移行後の体験ギャップを最小化できる。

## コラボレーションモデルの分類

### 1. リアルタイム同時編集型
複数ユーザーが同一ドキュメント・キャンバスを同時編集でき、カーソルや変更が即座に全員に反映される。

- **Figma → Penpot**: Penpot はセルフホスト版でもリアルタイム共同編集をサポート。ただし大規模ファイルでのレイテンシはSaaS版Figmaより劣る場合がある
- **Notion → AppFlowy / AFFiNE**: AppFlowy はクラウド版でリアルタイム同期を実装。AFFiNE もリアルタイム共同編集に対応している
- **制約**: リアルタイム同期はサーバーインフラへの依存度が高く、セルフホスト構成での実装コストが大きい

### 2. 非同期コメント・レビュー型
編集はシングルユーザーまたは直列で行われ、コメント・レビュー・承認フローで協働する。

- **Inkscape**: ネイティブの共同編集機能はなく、ファイル共有 + コメントツールとの組み合わせが必要
- **Vikunja**: タスクへのコメント・担当者アサインが中心で、リアルタイム性は低い
- **Plane**: イシュー・サイクルへのコメント・メンション機能あり

### 3. スレッド・非同期チャット型
Slack/Mattermost のようなスレッド構造で非同期コミュニケーションを行うモデル。

- **Slack → Mattermost/Rocket.Chat/Zulip**: 各ツールでスレッド機能の実装が異なる。Zulip はスレッドファーストの設計で非同期に最適化
- **非同期重視の文化**: リモートワーク・非同期チームでは Zulip 型が有効

## この軸で差が出るツール群

| ツール | リアルタイム同時編集 | 非同期コメント | マルチユーザー管理 |
|---|---|---|---|
| Penpot | ◎ | ◎ | ◎ |
| AppFlowy（クラウド） | ◎ | ◎ | ○ |
| AFFiNE | ◎ | ○ | ○ |
| Mattermost | — | ◎（スレッド） | ◎ |
| Zulip | — | ◎（スレッドファースト） | ◎ |
| Inkscape | ✗ | ✗ | ✗ |
| Vikunja | ✗ | ○ | ○ |
| Outline | △（同時表示のみ） | ◎ | ◎ |

## ossalt での使い方

コラボレーションモデルは移行判断の「フィルタ軸」として使う。具体的には：

1. **リアルタイム共同編集が必須か確認**: Figma → Penpot 移行の文脈では最重要。不要なら Inkscape で十分な場合も多い
2. **チームの人数・働き方を確認**: 1〜3人ならシングルユーザー向けツールで十分。5人以上なら共同編集機能の有無が移行可否を左右する
3. **セルフホスト版でも機能するか確認**: 一部ツールはクラウド版のみでリアルタイム編集をサポートし、セルフホスト版では制限される

## 関連ページ

- `wiki/saas/figma.md` — コラボレーションモデルが最も重要な比較軸になる SaaS
- `wiki/saas/notion.md` — コメント・メンション・リアルタイム編集の代替検討
- `wiki/tools/penpot.md` — リアルタイム共同編集をサポートする Figma 代替
- `wiki/tools/affine.md` — ドキュメント＋ホワイトボードの共同編集
- `wiki/comparisons/figma-vs-penpot.md`
- `wiki/decision-axes/self-host-difficulty.md` — セルフホストとリアルタイム同期の難易度は連動する

## Evidence sources

- https://penpot.app/
- https://appflowy.com/
- https://affine.pro/
- https://ossalt.jp/alternatives/figma

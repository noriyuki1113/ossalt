---
type: synthesis
slug: oss-workspace-landscape-2026
name: OSSワークスペース全体俯瞰 2026
last_reviewed: 2026-04-09
confidence: medium
source_count: 14
related_categories:
  - wiki/categories/workspace.md
  - wiki/categories/team-communication.md
  - wiki/categories/project-management.md
  - wiki/categories/no-code-database.md
  - wiki/categories/knowledge-management.md
  - wiki/categories/ui-design.md
  - wiki/categories/task-management.md
---

# OSS ワークスペース全体俯瞰 2026

## このページの目的

日本のチーム・スタートアップが「SaaS から OSS へ」移行を検討する際の全体地図を提供する。個別ツールの比較ではなく、「OSS ワークスペースエコシステム全体として何ができて、何がまだ難しいのか」を整理する。

---

## 1. 全体マップ：SaaS → OSS 対応表

| SaaS | 主な OSS 代替 | 代替完成度 | 主な課題 |
|---|---|---|---|
| **Notion** | AppFlowy, AFFiNE, Anytype, Outline | ★★★☆ | データベース機能のギャップ、移行ツール不足 |
| **Slack** | Mattermost, Rocket.Chat, Zulip | ★★★★ | 外部連携数、エンタープライズ統合 |
| **Figma** | Penpot, Inkscape | ★★★☆ | .fig 変換精度、プロトタイプ機能 |
| **Jira** | Plane, GitLab Issues | ★★★☆ | 権限管理の複雑さ、大規模チーム対応 |
| **Asana** | Vikunja, AppFlowy | ★★★☆ | 非エンジニア向け UI、承認フロー |
| **Airtable** | NocoDB, Baserow, Teable | ★★★★ | 自動化・API 連携の成熟度 |

凡例: ★★★★ = ほぼ代替可能、★★★☆ = 主要機能は代替可能・一部ギャップあり、★★☆☆ = 部分的な代替

---

## 2. 2026 年の潮流：なぜ今 OSS か

### 2.1 SaaS コスト圧力

2023〜2025 年にかけて主要 SaaS（Notion・Figma・Slack 等）は相次いで価格改定・プラン再編を行い、チームサイズ拡大に伴うコスト増が顕在化した。「無料プランから有料移行を迫られた」「1人増えるたびに月額が上がる」という不満が、OSS 代替への関心を押し上げた主要因のひとつ。

### 2.2 データ主権・ロックイン懸念

Adobe による Figma 買収計画（後に破談）は、「SaaS がいつ方針変更するかわからない」というリスクを可視化した。規制強化・個人情報保護要件の厳格化も相まって、「データを自社で管理したい」というニーズが高まっている。

### 2.3 OSS 品質の向上

AppFlowy・Penpot・Plane など、2020 年代前半に登場した新世代 OSS は、従来の OSS と比較してはるかに高い UI 品質・機能完成度を持つ。「OSS = 玄人向け・使いにくい」という先入観が崩れつつある。

---

## 3. カテゴリ別現状評価

### 3.1 チームコミュニケーション（代替成熟度: 高）

**Mattermost・Rocket.Chat・Zulip** は実績のある成熟した OSS チャットプラットフォームで、エンタープライズ利用にも対応する。Slack のすべての機能を再現するわけではないが、チャット・スレッド・通知・ファイル共有の基本機能は十分。

**ossalt 推奨**: Mattermost（Slack ライク・移行容易）、Zulip（非同期特化チーム向け）

### 3.2 ノーコードデータベース（代替成熟度: 高）

**NocoDB・Baserow・Teable** は Airtable の主要ユースケース（スプレッドシート UI・ビュー・フォーム）をほぼカバーする。NocoDB は既存 DB への接続、Baserow はゼロからの構築、Teable は大量データ処理で差別化している。

**ossalt 推奨**: Baserow（Airtable ライクで非エンジニア向け）、NocoDB（既存 DB 活用）

### 3.3 プロジェクト管理（代替成熟度: 中〜高）

**Plane** は Jira の代替として急速に成熟しており、スプリント・バックログ・ロードマップを OSS で実現する。ただし Jira の複雑な権限管理・カスタムワークフローの完全再現は難しい。**GitLab CE** はコードと Issue を統合するチームへの自然な選択肢。

**ossalt 推奨**: Plane（Jira 機能の代替）、GitLab CE（コード連携重視）

### 3.4 ワークスペース・ドキュメント（代替成熟度: 中）

**AppFlowy** が最も広いユースケースをカバーするが、Notion の完全な機能再現にはまだギャップがある。**Outline** は Wiki 特化で高品質。**AFFiNE** はホワイトボード統合が独自の強みだが成熟途上。**Anytype** はプライバシー重視だが ASAL ライセンスに注意。

**ossalt 推奨**: AppFlowy（汎用代替）、Outline（Wiki 特化）、AFFiNE（ホワイトボード必要時）

### 3.5 UI デザイン（代替成熟度: 中）

**Penpot** は Figma の唯一の現実的な OSS 代替で、セルフホスト・共同編集・プロトタイプを提供する。ただし `.fig` ファイルのインポート精度や大規模ファイルのパフォーマンスにまだ課題がある。**Inkscape** はベクター編集専用として確立した地位を持つ。

**ossalt 推奨**: Penpot（チームデザイン）、Inkscape（個人・印刷用途）

---

## 4. セルフホスト難易度の全体傾向

```
低難度（Docker 1コマンド）
  Vikunja, NocoDB, Baserow

中難度（Docker Compose 複数サービス）
  Mattermost, Outline, Plane, Teable, Penpot

高難度（複雑な構成・高リソース）
  GitLab CE, Rocket.Chat, AppFlowy（チームサーバー）, AFFiNE
```

小規模チーム（〜10人）には低〜中難度のツールを優先推奨する。高難度ツールは DevOps 担当が在籍する組織向け。

---

## 5. 日本語圏での OSS 移行の現実

### 追い風
- SaaS の価格改定による移行検討の増加
- Docker・セルフホストの知識の普及
- 国産エンジニアコミュニティによる OSS 解説記事の増加

### 逆風
- 主要 OSS の日本語ドキュメント不足（Plane・Penpot・AFFiNE）
- 非エンジニアへの普及の難しさ（習得コスト）
- 移行ツール（SaaS → OSS のデータ移行支援）の未成熟
- 「OSS = サポートがない = 怖い」という組織文化

### ossalt の役割

上記の「逆風」を一つひとつ解消するのが ossalt の存在意義。日本語の文脈で「このツールはこのチームには向かない」「移行コストはこれくらいかかる」を正直に伝えることで、失敗の少ない OSS 移行を支援する。

---

## 6. まとめ：今すぐ始めやすい移行パス

| 現在使っているSaaS | 今すぐ試せるOSS | 移行容易度 |
|---|---|---|
| Airtable | Baserow | ★★★★ |
| Slack | Mattermost | ★★★★ |
| Jira（小規模） | Plane | ★★★☆ |
| Asana | Vikunja | ★★★☆ |
| Notion（Wiki用途） | Outline | ★★★☆ |
| Notion（全用途） | AppFlowy | ★★☆☆ |
| Figma（チーム） | Penpot | ★★★☆ |
| GitHub Issues（拡張） | GitLab CE | ★★★☆ |

---

## 関連ページ

- `wiki/categories/workspace.md`
- `wiki/categories/team-communication.md`
- `wiki/categories/project-management.md`
- `wiki/categories/no-code-database.md`
- `wiki/synthesis/saas-to-oss-cost-guide.md`
- `wiki/decision-axes/self-host-difficulty.md`
- `wiki/decision-axes/migration-friction.md`

## Evidence sources

各ツールの wiki/tools/ ページを参照。本ページは ossalt wiki 全体の横断分析として作成。

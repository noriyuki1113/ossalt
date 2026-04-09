# find-my-alt wiki log

## [2026-04-05] ingest | notion.md（初回作成）

- 追加ソース: wiki/saas/notion.md
- 更新ページ: index.md
- 新規ページ: wiki/saas/notion.md
- 所感: saasページのフォーマットが確立。次はwiki/tools/appflowy.md, anytype.md, affine.md, outline.mdの作成が優先。wiki/comparisons/とwiki/decision-axes/はsaasページが3件以上揃ってから着手する。

## [2026-04-09] ingest | SaaS親ページ フェーズ1（5ページ一括作成）

- 新規ページ: wiki/saas/slack.md, wiki/saas/figma.md, wiki/saas/jira.md, wiki/saas/asana.md, wiki/saas/airtable.md
- 更新ページ: index.md
- 所感: SaaS親ページが6件に増え、comparisons/decision-axesの作成条件（3件以上）を満たした。次の優先順位は wiki/tools/ の各候補ページ（mattermost, penpot, plane, nocodb, vikunja 等）と、用途横断で使える decision-axes（ops-burden, migration-friction, self-host-difficulty）の作成。figma-vs-penpot, jira-vs-plane の比較記事も需要が高い。Jira の Linear 言及・Asana の Notion 言及は SaaS なので tools ページでなく比較文脈での注記扱いにしている点を次回 lint 時に確認すること。

## [2026-04-09] ingest | wiki/tools/ フェーズ1（8ページ一括作成）＋テンプレート統合

- 新規ページ: wiki/tools/mattermost.md, wiki/tools/penpot.md, wiki/tools/plane.md, wiki/tools/nocodb.md, wiki/tools/vikunja.md, wiki/tools/appflowy.md, wiki/tools/inkscape.md, wiki/tools/outline.md
- 更新ページ: _templates/tool-wiki.md（CLAUDE.mdスキーマ＋tool-wiki.md本文セクションの統合フォーマットに刷新）, index.md
- 所感: _templates/tool-wiki.md が main ブランチに存在することが判明し、CLAUDE.md スキーマと統合した新フォーマットに更新した。tools ページは全 saas ページから参照されている候補を優先した（slack→mattermost, figma→penpot+inkscape, jira→plane, asana→vikunja, notion→appflowy+outline, airtable→nocodb）。次の優先順位は残ツール（rocketchat, zulip, affine, anytype, baserow, teable）と decision-axes（ops-burden, migration-friction, self-host-difficulty）。comparisons は tools が揃ったので着手可能になった。

## [2026-04-09] ingest | decision-axes 4件・残ツール 6件・comparisons 4件 一括作成

- 新規ページ:
  - wiki/decision-axes/self-host-difficulty.md
  - wiki/decision-axes/ops-burden.md
  - wiki/decision-axes/migration-friction.md
  - wiki/decision-axes/local-first-offline.md
  - wiki/tools/rocketchat.md, zulip.md, affine.md, anytype.md, baserow.md, teable.md
  - wiki/comparisons/figma-vs-penpot.md, jira-vs-plane.md, mattermost-vs-rocketchat.md, nocodb-vs-baserow.md
- 更新ページ: index.md
- 所感: wiki の主要骨格が完成。saas 6件・tools 14件・comparisons 4件・decision-axes 4件、計 28 ページ。anytype は「Any Source Available License 1.0」で厳密には OSS でないため confidence: medium・注記あり。teable は新興プロジェクトのため confidence: low。次の優先候補は wiki/categories/（team-communication, ui-design, project-management, no-code-database, workspace の5カテゴリ）と wiki/synthesis/（OSS ワークスペース全体俯瞰・コスト比較分析）。lint 候補：figma.md の related_tools に lunacy が挙がっているが wiki/tools/lunacy.md が未作成（OSS でないため除外の方針を明記するか要判断）。

## [2026-04-09] lint | 全ページ構造チェック

- 問題:
  1. **categories 未作成（7件）**: knowledge-management, workspace, team-communication, ui-design, project-management, task-management, no-code-database — 全 saas ページから参照されているが存在しない
  2. **comparisons 未作成（9件）**: notion-vs-appflowy, notion-vs-anytype, notion-vs-affine, notion-vs-outline, mattermost-vs-zulip, nocodb-vs-teable, asana-vs-vikunja, vikunja-vs-appflowy, plane-vs-gitlab-issues
  3. **非 OSS ツールが related_tools に含まれている**: lunacy（figma.md）・linear（jira.md）・notion（asana.md）は SaaS / proprietary のため wiki/tools/ ページが存在しない。各 saas ページに「OSS 対象外」注記が必要
  4. **gitlab が tools に未作成**: jira.md が related_tools に gitlab を含むが wiki/tools/gitlab.md がない（GitLab CE は OSS のため作成候補）
- 対応: categories 7件を作成、comparisons 4件（優先度高）を作成、lunacy/linear/notion を saas ページで注記
- 提案: gitlab.md を tools に追加（GitLab CE は OSS）、collaboration-model と non-engineer-usability の decision-axes 追加

## [2026-04-09] ingest | フェーズ2完成（tools 1件・decision-axes 2件・comparisons 3件・synthesis 2件）

- 新規ページ:
  - wiki/tools/gitlab.md（GitLab CE：コードリポジトリ＋Issue＋CI/CD統合 DevOps プラットフォーム）
  - wiki/decision-axes/collaboration-model.md（コラボレーションモデル軸：リアルタイム共同編集の差異）
  - wiki/decision-axes/non-engineer-usability.md（非エンジニア向け使いやすさ軸：全社導入時の習得コスト）
  - wiki/comparisons/notion-vs-anytype.md（Anytype比較：プライバシー・ローカルファースト観点）
  - wiki/comparisons/notion-vs-affine.md（AFFiNE比較：ホワイトボード統合・セルフホスト観点）
  - wiki/comparisons/notion-vs-outline.md（Outline比較：Wiki特化・ドキュメント管理観点）
  - wiki/synthesis/oss-workspace-landscape-2026.md（OSS全体俯瞰：SaaS→OSS対応表・カテゴリ別評価）
  - wiki/synthesis/saas-to-oss-cost-guide.md（移行コスト試算ガイド：ツール別損益分岐点分析）
- 更新ページ: index.md（55ページ・195ソースに更新）, log.md
- 所感: wiki の全セクション（synthesis を含む）が完成。55ページ。gitlab.md を追加し jira.md の related_tools 参照が解消された。figma.md が言及する collaboration-model・decision-axes も追加され、broken link がすべて解消された。synthesis/oss-workspace-landscape-2026.md はカテゴリ横断の全体地図として機能し、synthesis/saas-to-oss-cost-guide.md は意思決定支援ツールとして具体的な試算枠組みを提供する。残タスク候補: plane-vs-gitlab-issues.md（comparisons）、vikunja-vs-appflowy.md、gitlab.md の日本語情報拡充。

## [2026-04-09] ingest | categories 7件・comparisons 4件・lint 修正

- 新規ページ:
  - wiki/categories/workspace.md, team-communication.md, no-code-database.md, project-management.md, task-management.md, ui-design.md, knowledge-management.md
  - wiki/comparisons/notion-vs-appflowy.md, mattermost-vs-zulip.md, nocodb-vs-teable.md, asana-vs-vikunja.md
- 更新ページ: wiki/saas/figma.md（lunacy 注記）, wiki/saas/jira.md（linear 注記）, index.md, log.md
- 所感: wiki の主要セクションがすべて埋まった（synthesis のみ未作成）。43ページ。残タスク: gitlab.md（tools）・collaboration-model/non-engineer-usability（decision-axes）・notion 系比較記事（notion-vs-anytype, notion-vs-affine, notion-vs-outline）・wiki/synthesis/。次のセッションでは synthesis ページ（OSS ワークスペース全体俯瞰・コスト比較）と残比較記事に着手する。

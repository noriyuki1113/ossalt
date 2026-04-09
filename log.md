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

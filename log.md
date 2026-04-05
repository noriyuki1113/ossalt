# find-my-alt wiki log

## [2026-04-05] ingest | Slack・Figmaカテゴリ追加（saas×2 / tools×4 / comparisons×4 / categories×2）

- 追加ソース: なし（既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/saas/slack.md, wiki/saas/figma.md, wiki/tools/mattermost.md, wiki/tools/rocketchat.md, wiki/tools/zulip.md, wiki/tools/penpot.md, wiki/comparisons/slack-vs-mattermost.md, slack-vs-rocketchat.md, slack-vs-zulip.md, figma-vs-penpot.md, wiki/categories/team-communication.md, design-tools.md
- 所感: Slackカテゴリは「Mattermost（近似移行）/ Rocket.Chat（オムニチャンネル）/ Zulip（非同期特化）」の3分岐が明確。Figmaカテゴリは Penpot が唯一の本格候補でありシンプルな比較構造。Variables / Auto Layout のギャップが Figma→Penpot移行の最大障壁。次の優先候補：GitHub代替（Gitea/Forgejo）、パスワード管理（Bitwarden）、プロジェクト管理（Plane/Jira代替）。

## [2026-04-05] ingest | decision-axes×3 + categories×1作成

- 追加ソース: なし（既存 wiki ページ・既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/decision-axes/local-first-offline.md, collaboration-model.md, migration-friction.md, wiki/categories/knowledge-management.md
- 所感: notion.mdのsuggested related pagesがすべて揃った。local-first-offlineはグラデーション（完全ローカル→クラウド専用）の整理が有効。migration-frictionは「移行摩擦チェックリスト」をossalt.jpのUXに活用できる素材。次はraw/へのソース追加によるconfidence向上が優先。AppFlowy・AFFiNEのGitHubデータをingestすると星成長率の評価精度が上がる。

## [2026-04-05] ingest | comparisons×4作成（notion-vs-appflowy/anytype/affine/outline）

- 追加ソース: なし（既存 wiki ページ・既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/comparisons/notion-vs-appflowy.md, notion-vs-anytype.md, notion-vs-affine.md, notion-vs-outline.md
- 所感: 4 比較記事を作成し、notion.md の suggested related pages がすべて比較記事レベルまで揃った。各記事で「DB 機能への依存度チェック」を移行判断の最重要軸として共通化した。次の優先は wiki/decision-axes/（local-first-offline / collaboration-model / migration-friction）と wiki/categories/knowledge-management.md。

## [2026-04-05] ingest | tools×3作成（anytype / outline / affine）

- 追加ソース: なし（notion.mdの言及・既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/tools/anytype.md, wiki/tools/outline.md, wiki/tools/affine.md
- 所感: notion.mdのrelated_toolsに挙がっていた4ツールのエンティティページが揃った。anytypeはライセンス（Any Source Available License）の複雑さとオブジェクトモデルの学習コストが日本語圏での普及障壁になっていると推定。outlineはBSL 1.1ライセンスと「DB機能なし」の制約を明記することで推薦文脈を明確化。affineはMIT×ホワイトボード統合が差別化だが成熟度の懸念を注記。次の優先はwiki/comparisons/notion-vs-appflowy.mdとwiki/categories/knowledge-management.md。

## [2026-04-05] ingest | appflowy.md（新規作成）

- 追加ソース: なし（notion.mdの言及・既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/tools/appflowy.md
- 所感: notion.mdで言及されていたAppFlowyのエンティティページを作成。オフライン・セルフホスト・AI機能の3軸が差別化ポイント。DB機能の成熟度と日本語圏での実導入事例が未確認のためconfidence: medium。次はanytype.md・affine.md・outline.mdの作成が優先。AppFlowyのGitHub raw情報（スター推移・リリースノート）をingestすると精度が上がる。

## [2026-04-05] ingest | notion.md（初回作成）

- 追加ソース: wiki/saas/notion.md
- 更新ページ: index.md
- 新規ページ: wiki/saas/notion.md
- 所感: saasページのフォーマットが確立。次はwiki/tools/appflowy.md, anytype.md, affine.md, outline.mdの作成が優先。wiki/comparisons/とwiki/decision-axes/はsaasページが3件以上揃ってから着手する。

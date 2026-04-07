# find-my-alt wiki log

## [2026-04-07] ingest | ビデオ会議・CRM・カスタマーサポートカテゴリ追加（saas×3 / tools×6 / comparisons×6 / categories×3）

- 追加ソース: なし（既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/saas/zoom.md, hubspot.md, zendesk.md, wiki/tools/jitsi.md, bigbluebutton.md, twenty.md, suitecrm.md, chatwoot.md, zammad.md, wiki/comparisons/zoom-vs-jitsi.md, zoom-vs-bigbluebutton.md, hubspot-vs-twenty.md, hubspot-vs-suitecrm.md, zendesk-vs-chatwoot.md, zendesk-vs-zammad.md, wiki/categories/video-conferencing.md, crm.md, customer-support.md
- 所感: ビデオ会議は「外部との会議が多い」日本の商習慣から完全移行が難しく、社内限定 + Jitsi のハイブリッド運用が現実的。LINE 対応欠如が日本市場でのカスタマーサポート OSS 採用の最大障壁。CRM は Twenty（モダン・軽量）と SuiteCRM（フル機能）の二段構えで HubSpot の異なる需要層に対応できる。次の優先候補：メール（Mailcow/Mailu）、モニタリング（Grafana/Prometheus）、コンテナ管理（Portainer/Coolify）。

## [2026-04-07] ingest | プロジェクト管理・BIカテゴリ追加（saas×2 / tools×5 / comparisons×4 / categories×2）

- 追加ソース: なし（既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/saas/jira.md, wiki/saas/tableau.md, wiki/tools/plane.md, wiki/tools/taiga.md, wiki/tools/metabase.md, wiki/tools/superset.md, wiki/tools/redash.md, wiki/comparisons/jira-vs-plane.md, jira-vs-taiga.md, tableau-vs-metabase.md, tableau-vs-superset.md, wiki/categories/project-management.md, bi-analytics.md
- 所感: BI カテゴリは「Tableau でできることの80%をMetabaseで無料実現する」という訴求が最も成立しやすいカテゴリ。Metabase（AGPL）vs Superset（Apache-2.0）のライセンス差がSaaS組み込み文脈での重要な選択軸になる。Redashは開発ペース低下が懸念で新規採用推薦は限定的。プロジェクト管理はPlaneが急成長中でJira代替の筆頭。Jira Server廃止（2024年）がOSS移行の構造的な追い風になっている。次の優先候補：メール（Mailcow/Mailu）、動画会議（Jitsi Meet/BigBlueButton）、CRM（Twenty/SuiteCRM）。

## [2026-04-07] ingest | パスワード管理・コードホスティングカテゴリ追加（saas×2 / tools×5 / comparisons×4 / categories×2）

- 追加ソース: なし（既存知識をベースに作成）
- 更新ページ: index.md
- 新規ページ: wiki/saas/1password.md, wiki/saas/github.md, wiki/tools/bitwarden.md, wiki/tools/vaultwarden.md, wiki/tools/gitea.md, wiki/tools/forgejo.md, wiki/tools/gitlab.md, wiki/comparisons/1password-vs-bitwarden.md, github-vs-gitea.md, github-vs-forgejo.md, github-vs-gitlab.md, wiki/categories/password-management.md, code-hosting.md
- 所感: パスワード管理は「移行摩擦最小カテゴリ」として訴求しやすい。Vaultwardenのスター4.1万は異常値で、セルフホスト需要の大きさを示している。コードホスティングはGitea Actions互換性とGitLab CEの運用負荷が判断の核。次の優先候補：プロジェクト管理（Plane/Jira代替）、BI分析（Metabase/Superset）、メール（Mailcow）。

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

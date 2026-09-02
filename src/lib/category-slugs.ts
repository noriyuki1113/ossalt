/**
 * Canonical mapping between the actual `parent_category_ja` values stored in
 * the DB (long form, e.g. "AI・機械学習") and the clean URL slugs used in
 * routes like /category/:slug. This must be kept in sync with the DB —
 * verified against the live `tools` table (see git history for context).
 */
export const CATEGORY_JA_TO_SLUG: Record<string, string> = {
  "AI・機械学習": "ai-ml",
  "ビジネスソフトウェア": "business",
  "開発者ツール": "developer-tools",
  "インフラ・運用": "infrastructure",
  "データ・分析": "data-analytics",
  "コンテンツ・パブリッシング": "content",
  "生産性・ユーティリティ": "productivity",
  "セキュリティ・プライバシー": "security",
  "コミュニティ・ソーシャル": "community",
  "その他": "other",
};

export const SLUG_TO_CATEGORY_JA: Record<string, string> = {};
for (const [ja, slug] of Object.entries(CATEGORY_JA_TO_SLUG)) {
  SLUG_TO_CATEGORY_JA[slug] = ja;
}

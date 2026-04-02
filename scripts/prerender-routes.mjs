/**
 * Prerender route definitions for SEO.
 * Each entry generates a static HTML file with correct meta tags.
 * Add new routes here to expand prerender coverage.
 */

const BASE_URL = "https://ossalt.jp";
const SITE_NAME = "OSSアルタナティブ";

// --- Alternatives pages ---
// slug → competitor name
const ALTERNATIVES = {
  notion: "Notion",
  figma: "Figma",
  zapier: "Zapier",
  slack: "Slack",
  firebase: "Firebase",
  airtable: "Airtable",
  trello: "Trello",
  jira: "Jira",
  wordpress: "WordPress",
  shopify: "Shopify",
  "google-analytics": "Google Analytics",
  datadog: "Datadog",
  auth0: "Auth0",
  typeform: "Typeform",
  "github-copilot": "GitHub Copilot",
  tableau: "Tableau",
  contentful: "Contentful",
  launchdarkly: "LaunchDarkly",
  "google-drive": "Google Drive",
  intercom: "Intercom",
  retool: "Retool",
  postman: "Postman",
  webflow: "Webflow",
  evernote: "Evernote",
  chatgpt: "ChatGPT",
  devin: "Devin",
  "stripe-billing": "Stripe Billing",
  pinecone: "Pinecone",
  bitly: "Bitly",
  canny: "Canny",
  zendesk: "Zendesk",
};

/** @returns {{ path: string, title: string, description: string, canonical: string }[]} */
export function getPrerenderRoutes() {
  const routes = [];

  // Alternatives pages
  for (const [slug, name] of Object.entries(ALTERNATIVES)) {
    routes.push({
      path: `/alternatives/${slug}`,
      title: `${name}の代替OSSツール一覧 | ${SITE_NAME}`,
      description: `${name}の代わりに使える無料オープンソースツールを比較。無料・セルフホスト可能なOSS代替を探そう。`,
      canonical: `${BASE_URL}/alternatives/${slug}`,
    });
  }

  // Static pages (already have useSeo, but prerender for initial HTML)
  const staticPages = [
    {
      path: "/",
      title: `${SITE_NAME} - 有料SaaSの代わりに使えるオープンソースツール集`,
      description: "Notion・Slack・Figmaなどの有料SaaSの代替となるオープンソースツールを日本語で検索・比較できるサイトです。無料で使えるOSSを簡単に見つけられます。",
    },
    {
      path: "/ranking",
      title: `OSSツール人気ランキング | ${SITE_NAME}`,
      description: "GitHubスター数で見るOSSツール人気ランキング。AI・開発・生産性など全カテゴリのトップツールを一覧で確認。",
    },
    {
      path: "/news",
      title: `OSSニュース・注目ツール | ${SITE_NAME}`,
      description: "今週の注目OSSツールとGitHubトレンドを毎週更新。人気のオープンソースツールをいち早くチェック。",
    },
    {
      path: "/quiz",
      title: `私に合うOSSを診断 | ${SITE_NAME}`,
      description: "質問に答えるだけであなたに最適なオープンソースツールが見つかる診断ツール。",
    },
    {
      path: "/savings",
      title: `SaaS→OSS コスト削減シミュレーター | ${SITE_NAME}`,
      description: "NotionやSlackなど有料SaaSをOSSに切り替えた場合の年間節約額を無料で計算。",
    },
    {
      path: "/about",
      title: `サイトについて | ${SITE_NAME}`,
      description: "OSSアルタナティブは、有料SaaSの代わりに使えるオープンソースツールを日本語で検索・比較できるディレクトリサイトです。",
    },
    {
      path: "/advertise",
      title: `広告掲載・スポンサー | ${SITE_NAME}`,
      description: "ossalt.jpに広告を掲載して、日本のエンジニアにあなたのOSSプロダクトを届けましょう。",
    },
    {
      path: "/contact",
      title: `お問い合わせ | ${SITE_NAME}`,
      description: "OSSアルタナティブへのお問い合わせはこちらから。掲載内容の誤り報告やツール追加リクエストを受け付けています。",
    },
    {
      path: "/privacy",
      title: `プライバシーポリシー | ${SITE_NAME}`,
      description: "OSSアルタナティブのプライバシーポリシーです。",
    },
    {
      path: "/terms",
      title: `利用規約 | ${SITE_NAME}`,
      description: "OSSアルタナティブの利用規約です。",
    },
    {
      path: "/disclaimer",
      title: `免責事項 | ${SITE_NAME}`,
      description: "OSSアルタナティブの免責事項です。",
    },
  ];

  for (const page of staticPages) {
    routes.push({
      ...page,
      canonical: page.canonical || `${BASE_URL}${page.path === "/" ? "" : page.path}`,
    });
  }

  return routes;
}

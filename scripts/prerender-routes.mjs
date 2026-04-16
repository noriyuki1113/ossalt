/**
 * Prerender route definitions for SEO.
 * Each entry generates a static HTML file with correct meta tags.
 * Add new routes here to expand prerender coverage.
 */

const BASE_URL = "https://ossalt.jp";
const SITE_NAME = "OSSアルタナティブ";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://jwcjmgvitywhsbjkqsui.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

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
  // Added
  linear: "Linear",
  asana: "Asana",
  confluence: "Confluence",
  sentry: "Sentry",
  miro: "Miro",
  mixpanel: "Mixpanel",
  hubspot: "HubSpot",
  clickup: "ClickUp",
  pagerduty: "PagerDuty",
  sendgrid: "SendGrid",
};

/**
 * Slug-specific meta overrides.
 * Use when you want a more specific title/description with concrete tool names
 * or keyword-rich phrases beyond the generic template.
 */
const SLUG_META_OVERRIDES = {
  zapier: {
    title: "Zapierの代替OSSツール5選 | 無料で使えるワークフロー自動化ツール比較",
    description: "Zapierより安く使えるオープンソースの自動化ツールを比較。n8n・Activepiecesなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  notion: {
    title: "Notionの代替OSSツール比較 | 無料・自己ホスト可能なワークスペース",
    description: "Notionより安く使えるオープンソースのワークスペースツールを比較。AppFlowy・AFFiNEなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  slack: {
    title: "Slackの代替OSSツール比較 | 無料で使えるチームチャットツール",
    description: "Slackより安く使えるオープンソースのチャットツールを比較。Mattermost・Rocket.Chatなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  figma: {
    title: "Figmaの代替OSSツール比較 | 無料で使えるUIデザインツール",
    description: "Figmaより安く使えるオープンソースのデザインツールを比較。Penpot・Inkscapeなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  jira: {
    title: "Jiraの代替OSSツール比較 | 無料で使えるプロジェクト管理ツール",
    description: "Jiraより安く使えるオープンソースのプロジェクト管理ツールを比較。Plane・GitLab Issuesなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  airtable: {
    title: "Airtableの代替OSSツール比較 | 無料で使えるノーコードDBツール",
    description: "Airtableより安く使えるオープンソースのデータベースツールを比較。NocoDB・Baserowなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  "google-analytics": {
    title: "Google Analyticsの代替OSSツール比較 | プライバシー重視のアクセス解析",
    description: "Google Analyticsの代替となるオープンソースのアクセス解析ツールを比較。Matomo・Umamiなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  auth0: {
    title: "Auth0の代替OSSツール比較 | 無料で使える認証・IAMツール",
    description: "Auth0より安く使えるオープンソースの認証ツールを比較。Keycloak・Authentikなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  linear: {
    title: "Linearの代替OSSツール比較 | 無料で使えるプロジェクト管理ツール",
    description: "Linearより安く使えるオープンソースのプロジェクト管理ツールを比較。Plane・GitLabなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  asana: {
    title: "Asanaの代替OSSツール比較 | 無料で使えるタスク管理ツール",
    description: "Asanaより安く使えるオープンソースのタスク・プロジェクト管理ツールを比較。Vikunja・Planeなど自己ホスト可能なツールを日本語で紹介。",
  },
  confluence: {
    title: "Confluenceの代替OSSツール比較 | 無料で使えるWikiツール",
    description: "Confluenceより安く使えるオープンソースのWiki・ドキュメント管理ツールを比較。Outline・BookStackなど自己ホスト可能なツールを日本語で紹介。",
  },
  sentry: {
    title: "Sentryの代替OSSツール比較 | 無料で使えるエラー監視ツール",
    description: "Sentryより安く使えるオープンソースのエラー監視ツールを比較。GlitchTip・Glimmer など自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  miro: {
    title: "Miroの代替OSSツール比較 | 無料で使えるオンラインホワイトボード",
    description: "Miroより安く使えるオープンソースのホワイトボードツールを比較。Excalidraw・tldrawなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  mixpanel: {
    title: "Mixpanelの代替OSSツール比較 | 無料で使えるプロダクト分析ツール",
    description: "Mixpanelより安く使えるオープンソースのプロダクト分析ツールを比較。PostHog・Umamiなど自己ホスト可能なツールを日本語で紹介。",
  },
  hubspot: {
    title: "HubSpotの代替OSSツール比較 | 無料で使えるCRM・マーケティングツール",
    description: "HubSpotより安く使えるオープンソースのCRM・マーケティングツールを比較。SuiteCRM・Ersatzなど自己ホスト可能なツールを日本語で紹介。",
  },
  clickup: {
    title: "ClickUpの代替OSSツール比較 | 無料で使えるオールインワン管理ツール",
    description: "ClickUpより安く使えるオープンソースのプロジェクト管理ツールを比較。Plane・Vikunjaなど自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
  pagerduty: {
    title: "PagerDutyの代替OSSツール比較 | 無料で使えるインシデント管理ツール",
    description: "PagerDutyより安く使えるオープンソースのインシデント管理ツールを比較。Grafana OnCall・Keepなど自己ホスト可能なツールを日本語で紹介。",
  },
  sendgrid: {
    title: "SendGridの代替OSSツール比較 | 無料で使えるメール配信ツール",
    description: "SendGridより安く使えるオープンソースのメール配信ツールを比較。Listmonk・Postal など自己ホスト可能なツールを日本語で紹介。無料で使えるものも。",
  },
};

async function fetchTools() {
  if (!SUPABASE_KEY) {
    console.warn("⚠️  SUPABASE_PUBLISHABLE_KEY not set — skipping tool page prerender");
    return [];
  }
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/tools?select=id,name,description_ja,description_en,parent_category_ja,primary_competitor&order=id`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (e) {
    console.warn("⚠️  Failed to fetch tools for prerender:", e.message);
    return [];
  }
}

/** @returns {Promise<{ path: string, title: string, description: string, canonical: string }[]>} */
export async function getPrerenderRoutes() {
  const routes = [];

  // Alternatives pages
  for (const [slug, name] of Object.entries(ALTERNATIVES)) {
    const override = SLUG_META_OVERRIDES[slug];
    routes.push({
      path: `/alternatives/${slug}`,
      title: override?.title ?? `${name}の代替OSSツール比較 | 無料・自己ホスト可`,
      description: override?.description ?? `${name}より安く使えるオープンソース代替ツールを比較。自己ホスト可能なツールや日本語対応含め紹介。ossalt.jpで無料で探せます。`,
      canonical: `${BASE_URL}/alternatives/${slug}`,
    });
  }

  // Category pages
  const CATEGORIES = {
    "ai-ml": { title: "AI・機械学習のOSS代替ツール一覧", desc: "ChatGPT・Copilotなどの有料AIサービスの代替となるオープンソースのAI・機械学習ツールを比較。" },
    "business": { title: "業務ソフトのOSS代替ツール一覧", desc: "Notion・Asana・Jiraなどの有料業務ソフトの代替となるオープンソースツールを比較。" },
    "developer-tools": { title: "開発ツールのOSS代替一覧", desc: "GitHub Copilot・Postmanなどの有料開発ツールの代替となるOSSを比較。" },
    "infrastructure": { title: "インフラ・運用のOSS代替ツール一覧", desc: "Datadog・PagerDutyなどのインフラ監視・運用ツールの代替OSSを比較。" },
    "data-analytics": { title: "データ分析のOSS代替ツール一覧", desc: "Tableau・Google Analyticsなどのデータ分析ツールの代替OSSを比較。" },
    "content": { title: "コンテンツ管理のOSS代替ツール一覧", desc: "WordPress・Contentfulなどの有料CMSの代替となるOSSを比較。" },
    "productivity": { title: "生産性ツールのOSS代替一覧", desc: "Evernote・Zapierなどの生産性ツールの代替OSSを比較。" },
    "security": { title: "セキュリティのOSS代替ツール一覧", desc: "Auth0・Oktaなどの認証・セキュリティツールの代替OSSを比較。" },
    "community": { title: "コミュニティツールのOSS代替一覧", desc: "Slack・Intercomなどのコミュニケーションツールの代替OSSを比較。" },
    "other": { title: "その他のOSS代替ツール一覧", desc: "さまざまなカテゴリの有料SaaSの代替となるOSSを比較。" },
  };

  for (const [slug, meta] of Object.entries(CATEGORIES)) {
    routes.push({
      path: `/category/${slug}`,
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.desc,
      canonical: `${BASE_URL}/category/${slug}`,
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

  // Tool detail pages — fetched from Supabase at build time
  const tools = await fetchTools();
  console.log(`  📦 Fetched ${tools.length} tools from Supabase`);
  for (const tool of tools) {
    const competitor = tool.primary_competitor || "";
    const titleBase = competitor
      ? `${tool.name}は${competitor}の代替？特徴と違いを解説`
      : `${tool.name} — OSSアルタナティブ`;
    const rawDesc = competitor
      ? `${tool.name}は${competitor}の代替OSSです。${tool.description_ja || tool.description_en || ""}。無料・セルフホスト可能。`
      : tool.description_ja || tool.description_en || `${tool.name}の詳細情報。ossalt.jpで無料で探せます。`;
    routes.push({
      path: `/tools/${tool.id}`,
      title: `${titleBase} | OSSアルタナティブ`,
      description: rawDesc.slice(0, 160),
      canonical: `${BASE_URL}/tools/${tool.id}`,
    });
  }

  return routes;
}

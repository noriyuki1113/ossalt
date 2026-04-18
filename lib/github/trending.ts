import type { GitHubRepo, GitHubTrendingItem, RawToolData } from "../../types/automation";
import { searchRepos } from "./api";

// Relevant OSS categories to filter for
const OSS_TOPICS = [
  "self-hosted",
  "selfhosted",
  "open-source",
  "saas-alternative",
  "productivity",
  "devtools",
  "developer-tools",
  "monitoring",
  "analytics",
  "cms",
  "crm",
  "database",
  "automation",
  "workflow",
  "collaboration",
];

// SaaS competitors to search around
const SAAS_TARGETS = [
  "notion", "slack", "jira", "github", "gitlab", "datadog", "sentry",
  "vercel", "netlify", "heroku", "firebase", "supabase", "airtable",
  "figma", "linear", "zendesk", "intercom", "hubspot", "mailchimp",
  "zapier", "segment", "mixpanel", "amplitude", "postman", "stripe",
];

export async function fetchTrendingOss(language?: string): Promise<GitHubTrendingItem[]> {
  // GitHub doesn't have an official trending API; approximate with star-sorted recent repos
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - 7);
  const since = dateThreshold.toISOString().split("T")[0];

  const topicQuery = OSS_TOPICS.slice(0, 3).map((t) => `topic:${t}`).join(" ");
  const langFilter = language ? ` language:${language}` : "";
  const query = `${topicQuery}${langFilter} pushed:>${since} stars:>50`;

  const repos = await searchRepos(query, 30);
  return repos.map((repo, i) => ({ rank: i + 1, repo }));
}

export async function fetchAlternativesForSaas(saasName: string): Promise<GitHubRepo[]> {
  const query = `${saasName} alternative self-hosted stars:>100 pushed:>2024-01-01`;
  return searchRepos(query, 20);
}

export async function fetchAllSaasAlternatives(): Promise<Map<string, GitHubRepo[]>> {
  const result = new Map<string, GitHubRepo[]>();

  for (const saas of SAAS_TARGETS) {
    try {
      const repos = await fetchAlternativesForSaas(saas);
      if (repos.length > 0) result.set(saas, repos);
      await sleep(1000); // Respect rate limits
    } catch (err) {
      console.error(`Failed to fetch alternatives for ${saas}:`, err);
    }
  }

  return result;
}

export function repoToRawData(repo: GitHubRepo, saasContext?: string): RawToolData {
  return {
    name: repo.name,
    description: repo.description ?? undefined,
    github_url: repo.html_url,
    stars: repo.stargazers_count,
    language: repo.language ?? undefined,
    topics: repo.topics,
    homepage: repo.homepage ?? undefined,
    license: repo.license?.spdx_id,
    saas_context: saasContext,
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

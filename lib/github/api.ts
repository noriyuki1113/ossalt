import type { GitHubRepo } from "../../types/automation";

const GITHUB_API = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export async function getRepo(fullName: string): Promise<GitHubRepo> {
  const res = await fetch(`${GITHUB_API}/repos/${fullName}`, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${fullName}`);
  return res.json();
}

export async function searchRepos(query: string, perPage = 30): Promise<GitHubRepo[]> {
  const params = new URLSearchParams({
    q: query,
    sort: "stars",
    order: "desc",
    per_page: String(perPage),
  });
  const res = await fetch(`${GITHUB_API}/search/repositories?${params}`, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub search error ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

export async function searchOssAlternatives(saasName: string): Promise<GitHubRepo[]> {
  const queries = [
    `${saasName} alternative self-hosted stars:>100`,
    `${saasName} open-source replacement stars:>50`,
  ];
  const results: GitHubRepo[] = [];
  const seen = new Set<number>();

  for (const q of queries) {
    const repos = await searchRepos(q, 10);
    for (const repo of repos) {
      if (!seen.has(repo.id) && !repo.archived && !repo.disabled) {
        seen.add(repo.id);
        results.push(repo);
      }
    }
    // Rate limit: 30 requests/min unauthenticated, 5000/hr authenticated
    await sleep(500);
  }

  return results;
}

export async function getRepoStars(fullName: string): Promise<number | null> {
  try {
    const repo = await getRepo(fullName);
    return repo.stargazers_count;
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

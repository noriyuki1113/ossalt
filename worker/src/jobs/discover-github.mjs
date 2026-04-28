/**
 * GitHub OSS discovery job.
 * Searches for OSS tools that could be added to OSSALT.
 * Inserts into oss_candidates (status='pending', human review required).
 */

import { Octokit } from "@octokit/rest";
import { upsertCandidates, existsInTools } from "../lib/dedup.mjs";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// SaaS competitors OSSALT covers → search for OSS alternatives
const QUERIES = [
  "notion alternative open source",
  "slack alternative self-hosted",
  "figma alternative open source",
  "jira alternative self-hosted",
  "airtable alternative open source",
  "github copilot alternative open source",
  "datadog alternative open source",
  "zapier alternative self-hosted",
  "auth0 alternative open source",
  "intercom alternative self-hosted",
];

const MIN_STARS = 100;
const MAX_AGE_DAYS = 180; // 半年以内に更新されたもの

export async function discoverGitHub() {
  console.log("[discover-github] start");
  const since = new Date(Date.now() - MAX_AGE_DAYS * 86400_000).toISOString().split("T")[0];
  const candidates = [];

  for (const q of QUERIES) {
    try {
      const { data } = await octokit.search.repos({
        q: `${q} stars:>=${MIN_STARS} pushed:>=${since} is:public archived:false`,
        sort: "stars",
        order: "desc",
        per_page: 10,
      });

      for (const repo of data.items) {
        if (await existsInTools(repo.html_url)) continue;

        candidates.push({
          source: "github",
          source_id: String(repo.id),
          name: repo.name,
          description: repo.description?.slice(0, 500) ?? null,
          github_url: repo.html_url,
          website_url: repo.homepage || null,
          stars_num: repo.stargazers_count,
          language: repo.language,
          license: repo.license?.spdx_id ?? null,
          tags: repo.topics ?? [],
          raw_data: {
            full_name: repo.full_name,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            pushed_at: repo.pushed_at,
            query: q,
          },
        });
      }

      // GitHub Search API: 30 req/min (authenticated)
      await sleep(2200);
    } catch (err) {
      console.error(`[discover-github] query failed: ${q}`, err.message);
    }
  }

  const { inserted, skipped } = await upsertCandidates(candidates);
  console.log(`[discover-github] done — inserted=${inserted} skipped=${skipped}`);
  return { inserted, skipped };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// スタンドアロン実行
if (process.argv[1].endsWith("discover-github.mjs")) {
  await discoverGitHub();
}

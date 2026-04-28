/**
 * Hacker News discovery job.
 * Finds "Show HN" posts about OSS tools via Algolia API (free, no auth).
 * Inserts into oss_candidates (status='pending').
 */

import { upsertCandidates, existsInTools } from "../lib/dedup.mjs";

const HN_API = "https://hn.algolia.com/api/v1";

// OSSキーワード × Show HN を検索
const QUERIES = [
  "open source alternative",
  "self-hosted alternative",
  "self-host",
  "open source tool",
];

const DAYS_BACK = 30;

export async function discoverHN() {
  console.log("[discover-hn] start");
  const numericFilters = `created_at_i>${Math.floor(Date.now() / 1000) - DAYS_BACK * 86400}`;
  const candidates = [];
  const seen = new Set();

  for (const q of QUERIES) {
    try {
      const url = new URL(`${HN_API}/search_by_date`);
      url.searchParams.set("query", q);
      url.searchParams.set("tags", "show_hn");
      url.searchParams.set("numericFilters", numericFilters);
      url.searchParams.set("hitsPerPage", "20");

      const resp = await fetch(url.toString());
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      for (const hit of data.hits) {
        const hnId = String(hit.objectID);
        if (seen.has(hnId)) continue;
        seen.add(hnId);

        const githubUrl = extractGitHubUrl(hit.url ?? "") || extractGitHubUrl(hit.story_text ?? "");
        if (!githubUrl) continue;
        if (await existsInTools(githubUrl)) continue;

        const name = cleanTitle(hit.title);
        if (!name) continue;

        candidates.push({
          source: "hn",
          source_id: hnId,
          name,
          description: hit.story_text ? stripHtml(hit.story_text).slice(0, 500) : null,
          github_url: githubUrl,
          website_url: hit.url !== githubUrl ? (hit.url ?? null) : null,
          stars_num: null,
          language: null,
          license: null,
          tags: [],
          raw_data: {
            hn_url: `https://news.ycombinator.com/item?id=${hnId}`,
            points: hit.points,
            num_comments: hit.num_comments,
            author: hit.author,
            query: q,
          },
        });
      }

      await sleep(300);
    } catch (err) {
      console.error(`[discover-hn] query failed: ${q}`, err.message);
    }
  }

  const { inserted, skipped } = await upsertCandidates(candidates);
  console.log(`[discover-hn] done — inserted=${inserted} skipped=${skipped}`);
  return { inserted, skipped };
}

function extractGitHubUrl(text) {
  const m = text?.match(/https?:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/);
  return m ? m[0].replace(/\/$/, "") : null;
}

function cleanTitle(title) {
  // "Show HN: ToolName – description" → "ToolName"
  return title
    ?.replace(/^Show HN:\s*/i, "")
    .replace(/\s[–—-].*$/, "")
    .trim() ?? "";
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

if (process.argv[1].endsWith("discover-hn.mjs")) {
  await discoverHN();
}

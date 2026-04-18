import { supabaseAdmin } from "../supabase/client";
import { fetchTrendingOss, fetchAlternativesForSaas, repoToRawData } from "../github/trending";
import type { DiscoveryResult, IngestionQueueItem } from "../../types/automation";

const SAAS_TARGETS = [
  "notion", "slack", "jira", "github", "datadog", "sentry",
  "vercel", "firebase", "airtable", "figma", "linear", "zendesk",
  "intercom", "hubspot", "mailchimp", "zapier", "postman",
];

export async function runDiscovery(options: {
  mode?: "trending" | "saas-alternatives" | "both";
  saasTarget?: string;
} = {}): Promise<DiscoveryResult> {
  const mode = options.mode ?? "both";
  const result: DiscoveryResult = { discovered: 0, queued: 0, duplicates: 0, errors: 0 };

  const existingUrls = await getExistingGithubUrls();

  if (mode === "trending" || mode === "both") {
    try {
      const items = await fetchTrendingOss();
      for (const item of items) {
        result.discovered++;
        const url = item.repo.html_url;
        if (existingUrls.has(url)) { result.duplicates++; continue; }
        await enqueue(repoToRawData(item.repo), url, "github_trending");
        result.queued++;
        existingUrls.add(url);
      }
    } catch (err) {
      console.error("Trending discovery error:", err);
      result.errors++;
    }
  }

  if (mode === "saas-alternatives" || mode === "both") {
    const targets = options.saasTarget ? [options.saasTarget] : SAAS_TARGETS;
    for (const saas of targets) {
      try {
        const repos = await fetchAlternativesForSaas(saas);
        for (const repo of repos) {
          result.discovered++;
          const url = repo.html_url;
          if (existingUrls.has(url)) { result.duplicates++; continue; }
          await enqueue(repoToRawData(repo, saas), url, "github_search");
          result.queued++;
          existingUrls.add(url);
        }
        await sleep(1000);
      } catch (err) {
        console.error(`Discovery error for ${saas}:`, err);
        result.errors++;
      }
    }
  }

  console.log(`Discovery complete: ${JSON.stringify(result)}`);
  return result;
}

async function getExistingGithubUrls(): Promise<Set<string>> {
  const [queueRes, toolsRes] = await Promise.all([
    supabaseAdmin.from("ingestion_queue").select("github_url").not("github_url", "is", null),
    supabaseAdmin.from("tools").select("github_url").not("github_url", "is", null),
  ]);

  const urls = new Set<string>();
  for (const row of queueRes.data ?? []) if (row.github_url) urls.add(row.github_url);
  for (const row of toolsRes.data ?? []) if (row.github_url) urls.add(row.github_url);
  return urls;
}

async function enqueue(
  rawData: Record<string, unknown>,
  githubUrl: string,
  sourceType: "github_trending" | "github_search"
): Promise<void> {
  const stars = (rawData.stars as number) ?? 0;
  const priority = stars > 5000 ? 1 : stars > 1000 ? 3 : stars > 200 ? 5 : 8;

  const { error } = await supabaseAdmin.from("ingestion_queue").insert({
    source_type: sourceType,
    raw_data: rawData,
    github_url: githubUrl,
    status: "pending",
    priority,
  });

  if (error) throw new Error(`Enqueue error: ${error.message}`);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

import { db } from "./supabase.mjs";

/**
 * Insert candidates, skip duplicates (source + source_id).
 * Returns { inserted, skipped }.
 */
export async function upsertCandidates(candidates) {
  let inserted = 0;
  let skipped = 0;

  for (const c of candidates) {
    const { error } = await db
      .from("oss_candidates")
      .insert(c)
      .throwOnError();

    if (error?.code === "23505") {
      // unique violation — already exists
      skipped++;
    } else if (error) {
      console.error(`Insert error for ${c.source_id}:`, error.message);
    } else {
      inserted++;
    }
  }

  return { inserted, skipped };
}

/**
 * Check if a GitHub URL is already in the tools table.
 */
export async function existsInTools(githubUrl) {
  if (!githubUrl) return false;
  const { count } = await db
    .from("tools")
    .select("id", { count: "exact", head: true })
    .eq("github_url", githubUrl);
  return (count ?? 0) > 0;
}

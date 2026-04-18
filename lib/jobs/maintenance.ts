import { supabaseAdmin } from "../supabase/client";
import { getRepoStars } from "../github/api";
import type { MaintenanceJob } from "../../types/automation";

export async function runStarRefresh(batchSize = 50): Promise<Partial<MaintenanceJob>> {
  const job = await startJob("star_refresh");

  try {
    const { data: tools, error } = await supabaseAdmin
      .from("tools")
      .select("id, github_url, stars_count")
      .not("github_url", "is", null)
      .order("updated_at", { ascending: true })
      .limit(batchSize);

    if (error) throw error;

    let updated = 0;
    for (const tool of tools ?? []) {
      const fullName = (tool.github_url as string).replace("https://github.com/", "");
      const newStars = await getRepoStars(fullName);
      if (newStars !== null && newStars !== tool.stars_count) {
        await supabaseAdmin.from("tools").update({ stars_count: newStars }).eq("id", tool.id);
        updated++;
      }
      await sleep(300);
    }

    return finishJob(job.id, tools?.length ?? 0, updated);
  } catch (err) {
    return failJob(job.id, err instanceof Error ? err.message : String(err));
  }
}

export async function runLinkCheck(): Promise<Partial<MaintenanceJob>> {
  const job = await startJob("link_check");

  try {
    const { data: tools, error } = await supabaseAdmin
      .from("tools")
      .select("id, slug, website_url")
      .not("website_url", "is", null)
      .limit(100);

    if (error) throw error;

    let checked = 0;
    let broken = 0;
    const brokenIds: number[] = [];

    for (const tool of tools ?? []) {
      try {
        const res = await fetch(tool.website_url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
        checked++;
        if (res.status >= 400) {
          broken++;
          brokenIds.push(tool.id);
        }
      } catch {
        broken++;
        brokenIds.push(tool.id);
      }
      await sleep(500);
    }

    if (brokenIds.length > 0) {
      await supabaseAdmin
        .from("tools")
        .update({ link_broken: true })
        .in("id", brokenIds);
    }

    return finishJob(job.id, checked, broken, { broken_ids: brokenIds });
  } catch (err) {
    return failJob(job.id, err instanceof Error ? err.message : String(err));
  }
}

export async function runArchiveDetect(): Promise<Partial<MaintenanceJob>> {
  const job = await startJob("archive_detect");

  try {
    const { data: tools, error } = await supabaseAdmin
      .from("tools")
      .select("id, slug, github_url")
      .not("github_url", "is", null)
      .not("status", "eq", "archived")
      .limit(50);

    if (error) throw error;

    let checked = 0;
    let archived = 0;

    for (const tool of tools ?? []) {
      try {
        const fullName = (tool.github_url as string).replace("https://github.com/", "");
        const res = await fetch(`https://api.github.com/repos/${fullName}`, {
          headers: process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {},
        });
        checked++;
        if (res.ok) {
          const data = await res.json();
          if (data.archived) {
            await supabaseAdmin.from("tools").update({ status: "archived" }).eq("id", tool.id);
            archived++;
          }
        }
      } catch {
        // continue
      }
      await sleep(500);
    }

    return finishJob(job.id, checked, archived);
  } catch (err) {
    return failJob(job.id, err instanceof Error ? err.message : String(err));
  }
}

async function startJob(jobType: MaintenanceJob["job_type"]) {
  const { data, error } = await supabaseAdmin
    .from("maintenance_jobs")
    .insert({ job_type: jobType, status: "running", started_at: new Date().toISOString() })
    .select("id")
    .single();
  if (error) throw new Error(`Start job error: ${error.message}`);
  return data;
}

async function finishJob(
  id: string,
  processed: number,
  updated: number,
  summary?: Record<string, unknown>
) {
  await supabaseAdmin.from("maintenance_jobs").update({
    status: "completed",
    completed_at: new Date().toISOString(),
    items_processed: processed,
    items_updated: updated,
    result_summary: summary ?? null,
  }).eq("id", id);
  return { id, status: "completed", items_processed: processed, items_updated: updated };
}

async function failJob(id: string, message: string) {
  await supabaseAdmin.from("maintenance_jobs").update({
    status: "failed",
    completed_at: new Date().toISOString(),
    error_message: message,
  }).eq("id", id);
  return { id, status: "failed", error_message: message };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

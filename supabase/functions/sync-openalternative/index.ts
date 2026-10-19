import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseReadme } from "./parse-readme.mjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-token",
};
const SOURCE = "https://raw.githubusercontent.com/piotrkulpinski/open-source-alternatives/main/README.md";

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function readAllNames(client: ReturnType<typeof createClient>, table: string) {
  const names = new Set<string>();
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from(table).select("name").range(offset, offset + 999);
    if (error) throw error;
    for (const row of data ?? []) {
      if (row.name) names.add(row.name.trim().toLocaleLowerCase("en-US"));
    }
    if ((data?.length ?? 0) < 1000) break;
  }
  return names;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const syncToken = Deno.env.get("SYNC_OPENALTERNATIVE_TOKEN");
  if (!supabaseUrl || !serviceKey) return respond({ error: "Server configuration missing" }, 500);

  const suppliedToken = req.headers.get("x-sync-token");
  let authorized = Boolean(syncToken && suppliedToken && suppliedToken === syncToken);
  if (!authorized) {
    const jwt = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (jwt && jwt !== serviceKey) {
      const caller = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || "", {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
      });
      const { data: user, error } = await caller.auth.getUser(jwt);
      if (!error && user.user) {
        const { data: isAdmin } = await caller.rpc("has_role", {
          _user_id: user.user.id,
          _role: "admin",
        });
        authorized = isAdmin === true;
      }
    }
  }
  if (!authorized) return respond({ error: "Forbidden" }, 403);

  try {
    const maxParam = Number(new URL(req.url).searchParams.get("max") ?? 50);
    if (!Number.isInteger(maxParam) || maxParam < 1 || maxParam > 100) {
      return respond({ error: "max must be between 1 and 100" }, 400);
    }
    const response = await fetch(SOURCE, { headers: { "User-Agent": "ossalt-candidate-sync" } });
    if (!response.ok) throw new Error(`OpenAlternative README returned ${response.status}`);
    const parsed = parseReadme(await response.text());
    if (parsed.length < 100) throw new Error("Too few catalog entries; upstream format may have changed");

    const db = createClient(supabaseUrl, serviceKey);
    const [published, queued] = await Promise.all([
      readAllNames(db, "tools"),
      readAllNames(db, "openalternative_candidates"),
    ]);
    const newCandidates = parsed.filter(t => {
      const name = t.name.trim().toLocaleLowerCase("en-US");
      return !published.has(name) && !queued.has(name);
    });
    let queuedCount = 0;
    const failures: string[] = [];
    for (const candidate of newCandidates.slice(0, maxParam)) {
      const { error } = await db.from("openalternative_candidates").insert(candidate);
      if (error) failures.push(`${candidate.name}: ${error.message}`);
      else queuedCount++;
    }
    return respond({
      message: "OpenAlternative candidate sync complete",
      total_parsed: parsed.length,
      new_queued: queuedCount,
      skipped_existing: parsed.length - newCandidates.length,
      remaining: Math.max(0, newCandidates.length - maxParam),
      errors: failures.length,
      timestamp: new Date().toISOString(),
    }, failures.length ? 500 : 200);
  } catch (error) {
    console.error("Candidate sync failed", error);
    return respond({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});

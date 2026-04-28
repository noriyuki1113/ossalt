/**
 * Google Indexing API job.
 * Requests Googlebot to crawl newly added tool pages.
 * Quota: 200 requests/day (free).
 *
 * Setup:
 *   1. Google Cloud Console → Create service account
 *   2. Grant "Owner" access to Search Console property
 *   3. Download JSON key → set GOOGLE_SA_KEY env var (base64 encoded)
 */

import { db } from "../lib/supabase.mjs";

const INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const BASE_URL = "https://ossalt.jp";
const DAILY_QUOTA = 180; // 200制限に余裕を持たせる

export async function requestIndex() {
  console.log("[request-index] start");

  const saKey = process.env.GOOGLE_SA_KEY;
  if (!saKey) {
    console.warn("[request-index] GOOGLE_SA_KEY not set — skipping");
    return;
  }

  const accessToken = await getAccessToken(saKey);

  // pendingのインデックス要求タスクを取得
  const { data: tasks } = await db
    .from("seo_tasks")
    .select("id, url")
    .eq("task_type", "index_request")
    .eq("status", "pending")
    .order("scheduled_at", { ascending: true })
    .limit(DAILY_QUOTA);

  if (!tasks?.length) {
    // 新しいツールページを自動的にキューに追加
    await enqueueNewToolPages();
    console.log("[request-index] queued new tool pages");
    return;
  }

  let done = 0;
  let errors = 0;

  for (const task of tasks) {
    try {
      const resp = await fetch(INDEXING_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: task.url, type: "URL_UPDATED" }),
      });

      const result = await resp.json();

      if (resp.ok) {
        await db.from("seo_tasks").update({
          status: "done",
          result,
          executed_at: new Date().toISOString(),
        }).eq("id", task.id);
        done++;
      } else {
        throw new Error(result.error?.message ?? `HTTP ${resp.status}`);
      }

      await sleep(500); // rate limit対策
    } catch (err) {
      await db.from("seo_tasks").update({
        status: "error",
        error_msg: err.message,
        executed_at: new Date().toISOString(),
      }).eq("id", task.id);
      errors++;
    }
  }

  console.log(`[request-index] done — submitted=${done} errors=${errors}`);
  return { done, errors };
}

/** tools テーブルの新規ページをseo_tasksに追加 */
async function enqueueNewToolPages() {
  // 過去7日以内に追加されたツールのうち、まだインデックス要求していないもの
  const since = new Date(Date.now() - 7 * 86400_000).toISOString();

  const { data: tools } = await db
    .from("tools")
    .select("id")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(DAILY_QUOTA);

  if (!tools?.length) return;

  const tasks = tools.map((t) => ({
    task_type: "index_request",
    url: `${BASE_URL}/tools/${t.id}`,
    api_source: "google_indexing",
    status: "pending",
  }));

  // ON CONFLICT DO NOTHING (unique index on url+task_type where pending)
  await db.from("seo_tasks").upsert(tasks, {
    onConflict: "url,task_type",
    ignoreDuplicates: true,
  });
}

/** Service Account JSON (base64) → OAuth2 access token */
async function getAccessToken(base64Key) {
  const sa = JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));
  const now = Math.floor(Date.now() / 1000);

  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));

  const unsigned = `${header}.${payload}`;
  const signature = await signRS256(unsigned, sa.private_key);
  const jwt = `${unsigned}.${signature}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const { access_token } = await resp.json();
  return access_token;
}

async function signRS256(data, privateKeyPem) {
  const pemBody = privateKeyPem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const binaryKey = Buffer.from(pemBody, "base64");

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(data)
  );

  return Buffer.from(sig)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

if (process.argv[1].endsWith("request-index.mjs")) {
  await requestIndex();
}

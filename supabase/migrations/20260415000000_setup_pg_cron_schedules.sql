-- ============================================================
-- pg_cron + pg_net: Automated Edge Function scheduling
-- ============================================================
-- Enables nightly GitHub stats refresh and weekly tool sync.
--
-- IMPORTANT: After applying this migration, set the two
-- configuration variables below in the Supabase SQL editor:
--
--   ALTER DATABASE postgres
--     SET app.supabase_url    = 'https://<project-ref>.supabase.co';
--   ALTER DATABASE postgres
--     SET app.supabase_anon_key = '<your-anon-key>';
--
-- (These are intentionally not committed to the repo.)
-- ============================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- 2. Helper function: call an Edge Function by name
-- ============================================================
CREATE OR REPLACE FUNCTION call_edge_function(
  function_name text,
  payload       jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_url text := current_setting('app.supabase_url',  true);
  anon_key text := current_setting('app.supabase_anon_key', true);
BEGIN
  IF base_url IS NULL OR anon_key IS NULL THEN
    RAISE WARNING 'app.supabase_url or app.supabase_anon_key not configured — skipping %', function_name;
    RETURN;
  END IF;

  PERFORM net.http_post(
    url     := base_url || '/functions/v1/' || function_name,
    headers := jsonb_build_object(
                 'Content-Type',  'application/json',
                 'Authorization', 'Bearer ' || anon_key
               ),
    body    := payload
  );
END;
$$;

-- ============================================================
-- 3. Scheduled jobs
-- ============================================================

-- 3-a. GitHub stats refresh — every night at 03:00 JST (18:00 UTC)
--      Processes up to 100 tools per run, ordered by oldest update first.
SELECT cron.schedule(
  'fetch-github-stats-nightly',
  '0 18 * * *',
  $$ SELECT call_edge_function('fetch-github-stats', '{"limit": 100}'::jsonb); $$
);

-- 3-b. OpenAlternative sync — every Monday at 04:00 JST (19:00 UTC Sunday)
--      Picks up at most 50 newly listed tools per run.
SELECT cron.schedule(
  'sync-openalternative-weekly',
  '0 19 * * 0',
  $$ SELECT call_edge_function('sync-openalternative', '{"max": 50}'::jsonb); $$
);

-- ============================================================
-- Verify (view scheduled jobs)
-- ============================================================
-- SELECT * FROM cron.job;

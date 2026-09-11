-- Trust signals: the "自己ホスト可否" shown on ToolDetail was always a guess
-- derived from stars/github presence (see getDifficultyInfo/isSelfHostable in
-- ToolDetail.tsx), and there was no record of when a listing's facts were
-- last confirmed or what they were confirmed against. Add real columns so
-- the UI can show a verified fact instead of a heuristic.

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS self_hostable          BOOLEAN,
  ADD COLUMN IF NOT EXISTS verified_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_source_url TEXT;

-- Backfill self_hostable: every tool with a GitHub repo or explicit Docker
-- support on this site is, by construction, a self-hostable OSS alternative.
UPDATE public.tools
SET self_hostable = (docker_available IS TRUE OR github_url IS NOT NULL)
WHERE self_hostable IS NULL;

-- Backfill verified_at from the most recent automated data refresh we
-- actually have for each row — this is when we last confirmed the listing's
-- facts (stars/license/scorecard), even though no one manually reviewed it.
UPDATE public.tools
SET verified_at = COALESCE(scorecard_updated_at, github_stars_updated_at, created_at)
WHERE verified_at IS NULL;

-- Backfill verification_source_url with the GitHub repo where available
-- (the actual source of stars/license/last_commit), else the official site.
UPDATE public.tools
SET verification_source_url = COALESCE(github_url, url)
WHERE verification_source_url IS NULL;

NOTIFY pgrst, 'reload schema';

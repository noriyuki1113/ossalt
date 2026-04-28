-- oss_candidates: 自動収集されたOSS候補（人間レビュー待ち）
CREATE TABLE public.oss_candidates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source      text NOT NULL,           -- 'github' | 'hn' | 'product_hunt' | 'libraries_io' | 'rss'
  source_id   text NOT NULL,           -- 外部ID（重複防止）
  name        text NOT NULL,
  description text,
  github_url  text,
  website_url text,
  stars_num   integer,
  language    text,
  license     text,
  tags        text[],
  raw_data    jsonb,
  status      text NOT NULL DEFAULT 'pending', -- 'pending'|'approved'|'rejected'|'duplicate'
  reviewed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX oss_candidates_source_uniq ON public.oss_candidates(source, source_id);
CREATE INDEX oss_candidates_status_idx ON public.oss_candidates(status, created_at DESC);

ALTER TABLE public.oss_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage oss_candidates"
  ON public.oss_candidates FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read oss_candidates"
  ON public.oss_candidates FOR SELECT TO public
  USING (has_role(auth.uid(), 'admin'));

-- seo_tasks: Googleインデックス要求・順位チェックタスク
CREATE TABLE public.seo_tasks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type    text NOT NULL,   -- 'index_request' | 'rank_check' | 'serp_snapshot'
  url          text NOT NULL,
  keyword      text,
  status       text NOT NULL DEFAULT 'pending', -- 'pending'|'done'|'error'
  api_source   text,            -- 'google_indexing' | 'search_console' | 'serper'
  result       jsonb,
  error_msg    text,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  executed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX seo_tasks_pending_idx ON public.seo_tasks(status, scheduled_at)
  WHERE status = 'pending';
CREATE UNIQUE INDEX seo_tasks_url_type_uniq ON public.seo_tasks(url, task_type)
  WHERE status = 'pending';

ALTER TABLE public.seo_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage seo_tasks"
  ON public.seo_tasks FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));

-- social_drafts: SNS投稿下書き（手動承認→投稿）
CREATE TABLE public.social_drafts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    text NOT NULL,   -- 'twitter' | 'bluesky' | 'linkedin'
  content     text NOT NULL,
  tool_id     integer REFERENCES public.tools(id) ON DELETE SET NULL,
  draft_type  text,            -- 'new_tool' | 'compare' | 'weekly_oss' | 'trending'
  status      text NOT NULL DEFAULT 'draft', -- 'draft'|'approved'|'posted'|'rejected'
  posted_at   timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX social_drafts_status_idx ON public.social_drafts(status, created_at DESC);

ALTER TABLE public.social_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage social_drafts"
  ON public.social_drafts FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));

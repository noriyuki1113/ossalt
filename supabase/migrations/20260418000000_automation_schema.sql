-- Automation pipeline: discovery → normalization → quality → content → publish

-- Sources registry (GitHub, ProductHunt, HN, etc.)
CREATE TABLE public.tool_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('github_trending', 'github_search', 'producthunt', 'hn_ask', 'manual')),
  config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  last_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ingestion queue: raw discovered tools before normalization
CREATE TABLE public.ingestion_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES public.tool_sources(id),
  source_type text NOT NULL,
  raw_data jsonb NOT NULL,
  github_url text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'normalized', 'rejected', 'duplicate')),
  priority integer NOT NULL DEFAULT 5,
  normalized_tool_id integer REFERENCES public.tools(id),
  rejection_reason text,
  error_message text,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ingestion_queue_status ON public.ingestion_queue(status);
CREATE INDEX idx_ingestion_queue_github_url ON public.ingestion_queue(github_url);

-- Tool → SaaS alternative mappings
CREATE TABLE public.tool_alternatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id integer NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  saas_name text NOT NULL,
  saas_slug text NOT NULL,
  saas_url text,
  confidence_score numeric(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'llm', 'community')),
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tool_id, saas_slug)
);

-- Comparison drafts (OSS vs SaaS)
CREATE TABLE public.comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  oss_tool_id integer REFERENCES public.tools(id),
  oss_name text NOT NULL,
  saas_name text NOT NULL,
  alternative_slug text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  content jsonb,
  quality_score numeric(3,2),
  reviewer_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comparisons_status ON public.comparisons(status);
CREATE INDEX idx_comparisons_alternative_slug ON public.comparisons(alternative_slug);

-- Social post drafts
CREATE TABLE public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id integer REFERENCES public.tools(id),
  comparison_id uuid REFERENCES public.comparisons(id),
  platform text NOT NULL CHECK (platform IN ('x', 'zenn', 'note', 'qiita')),
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'published', 'rejected')),
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Audit log for human review decisions
CREATE TABLE public.review_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('tool', 'comparison', 'social_post', 'ingestion')),
  entity_id text NOT NULL,
  action text NOT NULL CHECK (action IN ('approve', 'reject', 'edit', 'publish', 'archive')),
  reviewer text NOT NULL DEFAULT 'admin',
  before_state jsonb,
  after_state jsonb,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_review_logs_entity ON public.review_logs(entity_type, entity_id);

-- Scheduled maintenance job records
CREATE TABLE public.maintenance_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL CHECK (job_type IN ('star_refresh', 'link_check', 'archive_detect', 'sitemap_rebuild')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  items_processed integer NOT NULL DEFAULT 0,
  items_updated integer NOT NULL DEFAULT 0,
  error_message text,
  result_summary jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- View: pending queue stats
CREATE VIEW public.ingestion_queue_stats AS
SELECT
  status,
  COUNT(*) as count,
  MIN(discovered_at) as oldest,
  MAX(discovered_at) as newest
FROM public.ingestion_queue
GROUP BY status;

-- View: comparison pipeline
CREATE VIEW public.comparison_pipeline AS
SELECT
  c.id,
  c.slug,
  c.oss_name,
  c.saas_name,
  c.status,
  c.quality_score,
  c.created_at,
  c.updated_at,
  t.stars_num,
  t.github_url
FROM public.comparisons c
LEFT JOIN public.tools t ON t.id = c.oss_tool_id;

-- RLS
ALTER TABLE public.tool_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_jobs ENABLE ROW LEVEL SECURITY;

-- Public read for published comparisons
CREATE POLICY "published comparisons are public"
  ON public.comparisons FOR SELECT
  USING (status = 'published');

CREATE POLICY "tool_alternatives are public"
  ON public.tool_alternatives FOR SELECT
  USING (true);

-- Service role has full access (automation jobs run with service role)
CREATE POLICY "service role full access tool_sources"
  ON public.tool_sources FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service role full access ingestion_queue"
  ON public.ingestion_queue FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service role full access tool_alternatives"
  ON public.tool_alternatives FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service role full access comparisons"
  ON public.comparisons FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service role full access social_posts"
  ON public.social_posts FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service role full access review_logs"
  ON public.review_logs FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service role full access maintenance_jobs"
  ON public.maintenance_jobs FOR ALL
  USING (auth.role() = 'service_role');

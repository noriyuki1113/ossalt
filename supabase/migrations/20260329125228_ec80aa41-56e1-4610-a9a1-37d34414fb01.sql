
-- Add new columns to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS japanese_name text,
  ADD COLUMN IF NOT EXISTS japanese_description text,
  ADD COLUMN IF NOT EXISTS license text,
  ADD COLUMN IF NOT EXISTS github_stars integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS github_forks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_commit_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS self_host_difficulty text DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS best_for text,
  ADD COLUMN IF NOT EXISTS not_good_for text,
  ADD COLUMN IF NOT EXISTS source_origin text,
  ADD COLUMN IF NOT EXISTS source_url text;

-- Add new columns to categories
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS japanese_name text,
  ADD COLUMN IF NOT EXISTS japanese_description text;

-- Add new columns to alternatives
ALTER TABLE public.alternatives
  ADD COLUMN IF NOT EXISTS source_description text,
  ADD COLUMN IF NOT EXISTS japanese_source_name text,
  ADD COLUMN IF NOT EXISTS japanese_source_description text,
  ADD COLUMN IF NOT EXISTS category_hint text,
  ADD COLUMN IF NOT EXISTS source_url text;

-- Add new columns to alternative_products
ALTER TABLE public.alternative_products
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

-- Add github_url to submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS github_url text;

-- Create scrape_runs table
CREATE TABLE IF NOT EXISTS public.scrape_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  meta jsonb,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.scrape_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scrape_runs" ON public.scrape_runs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

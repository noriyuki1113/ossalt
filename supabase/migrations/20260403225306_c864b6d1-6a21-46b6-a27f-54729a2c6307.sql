
-- Pre-computed category pickups cache table
CREATE TABLE public.category_pickups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_ja text NOT NULL,
  tool_id integer NOT NULL,
  tool_name text,
  tool_description_ja text,
  tool_stars_num integer DEFAULT 0,
  tool_language text,
  tool_primary_competitor_ja text,
  tool_url text,
  tool_github_url text,
  rank_order integer DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast category lookups
CREATE INDEX idx_category_pickups_category ON public.category_pickups (category_ja, rank_order);

-- Enable RLS
ALTER TABLE public.category_pickups ENABLE ROW LEVEL SECURITY;

-- Anyone can read pickups
CREATE POLICY "Category pickups are publicly readable"
  ON public.category_pickups FOR SELECT
  TO public
  USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage category_pickups"
  ON public.category_pickups FOR ALL
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));


-- Workspace: saved_tools table
CREATE TABLE public.saved_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  tool_id integer NOT NULL,
  status text NOT NULL DEFAULT 'candidate',
  personal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Workspace: comparison_lists table
CREATE TABLE public.comparison_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  title text NOT NULL DEFAULT '無題の比較',
  summary_note text,
  share_token text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Workspace: comparison_list_items table
CREATE TABLE public.comparison_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_list_id uuid NOT NULL REFERENCES public.comparison_lists(id) ON DELETE CASCADE,
  tool_id integer NOT NULL,
  position integer NOT NULL DEFAULT 0,
  decision_note text,
  self_hosting_score integer,
  learning_curve_score integer,
  team_fit_score integer,
  custom_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_list_items ENABLE ROW LEVEL SECURITY;

-- RLS: saved_tools - anyone can read/write by session_key
CREATE POLICY "Anyone can manage their saved tools" ON public.saved_tools
  FOR ALL USING (true) WITH CHECK (length(session_key) > 0 AND length(session_key) <= 100);

-- RLS: comparison_lists - anyone can manage by session_key
CREATE POLICY "Anyone can manage their comparison lists" ON public.comparison_lists
  FOR ALL USING (true) WITH CHECK (length(session_key) > 0 AND length(session_key) <= 100);

-- RLS: comparison_list_items - anyone can manage
CREATE POLICY "Anyone can manage comparison list items" ON public.comparison_list_items
  FOR ALL USING (true) WITH CHECK (true);

-- RLS: shared comparison lists are publicly readable
CREATE POLICY "Shared comparisons are publicly readable" ON public.comparison_lists
  FOR SELECT USING (share_token IS NOT NULL);

-- Index for session_key lookups
CREATE INDEX idx_saved_tools_session ON public.saved_tools(session_key);
CREATE INDEX idx_comparison_lists_session ON public.comparison_lists(session_key);
CREATE INDEX idx_comparison_lists_share_token ON public.comparison_lists(share_token);
CREATE INDEX idx_comparison_list_items_list ON public.comparison_list_items(comparison_list_id);

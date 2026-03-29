
CREATE TABLE public.tools (
  id SERIAL PRIMARY KEY,
  name TEXT,
  url TEXT,
  description_en TEXT,
  description_ja TEXT,
  parent_category_en TEXT,
  parent_category_ja TEXT,
  category_en TEXT,
  category_ja TEXT,
  github_url TEXT,
  license TEXT,
  stars TEXT,
  stars_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are publicly readable" ON public.tools FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage tools" ON public.tools FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));


CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  status text NOT NULL DEFAULT 'draft',
  source_type text,
  source_id uuid,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are publicly readable" ON public.articles
  FOR SELECT TO public USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage articles" ON public.articles
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

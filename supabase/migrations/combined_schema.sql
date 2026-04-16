-- ============================================================
-- ossalt.jp — Combined Schema Migration
-- 新しいSupabaseプロジェクトに貼り付けて実行してください
-- SQL Editor で一括実行可能です
-- ============================================================

-- ============================================================
-- 1. 基盤：ロール・共通関数
-- ============================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- 2. カテゴリ・タグ
-- ============================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  japanese_name text,
  japanese_description text
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are publicly readable" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. プロダクト
-- ============================================================

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  website_url TEXT,
  github_url TEXT,
  logo_url TEXT,
  pricing_summary TEXT,
  has_free_plan BOOLEAN DEFAULT false,
  is_open_source BOOLEAN DEFAULT false,
  is_self_hostable BOOLEAN DEFAULT false,
  has_cloud BOOLEAN DEFAULT true,
  supports_japanese BOOLEAN DEFAULT false,
  target_audience TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  japanese_name text,
  japanese_description text,
  license text,
  github_stars integer DEFAULT 0,
  github_forks integer DEFAULT 0,
  last_commit_at timestamp with time zone,
  self_host_difficulty text DEFAULT 'medium',
  best_for text,
  not_good_for text,
  source_origin text,
  source_url text,
  logo_source text DEFAULT 'manual',
  logo_background text DEFAULT 'gray',
  logo_github_readme_url text,
  logo_github_avatar_url text,
  logo_favicon_url text
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are publicly readable" ON public.products FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (product_id, category_id)
);
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product categories are publicly readable" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_categories" ON public.product_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (product_id, tag_id)
);
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product tags are publicly readable" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_tags" ON public.product_tags FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT
);
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product features are publicly readable" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_features" ON public.product_features FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. オルタナティブ
-- ============================================================

CREATE TABLE public.alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_description text,
  japanese_source_name text,
  japanese_source_description text,
  category_hint text,
  source_url text
);
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alternatives are publicly readable" ON public.alternatives FOR SELECT USING (true);
CREATE POLICY "Admins can manage alternatives" ON public.alternatives FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_alternatives_updated_at BEFORE UPDATE ON public.alternatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.alternative_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alternative_id UUID REFERENCES public.alternatives(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rank_order INTEGER DEFAULT 0,
  reason_summary TEXT,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (alternative_id, product_id)
);
ALTER TABLE public.alternative_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alternative products are publicly readable" ON public.alternative_products FOR SELECT USING (true);
CREATE POLICY "Admins can manage alternative_products" ON public.alternative_products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. ツール（メインテーブル）
-- ============================================================

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  primary_competitor TEXT,
  primary_competitor_ja TEXT,
  replaces TEXT[],
  replaces_ja TEXT[],
  forks_num INTEGER,
  last_commit TIMESTAMPTZ,
  language TEXT,
  github_stars_updated_at TIMESTAMPTZ
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tools are publicly readable" ON public.tools FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage tools" ON public.tools FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_tools_parent_category_ja ON tools(parent_category_ja);
CREATE INDEX IF NOT EXISTS idx_tools_category_ja ON tools(category_ja);
CREATE INDEX IF NOT EXISTS idx_tools_stars_num ON tools(stars_num DESC);

-- ============================================================
-- 6. フォーム・問い合わせ系
-- ============================================================

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  github_url text
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.submissions
  FOR INSERT WITH CHECK (
    length(product_name) > 0 AND length(product_name) <= 200
    AND length(website_url) > 0 AND length(website_url) <= 500
    AND length(email) > 0 AND length(email) <= 320
  );
CREATE POLICY "Admins can manage submissions" ON public.submissions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text,
  email text NOT NULL,
  category text NOT NULL DEFAULT 'その他',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contacts
  FOR INSERT TO public
  WITH CHECK (
    length(email) > 0 AND length(email) <= 320
    AND length(message) > 0 AND length(message) <= 5000
  );
CREATE POLICY "Admins can manage contacts" ON public.contacts
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.advertise_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  product_name text NOT NULL,
  plan text NOT NULL DEFAULT 'undecided',
  message text
);
ALTER TABLE public.advertise_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON public.advertise_inquiries
  FOR INSERT TO public
  WITH CHECK (
    length(name) > 0 AND length(name) <= 200
    AND length(email) > 0 AND length(email) <= 320
    AND length(product_name) > 0 AND length(product_name) <= 200
  );
CREATE POLICY "Admins can manage inquiries" ON public.advertise_inquiries
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));

-- ============================================================
-- 7. モネタイズ系テーブル
-- ============================================================

CREATE TABLE public.listing_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website_url text NOT NULL,
  github_url text,
  category text,
  description text,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  message text,
  agreed_policy boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.listing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit listing request" ON public.listing_requests FOR INSERT TO public WITH CHECK (
  length(contact_name) > 0 AND length(contact_name) <= 200
  AND length(contact_email) > 0 AND length(contact_email) <= 320
  AND length(name) > 0 AND length(name) <= 200
  AND length(website_url) > 0 AND length(website_url) <= 500
);
CREATE POLICY "Admins can manage listing_requests" ON public.listing_requests FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.monetization_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type text NOT NULL DEFAULT 'sponsor',
  source_page text,
  source_page_type text,
  company_name text,
  contact_name text,
  email text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.monetization_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit monetization lead" ON public.monetization_leads FOR INSERT TO public WITH CHECK (
  length(coalesce(email, '')) > 0 AND length(coalesce(email, '')) <= 320
);
CREATE POLICY "Admins can manage monetization_leads" ON public.monetization_leads FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.sponsor_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name text NOT NULL,
  page_type text NOT NULL,
  category text,
  label text NOT NULL DEFAULT 'スポンサー',
  status text NOT NULL DEFAULT 'draft',
  cta_url text,
  cta_text text,
  sponsor_name text,
  sponsor_logo_url text,
  sponsor_description text,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsor_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sponsor slots are publicly readable" ON public.sponsor_slots FOR SELECT TO public USING (status = 'active');
CREATE POLICY "Admins can manage sponsor_slots" ON public.sponsor_slots FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.partner_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug_or_category text,
  partner_name text NOT NULL,
  partner_type text NOT NULL DEFAULT 'hosting',
  label text NOT NULL DEFAULT '提携',
  description text,
  url text,
  logo_url text,
  priority integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.partner_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active partner cards are publicly readable" ON public.partner_cards FOR SELECT TO public USING (active = true);
CREATE POLICY "Admins can manage partner_cards" ON public.partner_cards FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- ============================================================
-- 8. その他テーブル
-- ============================================================

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

CREATE TABLE public.scrape_runs (
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
CREATE INDEX idx_category_pickups_category ON public.category_pickups (category_ja, rank_order);
ALTER TABLE public.category_pickups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Category pickups are publicly readable"
  ON public.category_pickups FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage category_pickups"
  ON public.category_pickups FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO public
  WITH CHECK (length(email) > 0 AND length(email) <= 320);
CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 9. ワークスペース
-- ============================================================

CREATE TABLE public.saved_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  tool_id integer NOT NULL,
  status text NOT NULL DEFAULT 'candidate',
  personal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.comparison_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  title text NOT NULL DEFAULT '無題の比較',
  summary_note text,
  share_token text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

ALTER TABLE public.saved_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage their saved tools" ON public.saved_tools
  FOR ALL USING (true) WITH CHECK (length(session_key) > 0 AND length(session_key) <= 100);
CREATE POLICY "Anyone can manage their comparison lists" ON public.comparison_lists
  FOR ALL USING (true) WITH CHECK (length(session_key) > 0 AND length(session_key) <= 100);
CREATE POLICY "Anyone can manage comparison list items" ON public.comparison_list_items
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Shared comparisons are publicly readable" ON public.comparison_lists
  FOR SELECT USING (share_token IS NOT NULL);

-- ============================================================
-- 10. インデックス
-- ============================================================

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_alternatives_source_slug ON public.alternatives(source_slug);
CREATE INDEX idx_product_categories_product ON public.product_categories(product_id);
CREATE INDEX idx_product_categories_category ON public.product_categories(category_id);
CREATE INDEX idx_product_tags_product ON public.product_tags(product_id);
CREATE INDEX idx_alternative_products_alternative ON public.alternative_products(alternative_id);
CREATE INDEX idx_saved_tools_session ON public.saved_tools(session_key);
CREATE INDEX idx_comparison_lists_session ON public.comparison_lists(session_key);
CREATE INDEX idx_comparison_lists_share_token ON public.comparison_lists(share_token);
CREATE INDEX idx_comparison_list_items_list ON public.comparison_list_items(comparison_list_id);

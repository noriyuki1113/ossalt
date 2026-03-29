
-- Create app_role enum for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
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

-- RLS for user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are publicly readable" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are publicly readable" ON public.products FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Product Categories junction
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (product_id, category_id)
);
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product categories are publicly readable" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_categories" ON public.product_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Product Tags junction
CREATE TABLE public.product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (product_id, tag_id)
);
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product tags are publicly readable" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_tags" ON public.product_tags FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Alternatives (e.g. "Notionの代替")
CREATE TABLE public.alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alternatives are publicly readable" ON public.alternatives FOR SELECT USING (true);
CREATE POLICY "Admins can manage alternatives" ON public.alternatives FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_alternatives_updated_at BEFORE UPDATE ON public.alternatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Alternative Products junction
CREATE TABLE public.alternative_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alternative_id UUID REFERENCES public.alternatives(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rank_order INTEGER DEFAULT 0,
  reason_summary TEXT,
  UNIQUE (alternative_id, product_id)
);
ALTER TABLE public.alternative_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alternative products are publicly readable" ON public.alternative_products FOR SELECT USING (true);
CREATE POLICY "Admins can manage alternative_products" ON public.alternative_products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Product Features
CREATE TABLE public.product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT
);
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product features are publicly readable" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_features" ON public.product_features FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage submissions" ON public.submissions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_alternatives_source_slug ON public.alternatives(source_slug);
CREATE INDEX idx_product_categories_product ON public.product_categories(product_id);
CREATE INDEX idx_product_categories_category ON public.product_categories(category_id);
CREATE INDEX idx_product_tags_product ON public.product_tags(product_id);
CREATE INDEX idx_alternative_products_alternative ON public.alternative_products(alternative_id);

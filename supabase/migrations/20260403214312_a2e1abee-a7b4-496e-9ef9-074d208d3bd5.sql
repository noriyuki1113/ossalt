
-- 1. listing_requests: Free listing submissions
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

-- 2. monetization_leads: Upsell / sponsor inquiry leads
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
CREATE POLICY "Anyone can submit monetization lead" ON public.monetization_leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can manage monetization_leads" ON public.monetization_leads FOR ALL TO public USING (has_role(auth.uid(), 'admin'));

-- 3. sponsor_slots: Active sponsor placements
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

-- 4. partner_cards: Partner / affiliate cards on detail pages
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

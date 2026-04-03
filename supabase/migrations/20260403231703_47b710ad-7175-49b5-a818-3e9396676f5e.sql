
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

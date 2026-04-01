
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

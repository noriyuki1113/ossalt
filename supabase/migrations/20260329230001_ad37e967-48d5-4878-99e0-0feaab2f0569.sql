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
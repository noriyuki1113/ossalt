
DROP POLICY "Anyone can submit monetization lead" ON public.monetization_leads;
CREATE POLICY "Anyone can submit monetization lead" ON public.monetization_leads FOR INSERT TO public WITH CHECK (
  length(coalesce(email, '')) > 0 AND length(coalesce(email, '')) <= 320
);

CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  provider TEXT,
  page_path TEXT,
  link_url TEXT,
  cta_label TEXT,
  payload JSONB,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (length(event_type) > 0 AND length(event_type) <= 100);

CREATE POLICY "Admins can manage analytics events"
  ON public.analytics_events FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_analytics_events_type_created ON public.analytics_events (event_type, created_at DESC);
CREATE INDEX idx_analytics_events_provider ON public.analytics_events (provider);
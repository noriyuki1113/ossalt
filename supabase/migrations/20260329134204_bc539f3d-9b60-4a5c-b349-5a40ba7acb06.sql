
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS logo_source text DEFAULT 'manual';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS logo_background text DEFAULT 'gray';

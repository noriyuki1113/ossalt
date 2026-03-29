ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS logo_github_readme_url text,
  ADD COLUMN IF NOT EXISTS logo_github_avatar_url text,
  ADD COLUMN IF NOT EXISTS logo_favicon_url text;
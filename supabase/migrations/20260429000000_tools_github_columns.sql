-- sync_products.py が書き込むカラムを追加
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS github_stars    integer,
  ADD COLUMN IF NOT EXISTS github_forks    integer,
  ADD COLUMN IF NOT EXISTS github_issues   integer,
  ADD COLUMN IF NOT EXISTS github_watchers integer,
  ADD COLUMN IF NOT EXISTS github_language text,
  ADD COLUMN IF NOT EXISTS github_license  text,
  ADD COLUMN IF NOT EXISTS github_archived boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_commit_at  timestamptz,
  ADD COLUMN IF NOT EXISTS latest_release_name         text,
  ADD COLUMN IF NOT EXISTS latest_release_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS checked_at      timestamptz;

-- インデックス（アーカイブ済み・最終コミット日でフィルタ用）
CREATE INDEX IF NOT EXISTS tools_github_archived_idx ON public.tools(github_archived);
CREATE INDEX IF NOT EXISTS tools_checked_at_idx ON public.tools(checked_at);

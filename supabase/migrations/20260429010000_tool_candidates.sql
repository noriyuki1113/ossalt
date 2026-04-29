-- discover_tools.py が書き込むOSS候補テーブル
CREATE TABLE IF NOT EXISTS public.tool_candidates (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  github_url         text NOT NULL,
  official_url       text,
  description        text,
  stars              integer,
  forks              integer,
  language           text,
  license            text,
  category           text,
  competitor         text,
  discovery_keyword  text,
  status             text NOT NULL DEFAULT 'pending',  -- 'pending'|'approved'|'rejected'
  score              integer NOT NULL DEFAULT 0,
  reviewed_at        timestamptz,
  checked_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- github_url は重複不可
CREATE UNIQUE INDEX IF NOT EXISTS tool_candidates_github_url_idx
  ON public.tool_candidates(github_url);

-- レビュー用インデックス
CREATE INDEX IF NOT EXISTS tool_candidates_status_score_idx
  ON public.tool_candidates(status, score DESC);

ALTER TABLE public.tool_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tool_candidates"
  ON public.tool_candidates FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));

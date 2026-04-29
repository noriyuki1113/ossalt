-- check_seo.py が書き込むSEOチェック結果テーブル
CREATE TABLE IF NOT EXISTS public.seo_checks (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url                  text NOT NULL,
  status               text NOT NULL,          -- 'ok' | 'warn' | 'error'
  http_status          integer,
  title                text,
  meta_description     text,
  has_canonical        boolean DEFAULT false,
  has_og_title         boolean DEFAULT false,
  has_og_description   boolean DEFAULT false,
  has_json_ld          boolean DEFAULT false,
  contains_loading_text boolean DEFAULT false,
  response_ms          integer,
  error_message        text,
  checked_at           timestamptz NOT NULL DEFAULT now()
);

-- 直近チェック結果を高速取得するインデックス
CREATE INDEX IF NOT EXISTS seo_checks_url_checked_idx
  ON public.seo_checks(url, checked_at DESC);

CREATE INDEX IF NOT EXISTS seo_checks_status_idx
  ON public.seo_checks(status, checked_at DESC);

ALTER TABLE public.seo_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage seo_checks"
  ON public.seo_checks FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));

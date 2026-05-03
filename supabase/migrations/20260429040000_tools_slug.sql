-- tools テーブルに slug カラムを追加
-- SEO改善: /tools/:id → /tools/:slug URLへの移行

ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS tools_slug_unique_idx
  ON public.tools(slug)
  WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS tools_slug_idx
  ON public.tools(slug);

-- 既存データのslugをnameから自動生成（暫定）
-- 本番では手動またはスクリプトで正確なslugを設定する
UPDATE public.tools
SET slug = lower(
  regexp_replace(
    regexp_replace(name, '[^a-zA-Z0-9\s\-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL AND name IS NOT NULL;

-- ============================================================
-- tool_categories: 10行固定。CategoryFilter.tsx / category-slugs.ts /
-- News.tsx / sitemap/index.ts に散らばっていたハードコードされた
-- カテゴリ対応表の単一の情報源になる。
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tool_categories (
  slug          TEXT PRIMARY KEY,
  name_ja       TEXT NOT NULL,   -- 現行の parent_category_ja の実際の値と完全一致
  short_name_ja TEXT NOT NULL,   -- 現行の CategoryFilter.tsx の短縮ラベルと一致
  sort_order    INT  NOT NULL
);

INSERT INTO public.tool_categories (slug, name_ja, short_name_ja, sort_order) VALUES
  ('ai-ml',           'AI・機械学習',             'AI・ML',            1),
  ('business',        'ビジネスソフトウェア',      '業務ソフト',         2),
  ('developer-tools', '開発者ツール',              '開発ツール',         3),
  ('infrastructure',  'インフラ・運用',            'インフラ・運用',      4),
  ('data-analytics',  'データ・分析',              'データ・分析',        5),
  ('content',         'コンテンツ・パブリッシング', 'コンテンツ',         6),
  ('productivity',    '生産性・ユーティリティ',     '生産性・便利ツール',  7),
  ('security',        'セキュリティ・プライバシー', 'セキュリティ',       8),
  ('community',       'コミュニティ・ソーシャル',   'コミュニティ',       9),
  ('other',           'その他',                   'その他',            10)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tool categories are publicly readable" ON public.tool_categories
  FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage tool_categories" ON public.tool_categories
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- competitors: AlternativesPage.tsx の SLUG_MAP（約50件）をそのままシード。
-- ============================================================
CREATE TABLE IF NOT EXISTS public.competitors (
  slug    TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ja TEXT
);

INSERT INTO public.competitors (slug, name_en) VALUES
  ('notion','Notion'), ('figma','Figma'), ('zapier','Zapier'), ('slack','Slack'),
  ('firebase','Firebase'), ('airtable','Airtable'), ('trello','Trello'), ('jira','Jira'),
  ('wordpress','WordPress'), ('shopify','Shopify'), ('google-analytics','Google Analytics'),
  ('datadog','Datadog'), ('auth0','Auth0'), ('typeform','Typeform'),
  ('github-copilot','GitHub Copilot'), ('tableau','Tableau'), ('contentful','Contentful'),
  ('launchdarkly','LaunchDarkly'), ('google-drive','Google Drive'), ('intercom','Intercom'),
  ('retool','Retool'), ('postman','Postman'), ('webflow','Webflow'), ('evernote','Evernote'),
  ('chatgpt','ChatGPT'), ('devin','Devin'), ('stripe-billing','Stripe Billing'),
  ('pinecone','Pinecone'), ('bitly','Bitly'), ('canny','Canny'), ('zendesk','Zendesk'),
  ('linear','Linear'), ('asana','Asana'), ('confluence','Confluence'), ('sentry','Sentry'),
  ('miro','Miro'), ('mixpanel','Mixpanel'), ('hubspot','HubSpot'), ('clickup','ClickUp'),
  ('pagerduty','PagerDuty'), ('sendgrid','SendGrid'), ('heroku','Heroku'),
  ('calendly','Calendly'), ('mailchimp','Mailchimp'), ('discord','Discord'),
  ('monday','Monday.com'), ('loom','Loom'), ('vercel','Vercel'), ('doodle','Doodle'),
  ('github-actions','GitHub Actions'), ('circleci','CircleCI')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competitors are publicly readable" ON public.competitors
  FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage competitors" ON public.competitors
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- tools に新列を追加（最初はNULL許容でバックフィル用）
-- ============================================================
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS category_slug   TEXT REFERENCES public.tool_categories(slug),
  ADD COLUMN IF NOT EXISTS competitor_slug TEXT REFERENCES public.competitors(slug);

-- parent_category_ja からバックフィル（空テーブルではno-op。マッチしない値は
-- 'other' にフォールバック — 今回のバグの実例である短縮形/長い形の不一致も
-- ここで確実に一つのカテゴリに落ち着く）
UPDATE public.tools t
SET category_slug = COALESCE(
  (SELECT c.slug FROM public.tool_categories c WHERE c.name_ja = t.parent_category_ja),
  'other'
)
WHERE t.category_slug IS NULL;

-- primary_competitor からバックフィル（大文字小文字を無視して一致するもののみ。
-- マッチしないものはNULLのまま残る。下記トリアージクエリで確認すること:
--   SELECT id, name, primary_competitor FROM public.tools
--   WHERE primary_competitor IS NOT NULL AND competitor_slug IS NULL;
UPDATE public.tools t
SET competitor_slug = c.slug
FROM public.competitors c
WHERE t.competitor_slug IS NULL
  AND t.primary_competitor IS NOT NULL
  AND lower(t.primary_competitor) = lower(c.name_en);

ALTER TABLE public.tools ALTER COLUMN category_slug SET DEFAULT 'other';
ALTER TABLE public.tools ALTER COLUMN category_slug SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tools_category_slug   ON public.tools (category_slug);
CREATE INDEX IF NOT EXISTS idx_tools_competitor_slug ON public.tools (competitor_slug);

-- ============================================================
-- 同期トリガー: category_slug/competitor_slug が変更されたときに
-- 旧テキスト列(parent_category_ja / primary_competitor(_ja))を自動導出。
-- 不正なslugは例外を投げて書き込み自体を拒否する
-- ＝ 今回のバグの根本原因（不整合な自由入力）を書き込み時点で構造的に排除する。
-- これにより既存の全読み取りコードは変更なしで動き続ける。
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_tools_legacy_text_columns()
RETURNS TRIGGER AS $$
DECLARE
  cat  RECORD;
  comp RECORD;
BEGIN
  IF TG_OP = 'INSERT' OR NEW.category_slug IS DISTINCT FROM OLD.category_slug THEN
    SELECT name_ja INTO cat FROM public.tool_categories WHERE slug = NEW.category_slug;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'invalid category_slug: % (must exist in tool_categories)', NEW.category_slug;
    END IF;
    NEW.parent_category_ja := cat.name_ja;
  END IF;

  IF TG_OP = 'INSERT' OR NEW.competitor_slug IS DISTINCT FROM OLD.competitor_slug THEN
    IF NEW.competitor_slug IS NOT NULL THEN
      SELECT name_en, name_ja INTO comp FROM public.competitors WHERE slug = NEW.competitor_slug;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'invalid competitor_slug: % (must exist in competitors)', NEW.competitor_slug;
      END IF;
      NEW.primary_competitor    := comp.name_en;
      NEW.primary_competitor_ja := COALESCE(comp.name_ja, comp.name_en);
    ELSE
      NEW.primary_competitor    := NULL;
      NEW.primary_competitor_ja := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_tools_legacy_text ON public.tools;
CREATE TRIGGER trg_sync_tools_legacy_text
  BEFORE INSERT OR UPDATE OF category_slug, competitor_slug ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.sync_tools_legacy_text_columns();

NOTIFY pgrst, 'reload schema';

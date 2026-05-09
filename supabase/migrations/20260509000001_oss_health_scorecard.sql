-- OSS健全性スコア（OpenSSF Scorecard）
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS scorecard_score      DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS scorecard_updated_at TIMESTAMPTZ;

-- GitHubメトリクス補完（既存workerで取得可能）
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS open_issues_count INTEGER,
  ADD COLUMN IF NOT EXISTS subscriber_count  INTEGER;

-- セルフホスト・Docker情報（altstack-data連携）
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS docker_available   BOOLEAN,
  ADD COLUMN IF NOT EXISTS docker_compose_url TEXT;

-- スコアでの絞り込み・ソート用インデックス
CREATE INDEX IF NOT EXISTS idx_tools_scorecard_score
  ON public.tools (scorecard_score DESC NULLS LAST);

-- worker_runs: 各workerの実行履歴を記録する
CREATE TABLE IF NOT EXISTS public.worker_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name      text NOT NULL,                          -- 'sync_products' | 'discover_tools' | 'check_seo'
  status        text NOT NULL DEFAULT 'running',        -- 'running' | 'success' | 'error'
  success_count integer NOT NULL DEFAULT 0,
  skipped_count integer NOT NULL DEFAULT 0,
  error_count   integer NOT NULL DEFAULT 0,
  message       text,
  started_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz
);

-- 直近の実行履歴を高速取得
CREATE INDEX IF NOT EXISTS worker_runs_started_at_idx
  ON public.worker_runs(started_at DESC);

CREATE INDEX IF NOT EXISTS worker_runs_job_status_idx
  ON public.worker_runs(job_name, status, started_at DESC);

ALTER TABLE public.worker_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage worker_runs"
  ON public.worker_runs FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'));

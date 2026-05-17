-- AIエージェントが生成したOSSツール下書きテーブル
create table if not exists public.oss_tool_drafts (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  github_url text,
  name text,
  summary_ja text,
  category text,
  alternative_to text[],
  use_cases text[],
  pros text[],
  cons text[],
  vps_supported boolean,
  docker_supported boolean,
  difficulty text,
  license_note text,
  commercial_use_note text,
  recommended_for text[],
  not_recommended_for text[],
  setup_notes text,
  seo_title text,
  seo_description text,
  raw_ai_output jsonb,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updatedAtを自動更新するトリガー
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger oss_tool_drafts_updated_at
  before update on public.oss_tool_drafts
  for each row execute function public.set_updated_at();

-- 管理者のみアクセス可能（RLS無効 = service_role経由のみ）
alter table public.oss_tool_drafts enable row level security;

-- ossalt v2: migration-decision platform data model
-- This migration is additive: existing tables remain untouched until the v2
-- application switches its reads and writes to this model.

create extension if not exists pgcrypto;

create type public.ossalt_publication_state as enum ('draft', 'published', 'archived');
create type public.ossalt_verification_state as enum ('unverified', 'reviewing', 'verified', 'needs_review');
create type public.ossalt_evidence_kind as enum ('official_site', 'official_docs', 'official_repository', 'license', 'release_note', 'security_score', 'editorial_note');
create type public.ossalt_relation_state as enum ('candidate', 'verified', 'rejected');
create type public.ossalt_event_name as enum (
  'search_submitted', 'alternative_opened', 'tool_opened',
  'official_link_opened', 'github_link_opened', 'compare_opened',
  'guide_opened', 'newsletter_submitted', 'sponsor_opened'
);

-- A proprietary product is the starting point of a visitor's migration journey.
create table public.products_v2 (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  name_ja text,
  website_url text,
  category text,
  description_ja text,
  migration_summary_ja text,
  publication_state public.ossalt_publication_state not null default 'draft',
  source_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- An OSS project is intentionally separate from a source snapshot.
-- Editorial claims never overwrite the raw observation that supports them.
create table public.projects_v2 (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  name_ja text,
  short_description_ja text,
  category text,
  official_url text,
  repository_url text,
  license_spdx text,
  primary_language text,
  docker_available boolean,
  publication_state public.ossalt_publication_state not null default 'draft',
  verification_state public.ossalt_verification_state not null default 'unverified',
  verified_at timestamptz,
  verified_by text,
  source_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index projects_v2_repository_url_unique
  on public.projects_v2 (repository_url)
  where repository_url is not null;

-- A product can have several alternatives, and an OSS project can replace
-- several products. The relationship contains the editorial migration context.
create table public.alternative_relations_v2 (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products_v2(id) on delete cascade,
  project_id uuid not null references public.projects_v2(id) on delete cascade,
  relation_state public.ossalt_relation_state not null default 'candidate',
  migration_difficulty smallint check (migration_difficulty between 1 and 5),
  migration_summary_ja text,
  strengths_ja jsonb not null default '[]'::jsonb,
  constraints_ja jsonb not null default '[]'::jsonb,
  recommended_for_ja jsonb not null default '[]'::jsonb,
  not_recommended_for_ja jsonb not null default '[]'::jsonb,
  editorial_rank integer check (editorial_rank is null or editorial_rank > 0),
  source_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, project_id)
);

create index alternative_relations_v2_product_published_idx
  on public.alternative_relations_v2(product_id, relation_state, editorial_rank);
create index alternative_relations_v2_project_idx
  on public.alternative_relations_v2(project_id);

-- Every factual statement that matters for a decision can point to evidence.
create table public.evidence_sources_v2 (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects_v2(id) on delete cascade,
  product_id uuid references public.products_v2(id) on delete cascade,
  relation_id uuid references public.alternative_relations_v2(id) on delete cascade,
  kind public.ossalt_evidence_kind not null,
  label text not null,
  url text not null,
  observed_at timestamptz not null default now(),
  expires_at timestamptz,
  note_ja text,
  created_at timestamptz not null default now(),
  check (num_nonnulls(project_id, product_id, relation_id) = 1)
);

create index evidence_sources_v2_lookup_idx
  on public.evidence_sources_v2(project_id, product_id, relation_id, kind);

-- Time-series snapshots preserve GitHub and security observations instead of
-- presenting a dynamic value without its retrieval time.
create table public.project_snapshots_v2 (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects_v2(id) on delete cascade,
  observed_at timestamptz not null default now(),
  stars_count integer check (stars_count is null or stars_count >= 0),
  forks_count integer check (forks_count is null or forks_count >= 0),
  open_issues_count integer check (open_issues_count is null or open_issues_count >= 0),
  last_commit_at timestamptz,
  scorecard_score numeric(4,2) check (scorecard_score is null or scorecard_score between 0 and 10),
  source_url text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (project_id, observed_at)
);

create index project_snapshots_v2_latest_idx
  on public.project_snapshots_v2(project_id, observed_at desc);

-- Sponsor inventory is deliberately separate from products and relations:
-- payment can never affect an editorial order or verification state.
create table public.sponsor_placements_v2 (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  destination_url text not null,
  placement_kind text not null check (placement_kind in ('category', 'guide', 'related_service', 'newsletter')),
  target_key text,
  disclosure_label text not null default 'スポンサー',
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Event data is aggregated around the decision journey, not pageviews alone.
create table public.decision_events_v2 (
  id uuid primary key default gen_random_uuid(),
  event_name public.ossalt_event_name not null,
  occurred_at timestamptz not null default now(),
  product_id uuid references public.products_v2(id) on delete set null,
  project_id uuid references public.projects_v2(id) on delete set null,
  relation_id uuid references public.alternative_relations_v2(id) on delete set null,
  sponsor_placement_id uuid references public.sponsor_placements_v2(id) on delete set null,
  session_hash text,
  referrer_host text,
  metadata jsonb not null default '{}'::jsonb
);

create index decision_events_v2_analysis_idx
  on public.decision_events_v2(event_name, occurred_at desc);
create index decision_events_v2_product_idx
  on public.decision_events_v2(product_id, occurred_at desc)
  where product_id is not null;

-- Views give the front end a read-only published directory contract.
create view public.published_alternative_directory_v2
with (security_invoker = true) as
select
  relation.id as relation_id,
  product.slug as product_slug,
  product.name as product_name,
  product.name_ja as product_name_ja,
  project.id as project_id,
  project.slug as project_slug,
  project.name as project_name,
  project.name_ja as project_name_ja,
  project.short_description_ja,
  project.category,
  project.official_url,
  project.repository_url,
  project.license_spdx,
  project.primary_language,
  project.docker_available,
  project.verification_state,
  project.verified_at,
  project.source_checked_at,
  relation.migration_difficulty,
  relation.migration_summary_ja,
  relation.strengths_ja,
  relation.constraints_ja,
  relation.recommended_for_ja,
  relation.not_recommended_for_ja,
  relation.editorial_rank,
  snapshot.stars_count,
  snapshot.forks_count,
  snapshot.last_commit_at,
  snapshot.scorecard_score,
  snapshot.observed_at as snapshot_observed_at
from public.alternative_relations_v2 relation
join public.products_v2 product on product.id = relation.product_id
join public.projects_v2 project on project.id = relation.project_id
left join lateral (
  select *
  from public.project_snapshots_v2
  where project_id = project.id
  order by observed_at desc
  limit 1
) snapshot on true
where product.publication_state = 'published'
  and project.publication_state = 'published'
  and relation.relation_state = 'verified';

-- public read access: only published data and active disclosed placements.
alter table public.products_v2 enable row level security;
alter table public.projects_v2 enable row level security;
alter table public.alternative_relations_v2 enable row level security;
alter table public.evidence_sources_v2 enable row level security;
alter table public.project_snapshots_v2 enable row level security;
alter table public.sponsor_placements_v2 enable row level security;
alter table public.decision_events_v2 enable row level security;

create policy "published products are readable"
  on public.products_v2 for select using (publication_state = 'published');
create policy "published projects are readable"
  on public.projects_v2 for select using (publication_state = 'published');
create policy "verified relations are readable"
  on public.alternative_relations_v2 for select using (relation_state = 'verified');
create policy "evidence for published records is readable"
  on public.evidence_sources_v2 for select using (
    exists (select 1 from public.projects_v2 p where p.id = project_id and p.publication_state = 'published')
    or exists (select 1 from public.products_v2 p where p.id = product_id and p.publication_state = 'published')
    or exists (
      select 1 from public.alternative_relations_v2 r
      join public.products_v2 p on p.id = r.product_id
      join public.projects_v2 o on o.id = r.project_id
      where r.id = relation_id and r.relation_state = 'verified'
        and p.publication_state = 'published' and o.publication_state = 'published'
    )
  );
create policy "snapshots for published projects are readable"
  on public.project_snapshots_v2 for select using (
    exists (select 1 from public.projects_v2 p where p.id = project_id and p.publication_state = 'published')
  );
create policy "active sponsor placements are readable"
  on public.sponsor_placements_v2 for select using (
    is_active = true and starts_at <= now() and (ends_at is null or ends_at > now())
  );

-- Decision events are intentionally write-only from the public client.
create policy "public decision event insert"
  on public.decision_events_v2 for insert
  with check (event_name is not null);

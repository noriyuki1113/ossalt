-- Baseline documentation of the "ossalt-next" schema (Supabase project
-- acakchddmmuylifrgkbv), which already exists live with real data but has
-- never been version-controlled anywhere in this repository — it was
-- provisioned directly against that project in a separate session. This
-- migration exists so the schema has a reviewable, reproducible record; it
-- is NOT meant to be run with `apply_migration` against the live project
-- (every object here already exists there). Apply it via
-- `supabase link --project-ref acakchddmmuylifrgkbv && supabase db pull`
-- (which records the live schema as already-applied), or if the CLI is
-- unavailable, mark it applied without executing with
-- `supabase migration repair 20260924000001 --status applied` after
-- linking. Every table/column/constraint/policy below was confirmed
-- directly against the live database (pg_constraint, pg_policies,
-- pg_indexes, information_schema) before being written down here — this
-- is not a guess.
--
-- Do NOT confuse this with supabase/migrations/20260912060000_ossalt_v2_decision_platform.sql
-- (PR #24) — that migration creates a structurally different, `_v2`-suffixed
-- set of tables in the OLD `tools`-holding project, has zero application
-- code referencing it, and does not correspond to what's live here. It is a
-- separate, superseded design; its RLS/view patterns were used as a
-- starting template for this schema's equivalents but the two are unrelated
-- deployments.

create extension if not exists pgcrypto;

create type public.publication_state as enum ('draft', 'published', 'archived');
create type public.verification_state as enum ('unverified', 'reviewing', 'verified', 'needs_review');
create type public.evidence_kind as enum ('official_site', 'official_docs', 'official_repository', 'license', 'release_note', 'security_score', 'editorial_note');
create type public.relation_state as enum ('candidate', 'verified', 'rejected');
create type public.candidate_import_state as enum ('pending', 'enriched', 'rejected');
create type public.decision_event_name as enum (
  'search_submitted', 'alternative_opened', 'tool_opened',
  'official_link_opened', 'github_link_opened', 'compare_opened',
  'guide_opened', 'newsletter_submitted', 'sponsor_opened'
);

-- categories: hierarchical (self-referencing parent_id)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_ja text not null unique,
  parent_id uuid references public.categories(id) on delete restrict check (parent_id is null or parent_id <> id),
  sort_order integer not null default 0,
  description_ja text,
  aliases text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- licenses: lookup matching projects.license_spdx
create table public.licenses (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:[.-][a-z0-9]+)*$'),
  identifier text not null unique,
  aliases text[] not null default '{}'::text[],
  name text not null,
  kind text not null check (kind in ('osi', 'source_available')),
  copyleft text check (copyleft in ('none', 'weak', 'strong', 'network')),
  summary_ja text not null,
  reference_url text
);

create table public.vps_providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  affiliate_url text,
  official_url text not null,
  min_monthly_jpy integer not null check (min_monthly_jpy >= 0),
  pricing_checked_at date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- products: the proprietary SaaS being replaced
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  name_ja text,
  website_url text,
  category text,
  description_ja text,
  migration_summary_ja text,
  publication_state public.publication_state not null default 'draft',
  source_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  plan_name text,
  monthly_price_jpy integer check (monthly_price_jpy is null or monthly_price_jpy >= 0),
  pricing_source_url text,
  pricing_checked_at date
);

-- projects: the OSS project being recommended
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  name_ja text,
  short_description_ja text,
  official_url text,
  repository_url text,
  license_spdx text,
  primary_language text,
  docker_available boolean,
  publication_state public.publication_state not null default 'draft',
  verification_state public.verification_state not null default 'unverified',
  verified_at timestamptz,
  verified_by text,
  source_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index projects_repository_url_unique
  on public.projects (repository_url)
  where repository_url is not null;

create table public.project_categories (
  project_id uuid not null references public.projects(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (project_id, category_id)
);

create index project_categories_category_idx on public.project_categories (category_id);
create unique index project_categories_one_primary
  on public.project_categories (project_id) where is_primary;

-- alternative_relations: editorial product<->project link
create table public.alternative_relations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  relation_state public.relation_state not null default 'candidate',
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

create index alternative_relations_product_idx
  on public.alternative_relations (product_id, relation_state, editorial_rank);

-- evidence_sources: citations, polymorphic to exactly one of project/product/relation
create table public.evidence_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  relation_id uuid references public.alternative_relations(id) on delete cascade,
  kind public.evidence_kind not null,
  label text not null,
  url text not null,
  observed_at timestamptz not null default now(),
  expires_at timestamptz,
  note_ja text,
  created_at timestamptz not null default now(),
  check (num_nonnulls(project_id, product_id, relation_id) = 1)
);

create index evidence_sources_lookup_idx
  on public.evidence_sources (project_id, product_id, relation_id, kind);

-- project_snapshots: time-series GitHub/security metrics per project
create table public.project_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
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

create index project_snapshots_latest_idx
  on public.project_snapshots (project_id, observed_at desc);

create table public.tool_selfhost_guides (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.projects(id) on delete cascade,
  provider_id uuid not null references public.vps_providers(id) on delete cascade,
  method text not null check (method in ('startup_script', 'docker_compose', 'manual')),
  recommended_memory_gb numeric check (recommended_memory_gb is null or recommended_memory_gb > 0),
  steps_md text not null,
  source_url text not null,
  verified_at date not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tool_id, provider_id)
);

create index tool_selfhost_guides_tool_idx on public.tool_selfhost_guides (tool_id, status);

-- import_candidates: staging table for content awaiting editorial review.
-- No promotion/approval pipeline exists yet anywhere in this codebase —
-- that's Phase B follow-up work, not part of this baseline.
create table public.import_candidates (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text not null,
  source_slug text not null,
  category_path text[] not null default '{}'::text[],
  name text not null,
  description text,
  license_hint text,
  stars_hint text,
  import_state public.candidate_import_state not null default 'pending',
  imported_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  project_id uuid references public.projects(id) on delete set null,
  unique (source_name, source_slug)
);

create index import_candidates_state_idx
  on public.import_candidates (import_state, imported_at desc);

create table public.sponsor_placements (
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

create table public.decision_events (
  id uuid primary key default gen_random_uuid(),
  event_name public.decision_event_name not null,
  occurred_at timestamptz not null default now(),
  product_id uuid references public.products(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  relation_id uuid references public.alternative_relations(id) on delete set null,
  sponsor_placement_id uuid references public.sponsor_placements(id) on delete set null,
  session_hash text,
  referrer_host text,
  metadata jsonb not null default '{}'::jsonb
);

create index decision_events_analysis_idx
  on public.decision_events (event_name, occurred_at desc);

create table public.outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references public.projects(id) on delete set null,
  provider_id uuid references public.vps_providers(id) on delete set null,
  page_path text not null,
  created_at timestamptz not null default now()
);

create index outbound_clicks_provider_idx on public.outbound_clicks (provider_id, created_at desc);
create index outbound_clicks_created_idx on public.outbound_clicks (created_at desc);

-- RLS: enabled on every table, mirroring the live project's actual policies.
alter table public.categories enable row level security;
alter table public.licenses enable row level security;
alter table public.vps_providers enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.project_categories enable row level security;
alter table public.alternative_relations enable row level security;
alter table public.evidence_sources enable row level security;
alter table public.project_snapshots enable row level security;
alter table public.tool_selfhost_guides enable row level security;
alter table public.import_candidates enable row level security;
alter table public.decision_events enable row level security;
alter table public.sponsor_placements enable row level security;
alter table public.outbound_clicks enable row level security;

create policy "categories readable" on public.categories
  for select to public using (true);

create policy "licenses readable" on public.licenses
  for select to public using (true);

create policy "active providers readable" on public.vps_providers
  for select to public using (is_active);

create policy "published products readable" on public.products
  for select to public using (publication_state = 'published');

create policy "published projects readable" on public.projects
  for select to public using (publication_state = 'published');

create policy "published project categories readable" on public.project_categories
  for select to public using (
    exists (select 1 from public.projects p where p.id = project_categories.project_id and p.publication_state = 'published')
  );

create policy "verified relations readable" on public.alternative_relations
  for select to public using (relation_state = 'verified');

create policy "published snapshots readable" on public.project_snapshots
  for select to public using (
    exists (select 1 from public.projects p where p.id = project_snapshots.project_id and p.publication_state = 'published')
  );

create policy "published guides readable" on public.tool_selfhost_guides
  for select to public using (status = 'published');

create policy "active placements readable" on public.sponsor_placements
  for select to public using (is_active and starts_at <= now() and (ends_at is null or ends_at > now()));

create policy "public event insert" on public.decision_events
  for insert to public with check (event_name is not null);

-- No SELECT policy on evidence_sources, import_candidates, or outbound_clicks
-- yet — all three are RLS-enabled-no-policy today (confirmed via the
-- Supabase advisor), meaning anon/authenticated reads are rejected. A
-- public read policy for evidence_sources is added in the next migration
-- (needed for Phase A's trust-signal display); import_candidates and
-- outbound_clicks intentionally stay locked — the former is unreviewed
-- staging data, the latter isn't written from the client yet.

-- published_alternative_directory: a flattened, pre-joined view backing the
-- browse/search listing page. Exists live already (built by the same
-- out-of-band process that provisioned this schema) — documented here
-- verbatim via `pg_get_viewdef`, not redesigned. It resolves the primary
-- category and the full set of category slugs per project, joins the
-- license lookup by SPDX identifier or alias, always uses each project's
-- latest snapshot (LATERAL — PostgREST embedding can't express "only the
-- latest related row"), and lifts several fields out of
-- project_snapshots.raw_payload for convenient top-level access.
create view public.published_alternative_directory
with (security_invoker = true) as
select
  relation.id as relation_id,
  product.slug as product_slug,
  product.name as product_name,
  product.name_ja as product_name_ja,
  product.plan_name as product_plan_name,
  product.monthly_price_jpy as product_monthly_price_jpy,
  product.pricing_source_url as product_pricing_source_url,
  product.pricing_checked_at as product_pricing_checked_at,
  project.id as project_id,
  project.slug as project_slug,
  project.name as project_name,
  project.name_ja as project_name_ja,
  project.short_description_ja,
  primary_category.name_ja as category,
  primary_category.slug as category_slug,
  coalesce(project_category_slugs.slugs, '{}'::text[]) as category_slugs,
  project.official_url,
  project.repository_url,
  project.license_spdx,
  license.slug as license_slug,
  license.name as license_name,
  license.kind as license_kind,
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
  snapshot.last_commit_at,
  snapshot.observed_at as snapshot_observed_at,
  snapshot.forks_count,
  snapshot.open_issues_count,
  snapshot.raw_payload ->> 'owner_avatar_url' as owner_avatar_url,
  snapshot.raw_payload ->> 'repository_created_at' as repository_created_at,
  snapshot.raw_payload ->> 'latest_release_tag' as latest_release_tag,
  snapshot.raw_payload ->> 'latest_release_published_at' as latest_release_published_at,
  snapshot.raw_payload -> 'topics' as topics
from public.alternative_relations relation
join public.products product on product.id = relation.product_id
join public.projects project on project.id = relation.project_id
left join lateral (
  select c.name_ja, c.slug
  from public.project_categories pc
  join public.categories c on c.id = pc.category_id
  where pc.project_id = project.id and pc.is_primary
  limit 1
) primary_category on true
left join lateral (
  select array_agg(c.slug order by pc.is_primary desc, c.sort_order, c.slug) as slugs
  from public.project_categories pc
  join public.categories c on c.id = pc.category_id
  where pc.project_id = project.id
) project_category_slugs on true
left join lateral (
  select l.slug, l.name, l.kind
  from public.licenses l
  where l.identifier = project.license_spdx or project.license_spdx = any (l.aliases)
  limit 1
) license on true
left join lateral (
  select *
  from public.project_snapshots
  where project_snapshots.project_id = project.id
  order by project_snapshots.observed_at desc
  limit 1
) snapshot on true
where product.publication_state = 'published'
  and project.publication_state = 'published'
  and relation.relation_state = 'verified';

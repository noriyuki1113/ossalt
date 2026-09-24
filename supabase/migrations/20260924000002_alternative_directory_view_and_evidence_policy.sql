-- Adds a public SELECT policy for evidence_sources (needed to show
-- confirmation dates/source links on the tool detail page — this is the
-- schema-native version of the ad-hoc verified_at/verification_source_url
-- columns bolted onto the old `tools` table), and appends one column to the
-- already-live published_alternative_directory view.
--
-- Note: this migration originally planned to create the
-- published_alternative_directory view from scratch. It turned out to
-- already exist live (built by the same out-of-band process that
-- provisioned this schema, and considerably more complete than a first
-- draft would have been — it already resolves primary/all category slugs,
-- joins licenses by SPDX identifier or alias, and surfaces several GitHub
-- metadata fields out of project_snapshots' raw_payload). Its as-found
-- definition is documented verbatim in 20260924000001_ossalt_next_baseline.sql.
-- This migration only adds `project_created_at` (needed for Phase A's
-- "追加順" newest-first sort, which the as-found view didn't expose) via
-- CREATE OR REPLACE VIEW, appended at the end since Postgres doesn't allow
-- reordering or removing columns that way.

create policy "evidence for published records is readable" on public.evidence_sources
  for select to public using (
    (project_id is not null and exists (
      select 1 from public.projects p where p.id = evidence_sources.project_id and p.publication_state = 'published'
    ))
    or (product_id is not null and exists (
      select 1 from public.products pr where pr.id = evidence_sources.product_id and pr.publication_state = 'published'
    ))
    or (relation_id is not null and exists (
      select 1 from public.alternative_relations r
      join public.products pr on pr.id = r.product_id
      join public.projects p on p.id = r.project_id
      where r.id = evidence_sources.relation_id
        and r.relation_state = 'verified'
        and pr.publication_state = 'published'
        and p.publication_state = 'published'
    ))
  );

-- Phase A's "追加順" (newest-first) sort needs projects.created_at, which
-- the existing view doesn't expose. CREATE OR REPLACE VIEW can only append
-- columns at the end of the existing definition (Postgres rejects reordering
-- or removing columns), so the column is added last rather than inlined
-- next to the other project.* columns above it.
create or replace view public.published_alternative_directory
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
  snapshot.raw_payload -> 'topics' as topics,
  project.created_at as project_created_at
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

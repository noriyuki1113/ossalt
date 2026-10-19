-- Discovery records are private. Only reviewed records should be added to tools.
create table public.openalternative_candidates (
  id bigint generated always as identity primary key,
  name text not null,
  source_url text not null unique,
  description_en text not null,
  parent_category_en text not null,
  category_en text not null,
  license_claim text,
  stars_claim text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'rejected')),
  discovered_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create unique index openalternative_candidates_name_ci
  on public.openalternative_candidates (lower(btrim(name)));

alter table public.openalternative_candidates enable row level security;
create policy "Admins can review OpenAlternative candidates"
  on public.openalternative_candidates for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

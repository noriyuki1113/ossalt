# OpenAlternative candidate sync

This job only queues discovery records in `openalternative_candidates`. It never
inserts into `tools`. The source is the CC0 curated list in
`piotrkulpinski/open-source-alternatives`; the list links to OpenAlternative's
pages, not directly to the projects' GitHub repositories. License and star
labels are source claims and must be verified against the official repository.

Deployment order:

1. Apply migration `20261019000000_openalternative_candidates.sql` to the
   production database before deploying the Edge Function.
2. Set the Edge Function secret `SYNC_OPENALTERNATIVE_TOKEN` to a newly generated
   random value. Set the GitHub Actions repository secret of the same name to
   that value. Never use the publishable/anon key as the sync token.
3. Deploy the Edge Function and run the weekly workflow, or invoke the sync as
   an authenticated admin from `/admin`. The workflow queues at most 50 new
   candidates per run (configurable between 1 and 100).
4. Review the candidates in `/admin`, verify each project's official GitHub
   repository, actual license, SaaS alternative and Japanese description, then
   create a draft with `/admin/agent` before manually publishing it.

The candidate table is private under RLS. The Edge Function accepts only a
verified admin session or the scheduled workflow's sync token. Repeated runs
skip names already published or queued, including reviewed or rejected ones.

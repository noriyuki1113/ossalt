import { useQuery } from "@tanstack/react-query";
import { searchTerms } from "@/lib/tool-search";
import { buildCategoryTree, type CategoryRow } from "@/lib/category-tree";

// Dynamic import breaks supabase out of the initial modulepreload chain.
// The promise is cached after first resolution so repeated calls are free.
let _sbPromise: Promise<typeof import("@/integrations/supabase/client")> | null = null;
const sb = () => (_sbPromise ??= import("@/integrations/supabase/client")).then(m => m.supabase);

// One row of the `published_alternative_directory` view — a verified,
// published alternative_relation joined with its product, project, primary
// category, license, and latest GitHub/security snapshot. See
// supabase/migrations/20260924000001_ossalt_next_baseline.sql for the full
// view definition.
export interface AlternativeListing {
  relation_id: string;
  product_slug: string | null;
  product_name: string | null;
  product_name_ja: string | null;
  project_id: string;
  project_slug: string;
  project_name: string | null;
  project_name_ja: string | null;
  short_description_ja: string | null;
  category: string | null;
  category_slug: string | null;
  category_slugs: string[] | null;
  official_url: string | null;
  repository_url: string | null;
  license_spdx: string | null;
  license_slug: string | null;
  license_name: string | null;
  primary_language: string | null;
  docker_available: boolean | null;
  verification_state: string | null;
  verified_at: string | null;
  stars_count: number | null;
  forks_count: number | null;
  open_issues_count: number | null;
  last_commit_at: string | null;
  project_created_at: string | null;
}

const LISTING_COLUMNS = [
  "relation_id",
  "product_slug",
  "product_name",
  "product_name_ja",
  "project_id",
  "project_slug",
  "project_name",
  "project_name_ja",
  "short_description_ja",
  "category",
  "category_slug",
  "category_slugs",
  "official_url",
  "repository_url",
  "license_spdx",
  "license_slug",
  "license_name",
  "primary_language",
  "docker_available",
  "verification_state",
  "verified_at",
  "stars_count",
  "forks_count",
  "open_issues_count",
  "last_commit_at",
  "project_created_at",
].join(", ");

export type SortOption = "stars" | "recent" | "name" | "newest";

interface UseAlternativeListingsOptions {
  // Resolved by the caller via useCategories() + collectSlugs() — the
  // selected category's own slug plus all of its descendants' slugs, so
  // selecting a parent category also matches projects tagged only with a
  // child category. Passing a single-element array filters to just that slug.
  categorySlugs?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: SortOption;
  license?: string;
  hasGithub?: boolean;
  hasDocker?: boolean;
}

function listingSearchFilter(term: string): string {
  return ["project_name", "project_name_ja", "short_description_ja", "product_name", "product_name_ja"]
    .map(column => `${column}.ilike.%${term}%`).join(",");
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    // Categories rarely change — cache for 30 minutes
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await (await sb())
        .from("categories")
        .select("id, slug, name_ja, parent_id, sort_order");
      if (error) throw error;
      return buildCategoryTree((data as CategoryRow[]) || []);
    },
  });
}

export function useAlternativeListings(options?: UseAlternativeListingsOptions) {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? 24;

  return useQuery({
    queryKey: ["alternative-listings", options],
    // Listing can stay fresh for 3 minutes — balances freshness vs network cost
    staleTime: 3 * 60 * 1000,
    queryFn: async () => {
      const supabase = await sb();
      const sort = options?.sort ?? "stars";
      let query = supabase
        .from("published_alternative_directory")
        .select(LISTING_COLUMNS, { count: "exact" });

      if (sort === "recent") {
        query = query.order("last_commit_at", { ascending: false, nullsFirst: false });
      } else if (sort === "name") {
        query = query.order("project_name", { ascending: true, nullsFirst: false });
      } else if (sort === "newest") {
        query = query.order("project_created_at", { ascending: false, nullsFirst: false });
      } else {
        query = query.order("stars_count", { ascending: false, nullsFirst: false });
      }

      query = query.range(page * pageSize, (page + 1) * pageSize - 1);

      if (options?.categorySlugs?.length) {
        query = query.overlaps("category_slugs", options.categorySlugs);
      }

      for (const term of searchTerms(options?.search || "")) {
        query = query.or(listingSearchFilter(term));
      }

      if (options?.license) {
        query = query.eq("license_spdx", options.license);
      }

      if (options?.hasGithub) {
        query = query.not("repository_url", "is", null);
      }

      if (options?.hasDocker) {
        query = query.eq("docker_available", true);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { listings: (data as unknown as AlternativeListing[]) || [], totalCount: count || 0 };
    },
  });
}

export function useRelatedListings(options: { productSlug?: string | null; categorySlug?: string | null; excludeProjectId?: string }) {
  const { productSlug, categorySlug, excludeProjectId } = options;
  return useQuery({
    queryKey: ["related-listings", productSlug, categorySlug, excludeProjectId],
    queryFn: async () => {
      const supabase = await sb();
      const results: AlternativeListing[] = [];

      if (productSlug) {
        const { data } = await supabase
          .from("published_alternative_directory")
          .select(LISTING_COLUMNS)
          .eq("product_slug", productSlug)
          .neq("project_id", excludeProjectId ?? "")
          .order("stars_count", { ascending: false, nullsFirst: false })
          .limit(6);
        if (data) results.push(...(data as unknown as AlternativeListing[]));
      }

      if (results.length < 6 && categorySlug) {
        const existingIds = new Set([excludeProjectId, ...results.map(l => l.project_id)]);
        const { data } = await supabase
          .from("published_alternative_directory")
          .select(LISTING_COLUMNS)
          .contains("category_slugs", [categorySlug])
          .order("stars_count", { ascending: false, nullsFirst: false })
          .limit(10);
        if (data) {
          for (const l of data as unknown as AlternativeListing[]) {
            if (!existingIds.has(l.project_id) && results.length < 6) {
              results.push(l);
            }
          }
        }
      }

      return results;
    },
    enabled: !!(productSlug || categorySlug),
  });
}

export interface ProjectDetail {
  id: string;
  slug: string;
  name: string;
  name_ja: string | null;
  short_description_ja: string | null;
  official_url: string | null;
  repository_url: string | null;
  license_spdx: string | null;
  primary_language: string | null;
  docker_available: boolean | null;
  publication_state: string;
  verification_state: string;
  verified_at: string | null;
  verified_by: string | null;
  source_checked_at: string | null;
  created_at: string;
  relations: Array<{
    id: string;
    relation_state: string;
    migration_difficulty: number | null;
    migration_summary_ja: string | null;
    strengths_ja: unknown;
    constraints_ja: unknown;
    recommended_for_ja: unknown;
    not_recommended_for_ja: unknown;
    editorial_rank: number | null;
    product: {
      id: string;
      slug: string;
      name: string;
      name_ja: string | null;
      website_url: string | null;
      category: string | null;
    };
  }>;
  evidence_sources: Array<{
    id: string;
    kind: string;
    label: string;
    url: string;
    observed_at: string;
    note_ja: string | null;
  }>;
  project_snapshots: Array<{
    observed_at: string;
    stars_count: number | null;
    forks_count: number | null;
    open_issues_count: number | null;
    last_commit_at: string | null;
    scorecard_score: number | null;
  }>;
  project_categories: Array<{
    is_primary: boolean;
    category: { slug: string; name_ja: string };
  }>;
}

export function useProjectDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ["project-detail", slug],
    queryFn: async (): Promise<ProjectDetail | null> => {
      const supabase = await sb();
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id, slug, name, name_ja, short_description_ja, official_url, repository_url,
          license_spdx, primary_language, docker_available, publication_state,
          verification_state, verified_at, verified_by, source_checked_at, created_at,
          relations:alternative_relations(
            id, relation_state, migration_difficulty, migration_summary_ja,
            strengths_ja, constraints_ja, recommended_for_ja, not_recommended_for_ja, editorial_rank,
            product:products(id, slug, name, name_ja, website_url, category)
          ),
          evidence_sources(id, kind, label, url, observed_at, note_ja),
          project_snapshots(observed_at, stars_count, forks_count, open_issues_count, last_commit_at, scorecard_score),
          project_categories(is_primary, category:categories(slug, name_ja))
        `)
        .eq("slug", slug)
        .eq("publication_state", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return data as unknown as ProjectDetail;
    },
    enabled: !!slug,
  });
}

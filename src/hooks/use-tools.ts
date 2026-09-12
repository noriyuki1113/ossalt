import { searchTerms, toolSearchFilter } from "@/lib/tool-search";
import { useQuery } from "@tanstack/react-query";
import { CATEGORY_MAP } from "@/components/CategoryFilter";

// Dynamic import breaks supabase out of the initial modulepreload chain.
// The promise is cached after first resolution so repeated calls are free.
let _sbPromise: Promise<typeof import("@/integrations/supabase/client")> | null = null;
const sb = () => (_sbPromise ??= import("@/integrations/supabase/client")).then(m => m.supabase);

export interface Tool {
  id: number;
  name: string | null;
  url: string | null;
  description_en: string | null;
  description_ja: string | null;
  parent_category_en: string | null;
  parent_category_ja: string | null;
  category_en: string | null;
  category_ja: string | null;
  category_slug: string | null;
  github_url: string | null;
  license: string | null;
  stars: string | null;
  stars_num: number | null;
  created_at: string | null;
  primary_competitor: string | null;
  primary_competitor_ja: string | null;
  competitor_slug: string | null;
  replaces: string[] | null;
  replaces_ja: string[] | null;
  forks_num: number | null;
  last_commit: string | null;
  language: string | null;
  github_stars_updated_at: string | null;
  scorecard_score: number | null;
  scorecard_updated_at: string | null;
  open_issues_count: number | null;
  subscriber_count: number | null;
  docker_available: boolean | null;
  docker_compose_url: string | null;
  self_hostable: boolean | null;
  verified_at: string | null;
  verification_source_url: string | null;
}

// NOTE: every column here must actually exist on the live `tools` table.
// scorecard_score/docker_available (added by
// supabase/migrations/20260509000001_oss_health_scorecard.sql) were once
// live in code for weeks while missing from production — PostgREST then
// rejects every query using this select list with a 42703 error, silently
// breaking all tool browsing and search. If you add a column here, apply
// the migration to production first (or in the same change), then run
// `NOTIFY pgrst, 'reload schema';` — PostgREST caches the schema and won't
// see a column added via a manual ALTER TABLE until that cache is reloaded.
export const TOOL_CARD_COLUMNS = [
  "id",
  "name",
  "url",
  "github_url",
  "description_ja",
  "description_en",
  "parent_category_ja",
  "category_slug",
  "primary_competitor",
  "primary_competitor_ja",
  "competitor_slug",
  "stars_num",
  "language",
  "license",
  "forks_num",
  "last_commit",
  "scorecard_score",
  "docker_available",
  "created_at",
].join(", ");

export type SortOption = "stars" | "recent" | "name" | "newest";

interface UseToolsOptions {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: SortOption;
  license?: string;
  hasGithub?: boolean;
  hasDocker?: boolean;
}

export function useTools(options?: UseToolsOptions) {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? 24;

  return useQuery({
    queryKey: ["tools", options],
    // Tools list can stay fresh for 3 minutes — balances freshness vs network cost
    staleTime: 3 * 60 * 1000,
    queryFn: async () => {
      const sort = options?.sort ?? "stars";
      let query = (await sb())
        .from("tools")
        .select(TOOL_CARD_COLUMNS, { count: "exact" });

      if (sort === "recent") {
        query = query.order("last_commit", { ascending: false, nullsFirst: false });
      } else if (sort === "name") {
        query = query.order("name", { ascending: true, nullsFirst: false });
      } else if (sort === "newest") {
        query = query.order("created_at", { ascending: false, nullsFirst: false });
      } else {
        query = query.order("stars_num", { ascending: false, nullsFirst: false });
      }

      query = query.range(page * pageSize, (page + 1) * pageSize - 1);

      if (options?.category && options.category !== "すべて") {
        const dbCategory = CATEGORY_MAP[options.category] || options.category;
        query = query.eq("parent_category_ja", dbCategory);
      }

      for (const term of searchTerms(options?.search || "")) {
        query = query.or(toolSearchFilter(term));
      }

      if (options?.license) {
        query = query.eq("license", options.license);
      }

      if (options?.hasGithub) {
        query = query.not("github_url", "is", null);
      }

      if (options?.hasDocker) {
        // The column is present in production but not yet in the generated
        // Supabase TypeScript schema.
        query = query.filter("docker_available", "eq", true);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { tools: (data as unknown as Tool[]) || [], totalCount: count || 0 };
    },
  });
}

export function useToolCategories() {
  return useQuery({
    queryKey: ["tool-categories"],
    // Category counts rarely change — cache for 30 minutes
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await (await sb())
        .from("tools")
        .select("category_slug");
      if (error) throw error;

      const counts = new Map<string, number>();
      data?.forEach((t) => {
        const slug = t.category_slug;
        if (slug) counts.set(slug, (counts.get(slug) || 0) + 1);
      });

      return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([slug, count]) => ({ slug, count }));
    },
  });
}

export function useToolStats() {
  return useQuery({
    queryKey: ["tool-stats"],
    // Stats are aggregates that rarely change — cache for 1 hour
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    queryFn: async () => {
      const supabase = await sb();
      const [headResult, dataResult] = await Promise.all([
        supabase.from("tools").select("*", { count: "exact", head: true }),
        supabase.from("tools").select("stars_num, category_slug"),
      ]);

      if (headResult.error) throw headResult.error;
      if (dataResult.error) throw dataResult.error;

      const totalStars = dataResult.data?.reduce((sum, t) => sum + (t.stars_num || 0), 0) || 0;
      const categories = new Set(
        dataResult.data?.map((t) => t.category_slug).filter(Boolean)
      );

      return {
        toolCount: headResult.count || 0,
        categoryCount: categories.size,
        totalStars,
      };
    },
  });
}

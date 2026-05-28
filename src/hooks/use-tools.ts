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
  github_url: string | null;
  license: string | null;
  stars: string | null;
  stars_num: number | null;
  created_at: string | null;
  primary_competitor: string | null;
  primary_competitor_ja: string | null;
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
}

export const TOOL_CARD_COLUMNS = [
  "id",
  "name",
  "url",
  "github_url",
  "description_ja",
  "description_en",
  "parent_category_ja",
  "primary_competitor",
  "primary_competitor_ja",
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

      if (options?.search) {
        query = query.or(
          `name.ilike.%${options.search}%,description_ja.ilike.%${options.search}%,description_en.ilike.%${options.search}%,primary_competitor.ilike.%${options.search}%,primary_competitor_ja.ilike.%${options.search}%`
        );
      }

      if (options?.license) {
        query = query.eq("license", options.license);
      }

      if (options?.hasGithub) {
        query = query.not("github_url", "is", null);
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
        .select("parent_category_ja");
      if (error) throw error;

      const counts = new Map<string, number>();
      data?.forEach((t) => {
        const cat = t.parent_category_ja;
        if (cat) counts.set(cat, (counts.get(cat) || 0) + 1);
      });

      return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));
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
        supabase.from("tools").select("stars_num, parent_category_ja"),
      ]);

      if (headResult.error) throw headResult.error;
      if (dataResult.error) throw dataResult.error;

      const totalStars = dataResult.data?.reduce((sum, t) => sum + (t.stars_num || 0), 0) || 0;
      const categories = new Set(
        dataResult.data?.map((t) => t.parent_category_ja).filter(Boolean)
      );

      return {
        toolCount: headResult.count || 0,
        categoryCount: categories.size,
        totalStars,
      };
    },
  });
}

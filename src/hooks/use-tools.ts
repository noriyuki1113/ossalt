import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_MAP } from "@/components/CategoryFilter";

export interface Tool {
  id: number;
  slug: string | null;
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
}

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
    queryFn: async () => {
      const sort = options?.sort ?? "stars";
      let query = supabase
        .from("tools")
        .select("*", { count: "exact" });

      // Apply sort
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
      return { tools: (data as Tool[]) || [], totalCount: count || 0 };
    },
  });
}

export function useToolCategories() {
  return useQuery({
    queryKey: ["tool-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
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
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("tools")
        .select("stars_num, parent_category_ja", { count: "exact" });
      if (error) throw error;

      const totalStars = data?.reduce((sum, t) => sum + (t.stars_num || 0), 0) || 0;
      const categories = new Set(data?.map((t) => t.parent_category_ja).filter(Boolean));

      return {
        toolCount: count || 0,
        categoryCount: categories.size,
        totalStars,
      };
    },
  });
}

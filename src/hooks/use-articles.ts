import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useArticles(options?: { status?: string }) {
  return useQuery({
    queryKey: ["articles", options],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (options?.status) query = query.eq("status", options.status);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

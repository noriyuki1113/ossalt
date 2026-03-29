import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ───────── Products ───────── */

interface ProductFilter {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  featured?: boolean;
  japaneseOnly?: boolean;
  ossOnly?: boolean;
  selfHostOnly?: boolean;
  cloudOnly?: boolean;
}

export function useProducts(options?: ProductFilter) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (options?.featured) query = query.eq("featured", true);
      if (options?.japaneseOnly) query = query.eq("supports_japanese", true);
      if (options?.ossOnly) query = query.eq("is_open_source", true);
      if (options?.selfHostOnly) query = query.eq("is_self_hostable", true);
      if (options?.cloudOnly) query = query.eq("has_cloud", true);
      if (options?.search) query = query.or(`name.ilike.%${options.search}%,short_description.ilike.%${options.search}%`);

      const { data, error } = await query;
      if (error) throw error;

      let results = data || [];

      if (options?.categorySlug) {
        const { data: catData } = await supabase.from("categories").select("id").eq("slug", options.categorySlug).single();
        if (catData) {
          const { data: pcData } = await supabase.from("product_categories").select("product_id").eq("category_id", catData.id);
          const ids = new Set(pcData?.map(pc => pc.product_id) || []);
          results = results.filter(p => ids.has(p.id));
        } else {
          return [];
        }
      }

      if (options?.tagSlug) {
        const { data: tagData } = await supabase.from("tags").select("id").eq("slug", options.tagSlug).single();
        if (tagData) {
          const { data: ptData } = await supabase.from("product_tags").select("product_id").eq("tag_id", tagData.id);
          const ids = new Set(ptData?.map(pt => pt.product_id) || []);
          results = results.filter(p => ids.has(p.id));
        } else {
          return [];
        }
      }

      return results;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;

      const [pcRes, ptRes, featRes, altRes] = await Promise.all([
        supabase.from("product_categories").select("category_id, categories(*)").eq("product_id", data.id),
        supabase.from("product_tags").select("tag_id, tags(*)").eq("product_id", data.id),
        supabase.from("product_features").select("*").eq("product_id", data.id),
        supabase.from("alternative_products").select("alternative_id, alternatives(source_name, source_slug)").eq("product_id", data.id),
      ]);

      return {
        ...data,
        categories: pcRes.data?.map((pc: any) => pc.categories).filter(Boolean) || [],
        tags: ptRes.data?.map((pt: any) => pt.tags).filter(Boolean) || [],
        features: featRes.data || [],
        relatedAlternatives: altRes.data?.map((ap: any) => ap.alternatives).filter(Boolean) || [],
      };
    },
    enabled: !!slug,
  });
}

/* ───────── Categories ───────── */

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*").order("name");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCategoryProductCount(categoryId: string) {
  return useQuery({
    queryKey: ["category-product-count", categoryId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("product_categories")
        .select("*", { count: "exact", head: true })
        .eq("category_id", categoryId);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!categoryId,
  });
}

/* ───────── Alternatives ───────── */

export function useAlternatives(options?: { featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ["alternatives", options],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alternatives")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      let results = data || [];

      if (options?.featured) {
        results = results.filter(a => a.featured);
      }

      if (options?.search) {
        const q = options.search.toLowerCase();
        results = results.filter(a =>
          a.source_name.toLowerCase().includes(q) ||
          (a.description?.toLowerCase().includes(q))
        );
      }

      return results;
    },
  });
}

export function useAlternativesWithCounts() {
  return useQuery({
    queryKey: ["alternatives-with-counts"],
    queryFn: async () => {
      const { data: alts, error } = await supabase
        .from("alternatives")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      if (!alts || alts.length === 0) return [];

      const { data: counts } = await supabase
        .from("alternative_products")
        .select("alternative_id");

      const countMap = new Map<string, number>();
      counts?.forEach(c => {
        countMap.set(c.alternative_id, (countMap.get(c.alternative_id) || 0) + 1);
      });

      return alts.map(a => ({
        ...a,
        product_count: countMap.get(a.id) || 0,
      }));
    },
  });
}

export function useAlternative(slug: string) {
  return useQuery({
    queryKey: ["alternative", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alternatives")
        .select("*")
        .eq("source_slug", slug)
        .single();
      if (error) throw error;

      const { data: apData } = await supabase
        .from("alternative_products")
        .select("*, products(*)")
        .eq("alternative_id", data.id)
        .order("rank_order");

      // Get other alternatives for "related"
      const { data: relatedAlts } = await supabase
        .from("alternatives")
        .select("source_name, source_slug")
        .neq("id", data.id)
        .eq("featured", true)
        .limit(6);

      return {
        ...data,
        products: apData || [],
        relatedAlternatives: relatedAlts || [],
      };
    },
    enabled: !!slug,
  });
}

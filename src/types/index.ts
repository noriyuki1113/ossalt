import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  japanese_name?: string | null;
  japanese_description?: string | null;
  license?: string | null;
  github_stars?: number | null;
  github_forks?: number | null;
  last_commit_at?: string | null;
  self_host_difficulty?: string | null;
  best_for?: string | null;
  not_good_for?: string | null;
  source_origin?: string | null;
  source_url?: string | null;
};

export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  japanese_name?: string | null;
  japanese_description?: string | null;
};

export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Alternative = Database["public"]["Tables"]["alternatives"]["Row"] & {
  source_description?: string | null;
  japanese_source_name?: string | null;
  japanese_source_description?: string | null;
  category_hint?: string | null;
  source_url?: string | null;
};
export type AlternativeProduct = Database["public"]["Tables"]["alternative_products"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"] & {
  github_url?: string | null;
};
export type ProductFeature = Database["public"]["Tables"]["product_features"]["Row"];

export type ProductWithRelations = Product & {
  categories?: Category[];
  tags?: Tag[];
};

export type AlternativeWithProducts = Alternative & {
  category?: Category | null;
  products?: (AlternativeProduct & { product: Product })[];
};

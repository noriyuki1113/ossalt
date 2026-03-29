import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Alternative = Database["public"]["Tables"]["alternatives"]["Row"];
export type AlternativeProduct = Database["public"]["Tables"]["alternative_products"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type ProductFeature = Database["public"]["Tables"]["product_features"]["Row"];

export type ProductWithRelations = Product & {
  categories?: Category[];
  tags?: Tag[];
};

export type AlternativeWithProducts = Alternative & {
  category?: Category | null;
  products?: (AlternativeProduct & { product: Product })[];
};

-- 確認済みで application コードから一切参照されていない死んだテーブルを削除。
-- これらは以前試みられた完全正規化（UUID FKでproducts/categories/alternativesを
-- 結合する設計）の名残で、src/・supabase/functions/ を全文検索した結果、
-- .from("products") 等の参照はゼロ件だった。
DROP TABLE IF EXISTS public.product_features CASCADE;
DROP TABLE IF EXISTS public.product_tags CASCADE;
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.alternative_products CASCADE;
DROP TABLE IF EXISTS public.alternatives CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

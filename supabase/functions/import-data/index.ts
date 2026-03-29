import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImportProduct {
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  japanese_name?: string;
  japanese_description?: string;
  website_url?: string;
  github_url?: string;
  logo_url?: string;
  license?: string;
  github_stars?: number;
  github_forks?: number;
  supports_japanese?: boolean;
  is_open_source?: boolean;
  is_self_hostable?: boolean;
  has_cloud?: boolean;
  has_free_plan?: boolean;
  self_host_difficulty?: string;
  best_for?: string;
  not_good_for?: string;
  rank_order?: number;
  reason_summary?: string;
}

interface ImportAlternative {
  source_name: string;
  source_slug: string;
  source_description?: string;
  japanese_source_name?: string;
  japanese_source_description?: string;
  category_hint?: string;
  source_url?: string;
  featured?: boolean;
  products: ImportProduct[];
}

interface ImportPayload {
  source: string;
  alternatives: ImportAlternative[];
  dry_run?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth - must be admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is admin
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roleData || roleData.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse payload
    const payload: ImportPayload = await req.json();

    if (!payload.source || !Array.isArray(payload.alternatives)) {
      return new Response(JSON.stringify({ error: "Invalid payload: source and alternatives required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const isDryRun = payload.dry_run === true;

    // Create scrape_run record
    let scrapeRunId: string | null = null;
    if (!isDryRun) {
      const { data: run, error: runErr } = await supabase.from("scrape_runs").insert({
        source: payload.source,
        status: "running",
        started_at: new Date().toISOString(),
      }).select("id").single();
      if (runErr) throw runErr;
      scrapeRunId = run.id;
    }

    let alternativesUpserted = 0;
    let productsUpserted = 0;
    let linksUpserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    try {
      for (const alt of payload.alternatives) {
        if (!alt.source_name || !alt.source_slug) {
          errors.push(`Skipped alternative: missing source_name or source_slug`);
          skipped++;
          continue;
        }

        // Upsert alternative
        let alternativeId: string;
        if (!isDryRun) {
          const { data: existingAlt } = await supabase
            .from("alternatives")
            .select("id")
            .eq("source_slug", alt.source_slug)
            .maybeSingle();

          if (existingAlt) {
            const { error } = await supabase.from("alternatives").update({
              source_name: alt.source_name,
              description: alt.source_description || null,
              source_description: alt.source_description || null,
              japanese_source_name: alt.japanese_source_name || null,
              japanese_source_description: alt.japanese_source_description || null,
              category_hint: alt.category_hint || null,
              source_url: alt.source_url || null,
              featured: alt.featured ?? false,
            }).eq("id", existingAlt.id);
            if (error) { errors.push(`Alt update error (${alt.source_slug}): ${error.message}`); continue; }
            alternativeId = existingAlt.id;
          } else {
            const { data: newAlt, error } = await supabase.from("alternatives").insert({
              source_name: alt.source_name,
              source_slug: alt.source_slug,
              description: alt.source_description || null,
              source_description: alt.source_description || null,
              japanese_source_name: alt.japanese_source_name || null,
              japanese_source_description: alt.japanese_source_description || null,
              category_hint: alt.category_hint || null,
              source_url: alt.source_url || null,
              featured: alt.featured ?? false,
            }).select("id").single();
            if (error) { errors.push(`Alt insert error (${alt.source_slug}): ${error.message}`); continue; }
            alternativeId = newAlt.id;
          }
          alternativesUpserted++;
        } else {
          alternativeId = "dry-run";
          alternativesUpserted++;
        }

        // Upsert products
        for (const prod of alt.products || []) {
          if (!prod.name || !prod.slug) {
            errors.push(`Skipped product: missing name or slug`);
            skipped++;
            continue;
          }

          let productId: string;
          if (!isDryRun) {
            const { data: existingProd } = await supabase
              .from("products")
              .select("id")
              .eq("slug", prod.slug)
              .maybeSingle();

            const productData = {
              name: prod.name,
              slug: prod.slug,
              short_description: prod.short_description || null,
              description: prod.description || null,
              japanese_name: prod.japanese_name || null,
              japanese_description: prod.japanese_description || null,
              website_url: prod.website_url || null,
              github_url: prod.github_url || null,
              logo_url: prod.logo_url || null,
              license: prod.license || null,
              github_stars: prod.github_stars ?? 0,
              github_forks: prod.github_forks ?? 0,
              supports_japanese: prod.supports_japanese ?? false,
              is_open_source: prod.is_open_source ?? true,
              is_self_hostable: prod.is_self_hostable ?? false,
              has_cloud: prod.has_cloud ?? true,
              has_free_plan: prod.has_free_plan ?? false,
              self_host_difficulty: prod.self_host_difficulty || "medium",
              best_for: prod.best_for || null,
              not_good_for: prod.not_good_for || null,
              source_origin: payload.source,
              source_url: alt.source_url || null,
              status: "published",
            };

            if (existingProd) {
              const { error } = await supabase.from("products").update(productData).eq("id", existingProd.id);
              if (error) { errors.push(`Product update error (${prod.slug}): ${error.message}`); continue; }
              productId = existingProd.id;
            } else {
              const { data: newProd, error } = await supabase.from("products").insert(productData).select("id").single();
              if (error) { errors.push(`Product insert error (${prod.slug}): ${error.message}`); continue; }
              productId = newProd.id;
            }
            productsUpserted++;

            // Upsert alternative_products link
            const { data: existingLink } = await supabase
              .from("alternative_products")
              .select("id")
              .eq("alternative_id", alternativeId)
              .eq("product_id", productId)
              .maybeSingle();

            if (existingLink) {
              await supabase.from("alternative_products").update({
                rank_order: prod.rank_order ?? 0,
                reason_summary: prod.reason_summary || null,
              }).eq("id", existingLink.id);
            } else {
              const { error } = await supabase.from("alternative_products").insert({
                alternative_id: alternativeId,
                product_id: productId,
                rank_order: prod.rank_order ?? 0,
                reason_summary: prod.reason_summary || null,
              });
              if (error) { errors.push(`Link error (${alt.source_slug} -> ${prod.slug}): ${error.message}`); continue; }
            }
            linksUpserted++;
          } else {
            productsUpserted++;
            linksUpserted++;
          }
        }
      }

      // Update scrape_run
      if (scrapeRunId && !isDryRun) {
        await supabase.from("scrape_runs").update({
          status: errors.length > 0 ? "success" : "success",
          finished_at: new Date().toISOString(),
          meta: { alternatives_upserted: alternativesUpserted, products_upserted: productsUpserted, links_upserted: linksUpserted, skipped, errors },
        }).eq("id", scrapeRunId);
      }

      return new Response(JSON.stringify({
        success: true,
        dry_run: isDryRun,
        scrape_run_id: scrapeRunId,
        alternatives_upserted: alternativesUpserted,
        products_upserted: productsUpserted,
        links_upserted: linksUpserted,
        skipped,
        errors,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (processError: any) {
      if (scrapeRunId) {
        await supabase.from("scrape_runs").update({
          status: "failed",
          finished_at: new Date().toISOString(),
          error_message: processError.message,
          meta: { alternatives_upserted: alternativesUpserted, products_upserted: productsUpserted, links_upserted: linksUpserted, skipped, errors },
        }).eq("id", scrapeRunId);
      }
      throw processError;
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

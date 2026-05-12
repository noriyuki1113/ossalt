/**
 * Search abstraction layer for ossalt.jp
 *
 * Currently backed by Supabase full-text ILIKE queries.
 * To migrate to Typesense or Meilisearch:
 *   1. Implement SearchClient with the new backend
 *   2. Set VITE_SEARCH_BACKEND=typesense (or meilisearch)
 *   3. Replace activeClient below with the new implementation
 *
 * Migration guide:
 *   - Typesense: npm install typesense-instantsearch-adapter
 *     Configure TypesenseSearchClient with the host/apiKey from env vars
 *   - Meilisearch: npm install meilisearch
 *     Configure MeilisearchClient with host/apiKey from env vars
 */

export interface ToolSearchHit {
  id: number;
  name: string | null;
  url: string | null;
  github_url: string | null;
  description_ja: string | null;
  description_en: string | null;
  parent_category_ja: string | null;
  primary_competitor: string | null;
  primary_competitor_ja: string | null;
  stars_num: number | null;
  language: string | null;
  license: string | null;
  forks_num: number | null;
  last_commit: string | null;
  scorecard_score: number | null;
  docker_available: boolean | null;
  created_at: string | null;
}

export interface SearchFilters {
  category?: string;
  license?: string;
  hasGithub?: boolean;
}

export type SearchSortOption = "stars" | "recent" | "name" | "newest";

export interface SearchOptions {
  query: string;
  page?: number;
  pageSize?: number;
  filters?: SearchFilters;
  sort?: SearchSortOption;
}

export interface SearchResult {
  hits: ToolSearchHit[];
  totalCount: number;
  /** Processing time in milliseconds (provided by Typesense/Meilisearch) */
  processingTimeMs?: number;
  /** Which backend served this result */
  backend: "supabase" | "typesense" | "meilisearch";
}

export interface SearchClient {
  search(options: SearchOptions): Promise<SearchResult>;
  /** Returns true if the search backend is configured and reachable */
  isAvailable(): boolean;
  readonly backendName: "supabase" | "typesense" | "meilisearch";
}

// ── Supabase implementation (current default) ────────────────────────────────

import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_MAP } from "@/components/CategoryFilter";

const SEARCH_COLUMNS = [
  "id", "name", "url", "github_url", "description_ja", "description_en",
  "parent_category_ja", "primary_competitor", "primary_competitor_ja",
  "stars_num", "language", "license", "forks_num", "last_commit",
  "scorecard_score", "docker_available", "created_at",
].join(", ");

class SupabaseSearchClient implements SearchClient {
  readonly backendName = "supabase" as const;

  isAvailable() {
    return true;
  }

  async search({
    query,
    page = 0,
    pageSize = 24,
    filters = {},
    sort = "stars",
  }: SearchOptions): Promise<SearchResult> {
    let q = supabase.from("tools").select(SEARCH_COLUMNS, { count: "exact" });

    if (sort === "recent") {
      q = q.order("last_commit", { ascending: false, nullsFirst: false });
    } else if (sort === "name") {
      q = q.order("name", { ascending: true, nullsFirst: false });
    } else if (sort === "newest") {
      q = q.order("created_at", { ascending: false, nullsFirst: false });
    } else {
      q = q.order("stars_num", { ascending: false, nullsFirst: false });
    }

    q = q.range(page * pageSize, (page + 1) * pageSize - 1);

    if (filters.category && filters.category !== "すべて") {
      const dbCategory = CATEGORY_MAP[filters.category] || filters.category;
      q = q.eq("parent_category_ja", dbCategory);
    }

    if (query) {
      q = q.or(
        `name.ilike.%${query}%,description_ja.ilike.%${query}%,description_en.ilike.%${query}%,primary_competitor.ilike.%${query}%,primary_competitor_ja.ilike.%${query}%`
      );
    }

    if (filters.license) {
      q = q.eq("license", filters.license);
    }

    if (filters.hasGithub) {
      q = q.not("github_url", "is", null);
    }

    const { data, error, count } = await q;
    if (error) throw error;

    return {
      hits: (data as ToolSearchHit[]) || [],
      totalCount: count || 0,
      backend: "supabase",
    };
  }
}

// ── Typesense stub (swap in when ready) ──────────────────────────────────────
//
// import Typesense from "typesense";
//
// class TypesenseSearchClient implements SearchClient {
//   readonly backendName = "typesense" as const;
//   private client: Typesense.Client;
//
//   constructor() {
//     this.client = new Typesense.Client({
//       nodes: [{ host: import.meta.env.VITE_TYPESENSE_HOST, port: 443, protocol: "https" }],
//       apiKey: import.meta.env.VITE_TYPESENSE_SEARCH_KEY,
//       connectionTimeoutSeconds: 2,
//     });
//   }
//
//   isAvailable() {
//     return !!import.meta.env.VITE_TYPESENSE_HOST;
//   }
//
//   async search({ query, page = 0, pageSize = 24, filters = {}, sort = "stars" }: SearchOptions): Promise<SearchResult> {
//     const sortBy = sort === "stars" ? "stars_num:desc" : sort === "recent" ? "last_commit:desc" : sort === "newest" ? "created_at:desc" : "name:asc";
//     const filterBy = [
//       filters.category && filters.category !== "すべて" ? `parent_category_ja:=${filters.category}` : null,
//       filters.license ? `license:=${filters.license}` : null,
//       filters.hasGithub ? "github_url:!=" : null,
//     ].filter(Boolean).join(" && ");
//
//     const result = await this.client.collections("tools").documents().search({
//       q: query || "*",
//       query_by: "name,description_ja,description_en,primary_competitor,primary_competitor_ja",
//       sort_by: sortBy,
//       filter_by: filterBy || undefined,
//       page: page + 1,
//       per_page: pageSize,
//     });
//
//     return {
//       hits: result.hits?.map(h => h.document as ToolSearchHit) || [],
//       totalCount: result.found,
//       processingTimeMs: result.search_time_ms,
//       backend: "typesense",
//     };
//   }
// }

// ── Active client ─────────────────────────────────────────────────────────────

export const searchClient: SearchClient = new SupabaseSearchClient();
// To switch: replace with `new TypesenseSearchClient()` after configuring VITE_TYPESENSE_HOST

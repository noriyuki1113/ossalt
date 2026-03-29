export interface ImportProduct {
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

export interface ImportAlternative {
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

export interface ImportPayload {
  source: string;
  alternatives: ImportAlternative[];
  dry_run?: boolean;
}

export interface ImportResult {
  success: boolean;
  scrape_run_id?: string;
  alternatives_upserted: number;
  products_upserted: number;
  links_upserted: number;
  skipped: number;
  errors: string[];
}

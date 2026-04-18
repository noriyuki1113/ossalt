// Automation pipeline types

export type SourceType = "github_trending" | "github_search" | "producthunt" | "hn_ask" | "manual";
export type QueueStatus = "pending" | "processing" | "normalized" | "rejected" | "duplicate";
export type ComparisonStatus = "draft" | "review" | "approved" | "published" | "archived";
export type SocialPlatform = "x" | "zenn" | "note" | "qiita";
export type SocialPostStatus = "draft" | "approved" | "published" | "rejected";
export type ReviewAction = "approve" | "reject" | "edit" | "publish" | "archive";
export type EntityType = "tool" | "comparison" | "social_post" | "ingestion";
export type JobType = "star_refresh" | "link_check" | "archive_detect" | "sitemap_rebuild";
export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface ToolSource {
  id: string;
  name: string;
  source_type: SourceType;
  config: Record<string, unknown>;
  is_active: boolean;
  last_run_at: string | null;
  created_at: string;
}

export interface IngestionQueueItem {
  id: string;
  source_id: string | null;
  source_type: SourceType;
  raw_data: RawToolData;
  github_url: string | null;
  status: QueueStatus;
  priority: number;
  normalized_tool_id: number | null;
  rejection_reason: string | null;
  error_message: string | null;
  discovered_at: string;
  processed_at: string | null;
  created_at: string;
}

export interface RawToolData {
  name: string;
  description?: string;
  github_url?: string;
  stars?: number;
  language?: string;
  topics?: string[];
  homepage?: string;
  license?: string;
  // ProductHunt specific
  product_url?: string;
  tagline?: string;
  // Raw source data
  [key: string]: unknown;
}

export interface NormalizedTool {
  name: string;
  slug: string;
  description_ja: string;
  description_en: string;
  github_url: string;
  website_url?: string;
  license: string;
  stars_num: number;
  language: string;
  categories: string[];
  tags: string[];
  saas_alternatives: SaasAlternativeCandidate[];
  quality_score: number;
}

export interface SaasAlternativeCandidate {
  saas_name: string;
  saas_slug: string;
  saas_url?: string;
  confidence_score: number;
}

export interface ToolAlternative {
  id: string;
  tool_id: number;
  saas_name: string;
  saas_slug: string;
  saas_url: string | null;
  confidence_score: number;
  source: "manual" | "llm" | "community";
  is_primary: boolean;
  created_at: string;
}

export interface ComparisonContent {
  ossName: string;
  saasName: string;
  slug: string;
  alternativeSlug: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  verdict: string;
  comparison: ComparisonRow[];
  ossFor: string[];
  saasFor: string[];
  faq: FaqItem[];
  relatedSlugs: string[];
}

export interface ComparisonRow {
  feature: string;
  oss: string;
  saas: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Comparison {
  id: string;
  slug: string;
  oss_tool_id: number | null;
  oss_name: string;
  saas_name: string;
  alternative_slug: string;
  status: ComparisonStatus;
  content: ComparisonContent | null;
  quality_score: number | null;
  reviewer_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  tool_id: number | null;
  comparison_id: string | null;
  platform: SocialPlatform;
  content: string;
  status: SocialPostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
}

export interface ReviewLog {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  action: ReviewAction;
  reviewer: string;
  before_state: unknown;
  after_state: unknown;
  note: string | null;
  created_at: string;
}

export interface MaintenanceJob {
  id: string;
  job_type: JobType;
  status: JobStatus;
  started_at: string | null;
  completed_at: string | null;
  items_processed: number;
  items_updated: number;
  error_message: string | null;
  result_summary: Record<string, unknown> | null;
  created_at: string;
}

export interface QueueStats {
  status: QueueStatus;
  count: number;
  oldest: string;
  newest: string;
}

// Job result types
export interface DiscoveryResult {
  discovered: number;
  queued: number;
  duplicates: number;
  errors: number;
}

export interface NormalizerResult {
  processed: number;
  normalized: number;
  rejected: number;
  errors: number;
}

export interface QualityCheckResult {
  checked: number;
  passed: number;
  failed: number;
  scores: Record<string, number>;
}

export interface ContentGenResult {
  generated: number;
  comparisons: number;
  social_posts: number;
  errors: number;
}

// GitHub API types
export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  homepage: string | null;
  license: { spdx_id: string } | null;
  archived: boolean;
  disabled: boolean;
  pushed_at: string;
  updated_at: string;
}

export interface GitHubTrendingItem {
  rank: number;
  repo: GitHubRepo;
  stars_today?: number;
}

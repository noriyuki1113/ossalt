export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alternative_relations: {
        Row: {
          constraints_ja: Json
          created_at: string
          editorial_rank: number | null
          id: string
          migration_difficulty: number | null
          migration_summary_ja: string | null
          not_recommended_for_ja: Json
          product_id: string
          project_id: string
          recommended_for_ja: Json
          relation_state: Database["public"]["Enums"]["relation_state"]
          source_checked_at: string | null
          strengths_ja: Json
          updated_at: string
        }
        Insert: {
          constraints_ja?: Json
          created_at?: string
          editorial_rank?: number | null
          id?: string
          migration_difficulty?: number | null
          migration_summary_ja?: string | null
          not_recommended_for_ja?: Json
          product_id: string
          project_id: string
          recommended_for_ja?: Json
          relation_state?: Database["public"]["Enums"]["relation_state"]
          source_checked_at?: string | null
          strengths_ja?: Json
          updated_at?: string
        }
        Update: {
          constraints_ja?: Json
          created_at?: string
          editorial_rank?: number | null
          id?: string
          migration_difficulty?: number | null
          migration_summary_ja?: string | null
          not_recommended_for_ja?: Json
          product_id?: string
          project_id?: string
          recommended_for_ja?: Json
          relation_state?: Database["public"]["Enums"]["relation_state"]
          source_checked_at?: string | null
          strengths_ja?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alternative_relations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_relations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_relations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
        ]
      }
      categories: {
        Row: {
          aliases: string[]
          created_at: string
          description_ja: string | null
          id: string
          name_ja: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          created_at?: string
          description_ja?: string | null
          id?: string
          name_ja: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          created_at?: string
          description_ja?: string | null
          id?: string
          name_ja?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_events: {
        Row: {
          event_name: Database["public"]["Enums"]["decision_event_name"]
          id: string
          metadata: Json
          occurred_at: string
          product_id: string | null
          project_id: string | null
          referrer_host: string | null
          relation_id: string | null
          session_hash: string | null
          sponsor_placement_id: string | null
        }
        Insert: {
          event_name: Database["public"]["Enums"]["decision_event_name"]
          id?: string
          metadata?: Json
          occurred_at?: string
          product_id?: string | null
          project_id?: string | null
          referrer_host?: string | null
          relation_id?: string | null
          session_hash?: string | null
          sponsor_placement_id?: string | null
        }
        Update: {
          event_name?: Database["public"]["Enums"]["decision_event_name"]
          id?: string
          metadata?: Json
          occurred_at?: string
          product_id?: string | null
          project_id?: string | null
          referrer_host?: string | null
          relation_id?: string | null
          session_hash?: string | null
          sponsor_placement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "decision_events_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "alternative_relations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_events_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["relation_id"]
          },
          {
            foreignKeyName: "decision_events_sponsor_placement_id_fkey"
            columns: ["sponsor_placement_id"]
            isOneToOne: false
            referencedRelation: "sponsor_placements"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_sources: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          kind: Database["public"]["Enums"]["evidence_kind"]
          label: string
          note_ja: string | null
          observed_at: string
          product_id: string | null
          project_id: string | null
          relation_id: string | null
          url: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          kind: Database["public"]["Enums"]["evidence_kind"]
          label: string
          note_ja?: string | null
          observed_at?: string
          product_id?: string | null
          project_id?: string | null
          relation_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["evidence_kind"]
          label?: string
          note_ja?: string | null
          observed_at?: string
          product_id?: string | null
          project_id?: string | null
          relation_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_sources_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "evidence_sources_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "alternative_relations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_sources_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["relation_id"]
          },
        ]
      }
      import_candidates: {
        Row: {
          category_path: string[]
          description: string | null
          id: string
          import_state: Database["public"]["Enums"]["candidate_import_state"]
          imported_at: string
          license_hint: string | null
          name: string
          project_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_name: string
          source_slug: string
          source_url: string
          stars_hint: string | null
        }
        Insert: {
          category_path?: string[]
          description?: string | null
          id?: string
          import_state?: Database["public"]["Enums"]["candidate_import_state"]
          imported_at?: string
          license_hint?: string | null
          name: string
          project_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_name: string
          source_slug: string
          source_url: string
          stars_hint?: string | null
        }
        Update: {
          category_path?: string[]
          description?: string | null
          id?: string
          import_state?: Database["public"]["Enums"]["candidate_import_state"]
          imported_at?: string
          license_hint?: string | null
          name?: string
          project_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_name?: string
          source_slug?: string
          source_url?: string
          stars_hint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_candidates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_candidates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
        ]
      }
      licenses: {
        Row: {
          aliases: string[]
          copyleft: string | null
          identifier: string
          kind: string
          name: string
          reference_url: string | null
          slug: string
          summary_ja: string
        }
        Insert: {
          aliases?: string[]
          copyleft?: string | null
          identifier: string
          kind: string
          name: string
          reference_url?: string | null
          slug: string
          summary_ja: string
        }
        Update: {
          aliases?: string[]
          copyleft?: string | null
          identifier?: string
          kind?: string
          name?: string
          reference_url?: string | null
          slug?: string
          summary_ja?: string
        }
        Relationships: []
      }
      outbound_clicks: {
        Row: {
          created_at: string
          id: string
          page_path: string
          provider_id: string | null
          tool_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          provider_id?: string | null
          tool_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          provider_id?: string | null
          tool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbound_clicks_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "vps_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbound_clicks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbound_clicks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description_ja: string | null
          id: string
          migration_summary_ja: string | null
          monthly_price_jpy: number | null
          name: string
          name_ja: string | null
          plan_name: string | null
          pricing_checked_at: string | null
          pricing_source_url: string | null
          publication_state: Database["public"]["Enums"]["publication_state"]
          slug: string
          source_checked_at: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description_ja?: string | null
          id?: string
          migration_summary_ja?: string | null
          monthly_price_jpy?: number | null
          name: string
          name_ja?: string | null
          plan_name?: string | null
          pricing_checked_at?: string | null
          pricing_source_url?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          slug: string
          source_checked_at?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description_ja?: string | null
          id?: string
          migration_summary_ja?: string | null
          monthly_price_jpy?: number | null
          name?: string
          name_ja?: string | null
          plan_name?: string | null
          pricing_checked_at?: string | null
          pricing_source_url?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          slug?: string
          source_checked_at?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      project_categories: {
        Row: {
          category_id: string
          created_at: string
          is_primary: boolean
          project_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          is_primary?: boolean
          project_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          is_primary?: boolean
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_categories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_categories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_snapshots: {
        Row: {
          created_at: string
          forks_count: number | null
          id: string
          last_commit_at: string | null
          observed_at: string
          open_issues_count: number | null
          project_id: string
          raw_payload: Json | null
          scorecard_score: number | null
          source_url: string | null
          stars_count: number | null
        }
        Insert: {
          created_at?: string
          forks_count?: number | null
          id?: string
          last_commit_at?: string | null
          observed_at?: string
          open_issues_count?: number | null
          project_id: string
          raw_payload?: Json | null
          scorecard_score?: number | null
          source_url?: string | null
          stars_count?: number | null
        }
        Update: {
          created_at?: string
          forks_count?: number | null
          id?: string
          last_commit_at?: string | null
          observed_at?: string
          open_issues_count?: number | null
          project_id?: string
          raw_payload?: Json | null
          scorecard_score?: number | null
          source_url?: string | null
          stars_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          docker_available: boolean | null
          id: string
          license_spdx: string | null
          name: string
          name_ja: string | null
          official_url: string | null
          primary_language: string | null
          publication_state: Database["public"]["Enums"]["publication_state"]
          repository_url: string | null
          short_description_ja: string | null
          slug: string
          source_checked_at: string | null
          updated_at: string
          verification_state: Database["public"]["Enums"]["verification_state"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          docker_available?: boolean | null
          id?: string
          license_spdx?: string | null
          name: string
          name_ja?: string | null
          official_url?: string | null
          primary_language?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          repository_url?: string | null
          short_description_ja?: string | null
          slug: string
          source_checked_at?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          docker_available?: boolean | null
          id?: string
          license_spdx?: string | null
          name?: string
          name_ja?: string | null
          official_url?: string | null
          primary_language?: string | null
          publication_state?: Database["public"]["Enums"]["publication_state"]
          repository_url?: string | null
          short_description_ja?: string | null
          slug?: string
          source_checked_at?: string | null
          updated_at?: string
          verification_state?: Database["public"]["Enums"]["verification_state"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      sponsor_placements: {
        Row: {
          created_at: string
          destination_url: string
          disclosure_label: string
          ends_at: string | null
          id: string
          is_active: boolean
          label: string
          placement_kind: string
          starts_at: string
          target_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_url: string
          disclosure_label?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          label: string
          placement_kind: string
          starts_at: string
          target_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_url?: string
          disclosure_label?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          label?: string
          placement_kind?: string
          starts_at?: string
          target_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tool_selfhost_guides: {
        Row: {
          created_at: string
          id: string
          method: string
          provider_id: string
          recommended_memory_gb: number | null
          source_url: string
          status: string
          steps_md: string
          tool_id: string
          updated_at: string
          verified_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          method: string
          provider_id: string
          recommended_memory_gb?: number | null
          source_url: string
          status?: string
          steps_md: string
          tool_id: string
          updated_at?: string
          verified_at: string
        }
        Update: {
          created_at?: string
          id?: string
          method?: string
          provider_id?: string
          recommended_memory_gb?: number | null
          source_url?: string
          status?: string
          steps_md?: string
          tool_id?: string
          updated_at?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_selfhost_guides_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "vps_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_selfhost_guides_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_selfhost_guides_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "published_alternative_directory"
            referencedColumns: ["project_id"]
          },
        ]
      }
      vps_providers: {
        Row: {
          affiliate_url: string | null
          created_at: string
          id: string
          is_active: boolean
          min_monthly_jpy: number
          name: string
          official_url: string
          pricing_checked_at: string
          slug: string
          updated_at: string
        }
        Insert: {
          affiliate_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          min_monthly_jpy: number
          name: string
          official_url: string
          pricing_checked_at: string
          slug: string
          updated_at?: string
        }
        Update: {
          affiliate_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          min_monthly_jpy?: number
          name?: string
          official_url?: string
          pricing_checked_at?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      published_alternative_directory: {
        Row: {
          category: string | null
          category_slug: string | null
          category_slugs: string[] | null
          constraints_ja: Json | null
          docker_available: boolean | null
          editorial_rank: number | null
          forks_count: number | null
          last_commit_at: string | null
          latest_release_published_at: string | null
          latest_release_tag: string | null
          license_kind: string | null
          license_name: string | null
          license_slug: string | null
          license_spdx: string | null
          migration_difficulty: number | null
          migration_summary_ja: string | null
          not_recommended_for_ja: Json | null
          official_url: string | null
          open_issues_count: number | null
          owner_avatar_url: string | null
          primary_language: string | null
          product_monthly_price_jpy: number | null
          product_name: string | null
          product_name_ja: string | null
          product_plan_name: string | null
          product_pricing_checked_at: string | null
          product_pricing_source_url: string | null
          product_slug: string | null
          project_id: string | null
          project_name: string | null
          project_name_ja: string | null
          project_slug: string | null
          recommended_for_ja: Json | null
          relation_id: string | null
          repository_created_at: string | null
          repository_url: string | null
          short_description_ja: string | null
          snapshot_observed_at: string | null
          source_checked_at: string | null
          stars_count: number | null
          strengths_ja: Json | null
          topics: Json | null
          verification_state:
            | Database["public"]["Enums"]["verification_state"]
            | null
          verified_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      candidate_import_state: "pending" | "enriched" | "rejected"
      decision_event_name:
        | "search_submitted"
        | "alternative_opened"
        | "tool_opened"
        | "official_link_opened"
        | "github_link_opened"
        | "compare_opened"
        | "guide_opened"
        | "newsletter_submitted"
        | "sponsor_opened"
      evidence_kind:
        | "official_site"
        | "official_docs"
        | "official_repository"
        | "license"
        | "release_note"
        | "security_score"
        | "editorial_note"
      publication_state: "draft" | "published" | "archived"
      relation_state: "candidate" | "verified" | "rejected"
      verification_state:
        | "unverified"
        | "reviewing"
        | "verified"
        | "needs_review"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      candidate_import_state: ["pending", "enriched", "rejected"],
      decision_event_name: [
        "search_submitted",
        "alternative_opened",
        "tool_opened",
        "official_link_opened",
        "github_link_opened",
        "compare_opened",
        "guide_opened",
        "newsletter_submitted",
        "sponsor_opened",
      ],
      evidence_kind: [
        "official_site",
        "official_docs",
        "official_repository",
        "license",
        "release_note",
        "security_score",
        "editorial_note",
      ],
      publication_state: ["draft", "published", "archived"],
      relation_state: ["candidate", "verified", "rejected"],
      verification_state: [
        "unverified",
        "reviewing",
        "verified",
        "needs_review",
      ],
    },
  },
} as const

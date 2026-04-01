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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      advertise_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          plan: string
          product_name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          plan?: string
          product_name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          plan?: string
          product_name?: string
        }
        Relationships: []
      }
      alternative_products: {
        Row: {
          alternative_id: string
          created_at: string
          id: string
          product_id: string
          rank_order: number | null
          reason_summary: string | null
        }
        Insert: {
          alternative_id: string
          created_at?: string
          id?: string
          product_id: string
          rank_order?: number | null
          reason_summary?: string | null
        }
        Update: {
          alternative_id?: string
          created_at?: string
          id?: string
          product_id?: string
          rank_order?: number | null
          reason_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alternative_products_alternative_id_fkey"
            columns: ["alternative_id"]
            isOneToOne: false
            referencedRelation: "alternatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alternative_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      alternatives: {
        Row: {
          category_hint: string | null
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          japanese_source_description: string | null
          japanese_source_name: string | null
          source_description: string | null
          source_name: string
          source_slug: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          category_hint?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          japanese_source_description?: string | null
          japanese_source_name?: string | null
          source_description?: string | null
          source_name: string
          source_slug: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          category_hint?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          japanese_source_description?: string | null
          japanese_source_name?: string | null
          source_description?: string | null
          source_name?: string
          source_slug?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alternatives_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          source_id: string | null
          source_type: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          source_id?: string | null
          source_type?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          source_id?: string | null
          source_type?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          japanese_description: string | null
          japanese_name: string | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          japanese_description?: string | null
          japanese_name?: string | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          japanese_description?: string | null
          japanese_name?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string | null
          status: string
        }
        Insert: {
          category?: string
          created_at?: string
          email: string
          id?: string
          message: string
          name?: string | null
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string | null
          status?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: string
          id: string
          product_id: string
        }
        Insert: {
          category_id: string
          id?: string
          product_id: string
        }
        Update: {
          category_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_features: {
        Row: {
          feature_name: string
          feature_value: string | null
          id: string
          product_id: string
        }
        Insert: {
          feature_name: string
          feature_value?: string | null
          id?: string
          product_id: string
        }
        Update: {
          feature_name?: string
          feature_value?: string | null
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          id: string
          product_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          product_id: string
          tag_id: string
        }
        Update: {
          id?: string
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          best_for: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          github_forks: number | null
          github_stars: number | null
          github_url: string | null
          has_cloud: boolean | null
          has_free_plan: boolean | null
          id: string
          is_open_source: boolean | null
          is_self_hostable: boolean | null
          japanese_description: string | null
          japanese_name: string | null
          last_commit_at: string | null
          license: string | null
          logo_background: string | null
          logo_favicon_url: string | null
          logo_github_avatar_url: string | null
          logo_github_readme_url: string | null
          logo_source: string | null
          logo_url: string | null
          name: string
          not_good_for: string | null
          pricing_summary: string | null
          self_host_difficulty: string | null
          short_description: string | null
          slug: string
          source_origin: string | null
          source_url: string | null
          status: string
          supports_japanese: boolean | null
          target_audience: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          best_for?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_forks?: number | null
          github_stars?: number | null
          github_url?: string | null
          has_cloud?: boolean | null
          has_free_plan?: boolean | null
          id?: string
          is_open_source?: boolean | null
          is_self_hostable?: boolean | null
          japanese_description?: string | null
          japanese_name?: string | null
          last_commit_at?: string | null
          license?: string | null
          logo_background?: string | null
          logo_favicon_url?: string | null
          logo_github_avatar_url?: string | null
          logo_github_readme_url?: string | null
          logo_source?: string | null
          logo_url?: string | null
          name: string
          not_good_for?: string | null
          pricing_summary?: string | null
          self_host_difficulty?: string | null
          short_description?: string | null
          slug: string
          source_origin?: string | null
          source_url?: string | null
          status?: string
          supports_japanese?: boolean | null
          target_audience?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          best_for?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_forks?: number | null
          github_stars?: number | null
          github_url?: string | null
          has_cloud?: boolean | null
          has_free_plan?: boolean | null
          id?: string
          is_open_source?: boolean | null
          is_self_hostable?: boolean | null
          japanese_description?: string | null
          japanese_name?: string | null
          last_commit_at?: string | null
          license?: string | null
          logo_background?: string | null
          logo_favicon_url?: string | null
          logo_github_avatar_url?: string | null
          logo_github_readme_url?: string | null
          logo_source?: string | null
          logo_url?: string | null
          name?: string
          not_good_for?: string | null
          pricing_summary?: string | null
          self_host_difficulty?: string | null
          short_description?: string | null
          slug?: string
          source_origin?: string | null
          source_url?: string | null
          status?: string
          supports_japanese?: boolean | null
          target_audience?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      scrape_runs: {
        Row: {
          created_at: string
          error_message: string | null
          finished_at: string | null
          id: string
          meta: Json | null
          source: string
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          meta?: Json | null
          source: string
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          meta?: Json | null
          source?: string
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          email: string
          github_url: string | null
          id: string
          message: string | null
          product_name: string
          status: string
          website_url: string
        }
        Insert: {
          created_at?: string
          email: string
          github_url?: string | null
          id?: string
          message?: string | null
          product_name: string
          status?: string
          website_url: string
        }
        Update: {
          created_at?: string
          email?: string
          github_url?: string | null
          id?: string
          message?: string | null
          product_name?: string
          status?: string
          website_url?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          category_en: string | null
          category_ja: string | null
          created_at: string | null
          description_en: string | null
          description_ja: string | null
          forks_num: number | null
          github_stars_updated_at: string | null
          github_url: string | null
          id: number
          language: string | null
          last_commit: string | null
          license: string | null
          name: string | null
          parent_category_en: string | null
          parent_category_ja: string | null
          primary_competitor: string | null
          primary_competitor_ja: string | null
          replaces: string[] | null
          replaces_ja: string[] | null
          stars: string | null
          stars_num: number | null
          url: string | null
        }
        Insert: {
          category_en?: string | null
          category_ja?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ja?: string | null
          forks_num?: number | null
          github_stars_updated_at?: string | null
          github_url?: string | null
          id?: number
          language?: string | null
          last_commit?: string | null
          license?: string | null
          name?: string | null
          parent_category_en?: string | null
          parent_category_ja?: string | null
          primary_competitor?: string | null
          primary_competitor_ja?: string | null
          replaces?: string[] | null
          replaces_ja?: string[] | null
          stars?: string | null
          stars_num?: number | null
          url?: string | null
        }
        Update: {
          category_en?: string | null
          category_ja?: string | null
          created_at?: string | null
          description_en?: string | null
          description_ja?: string | null
          forks_num?: number | null
          github_stars_updated_at?: string | null
          github_url?: string | null
          id?: number
          language?: string | null
          last_commit?: string | null
          license?: string | null
          name?: string | null
          parent_category_en?: string | null
          parent_category_ja?: string | null
          primary_competitor?: string | null
          primary_competitor_ja?: string | null
          replaces?: string[] | null
          replaces_ja?: string[] | null
          stars?: string | null
          stars_num?: number | null
          url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const

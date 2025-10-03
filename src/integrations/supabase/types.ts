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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          answer_text: string
          answer_text_hy: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          order_index: number | null
          question_id: string
        }
        Insert: {
          answer_text: string
          answer_text_hy: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          order_index?: number | null
          question_id: string
        }
        Update: {
          answer_text?: string
          answer_text_hy?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          order_index?: number | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_configuration_items: {
        Row: {
          category_id: string
          created_at: string | null
          exam_config_id: string
          id: string
          question_count: number
        }
        Insert: {
          category_id: string
          created_at?: string | null
          exam_config_id: string
          id?: string
          question_count?: number
        }
        Update: {
          category_id?: string
          created_at?: string | null
          exam_config_id?: string
          id?: string
          question_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_configuration_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "questions_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_configuration_items_exam_config_id_fkey"
            columns: ["exam_config_id"]
            isOneToOne: false
            referencedRelation: "exam_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_configurations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          name_hy: string
          passing_score: number | null
          time_limit_minutes: number | null
          total_questions: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_hy: string
          passing_score?: number | null
          time_limit_minutes?: number | null
          total_questions: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_hy?: string
          passing_score?: number | null
          time_limit_minutes?: number | null
          total_questions?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      menus: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          parent_id: string | null
          title: string
          title_hy: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          parent_id?: string | null
          title: string
          title_hy: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          parent_id?: string | null
          title?: string
          title_hy?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          content_hy: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_description_hy: string | null
          slug: string
          title: string
          title_hy: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_hy?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_description_hy?: string | null
          slug: string
          title: string
          title_hy: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_hy?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_description_hy?: string | null
          slug?: string
          title?: string
          title_hy?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string | null
          created_at: string | null
          difficulty_level: number | null
          explanation: string | null
          explanation_hy: string | null
          id: string
          is_active: boolean | null
          question_image: string | null
          question_text: string
          question_text_hy: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          explanation?: string | null
          explanation_hy?: string | null
          id?: string
          is_active?: boolean | null
          question_image?: string | null
          question_text: string
          question_text_hy: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          explanation?: string | null
          explanation_hy?: string | null
          id?: string
          is_active?: boolean | null
          question_image?: string | null
          question_text?: string
          question_text_hy?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "questions_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_hy: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_hy: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_hy?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          description_hy: string | null
          id: string
          is_active: boolean | null
          resource_type: string
          resource_url: string
          thumbnail_url: string | null
          title: string
          title_hy: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_hy?: string | null
          id?: string
          is_active?: boolean | null
          resource_type: string
          resource_url: string
          thumbnail_url?: string | null
          title: string
          title_hy: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_hy?: string | null
          id?: string
          is_active?: boolean | null
          resource_type?: string
          resource_url?: string
          thumbnail_url?: string | null
          title?: string
          title_hy?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "questions_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          description_hy: string | null
          id: string
          is_active: boolean | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          title_hy: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_hy?: string | null
          id?: string
          is_active?: boolean | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          title_hy: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_hy?: string | null
          id?: string
          is_active?: boolean | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          title_hy?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "questions_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_test_attempts: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          created_at: string | null
          exam_config_id: string | null
          id: string
          score: number | null
          started_at: string | null
          test_id: string | null
          time_spent_seconds: number | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          exam_config_id?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          test_id?: string | null
          time_spent_seconds?: number | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          exam_config_id?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          test_id?: string | null
          time_spent_seconds?: number | null
          total_questions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_test_attempts_exam_config_id_fkey"
            columns: ["exam_config_id"]
            isOneToOne: false
            referencedRelation: "exam_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

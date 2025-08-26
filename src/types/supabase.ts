export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          user_id: string | null
          title: string
          summary: string | null
          ingredients: string[]
          directions: string[]
          tips: string | null
          prep_time: number
          cook_time: number
          total_time: number
          servings: number
          category: string | null
          image_url: string | null
          source: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          summary?: string | null
          ingredients: string[]
          directions: string[]
          tips?: string | null
          prep_time?: number
          cook_time?: number
          total_time?: number
          servings?: number
          category?: string | null
          image_url?: string | null
          source?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          summary?: string | null
          ingredients?: string[]
          directions?: string[]
          tips?: string | null
          prep_time?: number
          cook_time?: number
          total_time?: number
          servings?: number
          category?: string | null
          image_url?: string | null
          source?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
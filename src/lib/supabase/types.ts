/**
 * Supabase Database Types
 *
 * This file will be auto-generated when we run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 *
 * For now, we're re-exporting our manually defined types
 */

export * from '@/types';

// Placeholder for generated types
// After connecting to Supabase, run:
// npx supabase gen types typescript --project-id <project-id> --schema public > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Tables will be generated here
      products: {
        Row: {
          id: string;
          name: string;
          brand_id: string | null;
          collaborator: string | null;
          category: string;
          sku: string | null;
          description: string | null;
          image_url: string | null;
          release_date: string | null;
          retail_price: number | null;
          hype_score: number;
          hype_score_updated_at: string | null;
          confidence_score: number | null;
          is_limited_edition: boolean;
          status: string;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand_id?: string | null;
          collaborator?: string | null;
          category: string;
          sku?: string | null;
          description?: string | null;
          image_url?: string | null;
          release_date?: string | null;
          retail_price?: number | null;
          hype_score?: number;
          confidence_score?: number | null;
          is_limited_edition?: boolean;
          status?: string;
        };
        Update: {
          name?: string;
          brand_id?: string | null;
          collaborator?: string | null;
          category?: string;
          sku?: string | null;
          description?: string | null;
          image_url?: string | null;
          release_date?: string | null;
          retail_price?: number | null;
          hype_score?: number;
          confidence_score?: number | null;
          is_limited_edition?: boolean;
          status?: string;
        };
      };
      // Add other tables as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      product_category: 'sneakers' | 'football_boots' | 'streetwear' | 'toys' | 'collectibles';
      product_status: 'pending_review' | 'approved' | 'rejected' | 'archived';
      stock_status: 'in_stock' | 'out_of_stock' | 'preorder' | 'coming_soon' | 'unknown';
    };
  };
}

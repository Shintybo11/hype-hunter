// =============================================================================
// Supabase Database Types
// =============================================================================
// Generated from database schema. Update when schema changes.
// To regenerate with CLI: npx supabase gen types typescript --project-id whziayfmzoxhugviqffv > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =============================================================================
// Enum Types
// =============================================================================

export type ProductCategory =
  | 'sneakers'
  | 'football_boots'
  | 'streetwear'
  | 'toys'
  | 'collectibles'

export type ProductStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'archived'

export type StockStatus =
  | 'in_stock'
  | 'out_of_stock'
  | 'preorder'
  | 'coming_soon'
  | 'unknown'

export type SourceType =
  | 'calendar'
  | 'social'
  | 'resale'
  | 'trends'
  | 'retailer'

export type InventoryStatus =
  | 'ordered'
  | 'shipped'
  | 'delivered'
  | 'listed'
  | 'sold'
  | 'kept'
  | 'returned'

export type AlertType =
  | 'restock'
  | 'discovery'
  | 'price_drop'
  | 'digest'
  | 'custom'

// =============================================================================
// Table Row Types
// =============================================================================

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  heat_score: number
  created_at: string
  updated_at: string
}

export interface Retailer {
  id: string
  name: string
  slug: string
  base_url: string
  logo_url: string | null
  categories: ProductCategory[]
  scraper_id: string
  scraper_config: Json
  check_interval_minutes: number
  priority: number
  is_active: boolean
  last_successful_check: string | null
  consecutive_failures: number
  created_at: string
  updated_at: string
}

export interface Source {
  id: string
  name: string
  type: SourceType
  url: string | null
  scraper_id: string | null
  scraper_config: Json
  check_interval_minutes: number
  is_active: boolean
  reliability_score: number
  last_successful_scrape: string | null
  consecutive_failures: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  brand_id: string | null
  collaborator: string | null
  category: ProductCategory
  sku: string | null
  description: string | null
  image_url: string | null
  release_date: string | null
  retail_price: number | null
  hype_score: number
  hype_score_updated_at: string | null
  confidence_score: number | null
  is_limited_edition: boolean
  status: ProductStatus
  approved_at: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
}

export interface StockItem {
  id: string
  product_id: string
  retailer_id: string
  url: string
  retailer_sku: string | null
  status: StockStatus
  sizes: SizeAvailability[]
  price: number | null
  last_checked: string | null
  last_status_change: string | null
  is_monitored: boolean
  check_priority: number
  source: string | null
  match_confidence: number | null
  target_size: string | null
  created_at: string
  updated_at: string
}

export interface StockCheck {
  id: string
  stock_item_id: string
  status: StockStatus
  sizes: SizeAvailability[] | null
  price: number | null
  status_changed: boolean
  sizes_changed: boolean
  price_changed: boolean
  checked_at: string
  check_duration_ms: number | null
  error_message: string | null
}

export interface ProductSource {
  id: string
  product_id: string
  source_id: string
  external_id: string | null
  external_url: string | null
  raw_data: Json | null
  discovered_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  telegram_chat_id: string | null
  telegram_username: string | null
  telegram_linked_at: string | null
  sizes: UserSizes
  alert_settings: AlertSettings
  created_at: string
  updated_at: string
}

export interface RetailerAccount {
  id: string
  user_id: string
  retailer_id: string
  email: string
  password_encrypted: string
  addresses: Address[]
  last_validated: string | null
  is_valid: boolean
  created_at: string
  updated_at: string
}

export interface WatchlistItem {
  id: string
  user_id: string
  product_id: string
  alert_on_restock: boolean
  alert_on_price_drop: boolean
  target_price: number | null
  notes: string | null
  added_at: string
}

export interface InventoryItem {
  id: string
  user_id: string
  product_id: string | null
  product_name: string
  size: string | null
  purchase_price: number
  purchase_date: string
  retailer_name: string | null
  order_number: string | null
  status: InventoryStatus
  tracking_number: string | null
  carrier: string | null
  shipped_date: string | null
  delivered_date: string | null
  sale_price: number | null
  sale_date: string | null
  sale_platform: string | null
  platform_fees: number | null
  shipping_cost: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  product_id: string | null
  stock_item_id: string | null
  type: AlertType
  message: string
  telegram_message_id: string | null
  sent_at: string
  clicked_at: string | null
  metadata: Json
}

export interface HypeScore {
  id: string
  product_id: string
  total_score: number
  components: HypeScoreComponents
  recorded_at: string
}

export interface PriceHistory {
  id: string
  product_id: string
  retail_price: number | null
  stockx_price: number | null
  goat_price: number | null
  ebay_price: number | null
  avg_resale_price: number | null
  resale_premium_pct: number | null
  recorded_at: string
}

export interface SocialSignal {
  id: string
  product_id: string
  twitter_mentions: number
  reddit_mentions: number
  tiktok_mentions: number
  twitter_velocity: number | null
  reddit_velocity: number | null
  tiktok_velocity: number | null
  avg_sentiment: number | null
  recorded_at: string
}

// =============================================================================
// JSON Field Types
// =============================================================================

export interface SizeAvailability {
  uk: number
  us?: number
  eu?: number
  in_stock: boolean
  quantity?: number
}

export interface UserSizes {
  sneakers?: {
    uk: number
    us: number
    eu: number
    nike_adjustment?: number
  }
  clothing?: {
    tops: string
    bottoms_waist: number
    bottoms_length: number
  }
  football_boots?: {
    uk: number
    wide_fit: boolean
  }
}

export interface AlertSettings {
  min_hype_score?: number
  categories?: ProductCategory[]
  quiet_hours?: {
    start: string
    end: string
  }
  size_filter?: boolean
  instant_alerts?: boolean
  daily_digest?: boolean
  digest_time?: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  postcode: string
  country: string
  phone?: string
  is_default?: boolean
}

export interface HypeScoreComponents {
  social: number
  resale: number
  trends: number
  scarcity: number
  brand: number
  social_raw?: {
    twitter: number
    reddit: number
    tiktok: number
  }
  resale_raw?: {
    stockx: number
    goat: number
    retail: number
  }
}

// =============================================================================
// Database Schema Type (for Supabase client)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: Brand
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Brand, 'id'>>
        Relationships: []
      }
      retailers: {
        Row: Retailer
        Insert: Omit<Retailer, 'id' | 'created_at' | 'updated_at' | 'last_successful_check' | 'consecutive_failures'> & {
          id?: string
          created_at?: string
          updated_at?: string
          last_successful_check?: string | null
          consecutive_failures?: number
        }
        Update: Partial<Omit<Retailer, 'id'>>
        Relationships: []
      }
      sources: {
        Row: Source
        Insert: Omit<Source, 'id' | 'created_at' | 'updated_at' | 'last_successful_scrape' | 'consecutive_failures'> & {
          id?: string
          created_at?: string
          updated_at?: string
          last_successful_scrape?: string | null
          consecutive_failures?: number
        }
        Update: Partial<Omit<Source, 'id'>>
        Relationships: []
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'hype_score' | 'is_limited_edition' | 'status'> & {
          id?: string
          created_at?: string
          updated_at?: string
          hype_score?: number
          is_limited_edition?: boolean
          status?: ProductStatus
        }
        Update: Partial<Omit<Product, 'id'>>
        Relationships: []
      }
      stock_items: {
        Row: StockItem
        Insert: Omit<StockItem, 'id' | 'created_at' | 'updated_at' | 'status' | 'sizes' | 'is_monitored' | 'check_priority'> & {
          id?: string
          created_at?: string
          updated_at?: string
          status?: StockStatus
          sizes?: SizeAvailability[]
          is_monitored?: boolean
          check_priority?: number
        }
        Update: Partial<Omit<StockItem, 'id'>>
        Relationships: []
      }
      stock_checks: {
        Row: StockCheck
        Insert: Omit<StockCheck, 'id' | 'checked_at' | 'status_changed' | 'sizes_changed' | 'price_changed'> & {
          id?: string
          checked_at?: string
          status_changed?: boolean
          sizes_changed?: boolean
          price_changed?: boolean
        }
        Update: Partial<Omit<StockCheck, 'id'>>
        Relationships: []
      }
      product_sources: {
        Row: ProductSource
        Insert: Omit<ProductSource, 'id' | 'discovered_at'> & {
          id?: string
          discovered_at?: string
        }
        Update: Partial<Omit<ProductSource, 'id'>>
        Relationships: []
      }
      user_preferences: {
        Row: UserPreferences
        Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at' | 'sizes' | 'alert_settings'> & {
          id?: string
          created_at?: string
          updated_at?: string
          sizes?: UserSizes
          alert_settings?: AlertSettings
        }
        Update: Partial<Omit<UserPreferences, 'id'>>
        Relationships: []
      }
      retailer_accounts: {
        Row: RetailerAccount
        Insert: Omit<RetailerAccount, 'id' | 'created_at' | 'updated_at' | 'addresses' | 'is_valid'> & {
          id?: string
          created_at?: string
          updated_at?: string
          addresses?: Address[]
          is_valid?: boolean
        }
        Update: Partial<Omit<RetailerAccount, 'id'>>
        Relationships: []
      }
      watchlist: {
        Row: WatchlistItem
        Insert: Omit<WatchlistItem, 'id' | 'added_at' | 'alert_on_restock' | 'alert_on_price_drop'> & {
          id?: string
          added_at?: string
          alert_on_restock?: boolean
          alert_on_price_drop?: boolean
        }
        Update: Partial<Omit<WatchlistItem, 'id'>>
        Relationships: []
      }
      inventory: {
        Row: InventoryItem
        Insert: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'status'> & {
          id?: string
          created_at?: string
          updated_at?: string
          status?: InventoryStatus
        }
        Update: Partial<Omit<InventoryItem, 'id'>>
        Relationships: []
      }
      alerts: {
        Row: Alert
        Insert: Omit<Alert, 'id' | 'sent_at' | 'metadata'> & {
          id?: string
          sent_at?: string
          metadata?: Json
        }
        Update: Partial<Omit<Alert, 'id'>>
        Relationships: []
      }
      hype_scores: {
        Row: HypeScore
        Insert: Omit<HypeScore, 'id' | 'recorded_at'> & {
          id?: string
          recorded_at?: string
        }
        Update: Partial<Omit<HypeScore, 'id'>>
        Relationships: []
      }
      price_history: {
        Row: PriceHistory
        Insert: Omit<PriceHistory, 'id' | 'recorded_at'> & {
          id?: string
          recorded_at?: string
        }
        Update: Partial<Omit<PriceHistory, 'id'>>
        Relationships: []
      }
      social_signals: {
        Row: SocialSignal
        Insert: Omit<SocialSignal, 'id' | 'recorded_at' | 'twitter_mentions' | 'reddit_mentions' | 'tiktok_mentions'> & {
          id?: string
          recorded_at?: string
          twitter_mentions?: number
          reddit_mentions?: number
          tiktok_mentions?: number
        }
        Update: Partial<Omit<SocialSignal, 'id'>>
        Relationships: []
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      product_category: ProductCategory
      product_status: ProductStatus
      stock_status: StockStatus
      source_type: SourceType
      inventory_status: InventoryStatus
      alert_type: AlertType
    }
    CompositeTypes: {
      [key: string]: unknown
    }
  }
}

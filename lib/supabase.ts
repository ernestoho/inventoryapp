import { createClient } from "@supabase/supabase-js"

// Check if we're in demo mode or if Supabase is not properly configured
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.length > 20

// Create a mock client for development/preview when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () =>
      Promise.resolve({ data: null, error: { message: "Demo mode - Supabase not configured" } }),
    signUp: () => Promise.resolve({ data: null, error: { message: "Demo mode - Supabase not configured" } }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      gte: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  rpc: () => Promise.resolve({ data: [], error: null }),
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
  }),
  removeChannel: () => {},
})

// Use real Supabase client if properly configured and not in demo mode, otherwise use mock
export const supabase =
  !isDemoMode && hasValidSupabaseConfig ? createClient(supabaseUrl!, supabaseAnonKey!) : createMockClient()

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "admin" | "manager" | "operator" | "viewer"
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: "admin" | "manager" | "operator" | "viewer"
          avatar_url?: string | null
        }
        Update: {
          full_name?: string | null
          role?: "admin" | "manager" | "operator" | "viewer"
          avatar_url?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description?: string | null
          parent_id?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          parent_id?: string | null
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          currency: string
          payment_terms: number
          lead_time_days: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          currency?: string
          payment_terms?: number
          lead_time_days?: number
          is_active?: boolean
        }
        Update: {
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          currency?: string
          payment_terms?: number
          lead_time_days?: number
          is_active?: boolean
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string | null
          city: string | null
          country: string | null
          is_active: boolean
          location_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          address?: string | null
          city?: string | null
          country?: string | null
          is_active?: boolean
          location_type?: string
        }
        Update: {
          name?: string
          address?: string | null
          city?: string | null
          country?: string | null
          is_active?: boolean
          location_type?: string
        }
      }
      items: {
        Row: {
          id: string
          sku: string
          name: string
          description: string | null
          category_id: string | null
          unit_of_measure: string
          cost_price: number
          selling_price: number
          reorder_point: number
          reorder_quantity: number
          preferred_supplier_id: string | null
          is_active: boolean
          is_raw_material: boolean
          requires_batch_tracking: boolean
          shelf_life_days: number | null
          is_sales_item: boolean
          sales_price: number
          recipe_yield: number
          alcohol_content: number
          created_at: string
          updated_at: string
        }
        Insert: {
          sku: string
          name: string
          description?: string | null
          category_id?: string | null
          unit_of_measure?: string
          cost_price?: number
          selling_price?: number
          reorder_point?: number
          reorder_quantity?: number
          preferred_supplier_id?: string | null
          is_active?: boolean
          is_raw_material?: boolean
          requires_batch_tracking?: boolean
          shelf_life_days?: number | null
          is_sales_item?: boolean
          sales_price?: number
          recipe_yield?: number
          alcohol_content?: number
        }
        Update: {
          sku?: string
          name?: string
          description?: string | null
          category_id?: string | null
          unit_of_measure?: string
          cost_price?: number
          selling_price?: number
          reorder_point?: number
          reorder_quantity?: number
          preferred_supplier_id?: string | null
          is_active?: boolean
          is_raw_material?: boolean
          requires_batch_tracking?: boolean
          shelf_life_days?: number | null
          is_sales_item?: boolean
          sales_price?: number
          recipe_yield?: number
          alcohol_content?: number
        }
      }
      inventory: {
        Row: {
          id: string
          item_id: string
          location_id: string
          quantity: number
          reserved_quantity: number
          batch_number: string | null
          manufacture_date: string | null
          expiry_date: string | null
          updated_at: string
        }
        Insert: {
          item_id: string
          location_id: string
          quantity?: number
          reserved_quantity?: number
          batch_number?: string | null
          manufacture_date?: string | null
          expiry_date?: string | null
        }
        Update: {
          quantity?: number
          reserved_quantity?: number
          batch_number?: string | null
          manufacture_date?: string | null
          expiry_date?: string | null
        }
      }
      purchase_orders: {
        Row: {
          id: string
          po_number: string
          supplier_id: string
          location_id: string
          status: "draft" | "pending" | "approved" | "ordered" | "received" | "cancelled"
          order_date: string
          expected_date: string | null
          received_date: string | null
          total_amount: number
          currency: string
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          po_number: string
          supplier_id: string
          location_id: string
          status?: "draft" | "pending" | "approved" | "ordered" | "received" | "cancelled"
          order_date?: string
          expected_date?: string | null
          received_date?: string | null
          total_amount?: number
          currency?: string
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          po_number?: string
          supplier_id?: string
          location_id?: string
          status?: "draft" | "pending" | "approved" | "ordered" | "received" | "cancelled"
          order_date?: string
          expected_date?: string | null
          received_date?: string | null
          total_amount?: number
          currency?: string
          notes?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          sale_number: string
          customer_name: string | null
          location_id: string
          sale_date: string
          total_amount: number
          notes: string | null
          table_number: string | null
          server_name: string | null
          payment_method: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          sale_number: string
          customer_name?: string | null
          location_id: string
          sale_date?: string
          total_amount?: number
          notes?: string | null
          table_number?: string | null
          server_name?: string | null
          payment_method?: string
          created_by?: string | null
        }
        Update: {
          sale_number?: string
          customer_name?: string | null
          location_id?: string
          sale_date?: string
          total_amount?: number
          notes?: string | null
          table_number?: string | null
          server_name?: string | null
          payment_method?: string
        }
      }
      sales_items: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          price: number
          is_active: boolean
          preparation_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description?: string | null
          category?: string | null
          price: number
          is_active?: boolean
          preparation_time?: number
        }
        Update: {
          name?: string
          description?: string | null
          category?: string | null
          price?: number
          is_active?: boolean
          preparation_time?: number
        }
      }
      transfer_orders: {
        Row: {
          id: string
          transfer_number: string
          from_location_id: string
          to_location_id: string
          status: string
          transfer_date: string
          completed_date: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          transfer_number: string
          from_location_id: string
          to_location_id: string
          status?: string
          transfer_date?: string
          completed_date?: string | null
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          transfer_number?: string
          from_location_id?: string
          to_location_id?: string
          status?: string
          transfer_date?: string
          completed_date?: string | null
          notes?: string | null
        }
      }
      inventory_transactions: {
        Row: {
          id: string
          item_id: string
          location_id: string
          transaction_type: "purchase" | "sale" | "production" | "adjustment" | "transfer"
          quantity_change: number
          quantity_before: number
          quantity_after: number
          batch_number: string | null
          reference_id: string | null
          reference_type: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
      }
    }
  }
}

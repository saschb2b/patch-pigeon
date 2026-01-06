export type ChangeType = "FEATURE" | "FIX" | "IMPROVEMENT" | "KNOWNISSUE" | "BREAKING" | "REMOVED" | "NOTE"

// Legacy entry type (kept for backwards compatibility)
export type EntryType = "feature" | "improvement" | "fix" | "breaking"

export interface Profile {
  id: string
  owner_slug: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface ProductWithProfile extends Product {
  profiles: Profile
}

export interface Entry {
  id: string
  product_id: string
  title: string
  slug: string
  content: string | null // Now optional, for backwards compatibility
  summary: string | null // Optional version summary
  type: EntryType | null // Legacy, optional
  version: string | null
  published: boolean
  publish_date: string | null
  created_at: string
  updated_at: string
}

export interface EntryItem {
  id: string
  entry_id: string
  type: ChangeType
  title: string
  description: string | null
  area: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface EntryWithItems extends Entry {
  entry_items: EntryItem[]
}

export interface EntryWithProduct extends Entry {
  products: Product
}

export interface EntryWithProductAndProfile extends Entry {
  products: ProductWithProfile
}

export interface EntryWithItemsAndProduct extends EntryWithItems {
  products: Product
}

import { changeTypeEnum } from "@/lib/db/schema"
import type { profiles, products, entries, entryItems } from "@/lib/db/schema"

export type ChangeType = (typeof changeTypeEnum.enumValues)[number]

export type Profile = typeof profiles.$inferSelect
export type Product = typeof products.$inferSelect
export type Entry = typeof entries.$inferSelect
export type EntryItem = typeof entryItems.$inferSelect

export interface ProductWithProfile extends Product {
  profiles: Profile
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

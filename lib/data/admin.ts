import "server-only"

import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { entries, products } from "@/lib/db/schema"

export function getProductsForOwner(userId: string) {
  return db.query.products.findMany({
    where: eq(products.user_id, userId),
    with: {
      entries: {
        columns: { id: true, published: true },
      },
    },
    orderBy: [desc(products.created_at)],
  })
}

export function getOwnedProduct(userId: string, productId: string) {
  return db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.user_id, userId)),
  })
}

export function getOwnedProductWithEntries(userId: string, productId: string) {
  return db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.user_id, userId)),
    with: {
      entries: {
        with: {
          entry_items: {
            columns: { id: true },
          },
        },
        orderBy: [desc(entries.publish_date)],
      },
    },
  })
}

export async function getOwnedEntry(
  userId: string,
  productId: string,
  entryId: string,
) {
  const product = await getOwnedProduct(userId, productId)
  if (!product) return null

  const entry = await db.query.entries.findFirst({
    where: and(eq(entries.id, entryId), eq(entries.product_id, productId)),
    with: {
      entry_items: true,
    },
  })

  return entry ? { product, entry } : null
}

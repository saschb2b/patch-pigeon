import "server-only"

import { and, asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { entries, entryItems, products, profiles } from "@/lib/db/schema"

export function getPublicOwner(ownerSlug: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.owner_slug, ownerSlug),
  })
}

export async function getPublicProduct(ownerSlug: string, productSlug: string) {
  const profile = await getPublicOwner(ownerSlug)
  if (!profile) return null

  const product = await db.query.products.findFirst({
    where: and(eq(products.user_id, profile.id), eq(products.slug, productSlug)),
  })

  return product ? { profile, product } : null
}

export async function getPublicOwnerWithProducts(ownerSlug: string) {
  const profile = await getPublicOwner(ownerSlug)
  if (!profile) return null

  const ownerProducts = await db.query.products.findMany({
    where: eq(products.user_id, profile.id),
    with: {
      entries: {
        where: eq(entries.published, true),
        columns: {
          id: true,
          title: true,
          slug: true,
          version: true,
          publish_date: true,
        },
        orderBy: [desc(entries.publish_date)],
      },
    },
    orderBy: [desc(products.created_at)],
  })

  return { profile, products: ownerProducts }
}

export async function getPublicProductWithEntries(
  ownerSlug: string,
  productSlug: string,
  limit?: number,
) {
  const context = await getPublicProduct(ownerSlug, productSlug)
  if (!context) return null

  const publishedEntries = await db.query.entries.findMany({
    where: and(
      eq(entries.product_id, context.product.id),
      eq(entries.published, true),
    ),
    with: {
      entry_items: {
        orderBy: [asc(entryItems.sort_order)],
      },
    },
    orderBy: [desc(entries.publish_date)],
    limit,
  })

  return { ...context, entries: publishedEntries }
}

export async function getPublicEntry(
  ownerSlug: string,
  productSlug: string,
  entrySlug: string,
) {
  const context = await getPublicProduct(ownerSlug, productSlug)
  if (!context) return null

  const entry = await db.query.entries.findFirst({
    where: and(
      eq(entries.product_id, context.product.id),
      eq(entries.slug, entrySlug),
      eq(entries.published, true),
    ),
    with: {
      entry_items: {
        orderBy: [asc(entryItems.sort_order)],
      },
    },
  })

  if (!entry) return null

  const relatedEntries = await db.query.entries.findMany({
    where: and(
      eq(entries.product_id, context.product.id),
      eq(entries.published, true),
    ),
    with: {
      entry_items: {
        orderBy: [asc(entryItems.sort_order)],
      },
    },
    orderBy: [desc(entries.publish_date)],
    limit: 4,
  })

  return {
    ...context,
    entry,
    relatedEntries: relatedEntries.filter((candidate) => candidate.id !== entry.id).slice(0, 3),
  }
}

export async function getPublicFeed(
  ownerSlug: string,
  productSlug: string,
  options: { limit: number; offset?: number },
) {
  const context = await getPublicProduct(ownerSlug, productSlug)
  if (!context) return null

  const feedEntries = await db.query.entries.findMany({
    where: and(
      eq(entries.product_id, context.product.id),
      eq(entries.published, true),
    ),
    with: {
      entry_items: {
        orderBy: [asc(entryItems.sort_order)],
      },
    },
    orderBy: [desc(entries.publish_date)],
    limit: options.limit,
    offset: options.offset ?? 0,
  })

  return { ...context, entries: feedEntries }
}

export async function getSitemapData() {
  const [ownerRows, productRows, entryRows] = await Promise.all([
    db.select().from(profiles),
    db.select().from(products),
    db
      .select()
      .from(entries)
      .where(eq(entries.published, true)),
  ])

  return { profiles: ownerRows, products: productRows, entries: entryRows }
}

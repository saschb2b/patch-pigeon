"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq, inArray } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { entries, entryItems, products } from "@/lib/db/schema"
import { requireUser } from "@/lib/auth-helpers"

const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(2_000).optional().nullable(),
  logo_url: z
    .union([
      z.literal(""),
      z.url().refine((value) => /^https?:\/\//.test(value), "Use an HTTP or HTTPS URL"),
    ])
    .optional()
    .nullable(),
})

export async function createProductAction(
  raw: z.infer<typeof productSchema>,
): Promise<{ id: string } | { error: string }> {
  const user = await requireUser()
  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  try {
    const [created] = await db
      .insert(products)
      .values({
        user_id: user.id,
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        logo_url: parsed.data.logo_url || null,
      })
      .returning({ id: products.id })

    revalidatePath("/admin")
    return { id: created.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("products_user_slug_idx")) {
      return { error: "A product with this slug already exists" }
    }
    return { error: "Failed to create product" }
  }
}

export async function updateProductAction(
  productId: string,
  raw: z.infer<typeof productSchema>,
): Promise<{ ok: true } | { error: string }> {
  const user = await requireUser()
  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  try {
    const result = await db
      .update(products)
      .set({
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        logo_url: parsed.data.logo_url || null,
        updated_at: new Date().toISOString(),
      })
      .where(and(eq(products.id, productId), eq(products.user_id, user.id)))
      .returning({ id: products.id })

    if (result.length === 0) return { error: "Product not found" }

    revalidatePath("/admin")
    revalidatePath(`/admin/products/${productId}`)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg.includes("products_user_slug_idx")) {
      return { error: "A product with this slug already exists" }
    }
    return { error: "Failed to update product" }
  }
}

export async function deleteProductAction(productId: string): Promise<void> {
  const user = await requireUser()
  await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.user_id, user.id)))
  revalidatePath("/admin")
  redirect("/admin")
}

export async function togglePublishAction(entryId: string): Promise<void> {
  const user = await requireUser()

  const [row] = await db
    .select({
      id: entries.id,
      published: entries.published,
      publish_date: entries.publish_date,
      product_id: entries.product_id,
      user_id: products.user_id,
    })
    .from(entries)
    .innerJoin(products, eq(products.id, entries.product_id))
    .where(eq(entries.id, entryId))
    .limit(1)

  if (!row || row.user_id !== user.id) return

  const nextPublished = !row.published
  await db
    .update(entries)
    .set({
      published: nextPublished,
      publish_date: nextPublished
        ? new Date().toISOString().split("T")[0]
        : row.publish_date,
      updated_at: new Date().toISOString(),
    })
    .where(eq(entries.id, entryId))

  revalidatePath(`/admin/products/${row.product_id}`)
}

export async function deleteEntryAction(entryId: string): Promise<void> {
  const user = await requireUser()

  const [row] = await db
    .select({
      id: entries.id,
      product_id: entries.product_id,
      user_id: products.user_id,
    })
    .from(entries)
    .innerJoin(products, eq(products.id, entries.product_id))
    .where(eq(entries.id, entryId))
    .limit(1)

  if (!row || row.user_id !== user.id) return

  await db.delete(entries).where(eq(entries.id, entryId))
  revalidatePath(`/admin/products/${row.product_id}`)
}

const entryItemInputSchema = z.object({
  id: z.union([z.uuid(), z.string().regex(/^temp-[a-zA-Z0-9-]+$/)]),
  type: z.enum(["FEATURE", "FIX", "IMPROVEMENT", "KNOWNISSUE", "BREAKING", "REMOVED", "NOTE"]),
  title: z.string().trim().max(240),
  description: z.string().trim().max(10_000).nullable(),
  area: z.string().trim().max(80).nullable(),
  sort_order: z.number().int().nonnegative(),
})

const saveEntrySchema = z.object({
  productId: z.uuid(),
  entryId: z.uuid().optional(),
  title: z.string().trim().min(1).max(240),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  summary: z.string().trim().max(2_000).nullable().optional(),
  version: z.string().trim().max(80).nullable().optional(),
  published: z.boolean(),
  publish_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid publish date"),
  items: z.array(entryItemInputSchema).max(500),
  deletedItemIds: z.array(z.uuid()),
})

export async function saveEntryAction(
  raw: z.infer<typeof saveEntrySchema>,
): Promise<{ id: string } | { error: string }> {
  const user = await requireUser()
  const parsed = saveEntrySchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

  const data = parsed.data

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, data.productId), eq(products.user_id, user.id)))
    .limit(1)

  if (!product) return { error: "Product not found" }

  try {
    const entryId = await db.transaction(async (tx) => {
      let savedEntryId = data.entryId

      if (savedEntryId) {
        const updated = await tx
          .update(entries)
          .set({
            title: data.title,
            slug: data.slug,
            summary: data.summary || null,
            version: data.version || null,
            published: data.published,
            publish_date: data.publish_date,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(
              eq(entries.id, savedEntryId),
              eq(entries.product_id, data.productId),
            ),
          )
          .returning({ id: entries.id })
        if (updated.length === 0) throw new Error("ENTRY_NOT_FOUND")
      } else {
        const [created] = await tx
          .insert(entries)
          .values({
            product_id: data.productId,
            title: data.title,
            slug: data.slug,
            summary: data.summary || null,
            version: data.version || null,
            published: data.published,
            publish_date: data.publish_date,
          })
          .returning({ id: entries.id })
        savedEntryId = created.id
      }

      if (data.deletedItemIds.length > 0) {
        await tx
          .delete(entryItems)
          .where(
            and(
              eq(entryItems.entry_id, savedEntryId),
              inArray(entryItems.id, data.deletedItemIds),
            ),
          )
      }

      const validItems = data.items.filter((item) => item.title.length > 0)
      const newItems = validItems.filter((item) => item.id.startsWith("temp-"))
      const existingItems = validItems.filter((item) => !item.id.startsWith("temp-"))

      if (newItems.length > 0) {
        await tx.insert(entryItems).values(
          newItems.map((item) => ({
            entry_id: savedEntryId,
            type: item.type,
            title: item.title,
            description: item.description || null,
            area: item.area || null,
            sort_order: item.sort_order,
          })),
        )
      }

      for (const item of existingItems) {
        await tx
          .update(entryItems)
          .set({
            type: item.type,
            title: item.title,
            description: item.description || null,
            area: item.area || null,
            sort_order: item.sort_order,
            updated_at: new Date().toISOString(),
          })
          .where(
            and(eq(entryItems.id, item.id), eq(entryItems.entry_id, savedEntryId)),
          )
      }

      return savedEntryId
    })

    revalidatePath(`/admin/products/${data.productId}`)
    return { id: entryId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    if (msg === "ENTRY_NOT_FOUND") return { error: "Entry not found" }
    if (msg.includes("entries_product_slug_idx")) {
      return { error: "An entry with this slug already exists for this product" }
    }
    return { error: "Failed to save entry" }
  }
}

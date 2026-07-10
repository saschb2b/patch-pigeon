import type { MetadataRoute } from "next"
import { getSitemapData } from "@/lib/data/public"
import { getSiteUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()
  const { profiles, products, entries } = await getSitemapData()
  const ownerById = new Map(profiles.map((profile) => [profile.id, profile.owner_slug]))
  const productById = new Map(products.map((product) => [product.id, product]))

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/auth/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/auth/sign-up`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/demo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ]

  const profilePages: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${siteUrl}/${profile.owner_slug}`,
    lastModified: new Date(profile.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const productPages: MetadataRoute.Sitemap = products.flatMap((product) => {
    const ownerSlug = ownerById.get(product.user_id)
    if (!ownerSlug) return []
    return [{
      url: `${siteUrl}/${ownerSlug}/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }]
  })

  const entryPages: MetadataRoute.Sitemap = entries.flatMap((entry) => {
    const product = productById.get(entry.product_id)
    const ownerSlug = product ? ownerById.get(product.user_id) : undefined
    if (!product || !ownerSlug) return []
    return [{
      url: `${siteUrl}/${ownerSlug}/${product.slug}/${entry.slug}`,
      lastModified: new Date(entry.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }]
  })

  return [...staticPages, ...profilePages, ...productPages, ...entryPages]
}

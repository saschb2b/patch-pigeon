import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://patchpigeon.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/demo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  // Get all public profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("owner_slug, updated_at")

  // Get all products with owner info
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, user_id")
  
  // Get profile lookup
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, owner_slug")

  const profileLookup = new Map(
    (allProfiles || []).map(p => [p.id, p.owner_slug])
  )

  // Get all published entries with product info
  const { data: entries } = await supabase
    .from("entries")
    .select("slug, publish_date, updated_at, product_id")
    .eq("published", true)

  // Get products lookup
  const { data: allProducts } = await supabase
    .from("products")
    .select("id, slug, user_id")

  const productLookup = new Map(
    (allProducts || []).map(p => [p.id, { slug: p.slug, userId: p.user_id }])
  )

  // Profile pages
  const profilePages: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
    url: `${siteUrl}/${profile.owner_slug}`,
    lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Product changelog pages
  const productPages: MetadataRoute.Sitemap = (products || [])
    .filter(product => profileLookup.has(product.user_id))
    .map((product) => {
      const ownerSlug = profileLookup.get(product.user_id)
      return {
        url: `${siteUrl}/${ownerSlug}/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }
    })

  // Entry detail pages
  const entryPages: MetadataRoute.Sitemap = (entries || [])
    .filter(entry => productLookup.has(entry.product_id))
    .map((entry) => {
      const product = productLookup.get(entry.product_id)!
      const ownerSlug = profileLookup.get(product.userId)
      return {
        url: `${siteUrl}/${ownerSlug}/${product.slug}/${entry.slug}`,
        lastModified: entry.updated_at ? new Date(entry.updated_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }
    })

  return [...staticPages, ...profilePages, ...productPages, ...entryPages]
}

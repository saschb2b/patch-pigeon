import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { ownerSlug, productSlug } = await params
  const supabase = await createClient()

  // Fetch profile by owner slug
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, owner_slug")
    .eq("owner_slug", ownerSlug)
    .maybeSingle()

  if (!profile) {
    return new Response("Owner not found", { status: 404 })
  }

  // Fetch product scoped to owner
  const { data: product } = await supabase
    .from("products")
    .select("id, name, slug, description")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    return new Response("Product not found", { status: 404 })
  }

  // Fetch published entries
  const { data: entries } = await supabase
    .from("entries")
    .select("title, slug, content, type, version, publish_date")
    .eq("product_id", product.id)
    .eq("published", true)
    .order("publish_date", { ascending: false })
    .limit(50)

  const baseUrl = new URL(request.url).origin
  const publicPath = `/${profile.owner_slug}/${product.slug}`

  const rssItems = (entries || [])
    .map((entry) => {
      const pubDate = entry.publish_date ? new Date(entry.publish_date).toUTCString() : new Date().toUTCString()
      const link = `${baseUrl}${publicPath}/${entry.slug}`
      const description = entry.content.replace(/[#*`]/g, "").substring(0, 500)

      return `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <category>${entry.type}</category>
      ${entry.version ? `<version>${entry.version}</version>` : ""}
    </item>`
    })
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${product.name} Changelog</title>
    <link>${baseUrl}${publicPath}</link>
    <description>${product.description || `Latest updates for ${product.name}`}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api${publicPath}/changelog.rss" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  })
}

import { getPublicFeed } from "@/lib/data/public"
import { escapeXml } from "@/lib/utils/xml"
import { getSiteUrl } from "@/lib/site-url"

interface RouteParams {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { ownerSlug, productSlug } = await params
  const result = await getPublicFeed(ownerSlug, productSlug, { limit: 50 })

  if (!result) {
    return new Response("Changelog not found", { status: 404 })
  }

  const baseUrl = getSiteUrl()
  const publicPath = `/${result.profile.owner_slug}/${result.product.slug}`
  const items = result.entries
    .map((entry) => {
      const link = `${baseUrl}${publicPath}/${entry.slug}`
      const description =
        entry.summary ?? entry.entry_items.map((item) => item.title).join(" · ")
      const categories = [...new Set(entry.entry_items.map((item) => item.type))]

      return `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(entry.publish_date).toUTCString()}</pubDate>
      <description>${escapeXml(description.slice(0, 500))}</description>
      ${categories.map((category) => `<category>${escapeXml(category)}</category>`).join("\n      ")}
    </item>`
    })
    .join("")

  const title = `${result.product.name} Changelog`
  const description = result.product.description || `Latest updates for ${result.product.name}`
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(`${baseUrl}${publicPath}`)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${baseUrl}/api${publicPath}/changelog.rss`)}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  })
}

import { NextResponse } from "next/server"
import { getPublicFeed } from "@/lib/data/public"

interface RouteParams {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

function parseInteger(value: string | null, fallback: number) {
  if (value === null) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function GET(request: Request, { params }: RouteParams) {
  const { ownerSlug, productSlug } = await params
  const { searchParams } = new URL(request.url)
  const limit = Math.max(1, Math.min(parseInteger(searchParams.get("limit"), 50), 100))
  const offset = Math.max(0, parseInteger(searchParams.get("offset"), 0))
  const result = await getPublicFeed(ownerSlug, productSlug, {
    limit: limit + 1,
    offset,
  })

  if (!result) {
    return NextResponse.json({ error: "Changelog not found" }, { status: 404 })
  }

  const hasMore = result.entries.length > limit
  const feedEntries = result.entries.slice(0, limit)

  return NextResponse.json(
    {
      product: {
        name: result.product.name,
        slug: result.product.slug,
        description: result.product.description,
        logo_url: result.product.logo_url,
      },
      entries: feedEntries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        slug: entry.slug,
        summary: entry.summary,
        version: entry.version,
        publish_date: entry.publish_date,
        created_at: entry.created_at,
        items: entry.entry_items.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          area: item.area,
        })),
      })),
      pagination: { limit, offset, has_more: hasMore },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}

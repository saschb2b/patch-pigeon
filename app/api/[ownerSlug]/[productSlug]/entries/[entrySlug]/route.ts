import { NextResponse } from "next/server"
import { getPublicEntry } from "@/lib/data/public"

interface RouteParams {
  params: Promise<{ ownerSlug: string; productSlug: string; entrySlug: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { ownerSlug, productSlug, entrySlug } = await params
  const result = await getPublicEntry(ownerSlug, productSlug, entrySlug)

  if (!result) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  return NextResponse.json(
    {
      product: {
        name: result.product.name,
        slug: result.product.slug,
      },
      entry: {
        id: result.entry.id,
        title: result.entry.title,
        slug: result.entry.slug,
        summary: result.entry.summary,
        version: result.entry.version,
        publish_date: result.entry.publish_date,
        created_at: result.entry.created_at,
        items: result.entry.entry_items.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          area: item.area,
        })),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}

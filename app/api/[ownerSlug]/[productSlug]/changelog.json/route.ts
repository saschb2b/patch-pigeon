import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { ownerSlug, productSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("id").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: "Owner not found" }, { status: 404 })
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, name, slug, description, logo_url")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select("id, title, slug, summary, version, publish_date, created_at, entry_items(*)")
    .eq("product_id", product.id)
    .eq("published", true)
    .order("publish_date", { ascending: false })
    .range(offset, offset + limit - 1)

  if (entriesError) {
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }

  const transformedEntries = (entries || []).map((entry) => ({
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    summary: entry.summary,
    version: entry.version,
    publish_date: entry.publish_date,
    created_at: entry.created_at,
    items: (entry.entry_items || [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((item: { id: string; type: string; title: string; description: string | null; area: string | null }) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        area: item.area,
      })),
  }))

  return NextResponse.json(
    {
      product: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        logo_url: product.logo_url,
      },
      entries: transformedEntries,
      pagination: {
        limit,
        offset,
        has_more: (entries?.length || 0) === limit,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}

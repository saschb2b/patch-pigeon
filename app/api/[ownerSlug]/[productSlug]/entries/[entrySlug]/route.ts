import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteParams {
  params: Promise<{ ownerSlug: string; productSlug: string; entrySlug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { ownerSlug, productSlug, entrySlug } = await params
  const supabase = await createClient()

  // Fetch profile by owner slug
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, owner_slug")
    .eq("owner_slug", ownerSlug)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: "Owner not found" }, { status: 404 })
  }

  // Fetch product scoped to owner
  const { data: product } = await supabase
    .from("products")
    .select("id, name, slug")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Fetch entry
  const { data: entry } = await supabase
    .from("entries")
    .select("id, title, slug, content, type, version, publish_date, created_at")
    .eq("product_id", product.id)
    .eq("slug", entrySlug)
    .eq("published", true)
    .maybeSingle()

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  return NextResponse.json(
    {
      product: {
        name: product.name,
        slug: product.slug,
      },
      entry,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}

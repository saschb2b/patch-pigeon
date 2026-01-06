import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowRight, Calendar } from "lucide-react"
import type { Product, Entry } from "@/lib/types"

interface PageProps {
  params: Promise<{ ownerSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { ownerSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    return { title: "Not Found" }
  }

  return {
    title: `${profile.display_name || profile.owner_slug} - PatchPigeon`,
    description: `Explore changelogs from ${profile.display_name || profile.owner_slug}`,
  }
}

interface ProductWithLatestEntry extends Product {
  latest_entry?: Entry | null
  entry_count?: number
}

export default async function OwnerProfilePage({ params }: PageProps) {
  const { ownerSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    notFound()
  }

  // Get all products for this owner
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  // Fetch latest published entry and count for each product
  const productsWithLatest: ProductWithLatestEntry[] = await Promise.all(
    (products || []).map(async (product) => {
      const { data: latestEntry } = await supabase
        .from("entries")
        .select("*")
        .eq("product_id", product.id)
        .eq("published", true)
        .order("publish_date", { ascending: false })
        .limit(1)
        .maybeSingle()

      const { count } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true })
        .eq("product_id", product.id)
        .eq("published", true)

      return {
        ...product,
        latest_entry: latestEntry,
        entry_count: count || 0,
      }
    }),
  )

  // Only show products that have at least one published entry
  const publicProducts = productsWithLatest.filter((p) => p.entry_count && p.entry_count > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.display_name || profile.owner_slug}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#A7D8FF]/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">
                    {(profile.display_name || profile.owner_slug).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile.display_name || profile.owner_slug}</h1>
                <p className="text-sm text-muted-foreground">@{profile.owner_slug}</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Powered by</span>
              <PigeonLogo size="sm" className="w-5 h-5" />
              <span className="font-medium">PatchPigeon</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Projects</h2>
            <p className="text-muted-foreground">
              Explore all changelogs from {profile.display_name || profile.owner_slug}
            </p>
          </div>

          {publicProducts.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-border/50">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No public changelogs yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {publicProducts.map((product) => (
                <Link key={product.id} href={`/${ownerSlug}/${product.slug}`} className="group">
                  <Card className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-[#A7D8FF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#A7D8FF]/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {product.logo_url ? (
                          <img
                            src={product.logo_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#A7D8FF]/20 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-bold text-[#A7D8FF]">{product.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-[#A7D8FF] transition-colors truncate">
                              {product.name}
                            </h3>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                          )}
                          <div className="flex items-center gap-3 flex-wrap">
                            {product.latest_entry?.version && (
                              <Badge
                                variant="secondary"
                                className="font-mono text-xs bg-[#B8E5D5]/20 text-[#2D7A5F] border-0"
                              >
                                v{product.latest_entry.version}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {product.entry_count} {product.entry_count === 1 ? "update" : "updates"}
                            </span>
                            {product.latest_entry?.publish_date && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(product.latest_entry.publish_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Latest update preview */}
                      {product.latest_entry && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Latest update</p>
                          <p className="text-sm text-foreground font-medium truncate">{product.latest_entry.title}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

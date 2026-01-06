import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import type { EntryWithItems, Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { ownerSlug, productSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    return { title: "Not Found" }
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    return { title: "Not Found" }
  }

  return {
    title: `${product.name} Changelog | PatchPigeon`,
    description: product.description || `Latest updates and changes for ${product.name}`,
  }
}

export default async function ChangelogPage({ params }: PageProps) {
  const { ownerSlug, productSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    notFound()
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    notFound()
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("product_id", product.id)
    .eq("published", true)
    .order("publish_date", { ascending: false })

  const groupedEntries = groupEntriesByMonth((entries as EntryWithItems[]) || [])

  return (
    <div className="min-h-screen bg-background">
      <ChangelogHeader product={product as Product} profile={profile as Profile} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Changelog</h2>
            <p className="text-muted-foreground">All the latest updates, improvements, and fixes.</p>
          </div>

          {groupedEntries.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-xl">
              <p className="text-muted-foreground">No changelog entries yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="space-y-12 md:pl-4">
              {groupedEntries.map((group) => (
                <TimelineGroup
                  key={group.date}
                  date={group.date}
                  entries={group.entries}
                  ownerSlug={ownerSlug}
                  productSlug={productSlug}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function groupEntriesByMonth(entries: EntryWithItems[]): { date: string; entries: EntryWithItems[] }[] {
  const groups: Record<string, EntryWithItems[]> = {}

  entries.forEach((entry) => {
    const date = entry.publish_date ? new Date(entry.publish_date) : new Date(entry.created_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(entry)
  })

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, entries]) => ({ date, entries }))
}

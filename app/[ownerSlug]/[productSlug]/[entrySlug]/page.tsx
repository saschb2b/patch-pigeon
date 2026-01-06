import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { EntryCard } from "@/components/changelog/entry-card"
import type { EntryWithItems, Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ ownerSlug: string; productSlug: string; entrySlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { ownerSlug, productSlug, entrySlug } = await params
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

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("product_id", product.id)
    .eq("slug", entrySlug)
    .eq("published", true)
    .maybeSingle()

  if (!entry) {
    return { title: "Not Found" }
  }

  return {
    title: `${entry.title} - ${product.name} Changelog | PatchPigeon`,
    description: entry.summary || `${entry.title} changelog for ${product.name}`,
  }
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { ownerSlug, productSlug, entrySlug } = await params
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

  const { data: entry } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("product_id", product.id)
    .eq("slug", entrySlug)
    .eq("published", true)
    .maybeSingle()

  if (!entry) {
    notFound()
  }

  const { data: relatedEntries } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("product_id", product.id)
    .eq("published", true)
    .neq("id", entry.id)
    .order("publish_date", { ascending: false })
    .limit(3)

  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const entryWithItems = entry as EntryWithItems
  const items = entryWithItems.entry_items || []

  return (
    <div className="min-h-screen bg-background">
      <ChangelogHeader product={product as Product} profile={profile as Profile} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${ownerSlug}/${productSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to changelog
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 flex-wrap mb-4">
                {entry.version && (
                  <span className="text-sm font-mono font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    v{entry.version}
                  </span>
                )}
                {publishDate && <span className="text-sm text-muted-foreground">{publishDate}</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance mb-4">{entry.title}</h1>
              {entry.summary && <p className="text-lg text-muted-foreground">{entry.summary}</p>}
            </header>

            <div className="border-t border-border pt-8">
              {items.length > 0 ? (
                <EntryItemsList items={items} />
              ) : (
                <p className="text-muted-foreground text-center py-8">No changes documented for this version.</p>
              )}
            </div>
          </article>

          {relatedEntries && relatedEntries.length > 0 && (
            <section className="mt-16 pt-8 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">More Updates</h2>
              <div className="space-y-4">
                {relatedEntries.map((related) => (
                  <EntryCard
                    key={related.id}
                    entry={related as EntryWithItems}
                    ownerSlug={ownerSlug}
                    productSlug={productSlug}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

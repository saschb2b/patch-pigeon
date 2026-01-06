import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { getDemoData } from "@/lib/demo-data"

interface PageProps {
  params: Promise<{ productSlug: string; entrySlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { entrySlug } = await params
  const { product, entries } = getDemoData()
  const entry = entries.find((e) => e.slug === entrySlug)

  if (!entry) {
    return { title: "Not Found" }
  }

  return {
    title: `${entry.title} | ${product.name} Changelog | PatchPigeon`,
    description: entry.summary || `Changelog entry for ${product.name}`,
  }
}

export default async function DemoEntryDetailPage({ params }: PageProps) {
  const { productSlug, entrySlug } = await params
  const { profile, product, entries } = getDemoData()

  const entry = entries.find((e) => e.slug === entrySlug)

  if (!entry) {
    notFound()
  }

  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Find related entries
  const relatedEntries = entries.filter((e) => e.id !== entry.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      <div className="bg-gradient-to-r from-[#A7D8FF] via-[#FFD4B8] to-[#B8E8D2] text-slate-800 py-2 px-4 text-center text-sm font-medium">
        This is a demo changelog. Want your own?{" "}
        <a href="/auth/sign-up" className="underline font-semibold hover:no-underline">
          Sign up for free
        </a>
      </div>

      <ChangelogHeader product={product} profile={profile} isDemo />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/demo/${productSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to changelog
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 flex-wrap mb-4">
                {entry.version && (
                  <span className="text-sm font-mono font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    v{entry.version}
                  </span>
                )}
                {publishDate && <span className="text-sm text-muted-foreground">{publishDate}</span>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{entry.title}</h1>

              {entry.summary && <p className="text-lg text-muted-foreground">{entry.summary}</p>}
            </header>

            {/* Entry items */}
            <div className="border-t border-border pt-8">
              <EntryItemsList items={entry.entry_items || []} />
            </div>
          </article>

          {/* Related entries */}
          {relatedEntries.length > 0 && (
            <aside className="mt-16 pt-8 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Other Updates</h2>
              <div className="space-y-4">
                {relatedEntries.map((related) => (
                  <Link
                    key={related.id}
                    href={`/demo/${productSlug}/${related.slug}`}
                    className="block p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {related.version && (
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          v{related.version}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground">{related.title}</h3>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import { getDemoData } from "@/lib/demo-data"

export const metadata = {
  title: "Demo Changelog | PatchPigeon",
  description: "See how your changelog could look with PatchPigeon",
}

function groupEntriesByMonth(
  entries: typeof import("@/lib/demo-data").getDemoData extends () => infer R ? R["entries"] : never,
) {
  const groups: Record<string, typeof entries> = {}

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

export default function DemoProductPage() {
  const { profile, product, entries } = getDemoData()
  const groupedEntries = groupEntriesByMonth(entries)

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
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Changelog</h2>
            <p className="text-muted-foreground">All the latest updates, improvements, and fixes.</p>
          </div>

          <div className="space-y-12 md:pl-4">
            {groupedEntries.map((group) => (
              <TimelineGroup
                key={group.date}
                date={group.date}
                entries={group.entries}
                ownerSlug="demo"
                productSlug="acme-app"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

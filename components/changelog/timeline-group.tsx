import { EntryCard } from "./entry-card"
import type { EntryWithItems } from "@/lib/types"

interface TimelineGroupProps {
  date: string
  entries: EntryWithItems[]
  ownerSlug: string
  productSlug: string
}

export function TimelineGroup({ date, entries, ownerSlug, productSlug }: TimelineGroupProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 to-border hidden md:block" />

      <div className="flex items-center gap-4 mb-6">
        <div className="hidden md:flex items-center justify-center w-3 h-3 rounded-full bg-primary ring-4 ring-background -ml-[5px]" />
        <h2 className="text-xl font-semibold text-foreground">{formattedDate}</h2>
      </div>

      <div className="md:pl-8 space-y-4">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} ownerSlug={ownerSlug} productSlug={productSlug} />
        ))}
      </div>
    </div>
  )
}

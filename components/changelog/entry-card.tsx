import Link from "next/link"
import { Sparkles, Bug, Zap, AlertTriangle } from "lucide-react"
import type { EntryWithItems, ChangeType } from "@/lib/types"

interface EntryCardProps {
  entry: EntryWithItems
  ownerSlug: string
  productSlug: string
}

export function EntryCard({ entry, ownerSlug, productSlug }: EntryCardProps) {
  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Count items by type
  const items = entry.entry_items || []
  const typeCounts = items.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    },
    {} as Record<ChangeType, number>,
  )

  // Get summary: either from summary field or first few item titles
  const summaryText =
    entry.summary ||
    items
      .slice(0, 3)
      .map((i) => i.title)
      .join(" • ")

  return (
    <article className="group relative">
      <Link href={`/${ownerSlug}/${productSlug}/${entry.slug}`} className="block">
        <div className="flex flex-col gap-3 p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 flex-wrap">
            {entry.version && (
              <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                v{entry.version}
              </span>
            )}
            {publishDate && <span className="text-xs text-muted-foreground">{publishDate}</span>}
          </div>

          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {entry.title}
          </h3>

          {summaryText && <p className="text-sm text-muted-foreground line-clamp-2">{summaryText}</p>}

          {/* Change counts */}
          {items.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
              {typeCounts.FEATURE > 0 && (
                <span className="text-xs flex items-center gap-1 text-sky-600 dark:text-sky-400">
                  <Sparkles className="w-3 h-3" />
                  {typeCounts.FEATURE} feature{typeCounts.FEATURE > 1 ? "s" : ""}
                </span>
              )}
              {typeCounts.IMPROVEMENT > 0 && (
                <span className="text-xs flex items-center gap-1 text-peach-600 dark:text-peach-400">
                  <Zap className="w-3 h-3" />
                  {typeCounts.IMPROVEMENT} improvement{typeCounts.IMPROVEMENT > 1 ? "s" : ""}
                </span>
              )}
              {typeCounts.FIX > 0 && (
                <span className="text-xs flex items-center gap-1 text-mint-600 dark:text-mint-400">
                  <Bug className="w-3 h-3" />
                  {typeCounts.FIX} fix{typeCounts.FIX > 1 ? "es" : ""}
                </span>
              )}
              {typeCounts.BREAKING > 0 && (
                <span className="text-xs flex items-center gap-1 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-3 h-3" />
                  {typeCounts.BREAKING} breaking
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}

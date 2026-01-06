import { changeTypeConfig } from "./change-type-badge"
import type { EntryItem, ChangeType } from "@/lib/types"

interface EntryItemsListProps {
  items: EntryItem[]
  compact?: boolean
}

const typeOrder: ChangeType[] = ["FEATURE", "IMPROVEMENT", "FIX", "BREAKING", "REMOVED", "KNOWNISSUE", "NOTE"]

export function EntryItemsList({ items, compact = false }: EntryItemsListProps) {
  // Group items by type
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {} as Record<ChangeType, EntryItem[]>,
  )

  if (compact) {
    // Compact view: just show counts by type
    return (
      <div className="flex flex-wrap gap-2">
        {typeOrder.map((type) => {
          const typeItems = groupedItems[type]
          if (!typeItems || typeItems.length === 0) return null
          const config = changeTypeConfig[type]

          return (
            <span key={type} className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={config.className.split(" ")[1]}>{config.icon}</span>
              {typeItems.length} {config.label.toLowerCase()}
              {typeItems.length > 1 ? "s" : ""}
            </span>
          )
        })}
      </div>
    )
  }

  // Full view: grouped list
  return (
    <div className="space-y-6">
      {typeOrder.map((type) => {
        const typeItems = groupedItems[type]
        if (!typeItems || typeItems.length === 0) return null

        const config = changeTypeConfig[type]
        const colorClass = config.className.includes("sky")
          ? "text-sky-600 dark:text-sky-400"
          : config.className.includes("peach")
            ? "text-peach-600 dark:text-peach-400"
            : config.className.includes("mint")
              ? "text-mint-600 dark:text-mint-400"
              : config.className.includes("butter")
                ? "text-butter-600 dark:text-butter-400"
                : config.className.includes("red")
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"

        const dotColor = config.className.includes("sky")
          ? "bg-sky-500"
          : config.className.includes("peach")
            ? "bg-peach-500"
            : config.className.includes("mint")
              ? "bg-mint-500"
              : config.className.includes("butter")
                ? "bg-butter-500"
                : config.className.includes("red")
                  ? "bg-red-500"
                  : "bg-muted-foreground"

        return (
          <div key={type}>
            <div className={`flex items-center gap-2 mb-3 ${colorClass}`}>
              {config.icon}
              <h3 className="font-semibold text-sm uppercase tracking-wide">
                {config.label}
                {typeItems.length > 1 ? "s" : ""}
              </h3>
              <span className="text-xs opacity-60">({typeItems.length})</span>
            </div>
            <ul className="space-y-2.5">
              {typeItems
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.area && (
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {item.area}
                          </span>
                        )}
                        <span className="text-foreground">{item.title}</span>
                      </div>
                      {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

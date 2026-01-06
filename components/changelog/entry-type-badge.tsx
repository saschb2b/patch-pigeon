import { cn } from "@/lib/utils"
import type { EntryType } from "@/lib/types"

const typeConfig: Record<EntryType, { label: string; className: string }> = {
  feature: {
    label: "Feature",
    className: "bg-[#BFEBD6] text-[#1F2937] border-[#BFEBD6]",
  },
  improvement: {
    label: "Improvement",
    className: "bg-[#A7D8FF] text-[#1F2937] border-[#A7D8FF]",
  },
  fix: {
    label: "Fix",
    className: "bg-[#FFE7A3] text-[#1F2937] border-[#FFE7A3]",
  },
  breaking: {
    label: "Breaking",
    className: "bg-[#FFB8A1] text-[#1F2937] border-[#FFB8A1]",
  },
}

interface EntryTypeBadgeProps {
  type: EntryType
  className?: string
}

export function EntryTypeBadge({ type, className }: EntryTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

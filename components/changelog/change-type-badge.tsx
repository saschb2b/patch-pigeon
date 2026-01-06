import type React from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Bug, Zap, AlertTriangle, Minus, MessageSquare } from "lucide-react"
import type { ChangeType } from "@/lib/types"

const typeConfig: Record<ChangeType, { label: string; icon: React.ReactNode; className: string }> = {
  FEATURE: {
    label: "Feature",
    icon: <Sparkles className="w-3 h-3" />,
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  },
  IMPROVEMENT: {
    label: "Improvement",
    icon: <Zap className="w-3 h-3" />,
    className: "bg-peach-500/10 text-peach-700 dark:text-peach-300 border-peach-500/20",
  },
  FIX: {
    label: "Fix",
    icon: <Bug className="w-3 h-3" />,
    className: "bg-mint-500/10 text-mint-700 dark:text-mint-300 border-mint-500/20",
  },
  KNOWNISSUE: {
    label: "Known Issue",
    icon: <AlertTriangle className="w-3 h-3" />,
    className: "bg-butter-500/10 text-butter-700 dark:text-butter-300 border-butter-500/20",
  },
  BREAKING: {
    label: "Breaking",
    icon: <AlertTriangle className="w-3 h-3" />,
    className: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
  },
  REMOVED: {
    label: "Removed",
    icon: <Minus className="w-3 h-3" />,
    className: "bg-muted text-muted-foreground border-border",
  },
  NOTE: {
    label: "Note",
    icon: <MessageSquare className="w-3 h-3" />,
    className: "bg-muted text-muted-foreground border-border",
  },
}

interface ChangeTypeBadgeProps {
  type: ChangeType
  className?: string
  showIcon?: boolean
}

export function ChangeTypeBadge({ type, className, showIcon = true }: ChangeTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  )
}

export { typeConfig as changeTypeConfig }

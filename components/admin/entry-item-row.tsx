"use client"

import type React from "react"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bug,
  Zap,
  AlertTriangle,
  Minus,
  MessageSquare,
} from "lucide-react"
import type { ChangeType, EntryItem } from "@/lib/types"

export const changeTypeConfig: Record<
  ChangeType,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  FEATURE: {
    label: "Feature",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-500/10 border-sky-500/20",
  },
  FIX: {
    label: "Fix",
    icon: <Bug className="w-3.5 h-3.5" />,
    color: "text-mint-600 dark:text-mint-400",
    bgColor: "bg-mint-500/10 border-mint-500/20",
  },
  IMPROVEMENT: {
    label: "Improvement",
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-peach-600 dark:text-peach-400",
    bgColor: "bg-peach-500/10 border-peach-500/20",
  },
  KNOWNISSUE: {
    label: "Known Issue",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-butter-600 dark:text-butter-400",
    bgColor: "bg-butter-500/10 border-butter-500/20",
  },
  BREAKING: {
    label: "Breaking",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
  REMOVED: {
    label: "Removed",
    icon: <Minus className="w-3.5 h-3.5" />,
    color: "text-muted-foreground",
    bgColor: "bg-muted border-border",
  },
  NOTE: {
    label: "Note",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    color: "text-muted-foreground",
    bgColor: "bg-muted border-border",
  },
}

interface EntryItemRowProps {
  item: EntryItem
  onUpdate: (id: string, updates: Partial<EntryItem>) => void
  onDelete: (id: string) => void
}

export function EntryItemRow({ item, onUpdate, onDelete }: EntryItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(!!item.description)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = changeTypeConfig[item.type]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border bg-card transition-all ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-start gap-2 p-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2.5 cursor-grab opacity-40 hover:opacity-100 transition-opacity touch-none"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Type Selector */}
        <div className="shrink-0 w-32">
          <Select value={item.type} onValueChange={(v) => onUpdate(item.id, { type: v as ChangeType })}>
            <SelectTrigger className={`h-9 text-xs font-medium border ${config.bgColor} ${config.color}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(changeTypeConfig).map(([type, cfg]) => (
                <SelectItem key={type} value={type}>
                  <div className={`flex items-center gap-2 ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title & Area */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex gap-2">
            <Input
              value={item.title}
              onChange={(e) => onUpdate(item.id, { title: e.target.value })}
              placeholder="What changed?"
              className="h-9 flex-1"
            />
            <Input
              value={item.area || ""}
              onChange={(e) => onUpdate(item.id, { area: e.target.value || null })}
              placeholder="Area (optional)"
              className="h-9 w-28 text-xs font-mono"
            />
          </div>

          {/* Description (expandable) */}
          {isExpanded && (
            <Textarea
              value={item.description || ""}
              onChange={(e) => onUpdate(item.id, { description: e.target.value || null })}
              placeholder="Add more details (optional)..."
              className="min-h-[60px] text-sm resize-none"
              rows={2}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-60 hover:opacity-100"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive opacity-60 hover:opacity-100"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

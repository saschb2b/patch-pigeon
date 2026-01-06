"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Box, IconButton, Stack, Tooltip } from "@mui/material"
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import DeleteIcon from "@mui/icons-material/Delete"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import RemoveIcon from "@mui/icons-material/Remove"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import type { ChangeType, EntryItem } from "@/lib/types"

export const changeTypeConfig: Record<
  ChangeType,
  { label: string; icon: React.ReactNode; muiColor: string }
> = {
  FEATURE: {
    label: "Feature",
    icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />,
    muiColor: "#0ea5e9",
  },
  FIX: {
    label: "Fix",
    icon: <BugReportIcon sx={{ fontSize: 14 }} />,
    muiColor: "#10b981",
  },
  IMPROVEMENT: {
    label: "Improvement",
    icon: <BoltIcon sx={{ fontSize: 14 }} />,
    muiColor: "#f97316",
  },
  KNOWNISSUE: {
    label: "Known Issue",
    icon: <WarningIcon sx={{ fontSize: 14 }} />,
    muiColor: "#eab308",
  },
  BREAKING: {
    label: "Breaking",
    icon: <WarningIcon sx={{ fontSize: 14 }} />,
    muiColor: "#ef4444",
  },
  REMOVED: {
    label: "Removed",
    icon: <RemoveIcon sx={{ fontSize: 14 }} />,
    muiColor: "#6b7280",
  },
  NOTE: {
    label: "Note",
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />,
    muiColor: "#6b7280",
  },
}

interface EntryItemRowProps {
  item: EntryItem
  onUpdate: (id: string, updates: Partial<EntryItem>) => void
  onDelete: (id: string) => void
  onDuplicate?: (item: EntryItem) => void
  onNavigate?: (direction: "up" | "down") => void
  autoFocus?: boolean
}

export function EntryItemRow({ item, onUpdate, onDelete, onDuplicate, onNavigate, autoFocus }: EntryItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(!!item.description)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = changeTypeConfig[item.type]

  // Auto-focus when this is a new item
  useEffect(() => {
    if (autoFocus && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [autoFocus])

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    onUpdate(item.id, { type: event.target.value as ChangeType })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter to expand/add description
    if (e.key === "Enter" && !e.shiftKey && !isExpanded) {
      e.preventDefault()
      setIsExpanded(true)
    }
    // Arrow key navigation
    if (e.key === "ArrowUp" && (e.altKey || e.metaKey)) {
      e.preventDefault()
      onNavigate?.("up")
    }
    if (e.key === "ArrowDown" && (e.altKey || e.metaKey)) {
      e.preventDefault()
      onNavigate?.("down")
    }
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        borderRadius: 2,
        border: 1,
        borderColor: isDragging ? "primary.main" : "divider",
        bgcolor: "background.paper",
        transition: "all 0.2s",
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? 3 : 0,
        "&:hover": {
          borderColor: "grey.400",
        },
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: "0 0 0 1px rgba(31, 41, 55, 0.1)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ p: 1.5 }}>
        {/* Drag Handle */}
        <Tooltip title="Drag to reorder">
          <Box
            component="button"
            {...attributes}
            {...listeners}
            sx={{
              mt: 1,
              cursor: "grab",
              opacity: 0.4,
              background: "none",
              border: "none",
              p: 0,
              touchAction: "none",
              display: "flex",
              "&:hover": { opacity: 0.8 },
              "&:active": { cursor: "grabbing" },
            }}
          >
            <DragIndicatorIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          </Box>
        </Tooltip>

        {/* Type Selector */}
        <Box sx={{ flexShrink: 0, width: 140 }}>
          <MuiSelect
            value={item.type}
            onChange={handleTypeChange}
            size="small"
            fullWidth
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: config.muiColor,
              bgcolor: `${config.muiColor}10`,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${config.muiColor}40`,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: config.muiColor,
              },
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
              },
            }}
            renderValue={(value) => {
              const cfg = changeTypeConfig[value as ChangeType]
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: cfg.muiColor }}>
                  {cfg.icon}
                  {cfg.label}
                </Box>
              )
            }}
          >
            {Object.entries(changeTypeConfig).map(([type, cfg]) => (
              <MenuItem key={type} value={type}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: cfg.muiColor }}>
                  {cfg.icon}
                  {cfg.label}
                </Box>
              </MenuItem>
            ))}
          </MuiSelect>
        </Box>

        {/* Title & Area */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          <Stack direction="row" spacing={1}>
            <Input
              ref={titleInputRef}
              value={item.title}
              onChange={(e) => onUpdate(item.id, { title: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="What changed?"
              sx={{ flex: 1 }}
            />
            <Tooltip title="Component/area tag">
              <Box sx={{ width: 100 }}>
                <Input
                  value={item.area || ""}
                  onChange={(e) => onUpdate(item.id, { area: e.target.value || null })}
                  placeholder="Area"
                  inputProps={{ style: { fontSize: "0.75rem", fontFamily: "monospace" } }}
                />
              </Box>
            </Tooltip>
          </Stack>

          {/* Description (expandable) */}
          {isExpanded && (
            <Textarea
              value={item.description || ""}
              onChange={(e) => onUpdate(item.id, { description: e.target.value || null })}
              placeholder="Add more details (optional)..."
              rows={2}
              autoFocus={isExpanded && !item.description}
            />
          )}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={isExpanded ? "Hide description" : "Add description (Enter)"}>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
              {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
          {onDuplicate && (
            <Tooltip title="Duplicate item">
              <IconButton
                size="small"
                onClick={() => onDuplicate(item)}
                sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
              >
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete item">
            <IconButton
              size="small"
              onClick={() => onDelete(item.id)}
              sx={{
                opacity: 0.6,
                "&:hover": { opacity: 1, color: "error.main" },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  )
}

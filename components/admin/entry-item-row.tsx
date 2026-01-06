"use client"

import type React from "react"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Box, IconButton, Stack, Tooltip } from "@mui/material"
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import DeleteIcon from "@mui/icons-material/Delete"
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
}

export function EntryItemRow({ item, onUpdate, onDelete }: EntryItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(!!item.description)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = changeTypeConfig[item.type]

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    onUpdate(item.id, { type: event.target.value as ChangeType })
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "all 0.2s",
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? 3 : 0,
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ p: 1.5 }}>
        {/* Drag Handle */}
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
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        </Box>

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
              value={item.title}
              onChange={(e) => onUpdate(item.id, { title: e.target.value })}
              placeholder="What changed?"
              sx={{ flex: 1 }}
            />
            <Input
              value={item.area || ""}
              onChange={(e) => onUpdate(item.id, { area: e.target.value || null })}
              placeholder="Area"
              sx={{ width: 100 }}
              inputProps={{ style: { fontSize: "0.75rem", fontFamily: "monospace" } }}
            />
          </Stack>

          {/* Description (expandable) */}
          {isExpanded && (
            <Textarea
              value={item.description || ""}
              onChange={(e) => onUpdate(item.id, { description: e.target.value || null })}
              placeholder="Add more details (optional)..."
              rows={2}
            />
          )}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
              {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
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

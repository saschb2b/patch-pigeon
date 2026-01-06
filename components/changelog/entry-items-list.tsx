import { Box, Typography, Stack, Chip } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import RemoveIcon from "@mui/icons-material/Remove"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import type { EntryItem, ChangeType } from "@/lib/types"
import type React from "react"

interface EntryItemsListProps {
  items: EntryItem[]
  compact?: boolean
}

const typeOrder: ChangeType[] = ["FEATURE", "IMPROVEMENT", "FIX", "BREAKING", "REMOVED", "KNOWNISSUE", "NOTE"]

interface TypeConfig {
  label: string
  icon: React.ReactElement
  color: string
  dotColor: string
}

const typeConfig: Record<ChangeType, TypeConfig> = {
  FEATURE: {
    label: "Feature",
    icon: <AutoAwesomeIcon sx={{ fontSize: 16 }} />,
    color: "#0284c7",
    dotColor: "#a7d8ff",
  },
  IMPROVEMENT: {
    label: "Improvement",
    icon: <BoltIcon sx={{ fontSize: 16 }} />,
    color: "#c2410c",
    dotColor: "#ffb8a1",
  },
  FIX: {
    label: "Fix",
    icon: <BugReportIcon sx={{ fontSize: 16 }} />,
    color: "#15803d",
    dotColor: "#bfebd6",
  },
  KNOWNISSUE: {
    label: "Known Issue",
    icon: <WarningIcon sx={{ fontSize: 16 }} />,
    color: "#a16207",
    dotColor: "#ffe7a3",
  },
  BREAKING: {
    label: "Breaking",
    icon: <WarningIcon sx={{ fontSize: 16 }} />,
    color: "#dc2626",
    dotColor: "#fca5a5",
  },
  REMOVED: {
    label: "Removed",
    icon: <RemoveIcon sx={{ fontSize: 16 }} />,
    color: "#757575",
    dotColor: "#9e9e9e",
  },
  NOTE: {
    label: "Note",
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />,
    color: "#757575",
    dotColor: "#9e9e9e",
  },
}

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
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {typeOrder.map((type) => {
          const typeItems = groupedItems[type]
          if (!typeItems || typeItems.length === 0) return null
          const config = typeConfig[type]

          return (
            <Stack key={type} direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ color: config.color }}>{config.icon}</Box>
              <Typography variant="caption" color="text.secondary">
                {typeItems.length} {config.label.toLowerCase()}
                {typeItems.length > 1 ? "s" : ""}
              </Typography>
            </Stack>
          )
        })}
      </Stack>
    )
  }

  // Full view: grouped list
  return (
    <Stack spacing={3}>
      {typeOrder.map((type) => {
        const typeItems = groupedItems[type]
        if (!typeItems || typeItems.length === 0) return null

        const config = typeConfig[type]

        return (
          <Box key={type}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, color: config.color }}>
              {config.icon}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                {config.label}
                {typeItems.length > 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                ({typeItems.length})
              </Typography>
            </Stack>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Stack spacing={1.5}>
                {typeItems
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <Box
                      component="li"
                      key={item.id}
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          mt: 1,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: config.dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          {item.area && (
                            <Chip
                              label={item.area}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                bgcolor: "grey.100",
                                color: "text.secondary",
                              }}
                            />
                          )}
                          <Typography variant="body2" color="text.primary">
                            {item.title}
                          </Typography>
                        </Stack>
                        {item.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
              </Stack>
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

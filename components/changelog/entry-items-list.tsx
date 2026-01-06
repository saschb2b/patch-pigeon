'use client'

import { Box, Typography, Stack, Chip, Paper } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import RemoveIcon from "@mui/icons-material/Remove"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import type { EntryItem, ChangeType } from "@/lib/types"
import type React from "react"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface EntryItemsListProps {
  items: EntryItem[]
  compact?: boolean
}

const typeOrder: ChangeType[] = ["FEATURE", "IMPROVEMENT", "FIX", "BREAKING", "REMOVED", "KNOWNISSUE", "NOTE"]

interface TypeConfig {
  label: string
  pluralLabel: string
  icon: React.ReactElement
  color: string
  bgColor: string
  dotColor: string
}

const typeConfig: Record<ChangeType, TypeConfig> = {
  FEATURE: {
    label: "New Feature",
    pluralLabel: "New Features",
    icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} />,
    color: "#0284c7",
    bgColor: `${colors.sky}25`,
    dotColor: colors.sky,
  },
  IMPROVEMENT: {
    label: "Improvement",
    pluralLabel: "Improvements",
    icon: <BoltIcon sx={{ fontSize: 18 }} />,
    color: "#c2410c",
    bgColor: `${colors.peach}25`,
    dotColor: colors.peach,
  },
  FIX: {
    label: "Bug Fix",
    pluralLabel: "Bug Fixes",
    icon: <BugReportIcon sx={{ fontSize: 18 }} />,
    color: "#15803d",
    bgColor: `${colors.mint}25`,
    dotColor: colors.mint,
  },
  KNOWNISSUE: {
    label: "Known Issue",
    pluralLabel: "Known Issues",
    icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} />,
    color: "#a16207",
    bgColor: `${colors.butter}25`,
    dotColor: colors.butter,
  },
  BREAKING: {
    label: "Breaking Change",
    pluralLabel: "Breaking Changes",
    icon: <WarningIcon sx={{ fontSize: 18 }} />,
    color: "#dc2626",
    bgColor: "#fee2e2",
    dotColor: "#fca5a5",
  },
  REMOVED: {
    label: "Removed",
    pluralLabel: "Removed",
    icon: <RemoveIcon sx={{ fontSize: 18 }} />,
    color: "#64748b",
    bgColor: "#f1f5f9",
    dotColor: "#94a3b8",
  },
  NOTE: {
    label: "Note",
    pluralLabel: "Notes",
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,
    color: "#64748b",
    bgColor: "#f1f5f9",
    dotColor: "#94a3b8",
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
      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        {typeOrder.map((type) => {
          const typeItems = groupedItems[type]
          if (!typeItems || typeItems.length === 0) return null
          const config = typeConfig[type]

          return (
            <Stack key={type} direction="row" spacing={0.75} alignItems="center">
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: 1.5,
                  bgcolor: config.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.color,
                }}
              >
                {config.icon}
              </Box>
              <Typography variant="caption" sx={{ color: config.color, fontWeight: 600 }}>
                {typeItems.length} {config.label.toLowerCase()}
                {typeItems.length > 1 ? "s" : ""}
              </Typography>
            </Stack>
          )
        })}
      </Stack>
    )
  }

  // Full view: grouped list with cards
  return (
    <Stack spacing={5}>
      {typeOrder.map((type) => {
        const typeItems = groupedItems[type]
        if (!typeItems || typeItems.length === 0) return null

        const config = typeConfig[type]

        return (
          <Box key={type}>
            {/* Section header */}
            <Stack 
              direction="row" 
              spacing={1.5} 
              alignItems="center" 
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: config.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.color,
                }}
              >
                {config.icon}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: 700, 
                    color: config.color,
                    lineHeight: 1.2,
                  }}
                >
                  {typeItems.length > 1 ? config.pluralLabel : config.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {typeItems.length} {typeItems.length === 1 ? 'item' : 'items'}
                </Typography>
              </Box>
            </Stack>

            {/* Items list */}
            <Stack spacing={2}>
              {typeItems
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      animation: 'fadeIn 0.3s ease-out',
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'backwards',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateX(-8px)' },
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    {/* Dot indicator */}
                    <Box
                      sx={{
                        mt: 1,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: config.dotColor,
                        flexShrink: 0,
                        boxShadow: `0 0 0 3px ${config.bgColor}`,
                      }}
                    />

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack 
                        direction="row" 
                        spacing={1.5} 
                        alignItems="flex-start" 
                        flexWrap="wrap"
                        sx={{ mb: item.description ? 0.75 : 0 }}
                      >
                        {item.area && (
                          <Chip
                            label={item.area}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              bgcolor: "#f1f5f9",
                              color: "text.secondary",
                              fontFamily: 'monospace',
                            }}
                          />
                        )}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: "text.primary",
                            fontWeight: 500,
                            lineHeight: 1.5,
                            flex: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>
                      {item.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            lineHeight: 1.6,
                            pl: item.area ? 0 : 0,
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}

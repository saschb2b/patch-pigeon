'use client'

import { Box, Typography, Stack, Chip } from "@mui/material"
import { CHANGE_TYPE_ORDER, changeTypeConfig } from "@/components/change-type-config"
import type { EntryItem, ChangeType } from "@/lib/types"

interface EntryItemsListProps {
  items: EntryItem[]
  compact?: boolean
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
        {CHANGE_TYPE_ORDER.map((type) => {
          const typeItems = groupedItems[type]
          if (!typeItems || typeItems.length === 0) return null
          const config = changeTypeConfig[type]
          const Icon = config.icon

          return (
            <Stack key={type} direction="row" spacing={0.75} alignItems="center">
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: 1.5,
                  bgcolor: config.backgroundColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.color,
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
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
      {CHANGE_TYPE_ORDER.map((type) => {
        const typeItems = groupedItems[type]
        if (!typeItems || typeItems.length === 0) return null

        const config = changeTypeConfig[type]
        const Icon = config.icon

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
                  bgcolor: config.backgroundColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.color,
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
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
                  {typeItems.length > 1 ? config.pluralSectionLabel : config.sectionLabel}
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
                        boxShadow: `0 0 0 3px ${config.backgroundColor}`,
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

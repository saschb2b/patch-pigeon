'use client'

import { Box, Typography, Stack } from "@mui/material"
import { EntryCard } from "./entry-card"
import type { EntryWithItems } from "@/lib/types"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface TimelineGroupProps {
  date: string
  entries: EntryWithItems[]
  ownerSlug: string
  productSlug: string
  isFirst?: boolean
}

export function TimelineGroup({ date, entries, ownerSlug, productSlug, isFirst }: TimelineGroupProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <Box 
      sx={{ 
        position: "relative",
        animation: 'fadeInUp 0.5s ease-out',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Timeline line with gradient */}
      <Box
        sx={{
          position: "absolute",
          left: 15,
          top: 40,
          bottom: 0,
          width: "2px",
          background: `linear-gradient(180deg, ${colors.sky} 0%, ${colors.mint}50 50%, transparent 100%)`,
          display: { xs: "none", md: "block" },
        }}
      />
      {/* Month header */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          mb: 3
        }}>
        {/* Timeline node */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 2,
            background: isFirst 
              ? `linear-gradient(135deg, ${colors.sky}, ${colors.mint})`
              : colors.sky,
            boxShadow: isFirst 
              ? `0 4px 12px -2px ${colors.sky}80`
              : `0 2px 8px -2px ${colors.sky}60`,
            flexShrink: 0,
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 16, color: colors.ink }} />
        </Box>

        <Box
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: 2,
            bgcolor: isFirst ? `${colors.sky}20` : '#f8fafc',
            border: 1,
            borderColor: isFirst ? `${colors.sky}40` : 'divider',
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              color: isFirst ? colors.ink : "text.secondary",
              letterSpacing: '-0.01em',
            }}
          >
            {formattedDate}
          </Typography>
        </Box>

        {entries.length > 1 && (
          <Typography variant="caption" sx={{
            color: "text.secondary"
          }}>
            {entries.length} releases
          </Typography>
        )}
      </Stack>
      {/* Entry cards */}
      <Stack spacing={2.5} sx={{ pl: { xs: 0, md: 6 } }}>
        {entries.map((entry, index) => (
          <Box
            key={entry.id}
            sx={{
              animation: 'fadeInUp 0.4s ease-out',
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'backwards',
            }}
          >
            <EntryCard 
              entry={entry} 
              ownerSlug={ownerSlug} 
              productSlug={productSlug}
              isHighlighted={isFirst && index === 0}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

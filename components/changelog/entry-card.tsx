import Link from "next/link"
import { Box, Typography, Stack, Paper, Chip } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import type { EntryWithItems, ChangeType } from "@/lib/types"

interface EntryCardProps {
  entry: EntryWithItems
  ownerSlug: string
  productSlug: string
}

export function EntryCard({ entry, ownerSlug, productSlug }: EntryCardProps) {
  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Count items by type
  const items = entry.entry_items || []
  const typeCounts = items.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    },
    {} as Record<ChangeType, number>,
  )

  // Get summary: either from summary field or first few item titles
  const summaryText =
    entry.summary ||
    items
      .slice(0, 3)
      .map((i) => i.title)
      .join(" • ")

  return (
    <Box component="article" sx={{ position: "relative" }}>
      <Link href={`/${ownerSlug}/${productSlug}/${entry.slug}`} style={{ textDecoration: "none" }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            p: 3,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "#cbd5e1",
              boxShadow: 2,
              "& .entry-title": {
                color: "primary.main",
              },
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {entry.version && (
              <Chip
                label={`v${entry.version}`}
                size="small"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                }}
              />
            )}
            {publishDate && (
              <Typography variant="caption" color="text.secondary">
                {publishDate}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="h6"
            className="entry-title"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              transition: "color 0.2s",
            }}
          >
            {entry.title}
          </Typography>

          {summaryText && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {summaryText}
            </Typography>
          )}

          {/* Change counts */}
          {items.length > 0 && (
            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              sx={{ pt: 1, borderTop: 1, borderColor: "divider" }}
            >
              {typeCounts.FEATURE > 0 && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AutoAwesomeIcon sx={{ fontSize: 14, color: "#0284c7" }} />
                  <Typography variant="caption" sx={{ color: "#0284c7" }}>
                    {typeCounts.FEATURE} feature{typeCounts.FEATURE > 1 ? "s" : ""}
                  </Typography>
                </Stack>
              )}
              {typeCounts.IMPROVEMENT > 0 && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <BoltIcon sx={{ fontSize: 14, color: "#c2410c" }} />
                  <Typography variant="caption" sx={{ color: "#c2410c" }}>
                    {typeCounts.IMPROVEMENT} improvement{typeCounts.IMPROVEMENT > 1 ? "s" : ""}
                  </Typography>
                </Stack>
              )}
              {typeCounts.FIX > 0 && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <BugReportIcon sx={{ fontSize: 14, color: "#15803d" }} />
                  <Typography variant="caption" sx={{ color: "#15803d" }}>
                    {typeCounts.FIX} fix{typeCounts.FIX > 1 ? "es" : ""}
                  </Typography>
                </Stack>
              )}
              {typeCounts.BREAKING > 0 && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <WarningIcon sx={{ fontSize: 14, color: "#dc2626" }} />
                  <Typography variant="caption" sx={{ color: "#dc2626" }}>
                    {typeCounts.BREAKING} breaking
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}
        </Paper>
      </Link>
    </Box>
  )
}

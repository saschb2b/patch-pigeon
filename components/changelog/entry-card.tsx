'use client'

import Link from "next/link"
import { Box, Typography, Stack, Paper, Chip } from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import type { EntryWithItems, ChangeType } from "@/lib/types"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface EntryCardProps {
  entry: EntryWithItems
  ownerSlug: string
  productSlug: string
  isHighlighted?: boolean
}

export function EntryCard({ entry, ownerSlug, productSlug, isHighlighted }: EntryCardProps) {
  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
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

  // Determine primary type for card accent
  const primaryType = typeCounts.FEATURE ? 'FEATURE' 
    : typeCounts.IMPROVEMENT ? 'IMPROVEMENT'
    : typeCounts.FIX ? 'FIX'
    : typeCounts.BREAKING ? 'BREAKING'
    : null

  const accentColors: Record<string, string> = {
    FEATURE: colors.sky,
    IMPROVEMENT: colors.peach,
    FIX: colors.mint,
    BREAKING: '#fca5a5',
  }

  const accentColor = primaryType ? accentColors[primaryType] : colors.sky
  const changeCountLabel = [
    typeCounts.FEATURE > 0
      ? `${typeCounts.FEATURE} feature${typeCounts.FEATURE === 1 ? "" : "s"}`
      : null,
    typeCounts.IMPROVEMENT > 0
      ? `${typeCounts.IMPROVEMENT} improvement${typeCounts.IMPROVEMENT === 1 ? "" : "s"}`
      : null,
    typeCounts.FIX > 0
      ? `${typeCounts.FIX} fix${typeCounts.FIX === 1 ? "" : "es"}`
      : null,
    typeCounts.BREAKING > 0
      ? `${typeCounts.BREAKING} breaking change${typeCounts.BREAKING === 1 ? "" : "s"}`
      : null,
  ]
    .filter((label) => label !== null)
    .join(", ")
  const entryLinkLabel = [
    `View ${entry.title}`,
    entry.version ? `version ${entry.version}` : null,
    publishDate,
    changeCountLabel || null,
  ]
    .filter((label) => label !== null)
    .join(". ")

  return (
    <Box component="article" sx={{ position: "relative" }}>
      <Link
        href={`/${ownerSlug}/${productSlug}/${entry.slug}`}
        aria-label={entryLinkLabel}
        style={{ textDecoration: "none" }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 3 },
            border: 1,
            borderColor: isHighlighted ? accentColor : "divider",
            bgcolor: "background.paper",
            position: 'relative',
            overflow: 'hidden',
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderColor: accentColor,
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 24px -8px ${accentColor}40`,
              "& .entry-title": {
                color: "primary.main",
              },
              "& .arrow-icon": {
                opacity: 1,
                transform: 'translateX(0)',
              },
            },
            // Accent line
            "&::before": {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: isHighlighted ? '100%' : { xs: 3, sm: 4 },
              height: isHighlighted ? { xs: 3, sm: 4 } : '100%',
              background: isHighlighted 
                ? `linear-gradient(90deg, ${accentColor}, ${colors.mint})`
                : accentColor,
              borderRadius: isHighlighted ? '12px 12px 0 0' : '12px 0 0 12px',
            },
          }}
        >
          {/* Header row */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              justifyContent: "space-between"
            }}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
                flexWrap: "wrap"
              }}>
              {entry.version && (
                <Chip
                  label={`v${entry.version}`}
                  size="small"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: `${accentColor}30`,
                    color: colors.ink,
                    border: 1,
                    borderColor: `${accentColor}50`,
                  }}
                />
              )}
              {publishDate && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500
                  }}>
                  {publishDate}
                </Typography>
              )}
              {isHighlighted && (
                <Chip
                  label="Latest"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    bgcolor: colors.ink,
                    color: 'white',
                  }}
                />
              )}
            </Stack>

            {/* Arrow indicator */}
            <ArrowForwardIcon 
              className="arrow-icon"
              sx={{ 
                fontSize: 18, 
                color: 'text.secondary',
                opacity: 0,
                transform: 'translateX(-8px)',
                transition: 'all 0.25s ease',
              }} 
            />
          </Stack>

          {/* Title */}
          <Typography
            variant="h6"
            className="entry-title"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              transition: "color 0.2s",
              lineHeight: 1.3,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {entry.title}
          </Typography>

          {/* Summary */}
          {summaryText && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.6
              }}>
              {summaryText}
            </Typography>
          )}

          {/* Change counts */}
          {items.length > 0 && (
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              useFlexGap
              sx={{
                flexWrap: "wrap",
                pt: { xs: 1.5, sm: 2 },
                borderTop: 1,
                borderColor: "divider"
              }}>
              {typeCounts.FEATURE > 0 && (
                <Stack direction="row" spacing={0.5} sx={{
                  alignItems: "center"
                }}>
                  <Box
                    sx={{
                      width: { xs: 20, sm: 24 },
                      height: { xs: 20, sm: 24 },
                      borderRadius: 1.5,
                      bgcolor: `${colors.sky}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: "#0284c7" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#0284c7", fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {typeCounts.FEATURE}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> feature{typeCounts.FEATURE > 1 ? "s" : ""}</Box>
                  </Typography>
                </Stack>
              )}
              {typeCounts.IMPROVEMENT > 0 && (
                <Stack direction="row" spacing={0.5} sx={{
                  alignItems: "center"
                }}>
                  <Box
                    sx={{
                      width: { xs: 20, sm: 24 },
                      height: { xs: 20, sm: 24 },
                      borderRadius: 1.5,
                      bgcolor: `${colors.peach}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BoltIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: "#c2410c" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#c2410c", fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {typeCounts.IMPROVEMENT}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> improvement{typeCounts.IMPROVEMENT > 1 ? "s" : ""}</Box>
                  </Typography>
                </Stack>
              )}
              {typeCounts.FIX > 0 && (
                <Stack direction="row" spacing={0.5} sx={{
                  alignItems: "center"
                }}>
                  <Box
                    sx={{
                      width: { xs: 20, sm: 24 },
                      height: { xs: 20, sm: 24 },
                      borderRadius: 1.5,
                      bgcolor: `${colors.mint}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BugReportIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: "#15803d" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#15803d", fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {typeCounts.FIX}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> fix{typeCounts.FIX > 1 ? "es" : ""}</Box>
                  </Typography>
                </Stack>
              )}
              {typeCounts.BREAKING > 0 && (
                <Stack direction="row" spacing={0.5} sx={{
                  alignItems: "center"
                }}>
                  <Box
                    sx={{
                      width: { xs: 20, sm: 24 },
                      height: { xs: 20, sm: 24 },
                      borderRadius: 1.5,
                      bgcolor: '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WarningIcon sx={{ fontSize: { xs: 12, sm: 14 }, color: "#dc2626" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#dc2626", fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {typeCounts.BREAKING}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> breaking</Box>
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}
        </Paper>
      </Link>
    </Box>
  );
}

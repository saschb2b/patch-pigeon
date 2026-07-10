import { notFound } from "next/navigation"
import Link from "@/components/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiLink from "@mui/material/Link"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import TagIcon from "@mui/icons-material/Tag"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { EntryCard } from "@/components/changelog/entry-card"
import { getDemoData } from "@/lib/demo-data"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface PageProps {
  params: Promise<{ productSlug: string; entrySlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { productSlug, entrySlug } = await params
  const { product, entries } = getDemoData()
  const entry = entries.find((e) => e.slug === entrySlug)

  if (productSlug !== product.slug || !entry) {
    return { title: "Not Found" }
  }

  return {
    title: `${entry.title} | ${product.name} Changelog`,
    description: entry.summary || `Changelog entry for ${product.name}`,
  }
}

export default async function DemoEntryDetailPage({ params }: PageProps) {
  const { productSlug, entrySlug } = await params
  const { profile, product, entries } = getDemoData()

  const entry = entries.find((e) => e.slug === entrySlug)

  if (productSlug !== product.slug || !entry) {
    notFound()
  }

  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Find related entries
  const relatedEntries = entries.filter((e) => e.id !== entry.id).slice(0, 3)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Demo banner */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #A7D8FF, #FFD4B8, #B8E8D2)",
          color: "#1e293b",
          py: 1.5,
          px: 2,
          textAlign: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
          <RocketLaunchIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{
            fontWeight: 500
          }}>
            This is a demo changelog. Want your own?
          </Typography>
          <MuiLink
            href="/auth/sign-up"
            sx={{
              color: "inherit",
              fontWeight: 700,
              textDecoration: "underline",
              "&:hover": { textDecoration: "none" },
            }}
          >
            Create your changelog →
          </MuiLink>
        </Stack>
      </Box>
      <ChangelogHeader product={product} profile={profile} isDemo />
      {/* Hero section for entry */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: 1,
          borderColor: 'divider',
          background: `
            radial-gradient(ellipse 60% 50% at 20% 120%, ${colors.sky}20, transparent),
            radial-gradient(ellipse 40% 40% at 80% 20%, ${colors.peach}15, transparent),
            linear-gradient(180deg, #f8fafc 0%, white 100%)
          `,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {/* Back link */}
            <MuiLink
              component={Link}
              href={`/demo/${productSlug}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                fontSize: "0.875rem",
                color: "text.secondary",
                textDecoration: "none",
                mb: 3,
                fontWeight: 500,
                "&:hover": { color: "text.primary" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              Back to changelog
            </MuiLink>

            {/* Entry header */}
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap"
                }}>
                {entry.version && (
                  <Chip
                    icon={<TagIcon sx={{ fontSize: 14 }} />}
                    label={`v${entry.version}`}
                    size="small"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      bgcolor: `${colors.sky}30`,
                      color: colors.ink,
                      border: 1,
                      borderColor: `${colors.sky}50`,
                      '& .MuiChip-icon': { color: colors.ink },
                    }}
                  />
                )}
                {publishDate && (
                  <Stack direction="row" spacing={0.5} sx={{
                    alignItems: "center"
                  }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500
                      }}>
                      {publishDate}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  textWrap: "balance",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                {entry.title}
              </Typography>

              {entry.summary && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: 600
                  }}>
                  {entry.summary}
                </Typography>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Box component="article">
            {/* Content */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <EntryItemsList items={entry.entry_items || []} />
            </Paper>
          </Box>

          {/* Related entries */}
          {relatedEntries.length > 0 && (
            <Box component="section" sx={{ mt: 10 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4
                }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                  More Updates
                </Typography>
                <MuiLink 
                  component={Link}
                  href={`/demo/${productSlug}`}
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': { color: 'text.primary' }
                  }}
                >
                  View all →
                </MuiLink>
              </Stack>
              <Stack spacing={2.5}>
                {relatedEntries.map((related) => (
                  <EntryCard
                    key={related.id}
                    entry={related}
                    ownerSlug="demo"
                    productSlug={productSlug}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: '#f8fafc',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <Typography variant="body2" sx={{
              color: "text.secondary"
            }}>
              Powered by{' '}
              <Box 
                component="a" 
                href="/" 
                sx={{ 
                  color: 'text.primary', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                PatchPigeon
              </Box>
            </Typography>
            <Chip
              component="a"
              href="/auth/sign-up"
              label="Create your own changelog"
              size="small"
              clickable
              sx={{ 
                fontWeight: 600,
                bgcolor: '#1f2937',
                color: 'white',
                '&:hover': { bgcolor: '#374151' }
              }}
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

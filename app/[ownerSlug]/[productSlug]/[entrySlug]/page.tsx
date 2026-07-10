import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Box, Container, Typography, Stack, Paper, Chip } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import TagIcon from "@mui/icons-material/Tag"
import { getPublicEntry } from "@/lib/data/public"
import { getSiteUrl } from "@/lib/site-url"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { EntryCard } from "@/components/changelog/entry-card"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld"

const siteUrl = getSiteUrl()

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface PageProps {
  params: Promise<{ ownerSlug: string; productSlug: string; entrySlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ownerSlug, productSlug, entrySlug } = await params
  const result = await getPublicEntry(ownerSlug, productSlug, entrySlug)

  if (!result) {
    return { title: "Not Found" }
  }
  const { profile, product, entry } = result

  const title = `${entry.title} - ${product.name} Changelog`
  const description = entry.summary || `${entry.title} - View the latest changes, features, and fixes for ${product.name}.`
  const url = `${siteUrl}/${ownerSlug}/${productSlug}/${entrySlug}`
  
  const publishDate = entry.publish_date ? new Date(entry.publish_date).toISOString() : undefined
  const itemCount = entry.entry_items?.length || 0

  return {
    title,
    description,
    keywords: [
      product.name,
      entry.title,
      "changelog",
      "release notes",
      entry.version ? `v${entry.version}` : null,
      "update",
    ].filter(Boolean) as string[],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "PatchPigeon",
      publishedTime: publishDate,
      modifiedTime: entry.updated_at,
      authors: [profile.display_name || profile.owner_slug],
      tags: ["changelog", "release notes", product.name],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:published_time": publishDate || "",
      "version": entry.version || "",
      "change-count": String(itemCount),
    },
  }
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { ownerSlug, productSlug, entrySlug } = await params
  const result = await getPublicEntry(ownerSlug, productSlug, entrySlug)

  if (!result) {
    notFound()
  }
  const { profile, product, entry, relatedEntries } = result

  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const items = entry.entry_items

  return (
    <>
      <ArticleJsonLd 
        entry={entry}
        product={product}
        profile={profile}
      />
      <BreadcrumbJsonLd 
        items={[
          { name: "Home", url: siteUrl },
          { name: profile.display_name || profile.owner_slug, url: `${siteUrl}/${ownerSlug}` },
          { name: product.name, url: `${siteUrl}/${ownerSlug}/${productSlug}` },
          { name: entry.title, url: `${siteUrl}/${ownerSlug}/${productSlug}/${entrySlug}` },
        ]} 
      />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <ChangelogHeader product={product} profile={profile} />

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
            <Link href={`/${ownerSlug}/${productSlug}`} style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                  transition: "color 0.2s",
                  mb: 3,
                  display: 'inline-flex'
                }}>
                <ArrowBackIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{
                  fontWeight: 500
                }}>Back to changelog</Typography>
              </Stack>
            </Link>

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
              {items.length > 0 ? (
                <EntryItemsList items={items} />
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography sx={{
                    color: "text.secondary"
                  }}>
                    No changes documented for this version.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Related entries */}
          {relatedEntries && relatedEntries.length > 0 && (
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
                <Link 
                  href={`/${ownerSlug}/${productSlug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      '&:hover': { color: 'text.primary' }
                    }}
                  >
                    View all →
                  </Typography>
                </Link>
              </Stack>
              <Stack spacing={2.5}>
                {relatedEntries.map((related) => (
                  <EntryCard
                    key={related.id}
                    entry={related}
                    ownerSlug={ownerSlug}
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
            <Stack direction="row" spacing={2}>
              <Chip
                component="a"
                href={`/api/${ownerSlug}/${productSlug}/changelog.rss`}
                target="_blank"
                label="RSS"
                size="small"
                clickable
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: '#fff7ed',
                  color: '#c2410c',
                  '&:hover': { bgcolor: '#ffedd5' }
                }}
              />
              <Chip
                component="a"
                href={`/api/${ownerSlug}/${productSlug}/changelog.json`}
                target="_blank"
                label="JSON"
                size="small"
                clickable
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: '#f0fdf4',
                  color: '#15803d',
                  '&:hover': { bgcolor: '#dcfce7' }
                }}
              />
            </Stack>
          </Stack>
        </Container>
        </Box>
      </Box>
    </>
  );
}

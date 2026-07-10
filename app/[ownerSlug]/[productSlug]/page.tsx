import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Box, Container, Typography, Stack, Paper, Chip } from "@mui/material"
import { getPublicProductWithEntries } from "@/lib/data/public"
import { getSiteUrl } from "@/lib/site-url"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import { ChangelogJsonLd, BreadcrumbJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/json-ld"
import type { EntryWithItems } from "@/lib/types"
import HistoryIcon from "@mui/icons-material/History"

const siteUrl = getSiteUrl()

interface PageProps {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ownerSlug, productSlug } = await params
  const result = await getPublicProductWithEntries(ownerSlug, productSlug)

  if (!result) {
    return { title: "Not Found" }
  }
  const { product, entries } = result

  const title = `${product.name} Changelog`
  const description = product.description || `Latest updates, features, and bug fixes for ${product.name}. Stay informed about all product changes.`
  const url = `${siteUrl}/${ownerSlug}/${productSlug}`

  return {
    title,
    description,
    keywords: [
      product.name,
      "changelog",
      "release notes",
      "updates",
      "features",
      "bug fixes",
      `${product.name} updates`,
    ],
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "PatchPigeon",
      images: product.logo_url ? [{ url: product.logo_url, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${siteUrl}/api/${ownerSlug}/${productSlug}/changelog.rss`,
        "application/json": `${siteUrl}/api/${ownerSlug}/${productSlug}/changelog.json`,
      },
    },
    other: {
      "release-count": String(entries.length),
    },
  }
}

export default async function ChangelogPage({ params }: PageProps) {
  const { ownerSlug, productSlug } = await params
  const result = await getPublicProductWithEntries(ownerSlug, productSlug)

  if (!result) {
    notFound()
  }
  const { profile, product, entries } = result
  const groupedEntries = groupEntriesByMonth(entries)
  const totalEntries = entries.length

  return (
    <>
      <SoftwareApplicationJsonLd product={product} profile={profile} />
      <ChangelogJsonLd 
        product={product}
        profile={profile}
        entries={entries}
      />
      <BreadcrumbJsonLd 
        items={[
          { name: "Home", url: siteUrl },
          { name: profile.display_name || profile.owner_slug, url: `${siteUrl}/${ownerSlug}` },
          { name: product.name, url: `${siteUrl}/${ownerSlug}/${productSlug}` },
        ]} 
      />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <ChangelogHeader 
          product={product}
          profile={profile}
          entryCount={totalEntries}
        />

      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {groupedEntries.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                py: 10,
                px: 4,
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 4,
                background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <HistoryIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  mb: 1
                }}>
                No changelog entries yet
              </Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Check back soon for updates!
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={8}>
              {groupedEntries.map((group, index) => (
                <TimelineGroup
                  key={group.date}
                  date={group.date}
                  entries={group.entries}
                  ownerSlug={ownerSlug}
                  productSlug={productSlug}
                  isFirst={index === 0}
                />
              ))}
            </Stack>
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

function groupEntriesByMonth(entries: EntryWithItems[]): { date: string; entries: EntryWithItems[] }[] {
  const groups: Record<string, EntryWithItems[]> = {}

  entries.forEach((entry) => {
    const date = entry.publish_date ? new Date(entry.publish_date) : new Date(entry.created_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(entry)
  })

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, entries]) => ({ date, entries }))
}

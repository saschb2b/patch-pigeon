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
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { getDemoData } from "@/lib/demo-data"

interface PageProps {
  params: Promise<{ productSlug: string; entrySlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { entrySlug } = await params
  const { product, entries } = getDemoData()
  const entry = entries.find((e) => e.slug === entrySlug)

  if (!entry) {
    return { title: "Not Found" }
  }

  return {
    title: `${entry.title} | ${product.name} Changelog | PatchPigeon`,
    description: entry.summary || `Changelog entry for ${product.name}`,
  }
}

export default async function DemoEntryDetailPage({ params }: PageProps) {
  const { productSlug, entrySlug } = await params
  const { profile, product, entries } = getDemoData()

  const entry = entries.find((e) => e.slug === entrySlug)

  if (!entry) {
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
          background: "linear-gradient(to right, #A7D8FF, #FFD4B8, #B8E8D2)",
          color: "#1e293b",
          py: 1,
          px: 2,
          textAlign: "center",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        This is a demo changelog. Want your own?{" "}
        <MuiLink
          href="/auth/sign-up"
          sx={{
            color: "inherit",
            fontWeight: 600,
            textDecoration: "underline",
            "&:hover": { textDecoration: "none" },
          }}
        >
          Sign up for free
        </MuiLink>
      </Box>

      <ChangelogHeader product={product} profile={profile} isDemo />

      <Box component="main">
        <Container maxWidth="md" sx={{ py: 6 }}>
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
              mb: 4,
              "&:hover": { color: "text.primary" },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1rem" }} />
            Back to changelog
          </MuiLink>

          <Box component="article">
            <Box component="header" sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", mb: 2, alignItems: "center" }}>
                {entry.version && (
                  <Chip
                    label={`v${entry.version}`}
                    size="small"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 500,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      opacity: 0.9,
                    }}
                  />
                )}
                {publishDate && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {publishDate}
                  </Typography>
                )}
              </Stack>

              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  mb: 2,
                  fontSize: { xs: "1.875rem", md: "2.25rem" },
                }}
              >
                {entry.title}
              </Typography>

              {entry.summary && (
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
                  {entry.summary}
                </Typography>
              )}
            </Box>

            {/* Entry items */}
            <Box sx={{ borderTop: 1, borderColor: "divider", pt: 4 }}>
              <EntryItemsList items={entry.entry_items || []} />
            </Box>
          </Box>

          {/* Related entries */}
          {relatedEntries.length > 0 && (
            <Box component="aside" sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}>
                Other Updates
              </Typography>
              <Stack spacing={2}>
                {relatedEntries.map((related) => (
                  <Paper
                    key={related.id}
                    component={Link}
                    href={`/demo/${productSlug}/${related.slug}`}
                    elevation={0}
                    sx={{
                      display: "block",
                      p: 2,
                      borderRadius: 2,
                      border: 1,
                      borderColor: "divider",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                      {related.version && (
                        <Chip
                          label={`v${related.version}`}
                          size="small"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            height: 20,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            opacity: 0.8,
                          }}
                        />
                      )}
                    </Stack>
                    <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
                      {related.title}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}

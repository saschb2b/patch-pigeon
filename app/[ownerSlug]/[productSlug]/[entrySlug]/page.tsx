import { notFound } from "next/navigation"
import Link from "next/link"
import { Box, Container, Typography, Stack, Paper, Chip } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { createClient } from "@/lib/supabase/server"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { EntryCard } from "@/components/changelog/entry-card"
import type { EntryWithItems, Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ ownerSlug: string; productSlug: string; entrySlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { ownerSlug, productSlug, entrySlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    return { title: "Not Found" }
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    return { title: "Not Found" }
  }

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("product_id", product.id)
    .eq("slug", entrySlug)
    .eq("published", true)
    .maybeSingle()

  if (!entry) {
    return { title: "Not Found" }
  }

  return {
    title: `${entry.title} - ${product.name} Changelog | PatchPigeon`,
    description: entry.summary || `${entry.title} changelog for ${product.name}`,
  }
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { ownerSlug, productSlug, entrySlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    notFound()
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", productSlug)
    .maybeSingle()

  if (!product) {
    notFound()
  }

  const { data: entry } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("product_id", product.id)
    .eq("slug", entrySlug)
    .eq("published", true)
    .maybeSingle()

  if (!entry) {
    notFound()
  }

  const { data: relatedEntries } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("product_id", product.id)
    .eq("published", true)
    .neq("id", entry.id)
    .order("publish_date", { ascending: false })
    .limit(3)

  const publishDate = entry.publish_date
    ? new Date(entry.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const entryWithItems = entry as EntryWithItems
  const items = entryWithItems.entry_items || []

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <ChangelogHeader product={product as Product} profile={profile as Profile} />

      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 768, mx: "auto" }}>
          <Link href={`/${ownerSlug}/${productSlug}`} style={{ textDecoration: "none" }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
                transition: "color 0.2s",
                mb: 4,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">Back to changelog</Typography>
            </Stack>
          </Link>

          <Box component="article">
            <Box component="header" sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                {entry.version && (
                  <Chip
                    label={`v${entry.version}`}
                    size="small"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 500,
                      bgcolor: "#f1f5f9",
                      color: "#475569",
                    }}
                  />
                )}
                {publishDate && (
                  <Typography variant="body2" color="text.secondary">
                    {publishDate}
                  </Typography>
                )}
              </Stack>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  textWrap: "balance",
                  mb: 2,
                  fontSize: { xs: "1.875rem", md: "2.25rem" },
                }}
              >
                {entry.title}
              </Typography>
              {entry.summary && (
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.125rem" }}>
                  {entry.summary}
                </Typography>
              )}
            </Box>

            <Box sx={{ borderTop: 1, borderColor: "divider", pt: 4 }}>
              {items.length > 0 ? (
                <EntryItemsList items={items} />
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  No changes documented for this version.
                </Typography>
              )}
            </Box>
          </Box>

          {relatedEntries && relatedEntries.length > 0 && (
            <Box component="section" sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: "divider" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}>
                More Updates
              </Typography>
              <Stack spacing={2}>
                {relatedEntries.map((related) => (
                  <EntryCard
                    key={related.id}
                    entry={related as EntryWithItems}
                    ownerSlug={ownerSlug}
                    productSlug={productSlug}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

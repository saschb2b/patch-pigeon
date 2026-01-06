import { notFound } from "next/navigation"
import { Box, Container, Typography, Stack, Paper } from "@mui/material"
import { createClient } from "@/lib/supabase/server"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import type { EntryWithItems, Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ ownerSlug: string; productSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { ownerSlug, productSlug } = await params
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

  return {
    title: `${product.name} Changelog | PatchPigeon`,
    description: product.description || `Latest updates and changes for ${product.name}`,
  }
}

export default async function ChangelogPage({ params }: PageProps) {
  const { ownerSlug, productSlug } = await params
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

  const { data: entries } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("product_id", product.id)
    .eq("published", true)
    .order("publish_date", { ascending: false })

  const groupedEntries = groupEntriesByMonth((entries as EntryWithItems[]) || [])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <ChangelogHeader product={product as Product} profile={profile as Profile} />

      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 768, mx: "auto" }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
              Changelog
            </Typography>
            <Typography color="text.secondary">
              All the latest updates, improvements, and fixes.
            </Typography>
          </Box>

          {groupedEntries.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                py: 8,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">No changelog entries yet.</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Check back soon for updates!
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={6} sx={{ pl: { xs: 0, md: 2 } }}>
              {groupedEntries.map((group) => (
                <TimelineGroup
                  key={group.date}
                  date={group.date}
                  entries={group.entries}
                  ownerSlug={ownerSlug}
                  productSlug={productSlug}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  )
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

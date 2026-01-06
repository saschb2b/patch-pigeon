import { notFound } from "next/navigation"
import { Box, Container, Typography, Stack, Paper, Chip } from "@mui/material"
import { createClient } from "@/lib/supabase/server"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import type { EntryWithItems, Product, Profile } from "@/lib/types"
import HistoryIcon from "@mui/icons-material/History"

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
  const totalEntries = entries?.length || 0

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <ChangelogHeader 
        product={product as Product} 
        profile={profile as Profile} 
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
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No changelog entries yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
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

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiLink from "@mui/material/Link"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import { getDemoData } from "@/lib/demo-data"

export const metadata = {
  title: "Demo Changelog | PatchPigeon",
  description: "See how your changelog could look with PatchPigeon",
}

function groupEntriesByMonth(
  entries: ReturnType<typeof getDemoData>["entries"],
) {
  const groups: Record<string, typeof entries> = {}

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

export default function DemoProductPage() {
  const { profile, product, entries } = getDemoData()
  const groupedEntries = groupEntriesByMonth(entries)

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
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
              Changelog
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              All the latest updates, improvements, and fixes.
            </Typography>
          </Box>

          <Stack spacing={6} sx={{ pl: { md: 2 } }}>
            {groupedEntries.map((group) => (
              <TimelineGroup
                key={group.date}
                date={group.date}
                entries={group.entries}
                ownerSlug="demo"
                productSlug="acme-app"
              />
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiLink from "@mui/material/Link"
import Chip from "@mui/material/Chip"
import { ChangelogHeader } from "@/components/changelog/changelog-header"
import { TimelineGroup } from "@/components/changelog/timeline-group"
import { getDemoData } from "@/lib/demo-data"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"

export const metadata = {
  title: "Demo Changelog",
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
      <ChangelogHeader 
        product={product} 
        profile={profile} 
        isDemo 
        entryCount={entries.length}
      />
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Stack spacing={8}>
            {groupedEntries.map((group, index) => (
              <TimelineGroup
                key={group.date}
                date={group.date}
                entries={group.entries}
                ownerSlug="demo"
                productSlug="acme-app"
                isFirst={index === 0}
              />
            ))}
          </Stack>
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

import { Box, Typography, Stack } from "@mui/material"
import { EntryCard } from "./entry-card"
import type { EntryWithItems } from "@/lib/types"

interface TimelineGroupProps {
  date: string
  entries: EntryWithItems[]
  ownerSlug: string
  productSlug: string
}

export function TimelineGroup({ date, entries, ownerSlug, productSlug }: TimelineGroupProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <Box sx={{ position: "relative" }}>
      {/* Timeline line */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          bgcolor: "#e2e8f0",
          display: { xs: "none", md: "block" },
        }}
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* Timeline dot */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            bgcolor: "#64748b",
            boxShadow: "0 0 0 4px white",
            ml: "-4px",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#64748b" }}>
          {formattedDate}
        </Typography>
      </Stack>

      <Stack spacing={2} sx={{ pl: { xs: 0, md: 4 } }}>
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} ownerSlug={ownerSlug} productSlug={productSlug} />
        ))}
      </Stack>
    </Box>
  )
}

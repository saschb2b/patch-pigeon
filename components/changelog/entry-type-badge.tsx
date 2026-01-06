import { Chip } from "@mui/material"
import type { EntryType } from "@/lib/types"

interface TypeConfigItem {
  label: string
  bgcolor: string
  color: string
  borderColor: string
}

const typeConfig: Record<EntryType, TypeConfigItem> = {
  feature: {
    label: "Feature",
    bgcolor: "#BFEBD6",
    color: "#1F2937",
    borderColor: "#BFEBD6",
  },
  improvement: {
    label: "Improvement",
    bgcolor: "#A7D8FF",
    color: "#1F2937",
    borderColor: "#A7D8FF",
  },
  fix: {
    label: "Fix",
    bgcolor: "#FFE7A3",
    color: "#1F2937",
    borderColor: "#FFE7A3",
  },
  breaking: {
    label: "Breaking",
    bgcolor: "#FFB8A1",
    color: "#1F2937",
    borderColor: "#FFB8A1",
  },
}

interface EntryTypeBadgeProps {
  type: EntryType
}

export function EntryTypeBadge({ type }: EntryTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <Chip
      label={config.label}
      size="small"
      variant="outlined"
      sx={{
        height: 24,
        fontSize: "0.75rem",
        fontWeight: 500,
        bgcolor: config.bgcolor,
        color: config.color,
        borderColor: config.borderColor,
      }}
    />
  )
}

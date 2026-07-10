import { Chip } from "@mui/material"
import { changeTypeConfig } from "@/components/change-type-config"
import type { ChangeType } from "@/lib/types"

interface ChangeTypeBadgeProps {
  type: ChangeType
  showIcon?: boolean
}

export function ChangeTypeBadge({ type, showIcon = true }: ChangeTypeBadgeProps) {
  const config = changeTypeConfig[type]
  const Icon = config.icon

  return (
    <Chip
      label={config.label}
      icon={showIcon ? <Icon sx={{ fontSize: 14 }} /> : undefined}
      size="small"
      variant="outlined"
      sx={{
        height: 24,
        fontSize: "0.75rem",
        fontWeight: 500,
        bgcolor: config.backgroundColor,
        color: config.color,
        borderColor: config.borderColor,
        "& .MuiChip-icon": {
          ml: 0.5,
          color: config.color,
        },
      }}
    />
  )
}

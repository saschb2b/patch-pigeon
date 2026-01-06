import type React from "react"
import { Chip } from "@mui/material"
import AutoAwesome from "@mui/icons-material/AutoAwesome"
import BugReport from "@mui/icons-material/BugReport"
import Bolt from "@mui/icons-material/Bolt"
import Warning from "@mui/icons-material/Warning"
import Remove from "@mui/icons-material/Remove"
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline"
import type { ChangeType } from "@/lib/types"

interface TypeConfigItem {
  label: string
  icon: React.ReactElement
  bgcolor: string
  color: string
  borderColor: string
}

const typeConfig: Record<ChangeType, TypeConfigItem> = {
  FEATURE: {
    label: "Feature",
    icon: <AutoAwesome sx={{ fontSize: 14 }} />,
    bgcolor: "rgba(167, 216, 255, 0.15)",
    color: "#0284c7",
    borderColor: "rgba(167, 216, 255, 0.3)",
  },
  IMPROVEMENT: {
    label: "Improvement",
    icon: <Bolt sx={{ fontSize: 14 }} />,
    bgcolor: "rgba(255, 184, 161, 0.15)",
    color: "#c2410c",
    borderColor: "rgba(255, 184, 161, 0.3)",
  },
  FIX: {
    label: "Fix",
    icon: <BugReport sx={{ fontSize: 14 }} />,
    bgcolor: "rgba(191, 235, 214, 0.15)",
    color: "#15803d",
    borderColor: "rgba(191, 235, 214, 0.3)",
  },
  KNOWNISSUE: {
    label: "Known Issue",
    icon: <Warning sx={{ fontSize: 14 }} />,
    bgcolor: "rgba(255, 231, 163, 0.15)",
    color: "#a16207",
    borderColor: "rgba(255, 231, 163, 0.3)",
  },
  BREAKING: {
    label: "Breaking",
    icon: <Warning sx={{ fontSize: 14 }} />,
    bgcolor: "rgba(239, 68, 68, 0.1)",
    color: "#dc2626",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  REMOVED: {
    label: "Removed",
    icon: <Remove sx={{ fontSize: 14 }} />,
    bgcolor: "#f5f5f5",
    color: "#757575",
    borderColor: "#e0e0e0",
  },
  NOTE: {
    label: "Note",
    icon: <ChatBubbleOutline sx={{ fontSize: 14 }} />,
    bgcolor: "#f5f5f5",
    color: "#757575",
    borderColor: "#e0e0e0",
  },
}

interface ChangeTypeBadgeProps {
  type: ChangeType
  showIcon?: boolean
}

export function ChangeTypeBadge({ type, showIcon = true }: ChangeTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <Chip
      label={config.label}
      icon={showIcon ? config.icon : undefined}
      size="small"
      variant="outlined"
      sx={{
        height: 24,
        fontSize: "0.75rem",
        fontWeight: 500,
        bgcolor: config.bgcolor,
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

export { typeConfig as changeTypeConfig }

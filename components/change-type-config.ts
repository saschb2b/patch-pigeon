import type { SvgIconComponent } from "@mui/icons-material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import RemoveIcon from "@mui/icons-material/Remove"
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined"
import type { ChangeType } from "@/lib/types"

interface ChangeTypeConfig {
  label: string
  countLabel: string
  pluralCountLabel: string
  sectionLabel: string
  pluralSectionLabel: string
  icon: SvgIconComponent
  color: string
  backgroundColor: string
  borderColor: string
  dotColor: string
}

export const CHANGE_TYPE_ORDER: ChangeType[] = [
  "FEATURE",
  "IMPROVEMENT",
  "FIX",
  "BREAKING",
  "REMOVED",
  "KNOWNISSUE",
  "NOTE",
]

export const changeTypeConfig = {
  FEATURE: {
    label: "Feature",
    countLabel: "feature",
    pluralCountLabel: "features",
    sectionLabel: "New Feature",
    pluralSectionLabel: "New Features",
    icon: AutoAwesomeIcon,
    color: "#0284c7",
    backgroundColor: "rgba(167, 216, 255, 0.15)",
    borderColor: "rgba(167, 216, 255, 0.3)",
    dotColor: "#a7d8ff",
  },
  IMPROVEMENT: {
    label: "Improvement",
    countLabel: "improvement",
    pluralCountLabel: "improvements",
    sectionLabel: "Improvement",
    pluralSectionLabel: "Improvements",
    icon: BoltIcon,
    color: "#c2410c",
    backgroundColor: "rgba(255, 184, 161, 0.15)",
    borderColor: "rgba(255, 184, 161, 0.3)",
    dotColor: "#ffb8a1",
  },
  FIX: {
    label: "Fix",
    countLabel: "fix",
    pluralCountLabel: "fixes",
    sectionLabel: "Bug Fix",
    pluralSectionLabel: "Bug Fixes",
    icon: BugReportIcon,
    color: "#15803d",
    backgroundColor: "rgba(191, 235, 214, 0.15)",
    borderColor: "rgba(191, 235, 214, 0.3)",
    dotColor: "#bfebd6",
  },
  KNOWNISSUE: {
    label: "Known Issue",
    countLabel: "known issue",
    pluralCountLabel: "known issues",
    sectionLabel: "Known Issue",
    pluralSectionLabel: "Known Issues",
    icon: WarningIcon,
    color: "#a16207",
    backgroundColor: "rgba(255, 231, 163, 0.15)",
    borderColor: "rgba(255, 231, 163, 0.3)",
    dotColor: "#ffe7a3",
  },
  BREAKING: {
    label: "Breaking",
    countLabel: "breaking change",
    pluralCountLabel: "breaking changes",
    sectionLabel: "Breaking Change",
    pluralSectionLabel: "Breaking Changes",
    icon: WarningIcon,
    color: "#dc2626",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.2)",
    dotColor: "#fca5a5",
  },
  REMOVED: {
    label: "Removed",
    countLabel: "removal",
    pluralCountLabel: "removals",
    sectionLabel: "Removed",
    pluralSectionLabel: "Removed",
    icon: RemoveIcon,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    borderColor: "#e0e0e0",
    dotColor: "#94a3b8",
  },
  NOTE: {
    label: "Note",
    countLabel: "note",
    pluralCountLabel: "notes",
    sectionLabel: "Note",
    pluralSectionLabel: "Notes",
    icon: ChatBubbleOutlinedIcon,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    borderColor: "#e0e0e0",
    dotColor: "#94a3b8",
  },
} satisfies Record<ChangeType, ChangeTypeConfig>

import { Box, type SxProps, type Theme } from "@mui/material"

interface PigeonLogoProps {
  sx?: SxProps<Theme>
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 64, height: 64 },
}

export function PigeonLogo({ sx, size = "md" }: PigeonLogoProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        ...sizes[size],
        ...sx,
      }}
    >
      {/* Body */}
      <ellipse cx="32" cy="38" rx="18" ry="16" fill="#A7D8FF" />
      {/* Wing */}
      <ellipse cx="24" cy="36" rx="10" ry="8" fill="#7EC8FF" />
      {/* Head */}
      <circle cx="42" cy="24" r="12" fill="#A7D8FF" />
      {/* Beak */}
      <path d="M52 24L60 26L52 28V24Z" fill="#FFB8A1" />
      {/* Eye */}
      <circle cx="46" cy="22" r="2.5" fill="#1F2937" />
      <circle cx="47" cy="21" r="1" fill="white" />
      {/* Envelope/Patch in beak */}
      <rect x="50" y="22" width="8" height="6" rx="1" fill="#FFE7A3" stroke="#1F2937" strokeWidth="0.5" />
      <path d="M50 22L54 25L58 22" stroke="#1F2937" strokeWidth="0.5" fill="none" />
      {/* Tail feathers */}
      <ellipse cx="14" cy="42" rx="6" ry="4" fill="#7EC8FF" />
      <ellipse cx="16" cy="46" rx="5" ry="3" fill="#A7D8FF" />
      {/* Feet */}
      <path d="M26 52L24 58M26 52L28 58M26 52L26 58" stroke="#FFB8A1" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 52L36 58M38 52L40 58M38 52L38 58" stroke="#FFB8A1" strokeWidth="2" strokeLinecap="round" />
    </Box>
  )
}

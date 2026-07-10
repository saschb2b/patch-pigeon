import Link from "next/link"
import { Box, Typography } from "@mui/material"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Button } from "@/components/ui/button"

interface NotFoundPageProps {
  heading: string
  description: string
  actionLabel?: string
}

export function NotFoundPage({
  heading,
  description,
  actionLabel = "Back to PatchPigeon",
}: NotFoundPageProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: 440 }}>
        <PigeonLogo size="lg" sx={{ mx: "auto", mb: 3, opacity: 0.5 }} />
        <Typography
          component="h1"
          variant="h3"
          sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          {heading}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          {description}
        </Typography>
        <Button asChild>
          <Link href="/">{actionLabel}</Link>
        </Button>
      </Box>
    </Box>
  )
}

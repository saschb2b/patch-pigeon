import Link from "next/link"
import { Box, Typography } from "@mui/material"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Button } from "@/components/ui/button"

export default function OwnerNotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center", px: 2 }}>
        <PigeonLogo size="lg" sx={{ mx: "auto", mb: 3, opacity: 0.5 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
          Profile Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
          This profile doesn&apos;t exist or hasn&apos;t been set up yet. Check the URL or head back home.
        </Typography>
        <Button asChild>
          <Link href="/">Back to PatchPigeon</Link>
        </Button>
      </Box>
    </Box>
  )
}

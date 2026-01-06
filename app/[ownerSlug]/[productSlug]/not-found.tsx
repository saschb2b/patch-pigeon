import Link from "next/link"
import { Box, Typography } from "@mui/material"
import { Button } from "@/components/ui/button"
import { PigeonLogo } from "@/components/brand/pigeon-logo"

export default function NotFound() {
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
      <Box sx={{ textAlign: "center" }}>
        <PigeonLogo size="lg" sx={{ mx: "auto", mb: 3, opacity: 0.5 }} />
        <Typography variant="h2" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          This changelog could not be found.
        </Typography>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </Box>
    </Box>
  )
}

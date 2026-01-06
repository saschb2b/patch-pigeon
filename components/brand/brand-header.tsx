"use client"

import Link from "next/link"
import { AppBar, Toolbar, Container, Box, Typography, Stack } from "@mui/material"
import { PigeonLogo } from "./pigeon-logo"
import { Button } from "@/components/ui/button"

interface BrandHeaderProps {
  showAuth?: boolean
}

export function BrandHeader({ showAuth = true }: BrandHeaderProps) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  "&:hover svg": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <PigeonLogo size="sm" sx={{ transition: "transform 0.2s" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                  PatchPigeon
                </Typography>
              </Box>
            </Link>
            {showAuth && (
              <Stack direction="row" spacing={1.5}>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Get started free</Link>
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

"use client"

import Link from "next/link"
import { AppBar, Toolbar, Container, Box, Typography, Stack } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import { Button } from "@/components/ui/button"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { signOutAction } from "@/app/auth/actions"

interface AdminHeaderProps {
  user: { email: string }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover svg": { transform: "scale(1.05)" },
                }}
              >
                <PigeonLogo size="sm" sx={{ transition: "transform 0.2s" }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  PatchPigeon
                </Typography>
              </Box>
            </Link>
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{
              alignItems: "center"
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  display: { xs: "none", sm: "block" },
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                {user.email}
              </Typography>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogoutIcon sx={{ fontSize: 18, mr: { xs: 0, sm: 1 } }} />
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Sign Out
                  </Box>
                </Button>
              </form>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { AppBar, Toolbar, Container, Box, Typography, Stack } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { PigeonLogo } from "@/components/brand/pigeon-logo"

interface AdminHeaderProps {
  user: User
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

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
                  "&:hover svg": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <PigeonLogo size="sm" sx={{ transition: "transform 0.2s" }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: "text.primary",
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  PatchPigeon
                </Typography>
              </Box>
            </Link>
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </Typography>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogoutIcon sx={{ fontSize: 18, mr: { xs: 0, sm: 1 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Sign Out
                </Box>
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { Box, Container, Typography, Paper, Stack, Alert, InputAdornment } from "@mui/material"
import MailOutlinedIcon from "@mui/icons-material/MailOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import { loginAction, type ActionState } from "../actions"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(loginAction, {})

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "50%",
          background: "linear-gradient(135deg, rgba(167, 216, 255, 0.3) 0%, rgba(255, 184, 161, 0.2) 50%, rgba(191, 235, 214, 0.3) 100%)",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: 80, left: 80, width: 128, height: 128, borderRadius: "50%", bgcolor: "rgba(167, 216, 255, 0.4)", filter: "blur(32px)" }} />
        <Box sx={{ position: "absolute", bottom: 128, right: 80, width: 160, height: 160, borderRadius: "50%", bgcolor: "rgba(255, 184, 161, 0.4)", filter: "blur(32px)" }} />
        <Box sx={{ position: "absolute", top: "50%", left: "33%", width: 96, height: 96, borderRadius: "50%", bgcolor: "rgba(191, 235, 214, 0.4)", filter: "blur(32px)" }} />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 400, textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <PigeonLogo size="lg" sx={{ width: 128, height: 128 }} />
              <Box sx={{ position: "absolute", top: -8, right: -8 }}>
                <AutoAwesomeIcon sx={{ fontSize: 24, color: "#FFE7A3" }} />
              </Box>
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
            Your updates deserve to be seen
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.125rem",
              lineHeight: 1.7
            }}>
            Join hundreds of indie devs who keep their users in the loop with beautiful, hassle-free changelogs.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              border: 1,
              borderColor: "divider",
              textAlign: "left",
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: "italic", mb: 2, color: "text.primary" }}>
              {"“Coo coo! This tool is the bread crumbs I've been searching for. No more scattered updates across the park!”"}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{
              alignItems: "center"
            }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#a7d8ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PigeonLogo size="sm" />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>Colonel Feathers</Typography>
                <Typography variant="caption" sx={{
                  color: "text.secondary"
                }}>Chief Nesting Officer</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "center", mb: 4 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" spacing={1.5} sx={{
                alignItems: "center"
              }}>
                <PigeonLogo size="md" />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>PatchPigeon</Typography>
              </Stack>
            </Link>
          </Box>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>Welcome back!</Typography>
            <Typography sx={{
              color: "text.secondary"
            }}>Your changelogs missed you. Let&apos;s get you signed in.</Typography>
          </Box>

          <Box component="form" action={formAction}>
            <Stack spacing={2.5}>
              <Box>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlinedIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <Link href="/auth/forgot-password" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "#ffb8a1" } }}>
                      Forgot your password?
                    </Typography>
                  </Link>
                </Box>
              </Box>

              {state.error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {state.error}
                </Alert>
              )}

              <Button type="submit" disabled={isPending} sx={{ height: 48 }}>
                {isPending ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                  </>
                )}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{
              color: "text.secondary"
            }}>
              {"New to PatchPigeon? "}
              <Link href="/auth/sign-up" style={{ textDecoration: "none" }}>
                <Typography component="span" sx={{ fontWeight: 600, color: "text.primary", "&:hover": { color: "#a7d8ff" } }}>
                  Create an account
                </Typography>
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
                Back to home
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { Box, Container, Typography, Stack, Alert, InputAdornment } from "@mui/material"
import MailOutlinedIcon from "@mui/icons-material/MailOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CheckIcon from "@mui/icons-material/Check"
import { signUpAction, type ActionState } from "../actions"

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(signUpAction, {})

  const benefits = [
    "Unlimited changelog entries",
    "Beautiful public pages",
    "RSS & JSON API included",
    "Open source & community funded",
  ]

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
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
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>Start your journey</Typography>
            <Typography sx={{
              color: "text.secondary"
            }}>Create your account and ship your first changelog in minutes.</Typography>
          </Box>

          <Box component="form" action={formAction}>
            <Stack spacing={2.5}>
              <Box>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
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
                  placeholder="Create a password (min 6 chars)"
                  required
                  slotProps={{
                    htmlInput: { minLength: 8 },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box>
                <Label htmlFor="repeatPassword">Confirm Password</Label>
                <Input
                  id="repeatPassword"
                  name="repeatPassword"
                  type="password"
                  placeholder="Confirm your password"
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
              </Box>

              {state.error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>{state.error}</Alert>
              )}

              <Button type="submit" disabled={isPending} sx={{ height: 48 }}>
                {isPending ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                  </>
                )}
              </Button>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              textAlign: "center",
              mt: 2
            }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Typography>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{
              color: "text.secondary"
            }}>
              {"Already have an account? "}
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <Typography component="span" sx={{ fontWeight: 600, color: "text.primary", "&:hover": { color: "#a7d8ff" } }}>
                  Sign in
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
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "50%",
          background: "linear-gradient(225deg, rgba(191, 235, 214, 0.3) 0%, rgba(255, 231, 163, 0.2) 50%, rgba(167, 216, 255, 0.3) 100%)",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: 128, right: 80, width: 128, height: 128, borderRadius: "50%", bgcolor: "rgba(191, 235, 214, 0.4)", filter: "blur(32px)" }} />
        <Box sx={{ position: "absolute", bottom: 80, left: 80, width: 160, height: 160, borderRadius: "50%", bgcolor: "rgba(255, 231, 163, 0.4)", filter: "blur(32px)" }} />
        <Box sx={{ position: "absolute", top: "33%", right: "33%", width: 96, height: 96, borderRadius: "50%", bgcolor: "rgba(167, 216, 255, 0.4)", filter: "blur(32px)" }} />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 400 }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              mb: 4
            }}>
            <PigeonLogo size="lg" />
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>PatchPigeon</Typography>
          </Stack>

          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 3 }}>
            Everything you need to keep users in the loop
          </Typography>

          <Stack spacing={2}>
            {benefits.map((benefit, index) => (
              <Stack key={index} direction="row" spacing={1.5} sx={{
                alignItems: "center"
              }}>
                <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "#bfebd6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckIcon sx={{ fontSize: 16, color: "text.primary" }} />
                </Box>
                <Typography sx={{ fontWeight: 500, color: "text.primary" }}>{benefit}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

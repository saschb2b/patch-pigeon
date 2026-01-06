"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Box, Container, Typography, Stack, Paper, Alert, InputAdornment } from "@mui/material"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CheckIcon from "@mui/icons-material/Check"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin`,
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    "Unlimited changelog entries",
    "Beautiful public pages",
    "RSS & JSON API included",
    "Free forever for indie devs",
  ]

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Left side - Form */}
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
          {/* Mobile logo */}
          <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "center", mb: 4 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PigeonLogo size="md" />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                  PatchPigeon
                </Typography>
              </Stack>
            </Link>
          </Box>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
              Start your journey
            </Typography>
            <Typography color="text.secondary">
              Create your account and ship your first changelog in minutes.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSignUp}>
            <Stack spacing={2.5}>
              <Box>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Label htmlFor="repeat-password">Confirm Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button type="submit" disabled={isLoading} sx={{ height: 48 }}>
                {isLoading ? (
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

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Typography>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              {"Already have an account? "}
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, color: "text.primary", "&:hover": { color: "#a7d8ff" } }}
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>

          {/* Back to home */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
                Back to home
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Right side - Decorative */}
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
        {/* Floating shapes */}
        <Box
          sx={{
            position: "absolute",
            top: 128,
            right: 80,
            width: 128,
            height: 128,
            borderRadius: "50%",
            bgcolor: "rgba(191, 235, 214, 0.4)",
            filter: "blur(32px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: 80,
            width: 160,
            height: 160,
            borderRadius: "50%",
            bgcolor: "rgba(255, 231, 163, 0.4)",
            filter: "blur(32px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "33%",
            right: "33%",
            width: 96,
            height: 96,
            borderRadius: "50%",
            bgcolor: "rgba(167, 216, 255, 0.4)",
            filter: "blur(32px)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 400 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
            <PigeonLogo size="lg" />
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
              PatchPigeon
            </Typography>
          </Stack>

          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 3 }}>
            Everything you need to keep users in the loop
          </Typography>

          <Stack spacing={2}>
            {benefits.map((benefit, index) => (
              <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "#bfebd6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 16, color: "text.primary" }} />
                </Box>
                <Typography sx={{ fontWeight: 500, color: "text.primary" }}>{benefit}</Typography>
              </Stack>
            ))}
          </Stack>

          {/* Stats */}
          <Box
            sx={{
              mt: 5,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {[
              { value: "500+", label: "Developers" },
              { value: "10k+", label: "Changelogs" },
              { value: "Free", label: "Forever" },
            ].map((stat, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

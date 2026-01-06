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
import { Box, Container, Typography, Paper, Stack, Alert, InputAdornment } from "@mui/material"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/admin")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Left side - Decorative */}
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
        {/* Floating shapes */}
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 80,
            width: 128,
            height: 128,
            borderRadius: "50%",
            bgcolor: "rgba(167, 216, 255, 0.4)",
            filter: "blur(32px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 128,
            right: 80,
            width: 160,
            height: 160,
            borderRadius: "50%",
            bgcolor: "rgba(255, 184, 161, 0.4)",
            filter: "blur(32px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "33%",
            width: 96,
            height: 96,
            borderRadius: "50%",
            bgcolor: "rgba(191, 235, 214, 0.4)",
            filter: "blur(32px)",
          }}
        />

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
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.125rem", lineHeight: 1.7 }}>
            Join hundreds of indie devs who keep their users in the loop with beautiful, hassle-free changelogs.
          </Typography>

          {/* Testimonial card */}
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
              "Coo coo! This tool is the bread crumbs I've been searching for. No more scattered updates across the park!"
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#a7d8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                🐦
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                  Colonel Feathers
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Chief Nesting Officer
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Right side - Form */}
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
              Welcome back!
            </Typography>
            <Typography color="text.secondary">
              Your changelogs missed you. Let's get you signed in.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin}>
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
                  placeholder="Enter your password"
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
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <Link href="/auth/forgot-password" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "#ffb8a1" } }}>
                      Forgot your password?
                    </Typography>
                  </Link>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button type="submit" disabled={isLoading} sx={{ height: 48 }}>
                {isLoading ? (
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
            <Typography color="text.secondary">
              {"New to PatchPigeon? "}
              <Link href="/auth/sign-up" style={{ textDecoration: "none" }}>
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, color: "text.primary", "&:hover": { color: "#a7d8ff" } }}
                >
                  Create an account
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
    </Box>
  )
}

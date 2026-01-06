"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Box, Typography, Stack, Paper, Alert, InputAdornment } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ShieldIcon from "@mui/icons-material/Shield"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        // No valid session, redirect to forgot password
        router.push("/auth/forgot-password")
      }
    }
    checkSession()
  }, [router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })
      if (error) throw error
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        background: "linear-gradient(135deg, rgba(191, 235, 214, 0.1) 0%, rgba(255, 255, 255, 1) 50%, rgba(167, 216, 255, 0.1) 100%)",
      }}
    >
      {/* Floating shapes */}
      <Box
        sx={{
          position: "fixed",
          top: 80,
          right: 80,
          width: 256,
          height: 256,
          borderRadius: "50%",
          bgcolor: "rgba(191, 235, 214, 0.2)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          left: 80,
          width: 256,
          height: 256,
          borderRadius: "50%",
          bgcolor: "rgba(167, 216, 255, 0.2)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ width: "100%", maxWidth: 448, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PigeonLogo size="lg" />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                PatchPigeon
              </Typography>
            </Stack>
          </Link>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            border: 1,
            borderColor: "divider",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isSuccess ? (
            // Success state
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "rgba(191, 235, 214, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 32, color: "#bfebd6" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                Password updated!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Your password has been successfully reset. You can now sign in with your new password.
              </Typography>
              <Button asChild sx={{ height: 48 }}>
                <Link href="/auth/login">
                  Sign in now
                  <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                </Link>
              </Button>
            </Box>
          ) : (
            // Form state
            <>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "rgba(167, 216, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <ShieldIcon sx={{ fontSize: 32, color: "#a7d8ff" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                  Create new password
                </Typography>
                <Typography color="text.secondary">
                  Choose a strong password to keep your account secure.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleResetPassword}>
                <Stack spacing={2.5}>
                  <Box>
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
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
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      "Updating..."
                    ) : (
                      <>
                        Update Password
                        <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                      </>
                    )}
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

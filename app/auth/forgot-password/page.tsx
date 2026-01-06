"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { useState } from "react"
import { Box, Typography, Stack, Paper, Alert, InputAdornment } from "@mui/material"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SendIcon from "@mui/icons-material/Send"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/reset-password`,
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
        background: "linear-gradient(135deg, rgba(167, 216, 255, 0.1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 184, 161, 0.1) 100%)",
      }}
    >
      {/* Floating shapes */}
      <Box
        sx={{
          position: "fixed",
          top: 80,
          left: 80,
          width: 256,
          height: 256,
          borderRadius: "50%",
          bgcolor: "rgba(167, 216, 255, 0.2)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          right: 80,
          width: 256,
          height: 256,
          borderRadius: "50%",
          bgcolor: "rgba(255, 184, 161, 0.2)",
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
                Check your inbox!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                We've sent a password reset link to{" "}
                <Typography component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
                  {email}
                </Typography>
                . Click the link to create a new password.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Didn't receive the email? Check your spam folder or try again.
              </Typography>
              <Stack spacing={1.5}>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                  Try another email
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">
                    <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} />
                    Back to sign in
                  </Link>
                </Button>
              </Stack>
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
                    bgcolor: "rgba(255, 231, 163, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <MailOutlineIcon sx={{ fontSize: 32, color: "#ffe7a3" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                  Forgot your password?
                </Typography>
                <Typography color="text.secondary">
                  No worries! Enter your email and we'll send you a reset link. Our pigeon is fast!
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleResetPassword}>
                <Stack spacing={2.5}>
                  <Box>
                    <Label htmlFor="email">Email address</Label>
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

                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button type="submit" disabled={isLoading} sx={{ height: 48 }}>
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Reset Link
                        <SendIcon sx={{ ml: 1, fontSize: 18 }} />
                      </>
                    )}
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Link href="/auth/login" style={{ textDecoration: "none" }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">Back to sign in</Typography>
                  </Stack>
                </Link>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

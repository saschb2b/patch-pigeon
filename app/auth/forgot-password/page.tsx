"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { Box, Typography, Stack, Paper, Alert, InputAdornment } from "@mui/material"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SendIcon from "@mui/icons-material/Send"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { forgotPasswordAction, type ActionState } from "../actions"

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    forgotPasswordAction,
    {},
  )

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
      <Box sx={{ width: "100%", maxWidth: 448, position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PigeonLogo size="lg" />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>PatchPigeon</Typography>
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
          }}
        >
          {state.success ? (
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "rgba(191, 235, 214, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 32, color: "#22c55e" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>Check your inbox!</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {state.success}
              </Typography>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} />
                  Back to sign in
                </Link>
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "rgba(255, 231, 163, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                  <MailOutlineIcon sx={{ fontSize: 32, color: "#ffe7a3" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>Forgot your password?</Typography>
                <Typography color="text.secondary">No worries! Enter your email and we&apos;ll send you a reset link.</Typography>
              </Box>

              <Box component="form" action={formAction}>
                <Stack spacing={2.5}>
                  <Box>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {state.error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{state.error}</Alert>
                  )}

                  <Button type="submit" disabled={isPending} sx={{ height: 48 }}>
                    {isPending ? (
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
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
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

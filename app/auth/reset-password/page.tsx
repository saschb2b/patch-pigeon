"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { Box, Typography, Stack, Paper, Alert, InputAdornment } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ShieldIcon from "@mui/icons-material/Shield"
import { resetPasswordAction, type ActionState } from "../actions"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    {},
  )

  return (
    <Box sx={{ width: "100%", maxWidth: 448 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Stack direction="row" spacing={1.5} sx={{
            alignItems: "center"
          }}>
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
            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>Password updated!</Typography>
            <Typography
              sx={{
                color: "text.secondary",
                mb: 3
              }}>{state.success}</Typography>
            <Button asChild sx={{ height: 48 }}>
              <Link href="/auth/login">
                Sign in now
                <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
              </Link>
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "rgba(167, 216, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                <ShieldIcon sx={{ fontSize: 32, color: "#a7d8ff" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>Create new password</Typography>
              <Typography sx={{
                color: "text.secondary"
              }}>Choose a strong password to keep your account secure.</Typography>
            </Box>

            <Box component="form" action={formAction}>
              <input type="hidden" name="token" value={token} />
              <Stack spacing={2.5}>
                <Box>
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
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
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
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

                {state.error && <Alert severity="error" sx={{ borderRadius: 2 }}>{state.error}</Alert>}

                <Button type="submit" disabled={isPending || !token} sx={{ height: 48 }}>
                  {isPending ? "Updating..." : (
                    <>
                      Update Password
                      <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                    </>
                  )}
                </Button>

                {!token && (
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    Missing reset token. Please request a new password reset link.
                  </Alert>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </Box>
  )
}

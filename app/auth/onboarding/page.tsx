"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Alert, CircularProgress, InputAdornment } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { generateSlug } from "@/lib/utils/slug"
import { onboardingAction, checkSlugAvailability, type ActionState } from "../actions"

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState("")
  const [ownerSlug, setOwnerSlug] = useState("")
  const [availability, setAvailability] = useState<{
    slug: string
    isAvailable: boolean
  } | null>(null)
  const [isChecking, startCheck] = useTransition()
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(onboardingAction, {})

  useEffect(() => {
    if (!ownerSlug) return
    const handle = setTimeout(() => {
      startCheck(async () => {
        const { available } = await checkSlugAvailability(ownerSlug)
        setAvailability({ slug: ownerSlug, isAvailable: available })
      })
    }, 250)
    return () => clearTimeout(handle)
  }, [ownerSlug])

  const isAvailable = availability?.slug === ownerSlug
    ? availability.isAvailable
    : null

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 448 }}>
        <CardHeader sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <PigeonLogo size="lg" />
          </Box>
          <CardTitle>Welcome to PatchPigeon</CardTitle>
          <CardDescription>
            Choose your unique handle. This will be your namespace for all changelogs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Box component="form" action={formAction}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {state.error && (
                <Alert severity="error" icon={<ErrorIcon />}>
                  {state.error}
                </Alert>
              )}

              <Box>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="Acme Inc. or John Doe"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value)
                    setOwnerSlug(generateSlug(e.target.value))
                  }}
                />
                <Box component="p" sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>
                  Your company or personal name (optional)
                </Box>
              </Box>

              <Box>
                <Label htmlFor="ownerSlug">Your Handle</Label>
                <Input
                  id="ownerSlug"
                  name="ownerSlug"
                  placeholder="acme"
                  value={ownerSlug}
                  onChange={(e) => setOwnerSlug(generateSlug(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>/</Box>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {isChecking && <CircularProgress size={16} />}
                        {!isChecking && isAvailable === true && (
                          <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} />
                        )}
                        {!isChecking && isAvailable === false && (
                          <ErrorIcon sx={{ fontSize: 18, color: "error.main" }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <Box component="p" sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>
                  {isAvailable === false
                    ? "This handle is not available"
                    : "This is your unique URL namespace for all products"}
                </Box>
              </Box>

              <Box sx={{ borderRadius: 2, bgcolor: "grey.100", p: 2 }}>
                <Box component="p" sx={{ fontSize: "0.875rem", fontWeight: 500, mb: 0.5 }}>
                  Your changelog URLs will look like:
                </Box>
                <Box component="p" sx={{ fontSize: "0.875rem", fontFamily: "monospace", color: "primary.main" }}>
                  /{ownerSlug || "your-handle"}/your-product
                </Box>
              </Box>

              <Button type="submit" disabled={isPending || !isAvailable}>
                {isPending ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Creating profile...
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

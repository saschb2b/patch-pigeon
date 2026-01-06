"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Alert, CircularProgress, InputAdornment } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { generateSlug } from "@/lib/utils/slug"

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [displayName, setDisplayName] = useState("")
  const [ownerSlug, setOwnerSlug] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value)
    const slug = generateSlug(value)
    setOwnerSlug(slug)
    if (slug) {
      checkAvailability(slug)
    } else {
      setIsAvailable(null)
    }
  }

  const handleSlugChange = (value: string) => {
    const slug = generateSlug(value)
    setOwnerSlug(slug)
    if (slug) {
      checkAvailability(slug)
    } else {
      setIsAvailable(null)
    }
  }

  const checkAvailability = async (slug: string) => {
    setIsChecking(true)
    setIsAvailable(null)

    // Reserved slugs that shouldn't be used
    const reserved = [
      "admin",
      "auth",
      "api",
      "settings",
      "profile",
      "onboarding",
      "help",
      "support",
      "about",
      "pricing",
      "blog",
      "docs",
    ]
    if (reserved.includes(slug)) {
      setIsAvailable(false)
      setIsChecking(false)
      return
    }

    const { data } = await supabase.from("profiles").select("id").eq("owner_slug", slug).maybeSingle()

    setIsAvailable(!data)
    setIsChecking(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!ownerSlug || !isAvailable) {
      setError("Please choose an available handle")
      return
    }

    setIsSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      owner_slug: ownerSlug,
      display_name: displayName || null,
    })

    if (insertError) {
      if (insertError.code === "23505") {
        setError("This handle is already taken. Please choose another.")
        setIsAvailable(false)
      } else {
        setError(insertError.message)
      }
      setIsSubmitting(false)
      return
    }

    router.push("/admin")
  }

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
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {error && (
                <Alert severity="error" icon={<ErrorIcon />}>
                  {error}
                </Alert>
              )}

              <Box>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Acme Inc. or John Doe"
                  value={displayName}
                  onChange={(e) => handleDisplayNameChange(e.target.value)}
                />
                <Box component="p" sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>
                  Your company or personal name (optional)
                </Box>
              </Box>

              <Box>
                <Label htmlFor="ownerSlug">Your Handle</Label>
                <Input
                  id="ownerSlug"
                  placeholder="acme"
                  value={ownerSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                        patchpigeon.com/
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

              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: "grey.100",
                  p: 2,
                }}
              >
                <Box component="p" sx={{ fontSize: "0.875rem", fontWeight: 500, mb: 0.5 }}>
                  Your changelog URLs will look like:
                </Box>
                <Box
                  component="p"
                  sx={{ fontSize: "0.875rem", fontFamily: "monospace", color: "primary.main" }}
                >
                  patchpigeon.com/{ownerSlug || "your-handle"}/your-product
                </Box>
              </Box>

              <Button type="submit" disabled={isSubmitting || !isAvailable}>
                {isSubmitting ? (
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

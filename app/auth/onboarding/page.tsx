"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { generateSlug } from "@/lib/utils/slug"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PigeonLogo className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl">Welcome to PatchPigeon</CardTitle>
          <CardDescription>Choose your unique handle. This will be your namespace for all changelogs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Acme Inc. or John Doe"
                value={displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Your company or personal name (optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerSlug">Your Handle</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  patchpigeon.com/
                </div>
                <Input
                  id="ownerSlug"
                  className="pl-[140px] pr-10"
                  placeholder="acme"
                  value={ownerSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {isChecking && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  {!isChecking && isAvailable === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {!isChecking && isAvailable === false && <AlertCircle className="w-4 h-4 text-destructive" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAvailable === false
                  ? "This handle is not available"
                  : "This is your unique URL namespace for all products"}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-1">
              <p className="text-sm font-medium">Your changelog URLs will look like:</p>
              <p className="text-sm font-mono text-primary">
                patchpigeon.com/{ownerSlug || "your-handle"}/your-product
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !isAvailable}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating profile...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

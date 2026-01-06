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
import { Mail, Lock, ArrowRight, Check } from "lucide-react"

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
    <div className="flex min-h-screen w-full">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3">
              <PigeonLogo size="md" />
              <span className="text-2xl font-bold text-foreground">PatchPigeon</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Start your journey</h1>
            <p className="text-muted-foreground">Create your account and ship your first changelog in minutes.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border focus:border-[var(--sky)] focus:ring-[var(--sky)]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border focus:border-[var(--sky)] focus:ring-[var(--sky)]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeat-password" className="text-foreground font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border focus:border-[var(--sky)] focus:ring-[var(--sky)]/20"
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold text-base gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {"Already have an account? "}
              <Link
                href="/auth/login"
                className="text-foreground font-semibold hover:text-[var(--sky)] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-[var(--mint)]/30 via-[var(--butter)]/20 to-[var(--sky)]/30 items-center justify-center p-12 relative overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-32 right-20 w-32 h-32 rounded-full bg-[var(--mint)]/40 blur-2xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-[var(--butter)]/40 blur-2xl" />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-[var(--sky)]/40 blur-2xl" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <PigeonLogo size="lg" />
            <span className="text-3xl font-bold text-foreground">PatchPigeon</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-6">Everything you need to keep users in the loop</h2>

          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--mint)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-foreground font-medium">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Developers</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">10k+</p>
              <p className="text-sm text-muted-foreground">Changelogs</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">Free</p>
              <p className="text-sm text-muted-foreground">Forever</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

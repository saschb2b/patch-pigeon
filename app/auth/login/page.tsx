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
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react"

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
    <div className="flex min-h-screen w-full">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--sky)]/30 via-[var(--peach)]/20 to-[var(--mint)]/30 items-center justify-center p-12 relative overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[var(--sky)]/40 blur-2xl" />
        <div className="absolute bottom-32 right-20 w-40 h-40 rounded-full bg-[var(--peach)]/40 blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[var(--mint)]/40 blur-2xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <PigeonLogo size="lg" className="w-32 h-32" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-[var(--butter)]" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">Your updates deserve to be seen</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join hundreds of indie devs who keep their users in the loop with beautiful, hassle-free changelogs.
          </p>

          {/* Testimonial card */}
          <div className="mt-8 bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 text-left">
            <p className="text-foreground italic mb-4">
              "Finally, a changelog tool that doesn't feel like a chore. My users actually read my updates now!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--sky)] flex items-center justify-center text-foreground font-semibold">
                S
              </div>
              <div>
                <p className="font-medium text-foreground">Sarah Chen</p>
                <p className="text-sm text-muted-foreground">Indie Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Your changelogs missed you. Let's get you signed in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border focus:border-[var(--sky)] focus:ring-[var(--sky)]/20"
                />
              </div>
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-[var(--peach)] transition-colors"
                >
                  Forgot your password?
                </Link>
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
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {"New to PatchPigeon? "}
              <Link
                href="/auth/sign-up"
                className="text-foreground font-semibold hover:text-[var(--sky)] transition-colors"
              >
                Create an account
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
    </div>
  )
}

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
import { Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"

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
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[var(--mint)]/10 via-background to-[var(--sky)]/10">
      {/* Floating shapes */}
      <div className="fixed top-20 right-20 w-64 h-64 rounded-full bg-[var(--mint)]/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-64 h-64 rounded-full bg-[var(--sky)]/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <PigeonLogo size="lg" />
            <span className="text-2xl font-bold text-foreground">PatchPigeon</span>
          </Link>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl">
          {isSuccess ? (
            // Success state
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--mint)]/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[var(--mint)]" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password updated!</h1>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Link href="/auth/login">
                <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold gap-2">
                  Sign in now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            // Form state
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[var(--sky)]/30 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-[var(--sky)]" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Create new password</h1>
                <p className="text-muted-foreground">Choose a strong password to keep your account secure.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    New password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-muted/50 border-border focus:border-[var(--sky)] focus:ring-[var(--sky)]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground font-medium">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    "Updating..."
                  ) : (
                    <>
                      Update Password
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

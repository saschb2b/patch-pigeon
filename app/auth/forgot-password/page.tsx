"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import Link from "next/link"
import { useState } from "react"
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react"

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
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[var(--sky)]/10 via-background to-[var(--peach)]/10">
      {/* Floating shapes */}
      <div className="fixed top-20 left-20 w-64 h-64 rounded-full bg-[var(--sky)]/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-64 h-64 rounded-full bg-[var(--peach)]/20 blur-3xl pointer-events-none" />

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
              <h1 className="text-2xl font-bold text-foreground mb-2">Check your inbox!</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Click
                the link to create a new password.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
                  Try another email
                </Button>
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Form state
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[var(--butter)]/30 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-[var(--butter)]" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Forgot your password?</h1>
                <p className="text-muted-foreground">
                  No worries! Enter your email and we'll send you a reset link. Our pigeon is fast!
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email address
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
                    "Sending..."
                  ) : (
                    <>
                      Send Reset Link
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

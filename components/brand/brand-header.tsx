"use client"

import Link from "next/link"
import { PigeonLogo } from "./pigeon-logo"
import { Button } from "@/components/ui/button"

interface BrandHeaderProps {
  showAuth?: boolean
}

export function BrandHeader({ showAuth = true }: BrandHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <PigeonLogo size="sm" className="transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold text-foreground">PatchPigeon</span>
          </Link>
          {showAuth && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="bg-[#FFB8A1] text-[#1F2937] hover:bg-[#ffa78a] shadow-sm">
                <Link href="/auth/sign-up">Get started free</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

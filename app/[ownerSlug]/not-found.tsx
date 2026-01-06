import Link from "next/link"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Button } from "@/components/ui/button"

export default function OwnerNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <PigeonLogo size="lg" className="mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          This profile doesn&apos;t exist or hasn&apos;t been set up yet. Check the URL or head back home.
        </p>
        <Button asChild>
          <Link href="/">Back to PatchPigeon</Link>
        </Button>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PigeonLogo } from "@/components/brand/pigeon-logo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <PigeonLogo className="w-16 h-16 mx-auto mb-6 opacity-50" />
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-8">This changelog could not be found.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}

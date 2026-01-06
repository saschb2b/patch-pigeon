import Image from "next/image"
import Link from "next/link"
import type { Product, Profile } from "@/lib/types"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { ChevronRight } from "lucide-react"

interface ChangelogHeaderProps {
  product: Product
  profile: Profile
  isDemo?: boolean
}

export function ChangelogHeader({ product, profile, isDemo }: ChangelogHeaderProps) {
  const ownerHref = isDemo ? "/demo" : `/${profile.owner_slug}`
  const productHref = isDemo ? `/demo/${product.slug}` : `/${profile.owner_slug}/${product.slug}`

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={ownerHref} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.display_name || profile.owner_slug}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#A7D8FF]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">
                    {(profile.display_name || profile.owner_slug).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {profile.display_name || profile.owner_slug}
              </span>
            </Link>

            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />

            {/* Product info */}
            <Link href={productHref} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              {product.logo_url ? (
                <Image
                  src={product.logo_url || "/placeholder.svg"}
                  alt={`${product.name} logo`}
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-[#A7D8FF]/30 flex items-center justify-center">
                  <span className="text-base font-bold text-foreground">{product.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground">{product.name}</h1>
              </div>
            </Link>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="hidden sm:inline">Powered by</span>
            <PigeonLogo size="sm" className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">PatchPigeon</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

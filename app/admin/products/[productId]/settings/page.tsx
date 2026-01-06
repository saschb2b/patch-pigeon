import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProductForm } from "@/components/admin/product-form"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import type { Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductSettingsPage({ params }: PageProps) {
  const { productId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (!profile) {
    redirect("/auth/onboarding")
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single()

  if (!product) {
    notFound()
  }

  const publicUrl = `/${(profile as Profile).owner_slug}/${(product as Product).slug}`

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/admin/products/${productId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to entries
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">Product Settings</h1>

          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">Public Changelog URL</h3>
            <p className="text-sm font-mono text-primary">{publicUrl}</p>
            <p className="text-xs text-muted-foreground mt-2">
              API: <span className="font-mono">/api{publicUrl}/changelog.json</span>
            </p>
          </div>

          <ProductForm userId={user.id} product={product as Product} />

          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting this product will also delete all changelog entries. This action cannot be undone.
            </p>
            <DeleteProductButton productId={productId} productName={(product as Product).name} />
          </div>
        </div>
      </main>
    </div>
  )
}

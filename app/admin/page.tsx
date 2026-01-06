import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, ExternalLink, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminPage() {
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

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Products</h1>
            <p className="text-muted-foreground">
              Your changelogs live at <span className="font-mono text-primary">/{profile.owner_slug}/...</span>
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/create-product">
              <Plus className="w-4 h-4 mr-2" />
              New Product
            </Link>
          </Button>
        </div>

        {!products || products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No products yet. Create your first one to get started.</p>
              <Button asChild>
                <Link href="/admin/create-product">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <Card key={product.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        /{profile.owner_slug}/{product.slug}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${profile.owner_slug}/${product.slug}`} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                          <span className="sr-only">View public changelog</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}/settings`}>
                          <Settings className="w-4 h-4" />
                          <span className="sr-only">Product settings</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description || "No description"}
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/admin/products/${product.id}`}>Manage Entries</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

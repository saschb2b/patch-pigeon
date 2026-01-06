import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Plus, ExternalLink, ArrowLeft, Pencil, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { EntryTypeBadge } from "@/components/changelog/entry-type-badge"
import { DeleteEntryButton } from "@/components/admin/delete-entry-button"
import { TogglePublishButton } from "@/components/admin/toggle-publish-button"
import type { Entry, Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductEntriesPage({ params }: PageProps) {
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

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  const publicUrl = `/${(profile as Profile).owner_slug}/${(product as Product).slug}`

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{(product as Product).name}</h1>
              <p className="text-muted-foreground">
                <Link href={publicUrl} target="_blank" className="hover:underline inline-flex items-center gap-1">
                  {publicUrl}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </p>
            </div>
            <Button asChild>
              <Link href={`/admin/products/${productId}/create-entry`}>
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Link>
            </Button>
          </div>
        </div>

        {!entries || entries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No changelog entries yet.</p>
              <Button asChild>
                <Link href={`/admin/products/${productId}/create-entry`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Entry
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry: Entry) => (
              <Card key={entry.id} className="group">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {entry.published ? (
                          <Eye className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <EntryTypeBadge type={entry.type} />
                          {entry.version && (
                            <span className="text-xs font-mono text-muted-foreground">v{entry.version}</span>
                          )}
                          {entry.publish_date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.publish_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground truncate">{entry.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TogglePublishButton entry={entry} />
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${productId}/entries/${entry.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <DeleteEntryButton entryId={entry.id} entryTitle={entry.title} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

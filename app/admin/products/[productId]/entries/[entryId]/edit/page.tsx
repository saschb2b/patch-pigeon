import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EntryEditor } from "@/components/admin/entry-editor"
import type { Product, Entry, EntryItem, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ productId: string; entryId: string }>
}

export default async function EditEntryPage({ params }: PageProps) {
  const { productId, entryId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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

  const { data: entry } = await supabase
    .from("entries")
    .select("*, entry_items(*)")
    .eq("id", entryId)
    .eq("product_id", productId)
    .single()

  if (!entry) {
    notFound()
  }

  const typedProduct = product as Product
  const typedEntry = entry as Entry & { entry_items: EntryItem[] }
  const typedProfile = profile as Profile

  return (
    <EntryEditor
      productId={productId}
      productSlug={typedProduct.slug}
      productName={typedProduct.name}
      ownerSlug={typedProfile.owner_slug}
      entry={typedEntry}
    />
  )
}

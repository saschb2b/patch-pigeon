import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EntryEditor } from "@/components/admin/entry-editor"
import type { Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function CreateEntryPage({ params }: PageProps) {
  const { productId } = await params
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

  const typedProduct = product as Product
  const typedProfile = profile as Profile

  return (
    <EntryEditor
      productId={productId}
      productSlug={typedProduct.slug}
      productName={typedProduct.name}
      ownerSlug={typedProfile.owner_slug}
    />
  )
}

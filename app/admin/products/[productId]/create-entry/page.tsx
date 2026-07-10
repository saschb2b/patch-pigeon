import { notFound } from "next/navigation"
import { requireUserAndProfile } from "@/lib/auth-helpers"
import { getOwnedProduct } from "@/lib/data/admin"
import { EntryEditor } from "@/components/admin/entry-editor"

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function CreateEntryPage({ params }: PageProps) {
  const { productId } = await params
  const { user, profile } = await requireUserAndProfile()
  const product = await getOwnedProduct(user.id, productId)

  if (!product) {
    notFound()
  }

  return (
    <EntryEditor
      productId={productId}
      productSlug={product.slug}
      productName={product.name}
      ownerSlug={profile.owner_slug}
    />
  )
}

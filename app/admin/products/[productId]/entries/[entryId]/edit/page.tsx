import { notFound } from "next/navigation"
import { requireUserAndProfile } from "@/lib/auth-helpers"
import { getOwnedEntry } from "@/lib/data/admin"
import { EntryEditor } from "@/components/admin/entry-editor"

interface PageProps {
  params: Promise<{ productId: string; entryId: string }>
}

export default async function EditEntryPage({ params }: PageProps) {
  const { productId, entryId } = await params
  const { user, profile } = await requireUserAndProfile()
  const result = await getOwnedEntry(user.id, productId, entryId)

  if (!result) {
    notFound()
  }

  const { product, entry } = result

  return (
    <EntryEditor
      productId={productId}
      productSlug={product.slug}
      productName={product.name}
      ownerSlug={profile.owner_slug}
      entry={entry}
    />
  )
}

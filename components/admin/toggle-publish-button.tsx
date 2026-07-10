"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { togglePublishAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import type { Entry } from "@/lib/types"

interface TogglePublishButtonProps {
  entry: Entry
}

export function TogglePublishButton({ entry }: TogglePublishButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await togglePublishAction(entry.id)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} disabled={isLoading}>
      {isLoading ? "..." : entry.published ? "Unpublish" : "Publish"}
    </Button>
  )
}

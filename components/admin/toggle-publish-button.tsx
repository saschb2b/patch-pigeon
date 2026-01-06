"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
    const supabase = createClient()

    await supabase
      .from("entries")
      .update({
        published: !entry.published,
        publish_date: !entry.published ? new Date().toISOString().split("T")[0] : entry.publish_date,
      })
      .eq("id", entry.id)

    router.refresh()
    setIsLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} disabled={isLoading}>
      {isLoading ? "..." : entry.published ? "Unpublish" : "Publish"}
    </Button>
  )
}

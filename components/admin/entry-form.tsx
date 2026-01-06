"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { generateEntrySlug } from "@/lib/utils/slug"
import type { Entry, EntryType } from "@/lib/types"

interface EntryFormProps {
  productId: string
  entry?: Entry
}

const entryTypes: { value: EntryType; label: string }[] = [
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "fix", label: "Fix" },
  { value: "breaking", label: "Breaking Change" },
]

export function EntryForm({ productId, entry }: EntryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(entry?.title || "")
  const [slug, setSlug] = useState(entry?.slug || "")
  const [content, setContent] = useState(entry?.content || "")
  const [type, setType] = useState<EntryType>(entry?.type || "feature")
  const [version, setVersion] = useState(entry?.version || "")
  const [published, setPublished] = useState(entry?.published || false)
  const [publishDate, setPublishDate] = useState(entry?.publish_date || new Date().toISOString().split("T")[0])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!entry) {
      setSlug(generateEntrySlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (entry) {
        const { error } = await supabase
          .from("entries")
          .update({
            title,
            slug,
            content,
            type,
            version: version || null,
            published,
            publish_date: publishDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", entry.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("entries").insert({
          product_id: productId,
          title,
          slug,
          content,
          type,
          version: version || null,
          published,
          publish_date: publishDate,
        })

        if (error) throw error
      }

      router.push(`/admin/products/${productId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Improved performance for workflows"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="2025-01-06-improved-performance"
              required
            />
            <p className="text-xs text-muted-foreground">Unique identifier for this entry</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as EntryType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entryTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="version">Version (optional)</Label>
              <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.2.0" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="publishDate">Publish Date</Label>
            <Input
              id="publishDate"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="## What's New&#10;&#10;Describe your changes here using Markdown..."
              rows={12}
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
            <Label htmlFor="published" className="cursor-pointer">
              Publish immediately
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : entry ? "Update Entry" : "Create Entry"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

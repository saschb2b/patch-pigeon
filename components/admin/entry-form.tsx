"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Box, Stack, TextField, MenuItem, FormLabel, Alert, Grid } from "@mui/material"
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
      <CardContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <FormLabel htmlFor="title" sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5, display: "block" }}>
                Title
              </FormLabel>
              <TextField
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Improved performance for workflows"
                required
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <FormLabel htmlFor="slug" sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5, display: "block" }}>
                URL Slug
              </FormLabel>
              <TextField
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="2025-01-06-improved-performance"
                required
                size="small"
                fullWidth
                helperText="Unique identifier for this entry"
              />
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormLabel htmlFor="type" sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5, display: "block" }}>
                  Type
                </FormLabel>
                <TextField
                  id="type"
                  select
                  value={type}
                  onChange={(e) => setType(e.target.value as EntryType)}
                  size="small"
                  fullWidth
                >
                  {entryTypes.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <FormLabel htmlFor="version" sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5, display: "block" }}>
                  Version (optional)
                </FormLabel>
                <TextField
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.2.0"
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box>
              <FormLabel
                htmlFor="publishDate"
                sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5, display: "block" }}
              >
                Publish Date
              </FormLabel>
              <TextField
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <FormLabel htmlFor="content" sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5, display: "block" }}>
                Content (Markdown)
              </FormLabel>
              <TextField
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="## What's New&#10;&#10;Describe your changes here using Markdown..."
                multiline
                rows={12}
                required
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "0.875rem" } }}
              />
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <FormLabel htmlFor="published" sx={{ cursor: "pointer", fontWeight: 500, fontSize: "0.875rem" }}>
                Publish immediately
              </FormLabel>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="row" spacing={2}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : entry ? "Update Entry" : "Create Entry"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

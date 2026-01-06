"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { EntryItemRow, changeTypeConfig } from "./entry-item-row"
import { Box, Container, Typography, Stack, Paper, Alert, Chip, Grid } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import { generateEntrySlug } from "@/lib/utils/slug"
import type { Entry, EntryItem, ChangeType } from "@/lib/types"

interface EntryEditorProps {
  productId: string
  productSlug: string
  productName: string
  ownerSlug: string
  entry?: Entry & { entry_items?: EntryItem[] }
}

// Generate temporary IDs for new items
function generateTempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function EntryEditor({ productId, productSlug, productName, ownerSlug, entry }: EntryEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Version details
  const [title, setTitle] = useState(entry?.title || "")
  const [slug, setSlug] = useState(entry?.slug || "")
  const [summary, setSummary] = useState(entry?.summary || "")
  const [version, setVersion] = useState(entry?.version || "")
  const [published, setPublished] = useState(entry?.published || false)
  const [publishDate, setPublishDate] = useState(entry?.publish_date || new Date().toISOString().split("T")[0])

  // Entry items (structured changes)
  const [items, setItems] = useState<EntryItem[]>(entry?.entry_items?.sort((a, b) => a.sort_order - b.sort_order) || [])

  // Track deleted items for database sync
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!entry) {
      setSlug(generateEntrySlug(value))
    }
  }

  const handleAddItem = (type: ChangeType = "FEATURE") => {
    const newItem: EntryItem = {
      id: generateTempId(),
      entry_id: entry?.id || "",
      type,
      title: "",
      description: null,
      area: null,
      sort_order: items.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setItems([...items, newItem])
  }

  const handleUpdateItem = useCallback((id: string, updates: Partial<EntryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item)),
    )
  }, [])

  const handleDeleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    // Track real items for deletion
    if (!id.startsWith("temp-")) {
      setDeletedItemIds((prev) => [...prev, id])
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update sort_order
        return newItems.map((item, index) => ({ ...item, sort_order: index }))
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      let entryId = entry?.id

      // Create or update entry
      if (entry) {
        const { error } = await supabase
          .from("entries")
          .update({
            title,
            slug,
            summary: summary || null,
            version: version || null,
            published,
            publish_date: publishDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", entry.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from("entries")
          .insert({
            product_id: productId,
            title,
            slug,
            summary: summary || null,
            version: version || null,
            published,
            publish_date: publishDate,
          })
          .select("id")
          .single()

        if (error) throw error
        entryId = data.id
      }

      // Delete removed items
      if (deletedItemIds.length > 0) {
        const { error } = await supabase.from("entry_items").delete().in("id", deletedItemIds)

        if (error) throw error
      }

      // Upsert items
      const validItems = items.filter((item) => item.title.trim())

      for (const item of validItems) {
        if (item.id.startsWith("temp-")) {
          // Insert new item
          const { error } = await supabase.from("entry_items").insert({
            entry_id: entryId,
            type: item.type,
            title: item.title,
            description: item.description,
            area: item.area,
            sort_order: item.sort_order,
          })

          if (error) throw error
        } else {
          // Update existing item
          const { error } = await supabase
            .from("entry_items")
            .update({
              type: item.type,
              title: item.title,
              description: item.description,
              area: item.area,
              sort_order: item.sort_order,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id)

          if (error) throw error
        }
      }

      router.push(`/admin/products/${productId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Group items by type for preview
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!item.title.trim()) return acc
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {} as Record<ChangeType, EntryItem[]>,
  )

  const typeOrder: ChangeType[] = ["FEATURE", "IMPROVEMENT", "FIX", "BREAKING", "REMOVED", "KNOWNISSUE", "NOTE"]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </Button>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {entry ? "Edit Version" : "New Version"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {productName}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2 }}>
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published" style={{ cursor: "pointer" }}>
                {published ? "Published" : "Draft"}
              </Label>
            </Stack>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title || items.filter((i) => i.title.trim()).length === 0}
            >
              <SaveIcon sx={{ fontSize: 18, mr: 1 }} />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {error && (
        <Box sx={{ mx: 3, mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Split Screen Editor */}
      <Grid container sx={{ minHeight: "calc(100vh - 73px)" }}>
        {/* Left: Form */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ borderRight: { lg: 1 }, borderColor: "divider", bgcolor: "grey.50", overflow: "auto" }}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Version Details */}
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Version Details
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="January 2025 Update"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="1.2.0"
                        inputProps={{ style: { fontFamily: "monospace" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Label htmlFor="summary">Summary (optional)</Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Brief overview of this release..."
                      rows={2}
                    />
                  </Box>

                  <Box>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="2025-01-january-update"
                      inputProps={{ style: { fontFamily: "monospace", fontSize: "0.875rem" } }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      /{ownerSlug}/{productSlug}/{slug || "your-slug"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Changes List */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    Changes
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {items.filter((i) => i.title.trim()).length} items
                  </Typography>
                </Stack>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <Stack spacing={1}>
                      {items.map((item) => (
                        <EntryItemRow key={item.id} item={item} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />
                      ))}
                    </Stack>
                  </SortableContext>
                </DndContext>

                {items.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      No changes added yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click a button below to add your first change
                    </Typography>
                  </Paper>
                )}

                {/* Quick Add Buttons */}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem("FEATURE")}
                    sx={{ color: "#0ea5e9", borderColor: "rgba(14, 165, 233, 0.3)", "&:hover": { bgcolor: "rgba(14, 165, 233, 0.1)" } }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Feature
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem("IMPROVEMENT")}
                    sx={{ color: "#f97316", borderColor: "rgba(249, 115, 22, 0.3)", "&:hover": { bgcolor: "rgba(249, 115, 22, 0.1)" } }}
                  >
                    <BoltIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Improvement
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem("FIX")}
                    sx={{ color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)", "&:hover": { bgcolor: "rgba(16, 185, 129, 0.1)" } }}
                  >
                    <BugReportIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Fix
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem("BREAKING")}
                    sx={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}
                  >
                    <WarningIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Breaking
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddItem("NOTE")}>
                    <AddIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    More
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right: Live Preview */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ bgcolor: "background.paper", overflow: "auto" }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "grey.50",
              px: 3,
              py: 1.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <VisibilityIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Live Preview
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, lg: 5 } }}>
            <Box sx={{ maxWidth: 768 }}>
              {/* Preview Header */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                  {version && (
                    <Chip
                      label={`v${version}`}
                      size="small"
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 500,
                        bgcolor: "#f1f5f9",
                        color: "#475569",
                      }}
                    />
                  )}
                  {formattedDate && (
                    <Typography variant="body2" color="text.secondary">
                      {formattedDate}
                    </Typography>
                  )}
                  {!published && (
                    <Chip
                      label="Draft"
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        bgcolor: "rgba(234, 179, 8, 0.1)",
                        color: "#a16207",
                        borderColor: "rgba(234, 179, 8, 0.2)",
                      }}
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "text.primary", mb: 2, textWrap: "balance" }}
                >
                  {title || "Untitled Version"}
                </Typography>

                {summary && (
                  <Typography variant="body1" color="text.secondary">
                    {summary}
                  </Typography>
                )}
              </Box>

              {/* Preview Content - Grouped by Type */}
              <Box sx={{ borderTop: 1, borderColor: "divider", pt: 4 }}>
                <Stack spacing={4}>
                  {typeOrder.map((type) => {
                    const typeItems = groupedItems[type]
                    if (!typeItems || typeItems.length === 0) return null

                    const config = changeTypeConfig[type]

                    return (
                      <Box key={type}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: config.muiColor }}>
                          {config.icon}
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {config.label}s
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({typeItems.length})
                          </Typography>
                        </Stack>
                        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                          <Stack spacing={1.5}>
                            {typeItems.map((item) => (
                              <Box
                                component="li"
                                key={item.id}
                                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                              >
                                <Box
                                  sx={{
                                    mt: 1,
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    bgcolor: config.muiColor,
                                    flexShrink: 0,
                                    opacity: 0.6,
                                  }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                    {item.area && (
                                      <Chip
                                        label={item.area}
                                        size="small"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.7rem",
                                          bgcolor: "grey.100",
                                          color: "text.secondary",
                                        }}
                                      />
                                    )}
                                    <Typography variant="body2" color="text.primary">
                                      {item.title}
                                    </Typography>
                                  </Stack>
                                  {item.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                      {item.description}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    )
                  })}

                  {Object.keys(groupedItems).length === 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: "center",
                        py: 6,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography color="text.secondary" variant="h6" sx={{ mb: 1 }}>
                        No changes yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add changes on the left to see the preview
                      </Typography>
                    </Paper>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

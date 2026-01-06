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
import { Save, ArrowLeft, Plus, Eye, Sparkles, Bug, Zap, AlertTriangle } from "lucide-react"
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{entry ? "Edit Version" : "New Version"}</h1>
              <p className="text-sm text-muted-foreground">{productName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published" className="text-sm cursor-pointer">
                {published ? "Published" : "Draft"}
              </Label>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title || items.filter((i) => i.title.trim()).length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Split Screen Editor */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-73px)]">
        {/* Left: Form */}
        <div className="border-r bg-muted/30 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Version Details */}
            <div className="space-y-4 p-4 rounded-lg border bg-card">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Version Details</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="January 2025 Update"
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="1.2.0"
                      className="bg-background font-mono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="summary">Summary (optional)</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief overview of this release..."
                    className="bg-background resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="2025-01-january-update"
                    className="bg-background font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    /{ownerSlug}/{productSlug}/{slug || "your-slug"}
                  </p>
                </div>
              </div>
            </div>

            {/* Changes List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Changes</h3>
                <span className="text-xs text-muted-foreground">
                  {items.filter((i) => i.title.trim()).length} items
                </span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <EntryItemRow key={item.id} item={item} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {items.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg bg-card">
                  <p className="text-muted-foreground mb-4">No changes added yet</p>
                  <p className="text-sm text-muted-foreground">Click a button below to add your first change</p>
                </div>
              )}

              {/* Quick Add Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("FEATURE")}
                  className="text-sky-600 border-sky-500/30 hover:bg-sky-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Feature
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("IMPROVEMENT")}
                  className="text-peach-600 border-peach-500/30 hover:bg-peach-500/10"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Improvement
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("FIX")}
                  className="text-mint-600 border-mint-500/30 hover:bg-mint-500/10"
                >
                  <Bug className="w-3.5 h-3.5 mr-1.5" />
                  Fix
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("BREAKING")}
                  className="text-red-600 border-red-500/30 hover:bg-red-500/10"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  Breaking
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem("NOTE")}
                  className="text-muted-foreground"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="bg-background overflow-auto">
          <div className="sticky top-0 border-b bg-muted/50 px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              Live Preview
            </div>
          </div>

          <div className="p-6 lg:p-10">
            <div className="max-w-3xl">
              {/* Preview Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {version && (
                    <span className="text-sm font-mono font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      v{version}
                    </span>
                  )}
                  {formattedDate && <time className="text-sm text-muted-foreground">{formattedDate}</time>}
                  {!published && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Draft
                    </span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
                  {title || "Untitled Version"}
                </h1>

                {summary && <p className="text-lg text-muted-foreground">{summary}</p>}
              </div>

              {/* Preview Content - Grouped by Type */}
              <div className="border-t pt-8 space-y-8">
                {typeOrder.map((type) => {
                  const typeItems = groupedItems[type]
                  if (!typeItems || typeItems.length === 0) return null

                  const config = changeTypeConfig[type]

                  return (
                    <div key={type}>
                      <div className={`flex items-center gap-2 mb-4 ${config.color}`}>
                        {config.icon}
                        <h2 className="font-semibold">{config.label}s</h2>
                        <span className="text-xs text-muted-foreground">({typeItems.length})</span>
                      </div>
                      <ul className="space-y-3">
                        {typeItems.map((item) => (
                          <li key={item.id} className="flex items-start gap-3 group">
                            <span
                              className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${config.color.replace("text-", "bg-")}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {item.area && (
                                  <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {item.area}
                                  </span>
                                )}
                                <span className="text-foreground">{item.title}</span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}

                {Object.keys(groupedItems).length === 0 && (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground text-lg mb-2">No changes yet</p>
                    <p className="text-sm text-muted-foreground">Add changes on the left to see the preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect, useEffectEvent, useRef, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { saveEntryAction } from "@/app/admin/actions"
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
import { EntryItemRow } from "./entry-item-row"
import { EntryItemsList } from "@/components/changelog/entry-items-list"
import { formatDateOnly } from "@/lib/date"
import {
  Box,
  Typography,
  Stack,
  Paper,
  Alert,
  Chip,
  Grid,
  Snackbar,
  Tooltip,
  IconButton,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BugReportIcon from "@mui/icons-material/BugReport"
import BoltIcon from "@mui/icons-material/Bolt"
import WarningIcon from "@mui/icons-material/Warning"
import UndoIcon from "@mui/icons-material/Undo"
import KeyboardIcon from "@mui/icons-material/Keyboard"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import PreviewIcon from "@mui/icons-material/Preview"
import EditIcon from "@mui/icons-material/Edit"
import Link from "@/components/link"
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

// Draft storage key
function getDraftKey(productId: string, entryId?: string) {
  return `patchpigeon-draft-${productId}-${entryId || "new"}`
}

interface DraftData {
  title: string
  slug: string
  summary: string
  version: string
  published: boolean
  publishDate: string
  items: EntryItem[]
  savedAt: string
}

const subscribeToHydration = () => () => undefined

export function EntryEditor({ productId, productSlug, productName, ownerSlug, entry }: EntryEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Version details
  const [title, setTitle] = useState(entry?.title || "")
  const [slug, setSlug] = useState(entry?.slug || "")
  const [summary, setSummary] = useState(entry?.summary || "")
  const [version, setVersion] = useState(entry?.version || "")
  const [published, setPublished] = useState(entry?.published || false)
  const [initialPublishDate] = useState(
    () => entry?.publish_date || new Date().toISOString().split("T")[0],
  )
  const [publishDate, setPublishDate] = useState(initialPublishDate)

  // Entry items (structured changes)
  const [items, setItems] = useState<EntryItem[]>(
    () => [...(entry?.entry_items ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  )

  // Track deleted items for database sync
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([])

  // Track recently deleted item for undo
  const [lastDeletedItem, setLastDeletedItem] = useState<{ item: EntryItem; index: number } | null>(null)

  // Track if there are unsaved changes

  // Track which item was just added for auto-focus
  const [newItemId, setNewItemId] = useState<string | null>(null)

  // Ref for the items container to scroll to new items
  const itemsContainerRef = useRef<HTMLDivElement>(null)

  // Mobile view toggle (editor vs preview)
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor")

  // Client-side mounted state for DndContext (prevents hydration mismatch)
  const isMounted = useSyncExternalStore(subscribeToHydration, () => true, () => false)

  // Draft recovery state
  const [hasDraft, setHasDraft] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null)
  const draftKey = getDraftKey(productId, entry?.id)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const initialItemsById = new Map(
    entry?.entry_items?.map((item) => [item.id, item]) ?? [],
  )
  const hasItemChanges = items.some((item) => {
    const initialItem = initialItemsById.get(item.id)
    return item.id.startsWith("temp-") ||
      initialItem?.title !== item.title ||
      initialItem?.description !== item.description ||
      initialItem?.type !== item.type ||
      initialItem?.area !== item.area ||
      initialItem?.sort_order !== item.sort_order
  })
  const hasMetaChanges =
    title !== (entry?.title || "") ||
    slug !== (entry?.slug || "") ||
    summary !== (entry?.summary || "") ||
    version !== (entry?.version || "") ||
    published !== (entry?.published || false) ||
    publishDate !== initialPublishDate ||
    deletedItemIds.length > 0
  const hasChanges = hasItemChanges || hasMetaChanges

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])

  // Check for existing draft on mount
  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        const savedDraft = localStorage.getItem(draftKey)
        if (savedDraft) {
          const draft: DraftData = JSON.parse(savedDraft)
          if (draft.title || draft.items.length > 0) {
            setHasDraft(true)
            setDraftSavedAt(draft.savedAt)
          }
        }
      } catch {
        // Ignore malformed or inaccessible local storage.
      }
    }, 0)
    return () => window.clearTimeout(handle)
  }, [draftKey])

  // Auto-save draft every 30 seconds when there are changes
  useEffect(() => {
    if (!hasChanges) return

    const saveDraft = () => {
      try {
        const draft: DraftData = {
          title,
          slug,
          summary,
          version,
          published,
          publishDate,
          items,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(draftKey, JSON.stringify(draft))
      } catch {
        // Ignore localStorage errors (e.g., quota exceeded)
      }
    }

    // Save immediately on changes
    saveDraft()

    // Also save periodically
    const interval = setInterval(saveDraft, 30000)
    return () => clearInterval(interval)
  }, [hasChanges, title, slug, summary, version, published, publishDate, items, draftKey])

  const handleRestoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem(draftKey)
      if (savedDraft) {
        const draft: DraftData = JSON.parse(savedDraft)
        setTitle(draft.title)
        setSlug(draft.slug)
        setSummary(draft.summary)
        setVersion(draft.version)
        setPublished(draft.published)
        setPublishDate(draft.publishDate)
        setItems(draft.items)
        setHasDraft(false)
        setSuccessMessage("Draft restored")
      }
    } catch {
      setError("Failed to restore draft")
    }
  }

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftKey)
      setHasDraft(false)
    } catch {
      // Ignore
    }
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey)
    } catch {
      // Ignore
    }
  }

  const handleKeyboardShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault()
      if (!isLoading && title && items.some((item) => item.title.trim())) {
        void handleSubmit(event as unknown as React.FormEvent)
      }
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "F") {
      event.preventDefault()
      handleAddItem("FEATURE")
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
      event.preventDefault()
      handleAddItem("IMPROVEMENT")
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "B") {
      event.preventDefault()
      handleAddItem("FIX")
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "z" && lastDeletedItem) {
      event.preventDefault()
      handleUndoDelete()
    }
  })

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcut)
    return () => window.removeEventListener("keydown", handleKeyboardShortcut)
  }, [])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!entry) {
      setSlug(generateEntrySlug(value))
    }
  }

  function handleAddItem(type: ChangeType = "FEATURE") {
    const newId = generateTempId()
    const newItem: EntryItem = {
      id: newId,
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
    setNewItemId(newId)

    // Scroll to new item after render
    setTimeout(() => {
      itemsContainerRef.current?.scrollTo({
        top: itemsContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }, 100)
  }

  const handleDuplicateItem = (item: EntryItem) => {
    const newId = generateTempId()
    const newItem: EntryItem = {
      ...item,
      id: newId,
      title: `${item.title} (copy)`,
      sort_order: items.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setItems((prev) => [...prev, newItem])
    setNewItemId(newId)
    setSuccessMessage("Item duplicated")
  }

  const handleUpdateItem = (id: string, updates: Partial<EntryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item)),
    )
  }

  const handleDeleteItem = (id: string) => {
    const itemIndex = items.findIndex((item) => item.id === id)
    const deletedItem = items[itemIndex]

    if (deletedItem) {
      setLastDeletedItem({ item: deletedItem, index: itemIndex })
    }

    setItems((prev) => prev.filter((item) => item.id !== id))
    // Track real items for deletion
    if (!id.startsWith("temp-")) {
      setDeletedItemIds((prev) => [...prev, id])
    }
  }

  function handleUndoDelete() {
    if (lastDeletedItem) {
      const { item, index } = lastDeletedItem
      setItems((prev) => {
        const newItems = [...prev]
        newItems.splice(index, 0, item)
        return newItems.map((i, idx) => ({ ...i, sort_order: idx }))
      })
      // Remove from deleted IDs if it was a real item
      if (!item.id.startsWith("temp-")) {
        setDeletedItemIds((prev) => prev.filter((id) => id !== item.id))
      }
      setLastDeletedItem(null)
      setSuccessMessage("Item restored")
    }
  }

  const handleNavigateItem = (currentId: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex((item) => item.id === currentId)
    if (currentIndex === -1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    // Focus the target item
    setNewItemId(items[targetIndex].id)
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await saveEntryAction({
        productId,
        entryId: entry?.id,
        title,
        slug,
        summary: summary || null,
        version: version || null,
        published,
        publish_date: publishDate,
        items,
        deletedItemIds,
      })

      if ("error" in result) {
        setError(result.error)
        return
      }

      setSuccessMessage("Saved successfully!")
      setDeletedItemIds([])
      clearDraft()

      // Navigate after a short delay to show success message
      setTimeout(() => {
        router.push(`/admin/products/${productId}`)
      }, 500)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const formattedDate = publishDate
    ? formatDateOnly(publishDate, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const validItems = items.filter((item) => item.title.trim())
  const validItemCount = validItems.length

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
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
            py: 2
          }}>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              alignItems: "center",
              minWidth: 0
            }}>
            <Tooltip title="Back to entries">
              <IconButton onClick={() => router.back()} size="small">
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{
                alignItems: "center"
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  {entry ? "Edit" : "New"}
                </Typography>
                {hasChanges && (
                  <Chip
                    label="Unsaved"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      bgcolor: "warning.light",
                      color: "warning.dark",
                    }}
                  />
                )}
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  maxWidth: { xs: 100, sm: 200 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                {productName}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={{ xs: 0.5, sm: 2 }} sx={{
            alignItems: "center"
          }}>
            {/* Mobile view toggle */}
            <Tooltip title={mobileView === "editor" ? "Show preview" : "Show editor"}>
              <IconButton
                size="small"
                onClick={() => setMobileView(mobileView === "editor" ? "preview" : "editor")}
                sx={{ 
                  display: { xs: "flex", lg: "none" },
                  opacity: 0.6, 
                  "&:hover": { opacity: 1 } 
                }}
              >
                {mobileView === "editor" ? (
                  <PreviewIcon sx={{ fontSize: 20 }} />
                ) : (
                  <EditIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
            {entry && slug && (
              <Tooltip title="Open public preview">
                <IconButton
                  component={Link}
                  nativeButton={false}
                  href={`/${ownerSlug}/${productSlug}/${slug}`}
                  target="_blank"
                  size="small"
                  sx={{ opacity: 0.6, "&:hover": { opacity: 1 }, display: { xs: 'none', sm: 'flex' } }}
                >
                  <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Shortcuts: Ctrl+S save, Ctrl+Shift+F/I/B add items, Alt+Arrow navigate items">
              <IconButton size="small" sx={{ opacity: 0.5, display: { xs: "none", md: "flex" } }}>
                <KeyboardIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: "center",
                display: { xs: 'none', sm: 'flex' }
              }}>
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published" style={{ cursor: "pointer", fontSize: '0.875rem' }}>
                {published ? "Published" : "Draft"}
              </Label>
            </Stack>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title || validItemCount === 0}
              size="sm"
            >
              <SaveIcon sx={{ fontSize: 16, mr: { xs: 0, sm: 0.5 } }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {isLoading ? "Saving..." : "Save"}
              </Box>
            </Button>
          </Stack>
        </Stack>
      </Box>
      {error && (
        <Box sx={{ mx: 3, mt: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}
      {hasDraft && (
        <Box sx={{ mx: 3, mt: 2 }}>
          <Alert 
            severity="info" 
            onClose={handleDiscardDraft}
            action={
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRestoreDraft}
                sx={{ color: "info.dark", fontWeight: 600 }}
              >
                Restore
              </Button>
            }
          >
            You have an unsaved draft from {draftSavedAt ? new Date(draftSavedAt).toLocaleString() : "earlier"}
          </Alert>
        </Box>
      )}
      {/* Split Screen Editor */}
      <Grid container sx={{ minHeight: "calc(100vh - 73px)" }}>
        {/* Left: Form */}
        <Grid 
          size={{ xs: 12, lg: 6 }} 
          sx={{ 
            borderRight: { lg: 1 }, 
            borderColor: "divider", 
            bgcolor: "grey.50", 
            overflow: "auto",
            display: { xs: mobileView === "editor" ? "block" : "none", lg: "block" }
          }}
        >
          <Box sx={{ p: 3 }} ref={itemsContainerRef}>
            <Stack spacing={3}>
              {/* Version Details */}
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "block"
                  }}>
                  Version Details
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="January 2025 Update"
                      autoFocus={!entry}
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
                        slotProps={{ htmlInput: { style: { fontFamily: "monospace" } } }}
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
                      slotProps={{ htmlInput: { style: { fontFamily: "monospace", fontSize: "0.875rem" } } }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        mt: 0.5,
                        display: "block"
                      }}>
                      /{ownerSlug}/{productSlug}/{slug || "your-slug"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Changes List */}
              <Box>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2
                  }}>
                  <Typography variant="overline" sx={{
                    color: "text.secondary"
                  }}>
                    Changes *
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{
                    alignItems: "center"
                  }}>
                    {lastDeletedItem && (
                      <Tooltip title="Undo delete (Ctrl+Z)">
                        <Button variant="ghost" size="sm" onClick={handleUndoDelete}>
                          <UndoIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          Undo
                        </Button>
                      </Tooltip>
                    )}
                    <Typography variant="caption" sx={{
                      color: "text.secondary"
                    }}>
                      {validItemCount} item{validItemCount !== 1 ? "s" : ""}
                    </Typography>
                  </Stack>
                </Stack>

                {isMounted ? (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                      <Stack spacing={1}>
                        {items.map((item) => (
                          <EntryItemRow
                            key={item.id}
                            item={item}
                            onUpdate={handleUpdateItem}
                            onDelete={handleDeleteItem}
                            onDuplicate={handleDuplicateItem}
                            onNavigate={(direction) => handleNavigateItem(item.id, direction)}
                            autoFocus={item.id === newItemId}
                          />
                        ))}
                      </Stack>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <Stack spacing={1}>
                    {items.map((item) => (
                      <Paper
                        key={item.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: 1,
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Typography variant="body2" sx={{
                          color: "text.secondary"
                        }}>
                          {item.title || 'Loading...'}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {items.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      py: 6,
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      bgcolor: "background.paper",
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 40, color: "text.disabled", mb: 2 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        mb: 1
                      }}>
                      Start adding changes
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 3
                      }}>
                      Click a button below or use keyboard shortcuts
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{
                      justifyContent: "center"
                    }}>
                      <Chip
                        label="Ctrl+Shift+F"
                        size="small"
                        sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          lineHeight: "24px"
                        }}>
                        Feature
                      </Typography>
                      <Chip
                        label="Ctrl+Shift+B"
                        size="small"
                        sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          lineHeight: "24px"
                        }}>
                        Fix
                      </Typography>
                    </Stack>
                  </Paper>
                )}

                {/* Quick Add Buttons */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: "wrap",
                    mt: 2
                  }}>
                  <Tooltip title="Ctrl+Shift+F">
                    <Button
                      aria-label="Add feature"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddItem("FEATURE")}
                      sx={{ color: "#0ea5e9", borderColor: "rgba(14, 165, 233, 0.3)", "&:hover": { bgcolor: "rgba(14, 165, 233, 0.1)" } }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      Feature
                    </Button>
                  </Tooltip>
                  <Tooltip title="Ctrl+Shift+I">
                    <Button
                      aria-label="Add improvement"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddItem("IMPROVEMENT")}
                      sx={{ color: "#f97316", borderColor: "rgba(249, 115, 22, 0.3)", "&:hover": { bgcolor: "rgba(249, 115, 22, 0.1)" } }}
                    >
                      <BoltIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      Improvement
                    </Button>
                  </Tooltip>
                  <Tooltip title="Ctrl+Shift+B">
                    <Button
                      aria-label="Add fix"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddItem("FIX")}
                      sx={{ color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)", "&:hover": { bgcolor: "rgba(16, 185, 129, 0.1)" } }}
                    >
                      <BugReportIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      Fix
                    </Button>
                  </Tooltip>
                  <Button
                    aria-label="Add breaking change"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem("BREAKING")}
                    sx={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}
                  >
                    <WarningIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Breaking
                  </Button>
                  <Button aria-label="Add note" variant="outline" size="sm" onClick={() => handleAddItem("NOTE")}>
                    <AddIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    More
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right: Live Preview */}
        <Grid 
          size={{ xs: 12, lg: 6 }} 
          sx={{ 
            bgcolor: "background.paper", 
            overflow: "auto", 
            display: { xs: mobileView === "preview" ? "block" : "none", lg: "block" } 
          }}
        >
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
            <Stack direction="row" spacing={1} sx={{
              alignItems: "center"
            }}>
              <VisibilityIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Live Preview
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, lg: 5 } }}>
            <Box sx={{ maxWidth: 768 }}>
              {/* Preview Header */}
              <Box sx={{ mb: 4 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 2
                  }}>
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
                    <Typography variant="body2" sx={{
                      color: "text.secondary"
                    }}>
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
                  sx={{ fontWeight: 700, color: title ? "text.primary" : "text.disabled", mb: 2, textWrap: "balance" }}
                >
                  {title || "Untitled Version"}
                </Typography>

                {summary && (
                  <Typography variant="body1" sx={{
                    color: "text.secondary"
                  }}>
                    {summary}
                  </Typography>
                )}
              </Box>

              {/* Preview Content - Grouped by Type */}
              <Box sx={{ borderTop: 1, borderColor: "divider", pt: 4 }}>
                {validItems.length > 0 ? (
                  <EntryItemsList items={validItems} />
                ) : (
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
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        mb: 1
                      }}>
                      No changes yet
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: "text.secondary"
                    }}>
                      Add changes on the left to see the preview
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={
          <Stack direction="row" spacing={1} sx={{
            alignItems: "center"
          }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: "success.light" }} />
            <span>{successMessage}</span>
          </Stack>
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

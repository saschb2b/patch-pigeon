import { redirect, notFound } from "next/navigation"
import Link from "@/components/link"
import { Box, Container, Typography, Stack, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { EntryTypeBadge } from "@/components/changelog/entry-type-badge"
import { DeleteEntryButton } from "@/components/admin/delete-entry-button"
import { TogglePublishButton } from "@/components/admin/toggle-publish-button"
import type { Entry, Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductEntriesPage({ params }: PageProps) {
  const { productId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

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

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  const publicUrl = `/${(profile as Profile).owner_slug}/${(product as Product).slug}`

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader user={user} />

      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
                transition: "color 0.2s",
                mb: 2,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">Back to products</Typography>
            </Stack>
          </Link>

          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                {(product as Product).name}
              </Typography>
              <Link href={publicUrl} target="_blank" style={{ textDecoration: "none" }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ color: "text.secondary", "&:hover": { textDecoration: "underline" } }}
                >
                  <Typography variant="body2">{publicUrl}</Typography>
                  <OpenInNewIcon sx={{ fontSize: 14 }} />
                </Stack>
              </Link>
            </Box>
            <Button asChild>
              <Link href={`/admin/products/${productId}/create-entry`}>
                <AddIcon sx={{ fontSize: 18, mr: 1 }} />
                New Entry
              </Link>
            </Button>
          </Stack>
        </Box>

        {!entries || entries.length === 0 ? (
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No changelog entries yet.
              </Typography>
              <Button asChild>
                <Link href={`/admin/products/${productId}/create-entry`}>
                  <AddIcon sx={{ fontSize: 18, mr: 1 }} />
                  Create Entry
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {entries.map((entry: Entry) => (
              <Card key={entry.id}>
                <CardContent sx={{ py: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Box>
                        {entry.published ? (
                          <VisibilityIcon sx={{ fontSize: 18, color: "success.main" }} />
                        ) : (
                          <VisibilityOffIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          {entry.type && <EntryTypeBadge type={entry.type} />}
                          {entry.version && (
                            <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                              v{entry.version}
                            </Typography>
                          )}
                          {entry.publish_date && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(entry.publish_date).toLocaleDateString()}
                            </Typography>
                          )}
                        </Stack>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.title}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <TogglePublishButton entry={entry} />
                      <IconButton size="small" component={Link} href={`/admin/products/${productId}/entries/${entry.id}/edit`}>
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <DeleteEntryButton entryId={entry.id} entryTitle={entry.title} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  )
}

import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Box, Container, Typography, Stack, Paper } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"
import { ProductForm } from "@/components/admin/product-form"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import type { Product, Profile } from "@/lib/types"

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductSettingsPage({ params }: PageProps) {
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

  const publicUrl = `/${(profile as Profile).owner_slug}/${(product as Product).slug}`

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <AdminHeader user={user} />

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 }, flex: 1 }}>
        <Box sx={{ maxWidth: 672, mx: "auto" }}>
          <Link href={`/admin/products/${productId}`} style={{ textDecoration: "none" }}>
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
              <Typography variant="body2">Back to entries</Typography>
            </Stack>
          </Link>

          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: { xs: 2, sm: 4 }, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
            Product Settings
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mb: { xs: 2, sm: 4 },
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              bgcolor: "grey.50",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: "text.primary", mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Public Changelog URL
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.main", fontSize: { xs: '0.75rem', sm: '0.875rem' }, wordBreak: 'break-all' }}>
              {publicUrl}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              API: <Box component="span" sx={{ fontFamily: "monospace", wordBreak: 'break-all' }}>/api{publicUrl}/changelog.json</Box>
            </Typography>
          </Paper>

          <ProductForm userId={user.id} product={product as Product} />

          <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "error.main", mb: 2 }}>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Deleting this product will also delete all changelog entries. This action cannot be undone.
            </Typography>
            <DeleteProductButton productId={productId} productName={(product as Product).name} />
          </Box>
        </Box>
      </Container>

      <AdminFooter />
    </Box>
  )
}

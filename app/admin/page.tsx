import { redirect } from "next/navigation"
import Link from "next/link"
import { Box, Container, Typography, Stack, Grid, Tooltip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import SettingsIcon from "@mui/icons-material/Settings"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminPage() {
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

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader user={user} />

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: "text.primary",
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              Your Products
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Your changelogs live at{" "}
              <Typography component="span" sx={{ fontFamily: "monospace", color: "primary.main" }}>
                /{profile.owner_slug}/...
              </Typography>
            </Typography>
          </Box>
          <Button asChild>
            <Link href="/admin/create-product">
              <AddIcon sx={{ fontSize: 18, mr: 0.5 }} />
              New Product
            </Link>
          </Button>
        </Stack>

        {!products || products.length === 0 ? (
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No products yet. Create your first one to get started.
              </Typography>
              <Button asChild>
                <Link href="/admin/create-product">
                  <AddIcon sx={{ fontSize: 18, mr: 1 }} />
                  Create Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {products.map((product: Product) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "border-color 0.2s",
                    "&:hover": {
                      borderColor: "#cbd5e1",
                    },
                  }}
                >
                  <CardHeader>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                          /{profile.owner_slug}/{product.slug}
                        </CardDescription>
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View public changelog">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/${profile.owner_slug}/${product.slug}`} target="_blank">
                              <OpenInNewIcon sx={{ fontSize: 18 }} />
                            </Link>
                          </Button>
                        </Tooltip>
                        <Tooltip title="Product settings">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/settings`}>
                              <SettingsIcon sx={{ fontSize: 18 }} />
                            </Link>
                          </Button>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardHeader>
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description || "No description"}
                    </Typography>
                    <Button asChild sx={{ width: "100%" }}>
                      <Link href={`/admin/products/${product.id}`}>Manage Entries</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

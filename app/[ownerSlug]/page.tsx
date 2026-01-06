import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Box, Container, Typography, Stack, Chip, Avatar } from "@mui/material"
import InventoryIcon from "@mui/icons-material/Inventory2Outlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import type { Product, Entry } from "@/lib/types"

interface PageProps {
  params: Promise<{ ownerSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { ownerSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    return { title: "Not Found" }
  }

  return {
    title: `${profile.display_name || profile.owner_slug} - PatchPigeon`,
    description: `Explore changelogs from ${profile.display_name || profile.owner_slug}`,
  }
}

interface ProductWithLatestEntry extends Product {
  latest_entry?: Entry | null
  entry_count?: number
}

export default async function OwnerProfilePage({ params }: PageProps) {
  const { ownerSlug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("owner_slug", ownerSlug).maybeSingle()

  if (!profile) {
    notFound()
  }

  // Get all products for this owner
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  // Fetch latest published entry and count for each product
  const productsWithLatest: ProductWithLatestEntry[] = await Promise.all(
    (products || []).map(async (product) => {
      const { data: latestEntry } = await supabase
        .from("entries")
        .select("*")
        .eq("product_id", product.id)
        .eq("published", true)
        .order("publish_date", { ascending: false })
        .limit(1)
        .maybeSingle()

      const { count } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true })
        .eq("product_id", product.id)
        .eq("published", true)

      return {
        ...product,
        latest_entry: latestEntry,
        entry_count: count || 0,
      }
    }),
  )

  // Only show products that have at least one published entry
  const publicProducts = productsWithLatest.filter((p) => p.entry_count && p.entry_count > 0)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              {profile.avatar_url ? (
                <Avatar
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.owner_slug}
                  sx={{ width: 48, height: 48 }}
                />
              ) : (
                <Avatar sx={{ width: 48, height: 48, bgcolor: "rgba(167, 216, 255, 0.3)" }}>
                  <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
                    {(profile.display_name || profile.owner_slug).charAt(0).toUpperCase()}
                  </Typography>
                </Avatar>
              )}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {profile.display_name || profile.owner_slug}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{profile.owner_slug}
                </Typography>
              </Box>
            </Stack>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
                <Typography variant="caption">Powered by</Typography>
                <PigeonLogo size="sm" sx={{ width: 20, height: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>PatchPigeon</Typography>
              </Stack>
            </Link>
          </Stack>
        </Container>
      </Box>

      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 896, mx: "auto" }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
              Projects
            </Typography>
            <Typography color="text.secondary">
              Explore all changelogs from {profile.display_name || profile.owner_slug}
            </Typography>
          </Box>

          {publicProducts.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                bgcolor: "grey.50",
                borderRadius: 4,
                border: 1,
                borderColor: "divider",
              }}
            >
              <InventoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary">No public changelogs yet.</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              {publicProducts.map((product) => (
                <Link key={product.id} href={`/${ownerSlug}/${product.slug}`} style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "rgba(167, 216, 255, 0.5)",
                        boxShadow: "0 10px 40px rgba(167, 216, 255, 0.1)",
                        "& .product-name": {
                          color: "#a7d8ff",
                        },
                        "& .arrow-icon": {
                          opacity: 1,
                          transform: "translateX(4px)",
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        {product.logo_url ? (
                          <Box
                            component="img"
                            src={product.logo_url}
                            alt={product.name}
                            sx={{ width: 56, height: 56, borderRadius: 2, objectFit: "cover" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              bgcolor: "rgba(167, 216, 255, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#a7d8ff" }}>
                              {product.name.charAt(0)}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <Typography
                              className="product-name"
                              sx={{
                                fontSize: "1.125rem",
                                fontWeight: 600,
                                color: "text.primary",
                                transition: "color 0.2s",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {product.name}
                            </Typography>
                            <ArrowForwardIcon
                              className="arrow-icon"
                              sx={{
                                fontSize: 16,
                                color: "text.secondary",
                                opacity: 0,
                                transition: "all 0.2s",
                              }}
                            />
                          </Stack>
                          {product.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 1.5,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {product.description}
                            </Typography>
                          )}
                          <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
                            {product.latest_entry?.version && (
                              <Chip
                                label={`v${product.latest_entry.version}`}
                                size="small"
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: "0.75rem",
                                  bgcolor: "#B8E5D5",
                                  color: "#2D7A5F",
                                  border: 0,
                                }}
                              />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {product.entry_count} {product.entry_count === 1 ? "update" : "updates"}
                            </Typography>
                            {product.latest_entry?.publish_date && (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarTodayIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(product.latest_entry.publish_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Latest update preview */}
                      {product.latest_entry && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                            Latest update
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.latest_entry.title}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

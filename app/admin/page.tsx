import Link from "next/link"
import { Box, Container, Typography, Stack, Grid, Tooltip, Paper, Chip, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import SettingsIcon from "@mui/icons-material/Settings"
import FavoriteIcon from "@mui/icons-material/Favorite"
import GitHubIcon from "@mui/icons-material/GitHub"
import ArticleIcon from "@mui/icons-material/Article"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import InventoryIcon from "@mui/icons-material/Inventory"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { requireUserAndProfile } from "@/lib/auth-helpers"
import { getProductsForOwner } from "@/lib/data/admin"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

// Gradient colors for product cards
const cardGradients = [
  { bg: `linear-gradient(135deg, ${colors.sky}30, ${colors.mint}20)`, accent: colors.sky },
  { bg: `linear-gradient(135deg, ${colors.peach}30, ${colors.butter}20)`, accent: colors.peach },
  { bg: `linear-gradient(135deg, ${colors.mint}30, ${colors.sky}20)`, accent: colors.mint },
  { bg: `linear-gradient(135deg, ${colors.butter}30, ${colors.peach}20)`, accent: colors.butter },
]

export default async function AdminPage() {
  const { user, profile } = await requireUserAndProfile()
  const products = await getProductsForOwner(user.id)

  // Calculate stats
  const totalProducts = products.length
  const totalEntries = products.reduce((sum, product) => sum + product.entries.length, 0)
  const publishedEntries = products.reduce(
    (sum, product) => sum + product.entries.filter((entry) => entry.published).length,
    0,
  )

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <AdminHeader user={user} />

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 }, flex: 1 }}>
        {/* Welcome Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${colors.sky}15 0%, ${colors.peach}10 50%, ${colors.mint}15 100%)`,
            border: 1,
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blob */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.sky}30 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Box sx={{ position: 'relative' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  mb: 0.5,
                }}
              >
                Welcome back! 👋
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Your changelogs live at
                </Typography>
                <Chip
                  label={`/${profile.owner_slug}/...`}
                  size="small"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    bgcolor: 'white',
                    border: 1,
                    borderColor: 'divider',
                  }}
                />
              </Stack>
            </Box>
            <Button asChild size="lg">
              <Link href="/admin/create-product">
                <AddIcon sx={{ fontSize: 20, mr: 0.5 }} />
                New Product
              </Link>
            </Button>
          </Stack>

          {/* Stats Row */}
          {totalProducts > 0 && (
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 4 }}
              sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}
            >
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {totalProducts}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalProducts === 1 ? 'Product' : 'Products'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {totalEntries}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalEntries === 1 ? 'Entry' : 'Entries'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: colors.mint }}>
                  {publishedEntries}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Published
                </Typography>
              </Box>
            </Stack>
          )}
        </Paper>

        {/* Products Section */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
          Your Products
        </Typography>

        {!products || products.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              border: '2px dashed',
              borderColor: 'divider',
              textAlign: 'center',
              bgcolor: 'transparent',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                bgcolor: `${colors.sky}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <InventoryIcon sx={{ fontSize: 40, color: colors.ink, opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              No products yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
              Create your first product to start sharing changelogs with your users.
            </Typography>
            <Button asChild size="lg">
              <Link href="/admin/create-product">
                <RocketLaunchIcon sx={{ fontSize: 18, mr: 1 }} />
                Create Your First Product
              </Link>
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {products.map((product, index) => {
              const gradient = cardGradients[index % cardGradients.length]
              const entryCount = product.entries.length
              const publishedCount = product.entries.filter((entry) => entry.published).length
              
              return (
                <Grid size={{ xs: 12, md: 6 }} key={product.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 0,
                      borderRadius: 3,
                      border: 1,
                      borderColor: 'divider',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: gradient.accent,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px -8px ${gradient.accent}40`,
                        '& .product-arrow': {
                          transform: 'translateX(4px)',
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {/* Card Header with gradient */}
                    <Box
                      sx={{
                        p: 2.5,
                        background: gradient.bg,
                        borderBottom: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Product Icon */}
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2.5,
                              bgcolor: 'white',
                              border: 1,
                              borderColor: 'divider',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                          >
                            {product.logo_url ? (
                              <Box
                                component="img"
                                src={product.logo_url}
                                alt={product.name}
                                sx={{ width: 32, height: 32, borderRadius: 1, objectFit: 'cover' }}
                              />
                            ) : (
                              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: colors.ink }}>
                                {product.name.charAt(0).toUpperCase()}
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                              {product.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                            >
                              /{profile.owner_slug}/{product.slug}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View public changelog">
                            <IconButton
                              size="small"
                              href={`/${profile.owner_slug}/${product.slug}`}
                              target="_blank"
                              sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
                            >
                              <OpenInNewIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Settings">
                            <IconButton
                              size="small"
                              href={`/admin/products/${product.id}/settings`}
                              sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
                            >
                              <SettingsIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Card Body */}
                    <Box sx={{ p: 2.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          minHeight: 40,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.description || "No description yet"}
                      </Typography>

                      {/* Stats chips */}
                      <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
                        <Chip
                          icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                          label={`${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`}
                          size="small"
                          sx={{ bgcolor: `${colors.sky}20`, fontWeight: 500 }}
                        />
                        {publishedCount > 0 && (
                          <Chip
                            label={`${publishedCount} published`}
                            size="small"
                            sx={{ bgcolor: `${colors.mint}30`, color: '#15803d', fontWeight: 500 }}
                          />
                        )}
                      </Stack>

                      {/* CTA Button */}
                      <Button asChild sx={{ width: '100%' }}>
                        <Link href={`/admin/products/${product.id}`}>
                          Manage Entries
                          <ArrowForwardIcon
                            className="product-arrow"
                            sx={{
                              fontSize: 16,
                              ml: 0.5,
                              opacity: 0.7,
                              transition: 'all 0.2s ease',
                            }}
                          />
                        </Link>
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        )}

        {/* Sponsor hint */}
        <Paper
          elevation={0}
          component="a"
          href="https://github.com/sponsors/saschb2b"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: 6,
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'transparent',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: colors.peach,
              bgcolor: `${colors.peach}08`,
              '& .sponsor-heart': {
                transform: 'scale(1.2)',
                color: '#ff6b6b',
              },
            },
          }}
        >
          <FavoriteIcon
            className="sponsor-heart"
            sx={{
              fontSize: 18,
              color: colors.peach,
              transition: 'all 0.2s ease',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Enjoying PatchPigeon? Consider{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              supporting its development
            </Typography>
          </Typography>
          <GitHubIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 0.5 }} />
        </Paper>
      </Container>

      <AdminFooter />
    </Box>
  )
}

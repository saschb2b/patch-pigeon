'use client'

import Image from "next/image"
import Link from "next/link"
import type { Product, Profile } from "@/lib/types"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Box, Container, Stack, Typography, Avatar, Chip, Tooltip, IconButton } from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import RssFeedIcon from "@mui/icons-material/RssFeed"
import CodeIcon from "@mui/icons-material/Code"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface ChangelogHeaderProps {
  product: Product
  profile: Profile
  isDemo?: boolean
  entryCount?: number
}

export function ChangelogHeader({ product, profile, isDemo, entryCount }: ChangelogHeaderProps) {
  const ownerHref = isDemo ? "/demo" : `/${profile.owner_slug}`
  const productHref = isDemo ? `/demo/${product.slug}` : `/${profile.owner_slug}/${product.slug}`
  const apiUrl = isDemo 
    ? `/api/demo/${product.slug}/changelog.json` 
    : `/api/${profile.owner_slug}/${product.slug}/changelog.json`
  const rssUrl = isDemo 
    ? `/api/demo/${product.slug}/changelog.rss` 
    : `/api/${profile.owner_slug}/${product.slug}/changelog.rss`

  return (
    <>
      {/* Navigation Bar */}
      <Box
        component="nav"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <Stack direction="row" spacing={1.5} sx={{
              alignItems: "center"
            }}>
              <Link href={ownerHref} style={{ textDecoration: "none" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    "&:hover": { opacity: 0.7 },
                    transition: "opacity 0.2s"
                  }}>
                  {profile.avatar_url ? (
                    <Avatar
                      src={profile.avatar_url}
                      alt={profile.display_name || profile.owner_slug}
                      sx={{ width: 28, height: 28 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: colors.sky, fontSize: '0.875rem' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: colors.ink }}>
                        {(profile.display_name || profile.owner_slug).charAt(0).toUpperCase()}
                      </Typography>
                    </Avatar>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      display: { xs: "none", sm: "inline" },
                    }}
                  >
                    {profile.display_name || profile.owner_slug}
                  </Typography>
                </Stack>
              </Link>

              <ChevronRightIcon sx={{ fontSize: 16, color: "text.disabled" }} />

              <Link href={productHref} style={{ textDecoration: "none" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    "&:hover": { opacity: 0.7 },
                    transition: "opacity 0.2s"
                  }}>
                  {product.logo_url ? (
                    <Image
                      src={product.logo_url}
                      alt={`${product.name} logo`}
                      width={28}
                      height={28}
                      style={{ borderRadius: 6 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1.5,
                        background: `linear-gradient(135deg, ${colors.sky}, ${colors.mint})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: '0.875rem' }}>
                        {product.name.charAt(0)}
                      </Typography>
                    </Box>
                  )}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: "text.primary",
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {product.name}
                  </Typography>
                </Stack>
              </Link>
            </Stack>

            <Stack direction="row" spacing={0.5} sx={{
              alignItems: "center"
            }}>
              {/* API/RSS buttons - hidden on very small screens */}
              <Tooltip title="RSS Feed">
                <IconButton
                  component="a"
                  href={rssUrl}
                  target="_blank"
                  size="small"
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    color: "text.secondary",
                    "&:hover": { color: colors.ink, bgcolor: `${colors.butter}40` }
                  }}
                >
                  <RssFeedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="JSON API">
                <IconButton
                  component="a"
                  href={apiUrl}
                  target="_blank"
                  size="small"
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    color: "text.secondary",
                    "&:hover": { color: colors.ink, bgcolor: `${colors.mint}40` }
                  }}
                >
                  <CodeIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              <Box sx={{ width: '1px', height: 20, bgcolor: 'divider', mx: 0.5, display: { xs: 'none', sm: 'block' } }} />

              <Link href="/" style={{ textDecoration: "none" }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    alignItems: "center",
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                    transition: "color 0.2s"
                  }}>
                  <PigeonLogo size="sm" sx={{ width: 18, height: 18 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ fontWeight: 500, display: { xs: "none", sm: "inline" } }}
                  >
                    PatchPigeon
                  </Typography>
                </Stack>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
      {/* Hero Section */}
      <Box
        component="header"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: 1,
          borderColor: 'divider',
          background: `
            radial-gradient(ellipse 80% 60% at 50% 120%, ${colors.sky}25, transparent),
            radial-gradient(ellipse 50% 40% at 90% 20%, ${colors.peach}15, transparent),
            linear-gradient(180deg, #f8fafc 0%, white 100%)
          `,
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-5%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.mint}30, ${colors.sky}20)`,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '10%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.peach}25, ${colors.butter}20)`,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, position: 'relative' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 3 }}
            sx={{
              alignItems: { md: 'center' },
              justifyContent: "space-between"
            }}>
            <Stack direction="row" spacing={{ xs: 2, md: 3 }} sx={{
              alignItems: "flex-start"
            }}>
              {/* Product Logo */}
              {product.logo_url ? (
                <Image
                  src={product.logo_url}
                  alt={`${product.name} logo`}
                  width={72}
                  height={72}
                  style={{ borderRadius: 16, flexShrink: 0 }}
                />
              ) : (
                <Box
                  sx={{
                    width: { xs: 56, md: 72 },
                    height: { xs: 56, md: 72 },
                    borderRadius: { xs: 3, md: 4 },
                    background: `linear-gradient(135deg, ${colors.sky}, ${colors.mint})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: '0 8px 24px -8px rgba(167, 216, 255, 0.5)',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: colors.ink, fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
                    {product.name.charAt(0)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 0.5, sm: 1.5 }}
                  sx={{
                    alignItems: { sm: 'center' },
                    mb: 1
                  }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800, 
                      color: "text.primary",
                      fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Chip
                    icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
                    label="Changelog"
                    size="small"
                    sx={{
                      bgcolor: `${colors.sky}30`,
                      color: colors.ink,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                      '& .MuiChip-icon': { color: colors.ink },
                    }}
                  />
                </Stack>
                {product.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      maxWidth: 500,
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      display: { xs: '-webkit-box', md: 'block' },
                      WebkitLineClamp: { xs: 2, md: 'unset' },
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                    {product.description}
                  </Typography>
                )}
              </Box>
            </Stack>

            {/* Stats */}
            {entryCount !== undefined && entryCount > 0 && (
              <Stack 
                direction="row" 
                spacing={3}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "text.primary"
                    }}>
                    {entryCount}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500
                    }}>
                    Release{entryCount !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

import Image from "next/image"
import Link from "next/link"
import type { Product, Profile } from "@/lib/types"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Box, Container, Stack, Typography, Avatar } from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

interface ChangelogHeaderProps {
  product: Product
  profile: Profile
  isDemo?: boolean
}

export function ChangelogHeader({ product, profile, isDemo }: ChangelogHeaderProps) {
  const ownerHref = isDemo ? "/demo" : `/${profile.owner_slug}`
  const productHref = isDemo ? `/demo/${product.slug}` : `/${profile.owner_slug}/${product.slug}`

  return (
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
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Link href={ownerHref} style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ "&:hover": { opacity: 0.8 }, transition: "opacity 0.2s" }}
              >
                {profile.avatar_url ? (
                  <Avatar
                    src={profile.avatar_url}
                    alt={profile.display_name || profile.owner_slug}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(167, 216, 255, 0.3)" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
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

            {/* Product info */}
            <Link href={productHref} style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ "&:hover": { opacity: 0.8 }, transition: "opacity 0.2s" }}
              >
                {product.logo_url ? (
                  <Image
                    src={product.logo_url}
                    alt={`${product.name} logo`}
                    width={36}
                    height={36}
                    style={{ borderRadius: 8 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: "rgba(167, 216, 255, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
                      {product.name.charAt(0)}
                    </Typography>
                  </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {product.name}
                </Typography>
              </Stack>
            </Link>
          </Stack>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ color: "text.secondary", "&:hover": { color: "text.primary" }, transition: "color 0.2s" }}
            >
              <Typography variant="caption" sx={{ display: { xs: "none", sm: "inline" } }}>
                Powered by
              </Typography>
              <PigeonLogo size="sm" sx={{ width: 20, height: 20 }} />
              <Typography variant="caption" sx={{ fontWeight: 500, display: { xs: "none", sm: "inline" } }}>
                PatchPigeon
              </Typography>
            </Stack>
          </Link>
        </Stack>
      </Container>
    </Box>
  )
}

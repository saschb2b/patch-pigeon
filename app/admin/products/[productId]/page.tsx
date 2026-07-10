import { notFound } from "next/navigation"
import Link from "next/link"
import { Box, Container, Typography, Stack, Paper, Chip, IconButton, Tooltip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import SettingsIcon from "@mui/icons-material/Settings"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import DescriptionIcon from "@mui/icons-material/Description"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import { requireUserAndProfile } from "@/lib/auth-helpers"
import { getOwnedProductWithEntries } from "@/lib/data/admin"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"
import { DeleteEntryButton } from "@/components/admin/delete-entry-button"
import { TogglePublishButton } from "@/components/admin/toggle-publish-button"
import { formatDateOnly } from "@/lib/date"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

interface PageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductEntriesPage({ params }: PageProps) {
  const { productId } = await params

  const { user, profile } = await requireUserAndProfile()
  const product = await getOwnedProductWithEntries(user.id, productId)

  if (!product) {
    notFound()
  }

  const entries = product.entries
  const publicUrl = `/${profile.owner_slug}/${product.slug}`

  // Stats
  const totalEntries = entries.length
  const publishedCount = entries.filter((entry) => entry.published).length
  const draftCount = totalEntries - publishedCount

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <AdminHeader user={user} />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 }, flex: 1 }}>
        {/* Back link */}
        <Link href="/admin" style={{ textDecoration: "none" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
              transition: "color 0.2s",
              mb: 3,
              width: 'fit-content'
            }}>
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">Back to products</Typography>
          </Stack>
        </Link>

        {/* Product Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${colors.sky}15 0%, ${colors.mint}10 100%)`,
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
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.mint}30 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}>
            <Stack direction="row" spacing={2.5} sx={{
              alignItems: "center"
            }}>
              {/* Product Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'white',
                  border: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  flexShrink: 0,
                }}
              >
                {product.logo_url ? (
                  <Box
                    component="img"
                    src={product.logo_url}
                    alt={product.name}
                    sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover' }}
                  />
                ) : (
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: colors.ink }}>
                    {product.name.charAt(0).toUpperCase()}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {product.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    mt: 0.5
                  }}>
                  <Link href={publicUrl} target="_blank" style={{ textDecoration: "none" }}>
                    <Chip
                      label={publicUrl}
                      size="small"
                      icon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        bgcolor: 'white',
                        border: 1,
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': { borderColor: colors.sky },
                      }}
                    />
                  </Link>
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Tooltip title="Product settings">
                <IconButton
                  href={`/admin/products/${productId}/settings`}
                  sx={{
                    bgcolor: 'white',
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'white', borderColor: colors.ink },
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Button asChild size="lg">
                <Link href={`/admin/products/${productId}/create-entry`}>
                  <AddIcon sx={{ fontSize: 20, mr: 0.5 }} />
                  New Entry
                </Link>
              </Button>
            </Stack>
          </Stack>

          {/* Stats Row */}
          {totalEntries > 0 && (
            <Stack
              direction="row"
              spacing={{ xs: 3, sm: 5 }}
              sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary"
                  }}>
                  {totalEntries}
                </Typography>
                <Typography variant="caption" sx={{
                  color: "text.secondary"
                }}>
                  Total {totalEntries === 1 ? 'Entry' : 'Entries'}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#15803d'
                  }}>
                  {publishedCount}
                </Typography>
                <Typography variant="caption" sx={{
                  color: "text.secondary"
                }}>
                  Published
                </Typography>
              </Box>
              {draftCount > 0 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: colors.butter
                    }}>
                    {draftCount}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: "text.secondary"
                  }}>
                    {draftCount === 1 ? 'Draft' : 'Drafts'}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Paper>

        {/* Entries Section */}
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary"
            }}>
            Changelog Entries
          </Typography>
        </Stack>

        {!entries || entries.length === 0 ? (
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
                bgcolor: `${colors.mint}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 40, color: colors.ink, opacity: 0.5 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1
              }}>
              No entries yet
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                mb: 3,
                maxWidth: 320,
                mx: 'auto'
              }}>
              Create your first changelog entry to start keeping your users informed.
            </Typography>
            <Button asChild size="lg">
              <Link href={`/admin/products/${productId}/create-entry`}>
                <RocketLaunchIcon sx={{ fontSize: 18, mr: 1 }} />
                Create First Entry
              </Link>
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {entries.map((entry, index) => {
              const itemCount = entry.entry_items.length
              const isLatest = index === 0 && entry.published

              return (
                <Paper
                  key={entry.id}
                  elevation={0}
                  sx={{
                    p: 0,
                    borderRadius: 3,
                    border: 1,
                    borderColor: entry.published ? 'divider' : `${colors.butter}80`,
                    bgcolor: entry.published ? 'background.paper' : `${colors.butter}08`,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: entry.published ? colors.sky : colors.butter,
                      boxShadow: `0 4px 12px -4px ${entry.published ? colors.sky : colors.butter}40`,
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      p: 2.5
                    }}>
                    {/* Left side - Entry info */}
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "flex-start",
                        flex: 1,
                        minWidth: 0
                      }}>
                      {/* Status indicator */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: entry.published ? `${colors.mint}30` : `${colors.butter}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {entry.published ? (
                          <CheckCircleIcon sx={{ fontSize: 20, color: '#15803d' }} />
                        ) : (
                          <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: '#ca8a04' }} />
                        )}
                      </Box>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        {/* Meta row */}
                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          sx={{
                            alignItems: "center",
                            flexWrap: "wrap",
                            mb: 0.5
                          }}>
                          {entry.version && (
                            <Chip
                              label={`v${entry.version}`}
                              size="small"
                              sx={{
                                height: 22,
                                fontFamily: 'monospace',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                bgcolor: `${colors.sky}30`,
                                color: colors.ink,
                              }}
                            />
                          )}
                          {entry.publish_date && (
                            <Stack direction="row" spacing={0.5} sx={{
                              alignItems: "center"
                            }}>
                              <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{
                                color: "text.secondary"
                              }}>
                                {formatDateOnly(entry.publish_date, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Typography>
                            </Stack>
                          )}
                          {isLatest && (
                            <Chip
                              label="Latest"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: colors.ink,
                                color: 'white',
                              }}
                            />
                          )}
                          {!entry.published && (
                            <Chip
                              label="Draft"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                bgcolor: `${colors.butter}50`,
                                color: '#92400e',
                              }}
                            />
                          )}
                        </Stack>

                        {/* Title */}
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.title}
                        </Typography>

                        {/* Item count */}
                        {itemCount > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              mt: 0.5,
                              display: 'block'
                            }}>
                            {itemCount} {itemCount === 1 ? 'change' : 'changes'}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    {/* Right side - Actions */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "center",
                        flexShrink: 0
                      }}>
                      <TogglePublishButton entry={entry} />
                      <Tooltip title="Edit entry">
                        <IconButton
                          size="small"
                          href={`/admin/products/${productId}/entries/${entry.id}/edit`}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': { borderColor: colors.ink },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <DeleteEntryButton entryId={entry.id} entryTitle={entry.title} />
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Container>
      <AdminFooter />
    </Box>
  );
}

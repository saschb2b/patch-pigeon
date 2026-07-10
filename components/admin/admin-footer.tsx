import { Box, Container, Typography, Stack } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import GitHubIcon from "@mui/icons-material/GitHub"

// Brand colors
const colors = {
  peach: '#ffb8a1',
}

export function AdminFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <Box
            component="a"
            href="https://www.saschb2b.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: 'none',
              '&:hover .author-name': { color: colors.peach },
            }}
          >
            <Stack direction="row" spacing={0.75} sx={{
              alignItems: "center"
            }}>
              <FavoriteIcon sx={{ fontSize: 14, color: colors.peach }} />
              <Typography variant="caption" sx={{
                color: "text.secondary"
              }}>
                Made with love by{' '}
                <Typography
                  component="span"
                  variant="caption"
                  className="author-name"
                  sx={{ fontWeight: 600, color: 'text.primary', transition: 'color 0.2s' }}
                >
                  Sascha
                </Typography>
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} sx={{
            alignItems: "center"
          }}>
            <Box
              component="a"
              href="https://github.com/saschb2b/patch-pigeon"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  '&:hover': { color: 'text.primary' }
                }}>
                Source Code
              </Typography>
            </Box>

            <Box
              component="a"
              href="https://www.saschb2b.com/impressum"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  '&:hover': { color: 'text.primary' }
                }}>
                Impressum
              </Typography>
            </Box>

            <Box
              component="a"
              href="https://github.com/saschb2b"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <GitHubIcon sx={{ fontSize: 16 }} />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

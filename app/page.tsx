'use client'

import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import { Button } from "@/components/ui/button"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PublicIcon from "@mui/icons-material/Public"
import CodeIcon from "@mui/icons-material/Code"
import BoltIcon from "@mui/icons-material/Bolt"
import CheckIcon from "@mui/icons-material/Check"
import FavoriteIcon from "@mui/icons-material/Favorite"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 2 }}
          >
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PigeonLogo size="sm" />
              <Typography variant="h6" fontWeight={700} color="text.primary">
                PatchPigeon
              </Typography>
            </Link>
            <Stack direction="row" spacing={1.5}>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Get started free</Link>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <Chip
              icon={<AutoAwesomeIcon sx={{ color: colors.peach }} />}
              label="Built for indie devs who ship fast"
              sx={{
                bgcolor: `${colors.sky}20`,
                border: `1px solid ${colors.sky}40`,
                color: 'text.primary',
                fontWeight: 500,
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
              }}
            >
              Your users deserve to know{' '}
              <Box component="span" sx={{ color: colors.peach }}>
                what&apos;s new
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, fontWeight: 400, lineHeight: 1.6 }}
            >
              Stop burying updates in Discord or Twitter. Give your product a beautiful,
              public changelog that keeps users excited and informed.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              <Button asChild size="lg" endIcon={<ArrowForwardIcon />}>
                <Link href="/auth/sign-up">Create your changelog</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/demo">See a live example</Link>
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Free to start. No credit card required.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Pain Point Section */}
      <Box component="section" sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Sound familiar?
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="center"
          >
            {[
              {
                emoji: "😅",
                title: '"Where did I post that update?"',
                desc: "Twitter, Discord, email... your updates are scattered everywhere. Users miss the good stuff.",
              },
              {
                emoji: "🙈",
                title: '"I shipped 20 features last month"',
                desc: "But nobody knows. You're too busy building to write fancy release notes.",
              },
              {
                emoji: "😤",
                title: '"Is this app even maintained?"',
                desc: "Without visible updates, users assume the worst. Trust erodes silently.",
              },
            ].map((pain, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 3,
                  flex: 1,
                  maxWidth: 360,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h2" sx={{ mb: 2 }}>{pain.emoji}</Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {pain.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pain.desc}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Solution Section */}
      <Box component="section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 8 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: `${colors.mint}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PigeonLogo size="md" />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              PatchPigeon delivers your changelog
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              A beautiful home for all your updates. Takes 2 minutes to set up.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={6}
            alignItems="center"
          >
            {/* Feature List */}
            <Stack spacing={4} sx={{ flex: 1 }}>
              {[
                {
                  icon: <AccessTimeIcon />,
                  title: "Ship updates in seconds",
                  desc: "Structured editor with live preview. Write once, publish instantly.",
                  color: colors.sky,
                },
                {
                  icon: <PublicIcon />,
                  title: "One public link, infinite reach",
                  desc: "Share your changelog URL anywhere. No sign-up required for readers.",
                  color: colors.peach,
                },
                {
                  icon: <CodeIcon />,
                  title: "Simple REST API",
                  desc: "Fetch your changelog as JSON or RSS. Build custom integrations.",
                  color: colors.mint,
                },
                {
                  icon: <BoltIcon />,
                  title: "Zero maintenance",
                  desc: "We handle hosting, performance, and uptime. You just write.",
                  color: colors.butter,
                },
              ].map((feature, i) => (
                <Stack key={i} direction="row" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${feature.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.ink,
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>

            {/* Preview Card */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                maxWidth: 480,
                overflow: 'hidden',
                borderRadius: 3,
              }}
            >
              {/* Browser Chrome */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: '#f1f5f9',
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Stack direction="row" spacing={0.75}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f87171' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#fbbf24' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4ade80' }} />
                </Stack>
                <Box
                  sx={{
                    flex: 1,
                    mx: 2,
                    px: 2,
                    py: 0.75,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                  }}
                >
                  patchpigeon.com/acme/app
                </Box>
              </Box>

              {/* Preview Content */}
              <Box sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: `${colors.sky}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ color: colors.ink }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>Acme App</Typography>
                    <Typography variant="caption" color="text.secondary">Changelog</Typography>
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  {[
                    { type: "Feature", title: "Dark mode is here!", date: "Jan 6, 2025", color: colors.mint },
                    { type: "Fix", title: "Fixed login issues on Safari", date: "Jan 4, 2025", color: colors.butter },
                    { type: "Improvement", title: "Faster dashboard loading", date: "Jan 2, 2025", color: colors.sky },
                  ].map((entry, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      spacing={1.5}
                      sx={{
                        pb: 2,
                        borderBottom: i < 2 ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <Chip
                        label={entry.type}
                        size="small"
                        sx={{
                          bgcolor: entry.color,
                          color: colors.ink,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {entry.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {entry.date}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* How It Works */}
      <Box component="section" sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Up and running in 3 steps
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="center"
          >
            {[
              { step: "1", title: "Create your product", desc: "Name it, describe it, get your unique changelog URL.", color: colors.sky },
              { step: "2", title: "Write your first entry", desc: "Use our structured editor with live preview. Publish when ready.", color: colors.peach },
              { step: "3", title: "Share the link", desc: "Add it to your app, website, or social bio. Done!", color: colors.mint },
            ].map((item, i) => (
              <Stack key={i} alignItems="center" textAlign="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: item.color,
                    color: colors.ink,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    mb: 2,
                  }}
                >
                  {item.step}
                </Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Why Section */}
      <Box component="section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={6}
            alignItems="center"
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                Why a dedicated changelog?
              </Typography>
              <Stack spacing={2}>
                {[
                  "Shows users your product is actively maintained",
                  "Builds trust and transparency with your audience",
                  "Gives you a link to share on every platform",
                  "Makes your hard work visible to the world",
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: `${colors.mint}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.25,
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 14, color: colors.ink }} />
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                maxWidth: 400,
                p: 4,
                bgcolor: '#f8fafc',
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', mb: 3 }}
              >
                &ldquo;Finally, a changelog tool that doesn&apos;t feel like a chore.
                My users actually read my updates now!&rdquo;
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: colors.sky,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: colors.ink,
                  }}
                >
                  S
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>Sarah Chen</Typography>
                  <Typography variant="caption" color="text.secondary">Indie Developer</Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        component="section"
        sx={{
          py: 10,
          bgcolor: colors.ink,
          color: 'white',
        }}
      >
        <Container maxWidth="sm">
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <PigeonLogo size="lg" />
            <Typography variant="h3" fontWeight={700}>
              Your changelog, delivered.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Join indie developers who keep their users in the loop.
            </Typography>
            <Button
              asChild
              size="lg"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: colors.peach,
                color: colors.ink,
                '&:hover': { bgcolor: '#ffa78a' },
              }}
            >
              <Link href="/auth/sign-up">Start for free</Link>
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <FavoriteIcon sx={{ fontSize: 16, color: colors.peach }} />
              <Typography variant="body2" color="text.secondary">
                Made with love for indie devs
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PigeonLogo size="sm" />
              <Typography variant="body2" fontWeight={500}>
                PatchPigeon
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

'use client'

// Note: Metadata is defined in layout.tsx for this page since it's a client component

import Link from "next/link"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Fade from "@mui/material/Fade"
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
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import GroupsIcon from "@mui/icons-material/Groups"
import RssFeedIcon from "@mui/icons-material/RssFeed"
import GitHubIcon from "@mui/icons-material/GitHub"
import XIcon from "@mui/icons-material/X"

// Brand colors
const colors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
}

// Animated changelog entries for the hero preview
const demoEntries = [
  { type: "Feature", title: "Dark mode is here!", color: colors.mint, icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} /> },
  { type: "Fix", title: "Fixed login issues on Safari", color: colors.peach, icon: <BoltIcon sx={{ fontSize: 14 }} /> },
  { type: "Improvement", title: "50% faster dashboard loading", color: colors.sky, icon: <TrendingUpIcon sx={{ fontSize: 14 }} /> },
]

export default function HomePage() {
  const [visibleEntries, setVisibleEntries] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  // Animate entries appearing one by one
  useEffect(() => {
    if (visibleEntries < demoEntries.length) {
      const timer = setTimeout(() => {
        setVisibleEntries(v => v + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [visibleEntries])

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
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
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
      <Box
        component="section"
        sx={{
          position: 'relative',
          py: { xs: 10, md: 16 },
          overflow: 'hidden',
          // Gradient background
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${colors.sky}30, transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, ${colors.peach}20, transparent),
            radial-gradient(ellipse 50% 30% at 20% 80%, ${colors.mint}20, transparent)
          `,
        }}
      >
        {/* Floating decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.sky}40, ${colors.mint}20)`,
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.peach}40, ${colors.butter}30)`,
            filter: 'blur(30px)',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left: Copy */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack spacing={3}>
                <Chip
                  icon={<RocketLaunchIcon sx={{ fontSize: 16, color: colors.ink }} />}
                  label="Built for indie devs who ship fast"
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: 'white',
                    border: `1px solid ${colors.sky}60`,
                    color: 'text.primary',
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    '& .MuiChip-icon': { color: colors.ink },
                  }}
                />

                <Typography
                  variant="h1"
                  component="h1"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: '2.75rem', md: '3.75rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Your users deserve to know{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(135deg, ${colors.peach}, #ff8a65)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    what&apos;s new
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 500, fontWeight: 400, lineHeight: 1.7, fontSize: '1.125rem' }}
                >
                  Stop burying updates in Discord or Twitter. Give your product a beautiful,
                  public changelog that keeps users excited and informed.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ pt: 1 }}
                >
                  <Button asChild size="lg" endIcon={<ArrowForwardIcon />}>
                    <Link href="/auth/sign-up">Create your changelog</Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/demo">See a live example</Link>
                  </Button>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckIcon sx={{ fontSize: 18, color: colors.ink }} />
                    <Typography variant="body2" color="text.secondary">Free forever</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckIcon sx={{ fontSize: 18, color: colors.ink }} />
                    <Typography variant="body2" color="text.secondary">No credit card</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckIcon sx={{ fontSize: 18, color: colors.ink }} />
                    <Typography variant="body2" color="text.secondary">Setup in 2 min</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* Right: Animated Preview */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
                  transform: { lg: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' },
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: { lg: 'perspective(1000px) rotateY(-2deg) rotateX(1deg)' },
                  },
                }}
              >
                {/* Browser Chrome */}
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: '#f8fafc',
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
                      bgcolor: 'white',
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                      fontFamily: 'monospace',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4ade80' }} />
                    patchpigeon.com/acme/app
                  </Box>
                </Box>

                {/* Preview Content */}
                <Box sx={{ p: 3, bgcolor: 'white' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        background: `linear-gradient(135deg, ${colors.sky}, ${colors.mint})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RocketLaunchIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>Acme App</Typography>
                      <Typography variant="caption" color="text.secondary">Changelog</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }} />
                    <Chip
                      label="January 2025"
                      size="small"
                      sx={{ bgcolor: '#f1f5f9', fontWeight: 500 }}
                    />
                  </Stack>

                  <Stack spacing={2}>
                    {demoEntries.map((entry, i) => (
                      <Fade in={i < visibleEntries} timeout={500} key={i}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                          sx={{
                            pb: 2,
                            borderBottom: i < demoEntries.length - 1 ? 1 : 0,
                            borderColor: 'divider',
                            opacity: i < visibleEntries ? 1 : 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1.5,
                              bgcolor: entry.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {entry.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                label={entry.type}
                                size="small"
                                sx={{
                                  bgcolor: `${entry.color}40`,
                                  color: colors.ink,
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  height: 22,
                                }}
                              />
                            </Stack>
                            <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                              {entry.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Jan {6 - i * 2}, 2025
                            </Typography>
                          </Box>
                        </Stack>
                      </Fade>
                    ))}
                  </Stack>

                  {/* Typing indicator */}
                  {isTyping && (
                    <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: colors.sky,
                            animation: 'pulse 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 0.4, transform: 'scale(0.8)' },
                              '50%': { opacity: 1, transform: 'scale(1)' },
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box component="section" sx={{ py: 8, bgcolor: '#f8fafc', borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="center"
            divider={
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  width: '1px',
                  bgcolor: 'divider',
                }}
              />
            }
          >
            {[
              { value: "2 min", label: "Setup time", icon: <AccessTimeIcon /> },
              { value: "100%", label: "Free forever", icon: <FavoriteIcon /> },
              { value: "REST + RSS", label: "API included", icon: <RssFeedIcon /> },
            ].map((stat, i) => (
              <Stack key={i} alignItems="center" spacing={1} sx={{ flex: 1, py: { xs: 2, md: 0 } }}>
                <Box sx={{ color: colors.ink, opacity: 0.6 }}>{stat.icon}</Box>
                <Typography variant="h3" fontWeight={800} color="text.primary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {stat.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Pain Point Section */}
      <Box component="section" sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{ maxWidth: 600 }}
            >
              Sound familiar?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
              You&apos;re shipping fast, but nobody knows. Your updates are buried across platforms.
            </Typography>
          </Stack>

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
                color: colors.sky,
              },
              {
                emoji: "🙈",
                title: '"I shipped 20 features last month"',
                desc: "But nobody knows. You're too busy building to write fancy release notes.",
                color: colors.peach,
              },
              {
                emoji: "😤",
                title: '"Is this app even maintained?"',
                desc: "Without visible updates, users assume the worst. Trust erodes silently.",
                color: colors.mint,
              },
            ].map((pain, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 4,
                  flex: 1,
                  maxWidth: 360,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: pain.color,
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px -8px ${pain.color}40`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: pain.color,
                  },
                }}
              >
                <Typography variant="h2" sx={{ mb: 2, fontSize: '3rem' }}>{pain.emoji}</Typography>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  {pain.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {pain.desc}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Solution Section */}
      <Box
        component="section"
        sx={{
          py: 12,
          background: `linear-gradient(180deg, #f8fafc 0%, white 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 8 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${colors.sky}40, ${colors.mint}40)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <PigeonLogo size="lg" />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              PatchPigeon delivers your changelog
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 500 }}>
              A beautiful home for all your updates. Takes 2 minutes to set up.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {[
              {
                icon: <AccessTimeIcon sx={{ fontSize: 28 }} />,
                title: "Ship updates in seconds",
                desc: "Structured editor with live preview. Write once, publish instantly. Keyboard shortcuts for power users.",
                color: colors.sky,
              },
              {
                icon: <PublicIcon sx={{ fontSize: 28 }} />,
                title: "One public link, infinite reach",
                desc: "Share your changelog URL anywhere. No sign-up required for readers. Works great on mobile.",
                color: colors.peach,
              },
              {
                icon: <CodeIcon sx={{ fontSize: 28 }} />,
                title: "Simple REST API",
                desc: "Fetch your changelog as JSON or RSS. Build custom integrations, widgets, or embed in your app.",
                color: colors.mint,
              },
              {
                icon: <BoltIcon sx={{ fontSize: 28 }} />,
                title: "Zero maintenance",
                desc: "We handle hosting, performance, and uptime. You just write. Focus on building, not ops.",
                color: colors.butter,
              },
            ].map((feature, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: feature.color,
                      bgcolor: `${feature.color}08`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
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
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box component="section" sx={{ py: 12 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 8 }}
          >
            Up and running in 3 steps
          </Typography>

          <Stack spacing={0}>
            {[
              { step: "1", title: "Create your product", desc: "Name it, describe it, get your unique changelog URL instantly.", color: colors.sky },
              { step: "2", title: "Write your first entry", desc: "Use our structured editor with live preview. Add features, fixes, improvements.", color: colors.peach },
              { step: "3", title: "Share the link", desc: "Add it to your app, website, or social bio. Your users stay informed forever.", color: colors.mint },
            ].map((item, i) => (
              <Stack
                key={i}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ sm: 'center' }}
                sx={{
                  py: 4,
                  borderBottom: i < 2 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    bgcolor: item.color,
                    color: colors.ink,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Social Proof Section */}
      <Box component="section" sx={{ py: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={6}
            alignItems="center"
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
                Why a dedicated changelog?
              </Typography>
              <Stack spacing={2.5}>
                {[
                  "Shows users your product is actively maintained",
                  "Builds trust and transparency with your audience",
                  "Gives you a link to share on every platform",
                  "Makes your hard work visible to the world",
                  "Helps with SEO and discoverability",
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: `${colors.mint}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 16, color: colors.ink }} />
                    </Box>
                    <Typography variant="body1">
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Stack spacing={3} sx={{ flex: 1, maxWidth: 480 }}>
              {[
                {
                  quote: "Finally, a changelog tool that doesn't feel like a chore. My users actually read my updates now!",
                  name: "Sarah Chen",
                  role: "Indie Developer",
                  color: colors.sky,
                },
                {
                  quote: "Set it up in 5 minutes, shipped my first changelog the same day. The live preview is a game changer.",
                  name: "Marcus Rodriguez",
                  role: "Founder, DevTools Co",
                  color: colors.peach,
                },
              ].map((testimonial, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'white',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 4,
                      height: '100%',
                      bgcolor: testimonial.color,
                      borderRadius: '4px 0 0 4px',
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: 'italic', mb: 2, lineHeight: 1.7 }}
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: testimonial.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        color: colors.ink,
                      }}
                    >
                      {testimonial.name[0]}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{testimonial.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{testimonial.role}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        component="section"
        sx={{
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: colors.ink,
          color: 'white',
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '140%',
            height: '200%',
            background: `radial-gradient(ellipse at center, ${colors.sky}15 0%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
        
        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Stack alignItems="center" textAlign="center" spacing={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PigeonLogo size="lg" />
            </Box>
            <Typography variant="h2" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
              Your changelog, delivered.
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400 }}>
              Join indie developers who keep their users in the loop.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                asChild
                size="lg"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: colors.peach,
                  color: colors.ink,
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#ffa78a' },
                }}
              >
                <Link href="/auth/sign-up">Start for free</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Link href="/demo">View demo</Link>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: '#f8fafc',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'flex-start' }}
            spacing={4}
          >
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PigeonLogo size="sm" />
                <Typography variant="h6" fontWeight={700}>
                  PatchPigeon
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
                Beautiful changelogs for indie developers and small teams.
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <FavoriteIcon sx={{ fontSize: 14, color: colors.peach }} />
                <Typography variant="caption" color="text.secondary">
                  Made with love for indie devs
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={6}>
              <Stack spacing={1.5}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Product
                </Typography>
                <Link href="/demo" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'text.primary' } }}>
                    Demo
                  </Typography>
                </Link>
                <Link href="/auth/sign-up" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'text.primary' } }}>
                    Get Started
                  </Typography>
                </Link>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Connect
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Box
                    component="a"
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'divider', color: 'text.primary' },
                    }}
                  >
                    <GitHubIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box
                    component="a"
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'divider', color: 'text.primary' },
                    }}
                  >
                    <XIcon sx={{ fontSize: 18 }} />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              &copy; {new Date().getFullYear()} PatchPigeon. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

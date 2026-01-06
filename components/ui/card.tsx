'use client'

import * as React from 'react'
import MuiCard from '@mui/material/Card'
import MuiCardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface CardProps extends React.ComponentProps<typeof MuiCard> {}

function Card({ children, sx, ...props }: CardProps) {
  return (
    <MuiCard sx={sx} {...props}>
      {children}
    </MuiCard>
  )
}

interface CardHeaderProps {
  children?: React.ReactNode
  sx?: React.ComponentProps<typeof Box>['sx']
}

function CardHeader({ children, sx, ...props }: CardHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        p: 3,
        pb: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

interface CardTitleProps {
  children?: React.ReactNode
  sx?: React.ComponentProps<typeof Typography>['sx']
}

function CardTitle({ children, sx, ...props }: CardTitleProps) {
  return (
    <Typography
      variant="h6"
      component="h3"
      sx={{ fontWeight: 600, lineHeight: 1.2, ...sx }}
      {...props}
    >
      {children}
    </Typography>
  )
}

interface CardDescriptionProps {
  children?: React.ReactNode
  sx?: React.ComponentProps<typeof Typography>['sx']
}

function CardDescription({ children, sx, ...props }: CardDescriptionProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={sx}
      {...props}
    >
      {children}
    </Typography>
  )
}

interface CardActionProps {
  children?: React.ReactNode
  sx?: React.ComponentProps<typeof Box>['sx']
}

function CardAction({ children, sx, ...props }: CardActionProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

interface CardContentProps extends React.ComponentProps<typeof MuiCardContent> {}

function CardContent({ children, sx, ...props }: CardContentProps) {
  return (
    <MuiCardContent
      sx={{ p: 3, '&:last-child': { pb: 3 }, ...sx }}
      {...props}
    >
      {children}
    </MuiCardContent>
  )
}

interface CardFooterProps {
  children?: React.ReactNode
  sx?: React.ComponentProps<typeof Box>['sx']
}

function CardFooter({ children, sx, ...props }: CardFooterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        pt: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

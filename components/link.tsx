'use client'

import NextLink from 'next/link'
import type { LinkProps } from 'next/link'
import { forwardRef } from 'react'

// Wrapper component for Next.js Link to work with MUI components in Next.js 16
// See: https://mui.com/material-ui/integrations/nextjs/#next-js-v16-client-component-restriction
const Link = forwardRef<HTMLAnchorElement, LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function Link(props, ref) {
    return <NextLink ref={ref} {...props} />
  }
)

export default Link

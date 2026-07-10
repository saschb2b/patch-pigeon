'use client'

import * as React from 'react'
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  asChild?: boolean
}

function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  startIcon,
  endIcon,
  sx,
  ...props
}: ButtonProps) {
  const getMuiVariant = (): MuiButtonProps['variant'] => {
    switch (variant) {
      case 'default':
      case 'destructive':
      case 'secondary':
        return 'contained'
      case 'outline':
        return 'outlined'
      case 'ghost':
      case 'link':
        return 'text'
      default:
        return 'contained'
    }
  }

  const getMuiColor = (): MuiButtonProps['color'] => {
    switch (variant) {
      case 'destructive':
        return 'error'
      case 'secondary':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  const getMuiSize = (): MuiButtonProps['size'] => {
    switch (size) {
      case 'sm':
      case 'icon-sm':
        return 'small'
      case 'lg':
      case 'icon-lg':
        return 'large'
      default:
        return 'medium'
    }
  }

  // Handle icon-only buttons
  if (size === 'icon' || size === 'icon-sm' || size === 'icon-lg') {
    const iconSize = size === 'icon-sm' ? 32 : size === 'icon-lg' ? 44 : 40
    return (
      <IconButton
        color={getMuiColor()}
        size={getMuiSize()}
        sx={{
          width: iconSize,
          height: iconSize,
          ...(variant === 'outline' && {
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'divider',
            },
          }),
          ...sx,
        }}
        {...(props as React.ComponentProps<typeof IconButton>)}
      >
        {children}
      </IconButton>
    )
  }

  const child = asChild ? React.Children.only(children) : null
  if (child && React.isValidElement(child)) {
    const childProps = child.props as React.ComponentProps<React.ElementType>
    return (
      <MuiButton
        component={child.type as React.ElementType}
        nativeButton={false}
        {...childProps}
        {...props}
        variant={getMuiVariant()}
        color={getMuiColor()}
        size={getMuiSize()}
        startIcon={startIcon}
        endIcon={endIcon}
        sx={{
          ...(variant === 'link' && {
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'underline',
              backgroundColor: 'transparent',
            },
          }),
          ...sx,
        }}
      >
        {childProps.children}
      </MuiButton>
    )
  }

  return (
    <MuiButton
      variant={getMuiVariant()}
      color={getMuiColor()}
      size={getMuiSize()}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        ...(variant === 'link' && {
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'underline',
            backgroundColor: 'transparent',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  )
}

export { Button }

'use client'

import * as React from 'react'
import FormLabel, { FormLabelProps } from '@mui/material/FormLabel'

export type LabelProps = FormLabelProps

function Label({ sx, children, ...props }: LabelProps) {
  return (
    <FormLabel
      sx={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        mb: 0.5,
        color: 'text.primary',
        ...sx,
      }}
      {...props}
    >
      {children}
    </FormLabel>
  )
}

export { Label }

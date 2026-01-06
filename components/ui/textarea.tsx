'use client'

import * as React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export type TextareaProps = Omit<TextFieldProps, 'variant' | 'multiline'> & {
  rows?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ rows = 3, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        multiline
        rows={rows}
        size="small"
        fullWidth
        variant="outlined"
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }

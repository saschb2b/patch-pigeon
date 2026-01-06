'use client'

import * as React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export type InputProps = Omit<TextFieldProps, 'variant'>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <TextField
        inputRef={ref}
        size="small"
        fullWidth
        variant="outlined"
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

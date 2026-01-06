'use client'

import * as React from 'react'
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch'

export interface SwitchProps extends MuiSwitchProps {
  onCheckedChange?: (checked: boolean) => void
}

function Switch({ onCheckedChange, onChange, ...props }: SwitchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange?.(event, checked)
    onCheckedChange?.(checked)
  }

  return (
    <MuiSwitch
      onChange={handleChange}
      {...props}
    />
  )
}

export { Switch }

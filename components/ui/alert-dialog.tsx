'use client'

import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import MuiButton from '@mui/material/Button'
import Box from '@mui/material/Box'

// Context to manage dialog state
const AlertDialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error('AlertDialog components must be used within an AlertDialog')
  }
  return context
}

interface AlertDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function AlertDialog({ children, open: controlledOpen, onOpenChange }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

function AlertDialogTrigger({ children, asChild }: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialogContext()
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(true),
    })
  }
  
  return (
    <span onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  )
}

function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function AlertDialogOverlay() {
  return null
}

interface AlertDialogContentProps {
  children: React.ReactNode
}

function AlertDialogContent({ children }: AlertDialogContentProps) {
  const { open, setOpen } = useAlertDialogContext()
  
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      {children}
    </Dialog>
  )
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
}

function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
  return (
    <Box sx={{ px: 3, pt: 3 }}>
      {children}
    </Box>
  )
}

interface AlertDialogFooterProps {
  children: React.ReactNode
}

function AlertDialogFooter({ children }: AlertDialogFooterProps) {
  return (
    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
      {children}
    </DialogActions>
  )
}

interface AlertDialogTitleProps {
  children: React.ReactNode
}

function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  return (
    <DialogTitle sx={{ p: 0, fontSize: '1.125rem', fontWeight: 600 }}>
      {children}
    </DialogTitle>
  )
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
}

function AlertDialogDescription({ children }: AlertDialogDescriptionProps) {
  return (
    <DialogContentText sx={{ mt: 1, color: 'text.secondary' }}>
      {children}
    </DialogContentText>
  )
}

interface AlertDialogActionProps extends React.ComponentProps<typeof MuiButton> {
  children: React.ReactNode
}

function AlertDialogAction({ children, onClick, ...props }: AlertDialogActionProps) {
  const { setOpen } = useAlertDialogContext()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    setOpen(false)
  }
  
  return (
    <MuiButton
      variant="contained"
      onClick={handleClick}
      {...props}
    >
      {children}
    </MuiButton>
  )
}

interface AlertDialogCancelProps extends React.ComponentProps<typeof MuiButton> {
  children: React.ReactNode
}

function AlertDialogCancel({ children, onClick, ...props }: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialogContext()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    setOpen(false)
  }
  
  return (
    <MuiButton
      variant="outlined"
      onClick={handleClick}
      {...props}
    >
      {children}
    </MuiButton>
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

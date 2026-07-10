'use client'

import { createTheme } from '@mui/material/styles'

// PatchPigeon brand colors
const brandColors = {
  sky: '#a7d8ff',
  peach: '#ffb8a1',
  mint: '#bfebd6',
  butter: '#ffe7a3',
  ink: '#1f2937',
  surface: '#ffffff',
  mutedSurface: '#f8fafc',
}

// Light theme only
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.ink,
      contrastText: '#ffffff',
    },
    secondary: {
      main: brandColors.peach,
      contrastText: brandColors.ink,
    },
    error: {
      main: '#dc2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      contrastText: brandColors.ink,
    },
    info: {
      main: brandColors.sky,
      contrastText: brandColors.ink,
    },
    success: {
      main: '#10b981',
      contrastText: '#ffffff',
    },
    background: {
      default: brandColors.surface,
      paper: brandColors.surface,
    },
    text: {
      primary: brandColors.ink,
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"DM Sans", "DM Sans Fallback", system-ui, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brandColors.surface,
          color: brandColors.ink,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          variants: [
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                backgroundColor: brandColors.ink,
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#374151',
                },
              },
            },
          ],
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: brandColors.ink,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#f8fafc',
            borderColor: '#cbd5e1',
          },
        },
        text: {
          color: brandColors.ink,
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: brandColors.ink,
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          backgroundColor: brandColors.surface,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: brandColors.surface,
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: brandColors.sky,
              borderWidth: 2,
            },
          },
          '& .MuiInputBase-input': {
            color: brandColors.ink,
            '&::placeholder': {
              color: '#94a3b8',
              opacity: 1,
            },
          },
        },
      },
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.surface,
          borderRadius: 8,
          '& fieldset': {
            borderColor: '#e2e8f0',
          },
          '&:hover fieldset': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focused fieldset': {
            borderColor: brandColors.sky,
            borderWidth: 2,
          },
        },
        input: {
          padding: '10px 14px',
          color: brandColors.ink,
          '&::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: brandColors.ink,
          backgroundColor: brandColors.surface,
        },
        input: {
          color: brandColors.ink,
          '&::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.surface,
        },
        select: {
          color: brandColors.ink,
        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: brandColors.ink,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: brandColors.ink,
              opacity: 1,
              border: 0,
            },
          },
        },
        thumb: {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
          backgroundColor: '#ffffff',
        },
        track: {
          borderRadius: 26 / 2,
          backgroundColor: '#e2e8f0',
          opacity: 1,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        sizeSmall: {
          height: 24,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          backgroundColor: brandColors.surface,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: brandColors.surface,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: brandColors.ink,
          '&.Mui-focused': {
            color: brandColors.ink,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: brandColors.ink,
        },
      },
    },
  },
})

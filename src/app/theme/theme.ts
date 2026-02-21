import { createTheme, PaletteMode } from '@mui/material/styles';
import { gruvboxColors } from './gruvbox';
import { pureWhiteColors } from './pure-white';

const { dark: gruvboxDark, accents: gruvboxAccents } = gruvboxColors;
const { light: pureWhite, accents: pureWhiteAccents } = pureWhiteColors;

export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          background: {
            default: gruvboxDark.bg0,
            paper: gruvboxDark.bg1,
          },
          text: {
            primary: gruvboxDark.fg,
            secondary: gruvboxDark.gray,
          },
          primary: {
            main: gruvboxAccents.brightBlue,
            light: gruvboxAccents.brightBlue,
            dark: gruvboxAccents.blue,
            contrastText: gruvboxDark.bg0,
          },
          secondary: {
            main: gruvboxAccents.brightPurple,
            light: gruvboxAccents.brightPurple,
            dark: gruvboxAccents.purple,
            contrastText: gruvboxDark.bg0,
          },
          error: {
            main: gruvboxAccents.brightRed,
          },
          warning: {
            main: gruvboxAccents.brightYellow,
          },
          info: {
            main: gruvboxAccents.brightBlue,
          },
          success: {
            main: gruvboxAccents.brightGreen,
          },
          divider: gruvboxDark.bg2,
          action: {
            hover: gruvboxDark.bg2,
            selected: gruvboxDark.bg3,
          },
        }
      : {
          background: {
            default: pureWhite.bg0,
            paper: pureWhite.bg0,
          },
          text: {
            primary: pureWhite.fg,
            secondary: pureWhite.fg_secondary,
          },
          primary: {
            main: pureWhiteAccents.primary,
            light: pureWhiteAccents.primaryLight,
            dark: pureWhiteAccents.primaryDark,
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: pureWhiteAccents.secondary,
            light: pureWhiteAccents.secondaryLight,
            dark: pureWhiteAccents.secondaryDark,
            contrastText: '#FFFFFF',
          },
          error: {
            main: pureWhiteAccents.red,
          },
          warning: {
            main: pureWhiteAccents.yellow,
          },
          info: {
            main: pureWhiteAccents.blue,
          },
          success: {
            main: pureWhiteAccents.green,
          },
          divider: pureWhite.bg3,
          action: {
            hover: pureWhite.bg1,
            selected: pureWhite.bg2,
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid transparent',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
        },
      },
    },
  },
});

// For backward compatibility with existing imports
export const theme = getTheme('light');

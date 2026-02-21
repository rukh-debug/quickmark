// Pure White Color Palette
// Simple, minimal light theme with pure whites and meaningful grays

export const pureWhiteColors = {
  // Light mode backgrounds - Pure white with subtle gray variations
  light: {
    bg0: '#FFFFFF',
    bg0_soft: '#FAFAFA',
    bg1: '#F5F5F5',
    bg2: '#EEEEEE',
    bg3: '#E0E0E0',
    bg4: '#BDBDBD',
    fg: '#212121',
    fg_secondary: '#616161',
    gray: '#9E9E9E',
    dim: '#BDBDBD',
  },
  // Accents - Simple, professional colors
  accents: {
    // Primary - Blue
    primary: '#1976D2',
    primaryLight: '#42A5F5',
    primaryDark: '#1565C0',
    // Secondary - Teal
    secondary: '#00897B',
    secondaryLight: '#26A69A',
    secondaryDark: '#00695C',
    // Semantic colors
    red: '#D32F2F',
    green: '#388E3C',
    yellow: '#FBC02D',
    blue: '#1976D2',
    purple: '#7B1FA2',
    teal: '#00897B',
    orange: '#F57C00',
    // Bright variants
    brightRed: '#E53935',
    brightGreen: '#43A047',
    brightYellow: '#FDD835',
    brightBlue: '#1E88E5',
    brightPurple: '#8E24AA',
    brightTeal: '#26A69A',
    brightOrange: '#FB8C00',
  },
} as const;

// Available icon colors for quickmarks
export const quickMarkColors = [
  { name: 'Red', value: pureWhiteColors.accents.brightRed },
  { name: 'Green', value: pureWhiteColors.accents.brightGreen },
  { name: 'Yellow', value: pureWhiteColors.accents.brightYellow },
  { name: 'Blue', value: pureWhiteColors.accents.brightBlue },
  { name: 'Purple', value: pureWhiteColors.accents.brightPurple },
  { name: 'Teal', value: pureWhiteColors.accents.brightTeal },
  { name: 'Orange', value: pureWhiteColors.accents.brightOrange },
  { name: 'Gray', value: '#757575' },
] as const;

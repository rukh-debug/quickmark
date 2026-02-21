// Gruvbox Color Palette
// Based on the canonical Gruvbox theme: https://github.com/morhetz/gruvbox

export const gruvboxColors = {
  // Dark mode backgrounds (Gruvbox Dark)
  dark: {
    bg0_hard: '#1D2021',
    bg0: '#282828',
    bg0_soft: '#32302F',
    bg1: '#3C3836',
    bg2: '#504945',
    bg3: '#665C54',
    bg4: '#7C6F64',
    fg: '#EBDBB2',
    gray: '#928374',
    dim: '#7C6F64',
  },
  // Accents (same for both modes)
  accents: {
    red: '#CC241D',
    green: '#98971A',
    yellow: '#D79921',
    blue: '#458588',
    purple: '#B16286',
    aqua: '#689D6A',
    orange: '#D65D0E',
    // Bright variants
    brightRed: '#FB4934',
    brightGreen: '#B8BB26',
    brightYellow: '#FABD2F',
    brightBlue: '#83A598',
    brightPurple: '#D3869B',
    brightAqua: '#8EC07C',
    brightOrange: '#FE8019',
  },
} as const;

// Available icon colors for quickmarks
export const quickMarkColors = [
  { name: 'Red', value: gruvboxColors.accents.brightRed },
  { name: 'Green', value: gruvboxColors.accents.brightGreen },
  { name: 'Yellow', value: gruvboxColors.accents.brightYellow },
  { name: 'Blue', value: gruvboxColors.accents.brightBlue },
  { name: 'Purple', value: gruvboxColors.accents.brightPurple },
  { name: 'Aqua', value: gruvboxColors.accents.brightAqua },
  { name: 'Orange', value: gruvboxColors.accents.brightOrange },
  { name: 'Gray', value: '#928374' },
] as const;

/**
 * Get contrasting text color (white or dark) for a given background color
 * Uses luminance calculation for optimal contrast
 */
export function getContrastColor(bgColor: string): string {
  // Remove # if present
  const hex = bgColor.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark backgrounds, dark gray for light backgrounds
  return luminance > 0.6 ? '#1D2021' : '#FFFFFF';
}

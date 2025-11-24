/**
 * Theme configuration types
 * Defines the structure for client-specific themes
 */

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
}

export interface ThemeTypography {
  fontSans: string
  fontSerif: string
  fontMono: string
}

export interface ThemeShadow {
  x: string
  y: string
  blur: string
  spread: string
  opacity: string
  color: string
  '2xs': string
  xs: string
  sm: string
  default: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface ThemeConfig {
  /** Theme name for identification */
  name: string

  /** Light mode colors (uses oklch format) */
  light: ThemeColors

  /** Dark mode colors (uses oklch format) */
  dark: ThemeColors

  /** Typography settings */
  typography: ThemeTypography

  /** Border radius (e.g., '0.5rem') */
  radius: string

  /** Shadow configuration */
  shadow: ThemeShadow

  /** Letter spacing (e.g., '0em') */
  trackingNormal: string

  /** Base spacing unit (e.g., '0.25rem') */
  spacing: string
}

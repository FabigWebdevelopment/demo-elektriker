import type { ThemeConfig, ThemeColors } from '@/config/theme.types'

/**
 * Converts theme config object to CSS custom properties
 * Used to dynamically inject client-specific themes
 */

function colorsToCSSVars(colors: ThemeColors, prefix: ''): Record<string, string> {
  return {
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--card': colors.card,
    '--card-foreground': colors.cardForeground,
    '--popover': colors.popover,
    '--popover-foreground': colors.popoverForeground,
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground,
    '--secondary': colors.secondary,
    '--secondary-foreground': colors.secondaryForeground,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--destructive': colors.destructive,
    '--destructive-foreground': colors.destructiveForeground,
    '--border': colors.border,
    '--input': colors.input,
    '--ring': colors.ring,
    '--chart-1': colors.chart1,
    '--chart-2': colors.chart2,
    '--chart-3': colors.chart3,
    '--chart-4': colors.chart4,
    '--chart-5': colors.chart5,
    '--sidebar': colors.sidebar,
    '--sidebar-foreground': colors.sidebarForeground,
    '--sidebar-primary': colors.sidebarPrimary,
    '--sidebar-primary-foreground': colors.sidebarPrimaryForeground,
    '--sidebar-accent': colors.sidebarAccent,
    '--sidebar-accent-foreground': colors.sidebarAccentForeground,
    '--sidebar-border': colors.sidebarBorder,
    '--sidebar-ring': colors.sidebarRing,
  }
}

export function themeToCSSString(theme: ThemeConfig): string {
  const lightVars = colorsToCSSVars(theme.light, '')
  const darkVars = colorsToCSSVars(theme.dark, '')

  const rootVars = {
    ...lightVars,
    '--font-sans': theme.typography.fontSans,
    '--font-serif': theme.typography.fontSerif,
    '--font-mono': theme.typography.fontMono,
    '--radius': theme.radius,
    '--shadow-x': theme.shadow.x,
    '--shadow-y': theme.shadow.y,
    '--shadow-blur': theme.shadow.blur,
    '--shadow-spread': theme.shadow.spread,
    '--shadow-opacity': theme.shadow.opacity,
    '--shadow-color': theme.shadow.color,
    '--shadow-2xs': theme.shadow['2xs'],
    '--shadow-xs': theme.shadow.xs,
    '--shadow-sm': theme.shadow.sm,
    '--shadow': theme.shadow.default,
    '--shadow-md': theme.shadow.md,
    '--shadow-lg': theme.shadow.lg,
    '--shadow-xl': theme.shadow.xl,
    '--shadow-2xl': theme.shadow['2xl'],
    '--tracking-normal': theme.trackingNormal,
    '--spacing': theme.spacing,
  }

  // Convert to CSS string
  const rootCSS = Object.entries(rootVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  const darkCSS = Object.entries(darkVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `:root {\n${rootCSS}\n}\n\n.dark {\n${darkCSS}\n}`
}

/**
 * Generates the Tailwind CSS @theme inline block
 * This maps CSS variables to Tailwind utilities
 */
export function generateTailwindThemeBlock(): string {
  return `@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}`
}

/**
 * Generates complete CSS for a theme including @theme block
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  return `${themeToCSSString(theme)}\n\n${generateTailwindThemeBlock()}`
}

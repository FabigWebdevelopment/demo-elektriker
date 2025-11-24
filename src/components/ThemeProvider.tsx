import type { BusinessConfig } from '@/config/business.types'
import { generateThemeCSS } from '@/lib/utils/theme-to-css'

interface ThemeProviderProps {
  config: BusinessConfig
  children: React.ReactNode
}

/**
 * Theme Provider Component
 * Dynamically injects client-specific theme CSS into the page
 *
 * Usage:
 * ```tsx
 * <ThemeProvider config={clientConfig}>
 *   <YourApp />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ config, children }: ThemeProviderProps) {
  const themeCSS = generateThemeCSS(config.theme)

  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: themeCSS }}
        data-theme={config.theme.name}
      />
      {children}
    </>
  )
}

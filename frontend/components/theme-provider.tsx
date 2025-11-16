"use client"

import * as React from "react"
import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps as NextThemesProviderProps,
} from "next-themes"

/**
 * 🌓 ThemeProviderProps
 * Re-extends the official next-themes types, but redefines defaults
 * to ensure safe SSR and strict TypeScript compatibility.
 */
export interface ThemeProviderProps
    extends Omit<NextThemesProviderProps, "attribute"> {
    /** Defines how the theme is applied: "class" (default) or "data-theme" */
    attribute?: "class" | "data-theme"
}

/**
 * 🌗 ThemeProvider
 * Elegant wrapper around NextThemesProvider with sane defaults.
 * Prevents flicker on hydration and ensures cross-tab theme sync.
 */
export function ThemeProvider({
                                  children,
                                  attribute = "class",
                                  defaultTheme = "system",
                                  enableSystem = true,
                                  disableTransitionOnChange = true,
                                  ...props
                              }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute={attribute}
            defaultTheme={defaultTheme}
            enableSystem={enableSystem}
            disableTransitionOnChange={disableTransitionOnChange}
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { HydrationProvider } from "@/components/HydrationProvider"

export const metadata = {
    title: "Phalcon Gear Tracker v2",
    description: "WoW Gear comparison dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <HydrationProvider>{children}</HydrationProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}

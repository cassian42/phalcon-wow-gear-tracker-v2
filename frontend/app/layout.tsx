import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

export const metadata = {
    title: "Phalcon Gear Tracker v2",
    description: "Modern WoW gear tracker and comparator",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <main className="container mx-auto px-4 py-10">{children}</main>
        </ThemeProvider>
        </body>
        </html>
    )
}

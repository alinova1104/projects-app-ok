import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar, MobileSidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { DragDropProvider } from "@/components/drag-drop-provider"
import { Toaster } from "@/components/ui/toaster" // Sonner Toaster'ı import et

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProjeHub - Proje Yönetim Sistemi",
  description: "Modern proje yönetim uygulaması",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning className="theme-blue">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* ToastProvider kaldırıldı */}
          <DragDropProvider>
            <div className="flex h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden bg-background border-b border-border px-4 py-3 flex items-center justify-between">
                  <MobileSidebar />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="font-semibold text-foreground">ProjeHub</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThemeSelector />
                    <ThemeToggle />
                  </div>
                </div>
                <main className="flex-1 overflow-hidden">{children}</main>
              </div>
            </div>
            <KeyboardShortcuts />
            <Toaster /> {/* Sonner Toaster eklendi */}
          </DragDropProvider>
          {/* ToastContainerComponent kaldırıldı */}
        </ThemeProvider>
      </body>
    </html>
  )
}

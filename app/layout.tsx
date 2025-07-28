import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { DragDropProvider } from "@/components/drag-drop-provider" // DragDropProvider eklendi

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Management App",
  description: "A comprehensive project management application built with Next.js and Shadcn UI.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DragDropProvider>
            {" "}
            {/* DragDropProvider buraya eklendi */}
            <div className="flex h-screen bg-background text-foreground">
              <Sidebar />
              <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
            </div>
          </DragDropProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

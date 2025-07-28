"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const themes = [
  { name: "Mavi", value: "blue", color: "bg-blue-500" },
  { name: "Kırmızı", value: "red", color: "bg-red-500" },
  { name: "Yeşil", value: "green", color: "bg-green-500" },
  { name: "Mor", value: "purple", color: "bg-purple-500" },
  { name: "Turuncu", value: "orange", color: "bg-orange-500" },
]

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const [colorTheme, setColorTheme] = useState("blue")
  const { theme: darkTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("color-theme") || "blue"
    setColorTheme(savedTheme)
    applyTheme(savedTheme, darkTheme)
  }, [darkTheme])

  const applyTheme = (colorTheme: string, darkTheme: string | undefined) => {
    const root = document.documentElement

    // Remove all existing theme classes
    root.classList.remove("theme-blue", "theme-red", "theme-green", "theme-purple", "theme-orange")

    // Add the selected color theme
    root.classList.add(`theme-${colorTheme}`)

    // Ensure dark class is properly applied
    if (darkTheme === "dark") {
      root.classList.add("dark")
    } else if (darkTheme === "light") {
      root.classList.remove("dark")
    }
  }

  const handleThemeChange = (theme: string) => {
    setColorTheme(theme)
    localStorage.setItem("color-theme", theme)
    applyTheme(theme, darkTheme)
  }

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Tema rengi seç</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme.value} onClick={() => handleThemeChange(theme.value)}>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${theme.color}`} />
              <span>{theme.name}</span>
              {colorTheme === theme.value && <span className="ml-auto">✓</span>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderOpen, Users, Calendar, BarChart, Settings, Search, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { ThemeSelector } from "./theme-selector"

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { name: "Projeler", href: "/projects", icon: FolderOpen },
    { name: "Ekip", href: "/team", icon: Users },
    { name: "Takvim", href: "/calendar", icon: Calendar },
    { name: "Raporlar", href: "/reports", icon: BarChart },
    { name: "İstatistikler", href: "/statistics", icon: LayoutDashboard },
    { name: "Arama", href: "/search", icon: Search },
    { name: "Ayarlar", href: "/settings", icon: Settings },
  ]

  return (
    <aside className="group flex h-full flex-col border-r bg-background text-foreground transition-all duration-300 ease-in-out hover:w-64 w-16">
      <div className="flex h-20 items-center justify-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/placeholder-logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Proje Yönetimi
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                        pathname.startsWith(item.href) ? "bg-muted text-primary" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {item.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="group-hover:hidden">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center justify-center border-t p-4">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Temayı Değiştir</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="group-hover:hidden">
              Temayı Değiştir
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="ml-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ThemeSelector />
        </div>
      </div>
    </aside>
  )
}

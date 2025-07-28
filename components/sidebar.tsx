"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import {
  BarChart3,
  FolderOpen,
  Users,
  FileText,
  Settings,
  Plus,
  Menu,
  Search,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Projeler", href: "/projects", icon: FolderOpen },
  { name: "Ekip", href: "/team", icon: Users },
  { name: "Arama", href: "/search", icon: Search },
  { name: "Takvim", href: "/calendar", icon: Calendar },
  { name: "İstatistikler", href: "/statistics", icon: TrendingUp },
  { name: "Raporlar", href: "/reports", icon: FileText },
  { name: "Ayarlar", href: "/settings", icon: Settings },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">ProjeHub</h1>
          </div>
          <div className="flex items-center gap-1">
            <ThemeSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={`w-full justify-start ${
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                asChild
              >
                <Link href={item.href} onClick={onLinkClick}>
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </div>

        <div className="mt-8">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            asChild
          >
            <Link href="/projects/new" onClick={onLinkClick}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Proje
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="hidden md:flex w-64">
      <SidebarContent />
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

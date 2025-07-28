"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Command } from "lucide-react"

interface Shortcut {
  id: string
  keys: string[]
  description: string
}

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts: Shortcut[] = [
    { id: "1", keys: ["Ctrl", "K"], description: "Komut Paletini Aç" },
    { id: "2", keys: ["Ctrl", "Shift", "P"], description: "Yeni Proje Oluştur" },
    { id: "3", keys: ["Ctrl", "Shift", "T"], description: "Yeni Ekip Üyesi Ekle" },
    { id: "4", keys: ["Ctrl", "Shift", "E"], description: "Yeni Etkinlik Ekle" },
    { id: "5", keys: ["Alt", "P"], description: "Projeler Sayfasına Git" },
    { id: "6", keys: ["Alt", "T"], description: "Ekip Sayfasına Git" },
    { id: "7", keys: ["Alt", "C"], description: "Takvim Sayfasına Git" },
    { id: "8", keys: ["Alt", "R"], description: "Raporlar Sayfasına Git" },
    { id: "9", keys: ["Alt", "S"], description: "Ayarlar Sayfasına Git" },
    { id: "10", keys: ["Esc"], description: "Açık Diyalogları Kapat" },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Command className="w-4 h-4" />
          Klavye Kısayolları
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            Klavye Kısayolları
          </DialogTitle>
          <DialogDescription>Uygulamada gezinmek ve işlemleri hızlandırmak için kısayollar.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Kısayol</TableHead>
                <TableHead>Açıklama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shortcuts.map((shortcut) => (
                <TableRow key={shortcut.id}>
                  <TableCell className="font-mono text-sm">
                    {shortcut.keys.map((key, index) => (
                      <kbd
                        key={index}
                        className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded-md mr-1"
                      >
                        {key}
                      </kbd>
                    ))}
                  </TableCell>
                  <TableCell>{shortcut.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

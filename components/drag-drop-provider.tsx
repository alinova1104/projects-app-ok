"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { toast } from "sonner" // sonner'dan toast import edildi

interface DragDropContextType {
  draggedItem: any | null
  setDraggedItem: (item: any | null) => void
  handleDrop: (targetStatus: string) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<any | null>(null)

  const handleDrop = useCallback(
    (targetStatus: string) => {
      if (draggedItem) {
        // Burada gerçek bir API çağrısı ile projenin durumunu güncelleyebilirsiniz.
        // Örneğin: await projectApi.updateProjectStatus(draggedItem.id, targetStatus);
        console.log(`Proje "${draggedItem.name}" durumu "${targetStatus}" olarak güncellendi. (Simülasyon)`)
        toast.success("Proje Durumu Güncellendi", {
          description: `"${draggedItem.name}" projesi "${targetStatus}" durumuna taşındı.`,
        })
        setDraggedItem(null)
        // Gerçek bir uygulamada, burada veriyi yeniden çekmek veya state'i güncellemek gerekir.
        // Örneğin: router.refresh() veya bir global state güncellemesi.
      }
    },
    [draggedItem],
  )

  return (
    <DragDropContext.Provider value={{ draggedItem, setDraggedItem, handleDrop }}>{children}</DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}

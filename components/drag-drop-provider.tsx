"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface DragDropContextType {
  draggedItem: any
  setDraggedItem: (item: any) => void
  dropZone: string | null
  setDropZone: (zone: string | null) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [dropZone, setDropZone] = useState<string | null>(null)

  return (
    <DragDropContext.Provider value={{ draggedItem, setDraggedItem, dropZone, setDropZone }}>
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}

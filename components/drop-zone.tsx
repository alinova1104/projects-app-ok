"use client"

import type React from "react"

import { useDragDrop } from "@/components/drag-drop-provider"
import { toast } from "sonner" // sonner'dan toast import edildi

interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string
}

export function DropZone({ status, children, className, ...props }: DropZoneProps) {
  const { draggedItem, handleDrop } = useDragDrop()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem) {
      handleDrop(status)
    } else {
      toast.error("Hata", { description: "Sürüklenen bir öğe bulunamadı." })
    }
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDropEvent} className={className} {...props}>
      {children}
    </div>
  )
}

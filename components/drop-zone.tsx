"use client"

import type React from "react"

import { useDragDrop } from "./drag-drop-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  status: string
  children: React.ReactNode
  className?: string
}

export function DropZone({ status, children, className }: DropZoneProps) {
  const { draggedItem, dropZone, setDropZone } = useDragDrop()
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDropZone(status)
  }

  const handleDragLeave = () => {
    setDropZone(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem && draggedItem.status !== status) {
      // Burada normalde API çağrısı yapılır
      toast({
        title: "Proje durumu güncellendi",
        description: `${draggedItem.name} projesi ${status} durumuna taşındı`,
        type: "success",
      })
    }
    setDropZone(null)
  }

  const isActive = dropZone === status && draggedItem

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "transition-colors duration-200",
        isActive && "bg-primary/10 border-primary border-2 border-dashed rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  )
}

"use client"

import type React from "react"

import { ProjectCard } from "./project-card"
import { useDragDrop } from "./drag-drop-provider"
import { useToast } from "@/hooks/use-toast"

interface DraggableProjectCardProps {
  project: any
}

export function DraggableProjectCard({ project }: DraggableProjectCardProps) {
  const { setDraggedItem } = useDragDrop()
  const { toast } = useToast()

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-move transition-transform hover:scale-105"
    >
      <ProjectCard project={project} />
    </div>
  )
}

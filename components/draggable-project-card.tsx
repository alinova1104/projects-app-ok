"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDragDrop } from "./drag-drop-provider" // useDragDrop import edildi

interface DraggableProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    category: string
    status: "Aktif" | "Tamamlandı" | "Beklemede"
    priority: "Yüksek" | "Orta" | "Düşük"
    progress: number
  }
}

export function DraggableProjectCard({ project }: DraggableProjectCardProps) {
  const { setDraggedItem } = useDragDrop()

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", project.id)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const difficultyColors = {
    Kolay:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Orta: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Zor: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  }

  const statusColors = {
    Aktif: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Tamamlandı:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Beklemede: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
  }

  const priorityColors = {
    Yüksek: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Orta: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Düşük:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  }

  return (
    <Link href={`/projects/${project.id}`} draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-grab">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
            <Badge variant="outline" className={statusColors[project.status]}>
              {project.status}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{project.category}</Badge>
            <Badge variant="outline" className={priorityColors[project.priority]}>
              {project.priority} Öncelik
            </Badge>
          </div>
          <div>
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
              <span>İlerleme</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

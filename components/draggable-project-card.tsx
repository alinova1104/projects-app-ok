"use client"

import type React from "react"

import { useDragDrop } from "@/components/drag-drop-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { DollarSign, Users } from "lucide-react"

interface DraggableProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    category: string
    status: string
    priority: string
    progress: number
    createdAt: string
    deadline: string
    budget: number
    teamMembers: any[]
  }
}

export function DraggableProjectCard({ project }: DraggableProjectCardProps) {
  const { setDraggedItem } = useDragDrop()

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", project.id) // Sürüklenen öğenin ID'sini taşı
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
    <Link href={`/projects/${project.id}`} draggable onDragStart={handleDragStart}>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-grab">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            <Badge variant="outline" className={statusColors[project.status as keyof typeof statusColors]}>
              {project.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Kategori:</span>
              <span className="font-medium text-foreground">{project.category}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Öncelik:</span>
              <Badge variant="outline" className={priorityColors[project.priority as keyof typeof priorityColors]}>
                {project.priority}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Deadline:</span>
              <span className="font-medium text-foreground">
                {new Date(project.deadline).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">İlerleme</span>
              <span className="text-sm font-medium text-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.teamMembers.length} Üye</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>₺{project.budget.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Github, Clock } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
}

interface Project {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Kolay" | "Orta" | "Zor"
  createdAt: string
  updatedAt: string
  documents: string[]
  languages: string[]
  liveUrl?: string
  githubUrl?: string
  teamMembers: TeamMember[]
  features: string[]
  status: "Aktif" | "Tamamlandı" | "Beklemede"
  progress: number
}

const difficultyColors = {
  Kolay: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Orta: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  Zor: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
}

const statusColors = {
  Aktif: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  Tamamlandı:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Beklemede: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg font-semibold text-card-foreground mb-1 truncate">
              <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                {project.name}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={difficultyColors[project.difficulty]}>
                {project.difficulty}
              </Badge>
              <Badge variant="outline" className={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0" asChild>
            <Link href={`/projects/${project.id}`}>Detay</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3 md:line-clamp-2">
          {project.description}
        </CardDescription>

        <div className="space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>İlerleme</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1">
            {project.languages.slice(0, 3).map((lang, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                {lang}
              </Badge>
            ))}
            {project.languages.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                +{project.languages.length - 3}
              </Badge>
            )}
          </div>

          {/* Team Members */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">+{project.teamMembers.length - 3}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {project.liveUrl && (
              <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs md:text-sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Demo</span>
                  <span className="sm:hidden">Demo</span>
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs md:text-sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Kod</span>
                  <span className="sm:hidden">Kod</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

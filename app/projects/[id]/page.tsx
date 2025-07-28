"use client" // Client Component olarak işaretlendi

import { notFound, useParams } from "next/navigation" // useParams import edildi
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code,
  Star,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Target,
} from "lucide-react"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi

export default function ProjectDetail() {
  // params prop'u kaldırıldı, useParams kullanılacak
  const params = useParams()
  const id = params.id as string // useParams'tan id alındı

  const { projects } = getDb() // Veri doğrudan sunucuda çekildi
  const project = projects.find((p) => p.id === id) // id useParams'tan alındı

  if (!project) {
    notFound()
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{project.name}</h1>
              <p className="text-sm md:text-base text-muted-foreground">{project.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <EditProjectDialog project={project} />
            {project.liveUrl && (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Demo</span>
                  <span className="sm:hidden">Demo</span>
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">GitHub</span>
                  <span className="sm:hidden">GitHub</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Proje Özeti */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardDescription className="text-base mb-4">{project.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={difficultyColors[project.difficulty]}>
                      {project.difficulty}
                    </Badge>
                    <Badge variant="outline" className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={priorityColors[project.priority as keyof typeof priorityColors]}
                    >
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* İlerleme */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-foreground">Proje İlerlemesi</Label>
                  <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Temel Bilgiler Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Oluşturulma</div>
                  <div className="font-medium text-foreground">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Deadline</div>
                  <div className="font-medium text-foreground">
                    {new Date(project.deadline).toLocaleDateString("tr-TR")}
                  </div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Bütçe</div>
                  <div className="font-medium text-foreground">₺{project.budget.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Ekip Üyesi</div>
                  <div className="font-medium text-foreground">{project.teamMembers.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Teknolojiler */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Kullanılan Teknolojiler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      <Code className="w-3 h-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Özellikler */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Proje Özellikleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dökümanlar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Proje Dökümanları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ekip Üyeleri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ekip Üyeleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

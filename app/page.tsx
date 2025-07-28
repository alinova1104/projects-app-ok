"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, FolderOpen, TrendingUp, AlertCircle, CheckCircle, Pause } from "lucide-react"
import projectsData from "@/data/projects.json"
import { ActivityFeed } from "@/components/activity-feed"
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/projects")

  const { projects, teamMembers } = projectsData

  // İstatistikleri hesapla
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "Aktif").length
  const completedProjects = projects.filter((p) => p.status === "Tamamlandı").length
  const pendingProjects = projects.filter((p) => p.status === "Beklemede").length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  // Son güncellenmiş projeler
  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Yaklaşan deadline'lar
  const upcomingDeadlines = projects
    .filter((p) => p.status !== "Tamamlandı")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  const statusColors = {
    Aktif: "bg-blue-100 text-blue-800 border-blue-200",
    Tamamlandı: "bg-green-100 text-green-800 border-green-200",
    Beklemede: "bg-gray-100 text-gray-800 border-gray-200",
  }

  const priorityColors = {
    Yüksek: "bg-red-100 text-red-800 border-red-200",
    Orta: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Düşük: "bg-green-100 text-green-800 border-green-200",
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Dashboard</CardTitle>
          <p className="text-sm md:text-base text-muted-foreground">Proje durumlarınızın genel görünümü</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">{activeProjects} aktif proje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ekip Üyesi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">Aktif çalışan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama İlerleme</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">%{averageProgress}</div>
              <p className="text-xs text-muted-foreground">Tüm projeler</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Bütçe</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Tüm projeler</p>
            </CardContent>
          </Card>
        </div>

        {/* Proje Durumu Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeProjects}</div>
              <div className="mt-4 space-y-2">
                {projects
                  .filter((p) => p.status === "Aktif")
                  .slice(0, 3)
                  .map((project) => (
                    <div key={project.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{project.name}</span>
                      <span className="text-muted-foreground">%{project.progress}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Projeler</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
              <div className="mt-4 space-y-2">
                {projects
                  .filter((p) => p.status === "Tamamlandı")
                  .slice(0, 3)
                  .map((project) => (
                    <div key={project.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{project.name}</span>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen Projeler</CardTitle>
              <Pause className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{pendingProjects}</div>
              <div className="mt-4 space-y-2">
                {projects
                  .filter((p) => p.status === "Beklemede")
                  .slice(0, 3)
                  .map((project) => (
                    <div key={project.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{project.name}</span>
                      <Pause className="h-3 w-3 text-gray-600" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Son Güncellemeler */}
          <Card>
            <CardHeader>
              <CardTitle>Son Güncellemeler</CardTitle>
              <CardDescription>En son güncellenen projeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{project.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[project.status]}>
                          {project.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">%{project.progress}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yaklaşan Deadline'lar */}
          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Deadline'lar</CardTitle>
              <CardDescription>Dikkat edilmesi gereken projeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((project) => (
                  <div key={project.id} className="flex items-center space-x-4">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{project.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={priorityColors[project.priority as keyof typeof priorityColors]}
                        >
                          {project.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.deadline).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">%{project.progress}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}

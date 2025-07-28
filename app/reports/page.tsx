"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, FolderOpen, Clock, DollarSign, Calendar } from "lucide-react"
import projectsData from "@/data/projects.json"
import { ExportDialog } from "@/components/export-dialog"

export default function ReportsPage() {
  const { projects, teamMembers } = projectsData

  // İstatistikleri hesapla
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "Aktif").length
  const completedProjects = projects.filter((p) => p.status === "Tamamlandı").length
  const pendingProjects = projects.filter((p) => p.status === "Beklemede").length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  // Kategori bazında proje dağılımı
  const categoryStats = projects.reduce(
    (acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Zorluk düzeyi dağılımı
  const difficultyStats = projects.reduce(
    (acc, project) => {
      acc[project.difficulty] = (acc[project.difficulty] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // En aktif ekip üyeleri
  const memberProjectCount = teamMembers.sort((a, b) => b.projectCount - a.projectCount).slice(0, 5)

  // Yaklaşan deadline'lar
  const upcomingDeadlines = projects
    .filter((p) => p.status !== "Tamamlandı")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  // Bütçe Analizi
  const budgetByCategory = Object.entries(categoryStats)
    .map(([category, count]) => {
      const categoryBudget = projects.filter((p) => p.category === category).reduce((sum, p) => sum + p.budget, 0)
      return { category, budget: categoryBudget, count }
    })
    .sort((a, b) => b.budget - a.budget)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Raporlar</h1>
            <p className="text-sm md:text-base text-muted-foreground">Proje ve ekip performans raporları</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select defaultValue="this-month">
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">Bu Hafta</SelectItem>
                <SelectItem value="this-month">Bu Ay</SelectItem>
                <SelectItem value="this-quarter">Bu Çeyrek</SelectItem>
                <SelectItem value="this-year">Bu Yıl</SelectItem>
              </SelectContent>
            </Select>
            <ExportDialog />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* Genel İstatistikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Toplam Proje</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% bu ay
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Aktif Proje</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">
                  {Math.round((activeProjects / totalProjects) * 100)}% toplam projeden
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Ortalama İlerleme</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">%{averageProgress}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% geçen aya göre
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Toplam Bütçe</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">₺{totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -3% geçen aya göre
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Kategori Dağılımı */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Kategori Dağılımı</CardTitle>
              <CardDescription>Projelerin kategori bazında dağılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-card-foreground">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} proje</span>
                      <Badge variant="secondary">%{Math.round((count / totalProjects) * 100)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zorluk Düzeyi Dağılımı */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Zorluk Düzeyi Dağılımı</CardTitle>
              <CardDescription>Projelerin zorluk düzeyine göre dağılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(difficultyStats).map(([difficulty, count]) => {
                  const colors = {
                    Kolay: "bg-green-500",
                    Orta: "bg-yellow-500",
                    Zor: "bg-red-500",
                  }
                  return (
                    <div key={difficulty} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[difficulty as keyof typeof colors]}`}></div>
                        <span className="text-sm font-medium text-card-foreground">{difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} proje</span>
                        <Badge variant="secondary">%{Math.round((count / totalProjects) * 100)}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* En Aktif Ekip Üyeleri */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">En Aktif Ekip Üyeleri</CardTitle>
              <CardDescription>Proje sayısına göre en aktif üyeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberProjectCount.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{member.projectCount} proje</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yaklaşan Deadline'lar */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Yaklaşan Deadline'lar</CardTitle>
              <CardDescription>Dikkat edilmesi gereken projeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((project) => {
                  const daysLeft = Math.ceil(
                    (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )
                  const isUrgent = daysLeft <= 7

                  return (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${isUrgent ? "text-red-500" : "text-orange-500"}`} />
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(project.deadline).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                      </div>
                      <Badge variant={isUrgent ? "destructive" : "secondary"}>
                        {daysLeft > 0 ? `${daysLeft} gün` : "Gecikmiş"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

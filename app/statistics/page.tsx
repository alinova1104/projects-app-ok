"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, FolderOpen, DollarSign, Target, Award, Activity, Calendar } from "lucide-react"
import projectsData from "@/data/projects.json"
import { ExportDialog } from "@/components/export-dialog"

export default function StatisticsPage() {
  const { projects, teamMembers } = projectsData

  // Genel İstatistikler
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "Aktif").length
  const completedProjects = projects.filter((p) => p.status === "Tamamlandı").length
  const pendingProjects = projects.filter((p) => p.status === "Beklemede").length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  // Kategori İstatistikleri
  const categoryStats = projects.reduce(
    (acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Zorluk Düzeyi İstatistikleri
  const difficultyStats = projects.reduce(
    (acc, project) => {
      acc[project.difficulty] = (acc[project.difficulty] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Teknoloji İstatistikleri
  const technologyStats = projects.reduce(
    (acc, project) => {
      project.languages.forEach((lang) => {
        acc[lang] = (acc[lang] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  // En çok kullanılan teknolojiler (top 10)
  const topTechnologies = Object.entries(technologyStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  // Ekip Performansı
  const teamPerformance = teamMembers
    .map((member) => ({
      ...member,
      completedProjects: projects.filter(
        (p) => p.teamMembers.some((tm) => tm.id === member.id) && p.status === "Tamamlandı",
      ).length,
      activeProjects: projects.filter((p) => p.teamMembers.some((tm) => tm.id === member.id) && p.status === "Aktif")
        .length,
      projectCount: projects.filter((p) => p.teamMembers.some((tm) => tm.id === member.id)).length,
    }))
    .sort((a, b) => b.projectCount - a.projectCount)

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
            <h1 className="text-xl md:text-2xl font-bold text-foreground">İstatistikler</h1>
            <p className="text-sm md:text-base text-muted-foreground">Detaylı proje ve ekip analizi</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select defaultValue="all-time">
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">Bu Hafta</SelectItem>
                <SelectItem value="this-month">Bu Ay</SelectItem>
                <SelectItem value="this-quarter">Bu Çeyrek</SelectItem>
                <SelectItem value="this-year">Bu Yıl</SelectItem>
                <SelectItem value="all-time">Tüm Zamanlar</SelectItem>
              </SelectContent>
            </Select>
            <ExportDialog />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* Genel İstatistikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-card-foreground">Tamamlanma Oranı</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                %{Math.round((completedProjects / totalProjects) * 100)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% geçen aya göre
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Ortalama İlerleme</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Proje Durumu Dağılımı */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Proje Durumu</CardTitle>
              <CardDescription>Projelerin mevcut durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-card-foreground">Aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{activeProjects}</span>
                    <Badge variant="secondary">%{Math.round((activeProjects / totalProjects) * 100)}</Badge>
                  </div>
                </div>
                <Progress value={(activeProjects / totalProjects) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-card-foreground">Tamamlandı</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{completedProjects}</span>
                    <Badge variant="secondary">%{Math.round((completedProjects / totalProjects) * 100)}</Badge>
                  </div>
                </div>
                <Progress value={(completedProjects / totalProjects) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm font-medium text-card-foreground">Beklemede</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{pendingProjects}</span>
                    <Badge variant="secondary">%{Math.round((pendingProjects / totalProjects) * 100)}</Badge>
                  </div>
                </div>
                <Progress value={(pendingProjects / totalProjects) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Kategori Dağılımı */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Kategori Dağılımı</CardTitle>
              <CardDescription>Proje kategorilerine göre dağılım</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-card-foreground">{category}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <Progress value={(count / totalProjects) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zorluk Düzeyi */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Zorluk Düzeyi</CardTitle>
              <CardDescription>Projelerin zorluk dağılımı</CardDescription>
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
                    <div key={difficulty}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[difficulty as keyof typeof colors]}`}></div>
                          <span className="text-sm font-medium text-card-foreground">{difficulty}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <Progress value={(count / totalProjects) * 100} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* En Çok Kullanılan Teknolojiler */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Popüler Teknolojiler</CardTitle>
              <CardDescription>En çok kullanılan programlama dilleri ve teknolojiler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topTechnologies.map(([tech, count], index) => (
                  <div key={tech} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-card-foreground">{tech}</span>
                        <span className="text-sm text-muted-foreground">{count} proje</span>
                      </div>
                      <Progress value={(count / totalProjects) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bütçe Analizi */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Kategori Bazında Bütçe</CardTitle>
              <CardDescription>Her kategoriye ayrılan bütçe miktarı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetByCategory.map(({ category, budget, count }) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-card-foreground">{category}</span>
                      <span className="text-sm text-muted-foreground">₺{budget.toLocaleString()}</span>
                    </div>
                    <Progress value={(budget / totalBudget) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{count} proje</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ekip Performansı */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Award className="w-5 h-5" />
              Ekip Performansı
            </CardTitle>
            <CardDescription>Ekip üyelerinin proje bazında performansı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamPerformance.slice(0, 6).map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-card-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">{member.completedProjects} tamamlandı</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-muted-foreground">{member.activeProjects} aktif</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-card-foreground">{member.projectCount}</div>
                    <div className="text-xs text-muted-foreground">toplam</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

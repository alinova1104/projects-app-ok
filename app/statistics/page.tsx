import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Code,
} from "lucide-react"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi

export default function StatisticsPage() {
  const { projects, teamMembers } = getDb() // Veri doğrudan sunucuda çekildi

  // Genel İstatistikler
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "Aktif").length
  const completedProjects = projects.filter((p) => p.status === "Tamamlandı").length
  const pendingProjects = projects.filter((p) => p.status === "Beklemede").length
  const totalTeamMembers = teamMembers.length

  // Bütçe İstatistikleri
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const avgBudgetPerProject = totalProjects > 0 ? totalBudget / totalProjects : 0

  // İlerleme İstatistikleri
  const avgProgress = totalProjects > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0

  // Kategori Dağılımı
  const categoryCounts = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1
    return acc
  }, {})

  // Zorluk Düzeyi Dağılımı
  const difficultyCounts = projects.reduce((acc, project) => {
    acc[project.difficulty] = (acc[project.difficulty] || 0) + 1
    return acc
  }, {})

  // Yaklaşan Deadline'lar (Son 30 gün içinde)
  const today = new Date()
  const upcomingDeadlines = projects.filter((p) => {
    const deadlineDate = new Date(p.deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 30
  }).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">İstatistikler</h1>
            <p className="text-sm md:text-base text-muted-foreground">Proje ve ekip performansına genel bakış</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Genel Metrikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">Tüm zamanların toplamı</p>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">Şu anda devam eden</p>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tamamlanan Projeler</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedProjects}</div>
                <p className="text-xs text-muted-foreground">Başarıyla tamamlanan</p>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Ekip Üyesi</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTeamMembers}</div>
                <p className="text-xs text-muted-foreground">Tüm takım üyeleri</p>
              </CardContent>
            </Card>
          </div>

          {/* Detaylı İstatistikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Proje İlerlemesi</CardTitle>
                <CardDescription>Projelerin ortalama ilerleme durumu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Ortalama İlerleme</span>
                  <span className="text-sm font-bold">{avgProgress.toFixed(1)}%</span>
                </div>
                <Progress value={avgProgress} className="h-3" />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Aktif Projeler</span>
                    <span>{activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Tamamlanan Projeler</span>
                    <span>{completedProjects}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Beklemede Olan Projeler</span>
                    <span>{pendingProjects}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Bütçe Analizi</CardTitle>
                <CardDescription>Projelerin toplam ve ortalama bütçe dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Toplam Bütçe</span>
                    </div>
                    <span className="text-sm font-medium">₺{totalBudget.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Proje Başına Ortalama Bütçe</span>
                    </div>
                    <span className="text-sm font-medium">
                      ₺{avgBudgetPerProject.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Yaklaşan Deadline'lar (30 Gün İçinde)</span>
                    </div>
                    <span className="text-sm font-medium">{upcomingDeadlines}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Kategori Dağılımı</CardTitle>
                <CardDescription>Projelerin kategorilere göre dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-sm font-medium">{count} Proje</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Zorluk Düzeyi Dağılımı</CardTitle>
                <CardDescription>Projelerin zorluk düzeylerine göre dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(difficultyCounts).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{difficulty}</span>
                      </div>
                      <span className="text-sm font-medium">{count} Proje</span>
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

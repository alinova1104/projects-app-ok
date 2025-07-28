import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi
import { FileText, TrendingUp, Users } from "lucide-react"

export default function ReportsPage() {
  const { projects, teamMembers } = getDb() // Veri doğrudan sunucuda çekildi

  // Proje Durumlarına Göre Dağılım
  const projectStatusData = Object.entries(
    projects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({ name, value }))

  // Kategoriye Göre Proje Sayısı
  const projectCategoryData = Object.entries(
    projects.reduce(
      (acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({ name, value }))

  // Ortalama Proje İlerlemesi
  const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0)
  const averageProgress = projects.length > 0 ? (totalProgress / projects.length).toFixed(2) : 0

  // Toplam Bütçe
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0)

  // En Aktif Ekip Üyeleri (Proje Sayısına Göre)
  const topTeamMembers = teamMembers
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 5)
    .map((member) => ({ name: member.name, value: member.projectCount }))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Raporlar</h1>
            <p className="text-sm md:text-base text-muted-foreground">Proje ve ekip performansına genel bakış</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Tüm zamanların toplamı</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ortalama İlerleme</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Tüm projelerin ortalaması</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Bütçe</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺{totalBudget.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Tüm projelerin toplam bütçesi</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ekip Üyesi Sayısı</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">Aktif ekip üyesi sayısı</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proje Durumlarına Göre Dağılım</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart className="aspect-[4/3]" data={projectStatusData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Kategoriye Göre Proje Sayısı</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart className="aspect-[4/3]" data={projectCategoryData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>En Aktif Ekip Üyeleri</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart className="aspect-[4/3]" data={topTeamMembers} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

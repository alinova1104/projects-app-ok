import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart } from "@/components/ui/chart"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi
import { Activity, TrendingUp, Users } from "lucide-react"

export default function StatisticsPage() {
  const { projects, teamMembers } = getDb() // Veri doğrudan sunucuda çekildi

  // Proje İlerlemesi Zamanla (Örnek Veri)
  const projectProgressOverTime = [
    { name: "Ocak", value: 40 },
    { name: "Şubat", value: 45 },
    { name: "Mart", value: 50 },
    { name: "Nisan", value: 55 },
    { name: "Mayıs", value: 60 },
    { name: "Haziran", value: 65 },
    { name: "Temmuz", value: 70 },
  ]

  // Ekip Üyesi Rol Dağılımı
  const teamRoleDistribution = Object.entries(
    teamMembers.reduce(
      (acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({ name, value }))

  // Proje Bütçe Dağılımı (Örnek Veri)
  const projectBudgetDistribution = projects.map((project) => ({
    name: project.name,
    value: project.budget,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">İstatistikler</h1>
            <p className="text-sm md:text-base text-muted-foreground">Uygulama genelindeki istatistikler</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Proje İlerlemesi Zamanla
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart className="aspect-[4/3]" data={projectProgressOverTime} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ekip Üyesi Rol Dağılımı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart className="aspect-[4/3]" data={teamRoleDistribution} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Proje Bütçe Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart className="aspect-[4/3]" data={projectBudgetDistribution} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

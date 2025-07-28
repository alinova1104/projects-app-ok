import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Users, FolderOpen, BarChart } from "lucide-react"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi
import { ExportDialog } from "@/components/export-dialog" // ExportDialog import edildi

export default function ReportsPage() {
  const { projects, teamMembers } = getDb() // Veri doğrudan sunucuda çekildi

  // Genel İstatistikler
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "Aktif").length
  const completedProjects = projects.filter((p) => p.status === "Tamamlandı").length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const avgProgress = totalProjects > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0

  // En Yüksek Bütçeli Projeler
  const topBudgetProjects = [...projects].sort((a, b) => b.budget - a.budget).slice(0, 5)

  // En Aktif Ekip Üyeleri (Proje Sayısına Göre)
  const activeTeamMembers = [...teamMembers].sort((a, b) => b.projectCount - a.projectCount).slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Raporlar</h1>
            <p className="text-sm md:text-base text-muted-foreground">Detaylı proje ve ekip raporları</p>
          </div>
          <ExportDialog data={{ projects, teamMembers }} /> {/* ExportDialog buraya eklendi */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Genel Bakış */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Genel Bakış
              </CardTitle>
              <CardDescription>Uygulamanızdaki genel istatistikler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <FolderOpen className="w-8 h-8 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{totalProjects}</span>
                  <span className="text-sm text-muted-foreground">Toplam Proje</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <span className="text-2xl font-bold text-foreground">{teamMembers.length}</span>
                  <span className="text-sm text-muted-foreground">Toplam Ekip Üyesi</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-2xl font-bold text-foreground">₺{totalBudget.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Toplam Bütçe</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-2xl font-bold text-foreground">{avgProgress.toFixed(1)}%</span>
                  <span className="text-sm text-muted-foreground">Ortalama İlerleme</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proje Durumları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Proje Durumları
              </CardTitle>
              <CardDescription>Projelerin mevcut durumlarına göre dağılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">Proje Sayısı</TableHead>
                    <TableHead className="text-right">Yüzde (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Aktif</TableCell>
                    <TableCell className="text-right">{activeProjects}</TableCell>
                    <TableCell className="text-right">
                      {((activeProjects / totalProjects) * 100 || 0).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tamamlandı</TableCell>
                    <TableCell className="text-right">{completedProjects}</TableCell>
                    <TableCell className="text-right">
                      {((completedProjects / totalProjects) * 100 || 0).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Beklemede</TableCell>
                    <TableCell className="text-right">{totalProjects - activeProjects - completedProjects}</TableCell>
                    <TableCell className="text-right">
                      {(((totalProjects - activeProjects - completedProjects) / totalProjects) * 100 || 0).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* En Yüksek Bütçeli Projeler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                En Yüksek Bütçeli Projeler
              </CardTitle>
              <CardDescription>En yüksek bütçeye sahip ilk 5 proje</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proje Adı</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Bütçe (₺)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topBudgetProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.category}</TableCell>
                      <TableCell className="text-right">₺{project.budget.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* En Aktif Ekip Üyeleri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                En Aktif Ekip Üyeleri
              </CardTitle>
              <CardDescription>En çok projede yer alan ilk 5 ekip üyesi</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="text-right">Proje Sayısı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTeamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="text-right">{member.projectCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

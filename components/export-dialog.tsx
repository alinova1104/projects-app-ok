"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, Table, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import projectsData from "@/data/projects.json"

export function ExportDialog() {
  const [format, setFormat] = useState("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeTeam, setIncludeTeam] = useState(true)
  const [includeProjects, setIncludeProjects] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const generatePDFReport = () => {
    const { projects, teamMembers } = projectsData

    // PDF içeriği oluştur
    let content = `
# PROJE YÖNETİM RAPORU
Tarih: ${new Date().toLocaleDateString("tr-TR")}

## GENEL İSTATİSTİKLER
- Toplam Proje: ${projects.length}
- Aktif Proje: ${projects.filter((p) => p.status === "Aktif").length}
- Tamamlanan Proje: ${projects.filter((p) => p.status === "Tamamlandı").length}
- Bekleyen Proje: ${projects.filter((p) => p.status === "Beklemede").length}
- Toplam Bütçe: ₺${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
- Ortalama İlerleme: %${Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}
`

    if (includeProjects) {
      content += `\n## PROJE LİSTESİ\n`
      projects.forEach((project) => {
        content += `
### ${project.name}
- Kategori: ${project.category}
- Durum: ${project.status}
- İlerleme: %${project.progress}
- Zorluk: ${project.difficulty}
- Öncelik: ${project.priority}
- Bütçe: ₺${project.budget.toLocaleString()}
- Deadline: ${new Date(project.deadline).toLocaleDateString("tr-TR")}
- Açıklama: ${project.description}
`
      })
    }

    if (includeTeam) {
      content += `\n## EKİP ÜYELERİ\n`
      teamMembers.forEach((member) => {
        content += `
### ${member.name}
- Rol: ${member.role}
- E-posta: ${member.email}
- Telefon: ${member.phone}
- Proje Sayısı: ${member.projectCount}
- Yetenekler: ${member.skills.join(", ")}
- Katılım Tarihi: ${new Date(member.joinDate).toLocaleDateString("tr-TR")}
`
      })
    }

    return content
  }

  const generateExcelData = () => {
    const { projects, teamMembers } = projectsData

    let csvContent = "data:text/csv;charset=utf-8,"

    if (includeProjects) {
      csvContent += "PROJELER\n"
      csvContent += "Ad,Kategori,Durum,İlerleme,Zorluk,Öncelik,Bütçe,Deadline,Açıklama\n"

      projects.forEach((project) => {
        csvContent += `"${project.name}","${project.category}","${project.status}",${project.progress},"${project.difficulty}","${project.priority}",${project.budget},"${new Date(project.deadline).toLocaleDateString("tr-TR")}","${project.description}"\n`
      })

      csvContent += "\n"
    }

    if (includeTeam) {
      csvContent += "EKİP ÜYELERİ\n"
      csvContent += "Ad,Rol,E-posta,Telefon,Proje Sayısı,Yetenekler,Katılım Tarihi\n"

      teamMembers.forEach((member) => {
        csvContent += `"${member.name}","${member.role}","${member.email}","${member.phone}",${member.projectCount},"${member.skills.join(", ")}","${new Date(member.joinDate).toLocaleDateString("tr-TR")}"\n`
      })
    }

    return csvContent
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simüle edilmiş export işlemi
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const timestamp = new Date().toISOString().split("T")[0]

      if (format === "pdf") {
        const content = generatePDFReport()
        downloadFile(content, `proje-raporu-${timestamp}.txt`, "text/plain")

        toast({
          title: "PDF raporu oluşturuldu",
          description: `Rapor ${timestamp} tarihli olarak indirildi`,
          type: "success",
        })
      } else if (format === "excel") {
        const csvContent = generateExcelData()
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `proje-raporu-${timestamp}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Excel raporu oluşturuldu",
          description: `CSV formatında rapor ${timestamp} tarihli olarak indirildi`,
          type: "success",
        })
      }

      setOpen(false)
    } catch (error) {
      toast({
        title: "Rapor oluşturulamadı",
        description: "Bir hata oluştu, lütfen tekrar deneyin",
        type: "error",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Rapor İndir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Rapor İndir
          </DialogTitle>
          <DialogDescription>Proje raporunuzu istediğiniz formatta indirin</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF (Metin)
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    Excel (CSV)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>İçerik</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="projects" checked={includeProjects} onCheckedChange={setIncludeProjects} />
                <Label htmlFor="projects">Proje listesi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="team" checked={includeTeam} onCheckedChange={setIncludeTeam} />
                <Label htmlFor="team">Ekip üyeleri</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                <Label htmlFor="charts">İstatistikler</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isExporting}>
            İptal
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || (!includeProjects && !includeTeam && !includeCharts)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                İndiriliyor...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                İndir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

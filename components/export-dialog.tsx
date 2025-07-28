"use client"

import { Label } from "@/components/ui/label"
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
import { Download } from "lucide-react"
import { toast } from "sonner" // sonner'dan toast import edildi

interface ExportDialogProps {
  data: {
    projects: any[]
    teamMembers: any[]
  }
}

export function ExportDialog({ data }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reportType, setReportType] = useState("projects")
  const [fileFormat, setFileFormat] = useState("csv")
  const [isLoading, setIsLoading] = useState(false)

  const generateCsv = (dataArray: any[], filename: string) => {
    if (!dataArray || dataArray.length === 0) {
      toast.error("Dışa aktarılacak veri bulunamadı.")
      return
    }

    const headers = Object.keys(dataArray[0])
    const csvContent = [
      headers.join(","),
      ...dataArray.map((row) => headers.map((fieldName) => JSON.stringify(row[fieldName])).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("CSV dosyası başarıyla indirildi!")
    } else {
      toast.error("Tarayıcınız dosya indirmeyi desteklemiyor.")
    }
  }

  const generatePdf = (dataArray: any[], filename: string) => {
    if (!dataArray || dataArray.length === 0) {
      toast.error("Dışa aktarılacak veri bulunamadı.")
      return
    }

    // Basit bir metin tabanlı PDF simülasyonu
    let content = `Rapor: ${filename}\n\n`
    dataArray.forEach((item, index) => {
      content += `--- Öğe ${index + 1} ---\n`
      for (const key in item) {
        content += `${key}: ${item[key]}\n`
      }
      content += "\n"
    })

    const blob = new Blob([content], { type: "application/pdf;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.pdf`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("PDF dosyası başarıyla indirildi!")
    } else {
      toast.error("Tarayıcınız dosya indirmeyi desteklemiyor.")
    }
  }

  const handleExport = () => {
    setIsLoading(true)
    let exportData: any[] = []
    let filename = ""

    if (reportType === "projects") {
      exportData = data.projects
      filename = "projeler-raporu"
    } else if (reportType === "teamMembers") {
      exportData = data.teamMembers
      filename = "ekip-uyeleri-raporu"
    } else if (reportType === "statistics") {
      // İstatistikler için özel bir format oluştur
      const totalProjects = data.projects.length
      const activeProjects = data.projects.filter((p) => p.status === "Aktif").length
      const completedProjects = data.projects.filter((p) => p.status === "Tamamlandı").length
      const totalBudget = data.projects.reduce((sum, p) => sum + p.budget, 0)
      const avgProgress = totalProjects > 0 ? data.projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects : 0

      exportData = [
        {
          "Toplam Proje": totalProjects,
          "Aktif Proje": activeProjects,
          "Tamamlanan Proje": completedProjects,
          "Toplam Ekip Üyesi": data.teamMembers.length,
          "Toplam Bütçe": totalBudget,
          "Ortalama İlerleme (%)": avgProgress.toFixed(1),
        },
      ]
      filename = "genel-istatistikler-raporu"
    }

    filename += `-${new Date().toISOString().split("T")[0]}` // Tarih damgası ekle

    setTimeout(() => {
      if (fileFormat === "csv") {
        generateCsv(exportData, filename)
      } else if (fileFormat === "pdf") {
        generatePdf(exportData, filename)
      }
      setIsLoading(false)
      setOpen(false)
    }, 1000) // Simülasyon süresi
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
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
          <DialogDescription>İndirmek istediğiniz rapor türünü ve formatını seçin.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reportType">Rapor Türü</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Rapor türü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects">Projeler</SelectItem>
                <SelectItem value="teamMembers">Ekip Üyeleri</SelectItem>
                <SelectItem value="statistics">Genel İstatistikler</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileFormat">Dosya Formatı</Label>
            <Select value={fileFormat} onValueChange={setFileFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Dosya formatı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            İptal
          </Button>
          <Button
            type="submit"
            onClick={handleExport}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                İndiriliyor...
              </span>
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
